import express from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, type, donorName, donorEmail, donorPhone, membershipMonth, description } = req.body;

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        amount: Math.round(amount * 100), // Convert to cents
        type,
        donorName,
        donorEmail,
        donorPhone,
        membershipMonth,
        description,
        status: 'pending'
      }
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: {
        paymentId: payment.id.toString(),
        type,
        donorEmail: donorEmail || ''
      }
    });

    // Update payment with Stripe payment ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripePaymentId: paymentIntent.id }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Create Stripe Checkout session for membership
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceAmount, customerName, customerEmail, customerPhone, mode } = req.body;

    // Create customer in database first
    const payment = await prisma.payment.create({
      data: {
        amount: Math.round(priceAmount * 100), // Convert to cents
        type: 'membership',
        donorName: customerName,
        donorEmail: customerEmail,
        donorPhone: customerPhone,
        membershipMonth: new Date().toISOString().slice(0, 7), // Current month
        description: 'Monthly membership',
        status: 'pending'
      }
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: mode || 'subscription', // 'subscription' for recurring, 'payment' for one-time
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Church Membership',
              description: 'Monthly church membership subscription',
            },
            unit_amount: Math.round(priceAmount * 100), // Convert to cents
            recurring: mode === 'subscription' ? {
              interval: 'month',
            } : undefined,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}&auto_complete=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata: {
        paymentId: payment.id.toString(),
        customerName,
        customerPhone: customerPhone || '',
      },
    });

    // Update payment record with Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripePaymentId: session.id }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.metadata.paymentId;

      // Update payment status to completed
      await prisma.payment.update({
        where: { id: parseInt(paymentId) },
        data: {
          status: 'completed',
          metadata: paymentIntent
        }
      });

      console.log('Payment completed:', paymentId);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.metadata.paymentId;

      // Update payment status to failed
      await prisma.payment.update({
        where: { id: parseInt(paymentId) },
        data: {
          status: 'failed',
          metadata: paymentIntent
        }
      });

      console.log('Payment failed:', paymentId);
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const paymentId = session.metadata.paymentId;

      // Update payment status to completed for checkout sessions
      await prisma.payment.update({
        where: { id: parseInt(paymentId) },
        data: {
          status: 'completed',
          metadata: session
        }
      });

      console.log('Checkout session completed:', paymentId);
    } else if (event.type === 'invoice.payment_succeeded') {
      // Handle recurring subscription payments
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      
      // You can handle recurring payments here if needed
      console.log('Subscription payment succeeded:', subscriptionId);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get all payments (for admin dashboard)
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Handle successful payment redirect and update status
router.get('/payment-success', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (session_id) {
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.payment_status === 'paid' && session.metadata.paymentId) {
        // Update payment status to completed
        await prisma.payment.update({
          where: { id: parseInt(session.metadata.paymentId) },
          data: {
            status: 'completed',
            metadata: session
          }
        });
        
        console.log('Payment marked as completed:', session.metadata.paymentId);
      }
    }
    
    res.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: 'Failed to process payment success' });
  }
});

// Manual route to mark payment as completed (for development/testing)
router.post('/mark-payment-completed', async (req, res) => {
  try {
    const { paymentId, stripeSessionId } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID required' });
    }
    
    // If we have a Stripe session ID, verify it first
    if (stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
      
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Payment not completed in Stripe' });
      }
    }
    
    // Update payment status to completed
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(paymentId) },
      data: {
        status: 'completed',
        updatedAt: new Date()
      }
    });
    
    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Error marking payment as completed:', error);
    res.status(500).json({ error: 'Failed to mark payment as completed' });
  }
});

// Get payment statistics
router.get('/payments/stats', async (req, res) => {
  try {
    const totalDonations = await prisma.payment.aggregate({
      where: { type: 'donation', status: 'completed' },
      _sum: { amount: true }
    });

    const totalMemberships = await prisma.payment.aggregate({
      where: { type: 'membership', status: 'completed' },
      _sum: { amount: true }
    });

    const monthlyStats = await prisma.payment.groupBy({
      by: ['membershipMonth'],
      where: {
        type: 'membership',
        status: 'completed',
        membershipMonth: { not: null }
      },
      _sum: { amount: true },
      _count: true
    });

    res.json({
      totalDonations: (totalDonations._sum.amount || 0) / 100, // Convert from cents
      totalMemberships: (totalMemberships._sum.amount || 0) / 100,
      monthlyStats: monthlyStats.map(stat => ({
        month: stat.membershipMonth,
        amount: (stat._sum.amount || 0) / 100,
        count: stat._count
      }))
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ error: 'Failed to fetch payment statistics' });
  }
});

export default router;
