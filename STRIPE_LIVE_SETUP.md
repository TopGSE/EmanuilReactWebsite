# Stripe Live Mode Setup Guide

## 🚨 IMPORTANT: Going Live Checklist

### 1. Complete Stripe Account Verification

- [ ] Log into https://dashboard.stripe.com
- [ ] Complete "Activate your account" checklist
- [ ] Verify business information
- [ ] Add bank account for payouts
- [ ] Set payout schedule (Daily/Weekly/Monthly)

### 2. Get Live API Keys

In Stripe Dashboard:

1. Toggle from "Test mode" to "Live mode" (top right)
2. Go to Developers → API Keys
3. Copy your LIVE keys:
   - Publishable key (starts with pk*live*...)
   - Secret key (starts with sk*live*...)

### 3. Update Environment Variables

Replace these in your .env file:

```env
# LIVE MODE - Replace test keys with live keys
STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_LIVE_PUBLISHABLE_KEY"
STRIPE_SECRET_KEY="sk_live_YOUR_LIVE_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_LIVE_WEBHOOK_SECRET"
```

### 4. Webhook Setup (Production)

1. In Stripe Dashboard (Live mode): Developers → Webhooks
2. Add endpoint: https://yourdomain.com/api/stripe/webhook
3. Select events:
   - checkout.session.completed
   - payment_intent.succeeded
   - invoice.payment_succeeded
4. Copy webhook secret to .env file

### 5. Money Flow Process

#### Donations ($25+ one-time):

- Customer pays → Stripe collects → Stripe fees (2.9% + €0.25) → Remainder goes to your bank

#### Memberships (€25/month recurring):

- Monthly charge → Stripe collects → Stripe fees → Remainder goes to your bank
- Automatic recurring billing

#### Example Calculations:

- **€25 donation**: €25 - €0.98 fee = **€24.02 to your bank**
- **€25 monthly membership**: €25 - €0.98 fee = **€24.02 monthly to your bank**

### 6. Payout Timeline

- **Belgium**: Usually 2-7 business days after transaction
- **First payout**: May take 7-14 days (standard verification period)
- **Subsequent payouts**: Based on your chosen schedule

### 7. Monitoring & Reports

- Stripe Dashboard → Payments (see all transactions)
- Stripe Dashboard → Payouts (see bank transfers)
- Your Admin Panel → Payments (see local records)

## 📊 Revenue Tracking

Your admin dashboard will show:

- Total donations received
- Total membership revenue
- Monthly membership statistics
- Payment statuses (pending/completed)

## ⚠️ Important Notes

1. **Test First**: Always test in test mode before going live
2. **Webhook Required**: Essential for automatic payment status updates
3. **SSL Certificate**: Required for live mode (https://)
4. **Compliance**: Ensure GDPR compliance for EU customers

## 🔧 Troubleshooting

- **Pending Payments**: Usually webhook configuration issue
- **Failed Payouts**: Check bank account details in Stripe
- **Missing Money**: Check Stripe Dashboard → Balance
