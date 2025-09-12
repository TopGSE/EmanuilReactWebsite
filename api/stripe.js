// Consolidated Stripe API endpoints
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.replace('/api/stripe', '');

    // Route to appropriate handler based on path
    if (path === '/create-payment-intent' && req.method === 'POST') {
      return await handleCreatePaymentIntent(req, res);
    } else if (path === '/create-checkout-session' && req.method === 'POST') {
      return await handleCreateCheckoutSession(req, res);
    } else if (path === '/webhook' && req.method === 'POST') {
      return await handleWebhook(req, res);
    } else if (path === '/payments' && req.method === 'GET') {
      return await handleGetPayments(req, res);
    } else if (path === '/payments/stats' && req.method === 'GET') {
      return await handleGetPaymentStats(req, res);
    } else if (path === '/payment-success' && req.method === 'GET') {
      return await handlePaymentSuccess(req, res);
    } else if (path === '/mark-payment-completed' && req.method === 'POST') {
      return await handleMarkPaymentCompleted(req, res);
    } else {
      return res.status(404).json({ success: false, message: 'Stripe endpoint not found' });
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCreatePaymentIntent(req, res) {
  try {
    const { amount, type, donorName, donorEmail, donorPhone, membershipMonth, description } = req.body;

    // Create Stripe payment intent first
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: {
        type,
        donorEmail: donorEmail || ''
      }
    });

    // Create payment record with Stripe payment ID
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntent.id,
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

    // Update payment intent metadata with payment ID
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        paymentId: payment.id.toString(),
        type,
        donorEmail: donorEmail || ''
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}

async function handleCreateCheckoutSession(req, res) {
  try {
    const { priceAmount, customerName, customerEmail, customerPhone, mode } = req.body;

    // Create Stripe checkout session first
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
        customerName,
        customerPhone: customerPhone || '',
      },
    });

    // Now create payment record with Stripe session ID
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: session.id,
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

    // Update session metadata with payment ID
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        paymentId: payment.id.toString(),
        customerName,
        customerPhone: customerPhone || '',
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

async function handleWebhook(req, res) {
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
}

async function handleGetPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments'
    });
  }
}

async function handleGetPaymentStats(req, res) {
  try {
    // Get total payments count
    const totalPayments = await prisma.payment.count();

    // Get total amount (sum of all payments in cents, convert to euros)
    const payments = await prisma.payment.findMany({
      select: {
        amount: true,
        type: true,
        status: true
      }
    });

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0) / 100; // Convert cents to euros

    // Get payments by type
    const paymentsByType = payments.reduce((acc, payment) => {
      acc[payment.type] = (acc[payment.type] || 0) + 1;
      return acc;
    }, {});

    // Get payments by status
    const paymentsByStatus = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    // Get recent payments (last 10)
    const recentPayments = await prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        donorName: true,
        donorEmail: true,
        status: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      stats: {
        totalPayments,
        totalAmount,
        paymentsByType,
        paymentsByStatus,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment statistics'
    });
  }
}

async function handlePaymentSuccess(req, res) {
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
}

async function handleMarkPaymentCompleted(req, res) {
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
}
