# Paystack Payment Integration Setup 🇬🇭

Complete Paystack payment gateway integration for Ghana.

## ✅ What's Been Added

### Backend
- ✅ Paystack API client (`back/orders/paystack.py`)
- ✅ Payment initialization endpoint
- ✅ Payment verification endpoint
- ✅ Payment reference tracking in Order model
- ✅ Paystack configuration endpoint

### Frontend
- ✅ Paystack inline script loader
- ✅ Payment popup integration
- ✅ Updated checkout flow (Shipping → Payment → Review)
- ✅ Payment success/failure handling
- ✅ Order verification after payment

## 🔧 Setup Instructions

### 1. Get Paystack API Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up or log in
3. Navigate to **Settings → API Keys & Webhooks**
4. Copy your **Public Key** and **Secret Key**

### 2. Configure Backend

Update `back/.env`:

```env
# Paystack Configuration (Ghana)
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

**Important:** 
- Use **test keys** for development (starts with `sk_test_` and `pk_test_`)
- Use **live keys** for production (starts with `sk_live_` and `pk_live_`)

### 3. Install Dependencies

```bash
cd back
pip install requests
```

### 4. Run Migrations

```bash
cd back
python manage.py makemigrations
python manage.py migrate
```

This adds the `payment_reference` field to the Order model.

### 5. Restart Backend

```bash
python manage.py runserver
```

## 🚀 How It Works

### Payment Flow

```
1. Customer fills shipping info
   ↓
2. Customer selects Paystack payment
   ↓
3. Customer reviews order
   ↓
4. Customer clicks "Pay with Paystack"
   ↓
5. Backend creates order (status: pending)
   ↓
6. Backend initializes Paystack transaction
   ↓
7. Paystack popup opens
   ↓
8. Customer completes payment
   ↓
9. Backend verifies payment
   ↓
10. Order status updated to "paid"
    ↓
11. Customer redirected to confirmation page
```

### API Endpoints

#### Initialize Payment
```
POST /api/orders/initialize_payment/
{
  "order_id": "ORD123456",
  "callback_url": "http://localhost:8080/order/ORD123456/confirmation"
}

Response:
{
  "status": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "PAY-ORD123456-1234567890"
  }
}
```

#### Verify Payment
```
POST /api/orders/verify_payment/
{
  "reference": "PAY-ORD123456-1234567890"
}

Response:
{
  "status": true,
  "data": {
    "order_id": "ORD123456",
    "amount": 99.22,
    "status": "paid"
  }
}
```

#### Get Paystack Config
```
GET /api/orders/paystack_config/

Response:
{
  "public_key": "pk_test_..."
}
```

## 🧪 Testing

### Test with Paystack Test Cards

Paystack provides test cards for development:

**Successful Payment:**
- Card: `5060666666666666666`
- CVV: `123`
- Expiry: Any future date
- PIN: `1234`
- OTP: `123456`

**Failed Payment:**
- Card: `5060666666666666666`
- CVV: `123`
- Expiry: Any future date
- PIN: `0000`

### Test Flow

1. Start both servers:
   ```bash
   # Terminal 1
   cd back && python manage.py runserver
   
   # Terminal 2
   cd front && npm run dev
   ```

2. Go to http://localhost:8080/shop

3. Add products to cart

4. Go to checkout: http://localhost:8080/checkout

5. Fill shipping information:
   - Name: Test User
   - Email: test@example.com
   - Address: 123 Test St
   - City: Accra

6. Continue to Payment (Paystack is pre-selected)

7. Review order and click "Pay with Paystack"

8. Paystack popup opens

9. Use test card details above

10. Complete payment

11. Redirected to confirmation page

## 💳 Supported Payment Methods

### Cards
- Visa
- Mastercard
- Verve

### Mobile Money
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

### Bank Transfer
- All major Ghanaian banks
- Instant bank transfer

## 🔒 Security Features

- ✅ PCI DSS compliant
- ✅ 3D Secure authentication
- ✅ Encrypted transactions
- ✅ Fraud detection
- ✅ Payment verification
- ✅ Webhook support (optional)

## 📊 Order Status Flow

```
Order Created → payment_status: "pending"
    ↓
Payment Initialized → payment_reference saved
    ↓
Payment Completed → payment_status: "paid", status: "processing"
    ↓
Order Fulfilled → status: "shipped"
    ↓
Order Delivered → status: "delivered"
```

## 🐛 Troubleshooting

### Issue: "Paystack is not configured"
**Solution:** Add Paystack keys to `back/.env` and restart backend

### Issue: Payment popup doesn't open
**Solution:** 
1. Check browser console for errors
2. Verify Paystack script is loaded
3. Check public key is correct

### Issue: Payment verification fails
**Solution:**
1. Check secret key is correct
2. Verify payment reference matches
3. Check backend logs for errors

### Issue: "Invalid key" error
**Solution:**
1. Verify you're using the correct environment keys (test vs live)
2. Check keys don't have extra spaces
3. Regenerate keys if needed

## 🌐 Production Deployment

### Before Going Live

1. **Switch to Live Keys:**
   ```env
   PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
   PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
   ```

2. **Enable Webhooks (Optional):**
   - Go to Paystack Dashboard → Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/paystack/`
   - Select events: `charge.success`, `charge.failed`

3. **Test Thoroughly:**
   - Test all payment methods
   - Test failed payments
   - Test network interruptions
   - Test on mobile devices

4. **Update Callback URLs:**
   - Use production domain instead of localhost
   - Ensure HTTPS is enabled

## 📱 Mobile Money Testing

For Mobile Money testing in development:
1. Use test phone numbers provided by Paystack
2. Follow prompts in Paystack popup
3. Use test OTP: `123456`

## 💰 Fees

Paystack Ghana fees (as of 2024):
- Local cards: 1.95% + GHS 0.50
- International cards: 3.9% + GHS 0.50
- Mobile Money: 1.95% + GHS 0.50
- Bank Transfer: Free

## 📚 Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack Ghana](https://paystack.com/gh)
- [Test Cards](https://paystack.com/docs/payments/test-payments)
- [API Reference](https://paystack.com/docs/api)

## ✨ Features

- ✅ Multiple payment methods
- ✅ Mobile-responsive checkout
- ✅ Real-time payment verification
- ✅ Automatic order status updates
- ✅ Payment reference tracking
- ✅ Error handling
- ✅ Loading states
- ✅ Success/failure callbacks

## 🎉 You're Ready!

Paystack payment integration is complete and ready to use. Test the checkout flow and start accepting payments! 🚀
