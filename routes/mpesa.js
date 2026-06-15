const express = require('express')
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')
const router = express.Router()

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// M-Pesa URLs
const MPESA_URLS = {
  sandbox: {
    auth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkpush: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  },
  production: {
    auth: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkpush: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  }
}

const ENV = process.env.MPESA_ENV || 'sandbox'
const URLS = MPESA_URLS[ENV]

// ─── STEP 1: Get M-Pesa access token ───────────────────────────────────────
async function getAccessToken() {
  const auth = Buffer.from(
    process.env.MPESA_CONSUMER_KEY + ':' + process.env.MPESA_CONSUMER_SECRET
  ).toString('base64')

  const response = await axios.get(URLS.auth, {
    headers: { Authorization: 'Basic ' + auth }
  })

  return response.data.access_token
}

// ─── STEP 2: Generate password ─────────────────────────────────────────────
function generatePassword() {
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
  const raw = process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
  const password = Buffer.from(raw).toString('base64')
  return { password: password, timestamp: timestamp }
}

// ─── ROUTE 1: STK Push — sends payment prompt to customer's phone ──────────
router.post('/stkpush', async function(req, res) {
  try {
    var phone = req.body.phone
    var amount = req.body.amount
    var orderId = req.body.orderId
    var customerName = req.body.customerName

    // Validate inputs
    if (!phone || !amount || !orderId) {
      return res.status(400).json({ error: 'phone, amount and orderId are required' })
    }

    // Format phone: convert 07XXXXXXXX to 2547XXXXXXXX
    var formattedPhone = phone.toString().replace(/^0/, '254')
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1)

    var accessToken = await getAccessToken()
    var passData = generatePassword()
    var password = passData.password
    var timestamp = passData.timestamp

    var payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'FreshMart-' + orderId,
      TransactionDesc: 'FreshMart order ' + orderId + ' by ' + (customerName || 'Customer'),
    }

    var response = await axios.post(URLS.stkpush, payload, {
      headers: { Authorization: 'Bearer ' + accessToken }
    })

    // Save payment record to Supabase
    await supabase.from('payments').insert([{
      order_id: orderId,
      phone: formattedPhone,
      amount: amount,
      status: 'pending',
      checkout_request_id: response.data.CheckoutRequestID,
    }])

    console.log('STK Push sent to ' + formattedPhone + ' for KES ' + amount)

    res.json({
      success: true,
      message: 'STK Push sent! Customer should see payment prompt.',
      checkoutRequestId: response.data.CheckoutRequestID,
    })

  } catch (error) {
    var errDetails = (error.response && error.response.data) || error.message
    console.error('STK Push error:', errDetails)
    res.status(500).json({
      error: 'Failed to send STK Push',
      details: errDetails
    })
  }
})

// ─── ROUTE 2: Callback — Safaricom calls this after payment ───────────────
router.post('/callback', async function(req, res) {
  try {
    var Body = req.body.Body
    var stkCallback = Body.stkCallback

    var resultCode = stkCallback.ResultCode
    var resultDesc = stkCallback.ResultDesc
    var checkoutRequestId = stkCallback.CheckoutRequestID

    if (resultCode === 0) {
      // Payment SUCCESSFUL
      var items = stkCallback.CallbackMetadata.Item

      var mpesaRefItem = items.find(function(i) { return i.Name === 'MpesaReceiptNumber' })
      var amountItem   = items.find(function(i) { return i.Name === 'Amount' })
      var phoneItem    = items.find(function(i) { return i.Name === 'PhoneNumber' })

      var mpesaRef = mpesaRefItem ? mpesaRefItem.Value : null
      var amount   = amountItem   ? amountItem.Value   : null
      var phone    = phoneItem    ? phoneItem.Value     : null

      // Update payment status in Supabase (matched by checkout_request_id)
      await supabase
        .from('payments')
        .update({ status: 'completed', mpesa_reference: mpesaRef })
        .eq('checkout_request_id', checkoutRequestId)

      // Update order payment status
      await supabase
        .from('orders')
        .update({ payment_status: 'paid', mpesa_reference: mpesaRef })
        .eq('payment_status', 'pending')

      console.log('Payment confirmed! M-Pesa ref: ' + mpesaRef + ' | KES ' + amount + ' from ' + phone)

    } else {
      // Payment FAILED or CANCELLED
      console.log('Payment failed: ' + resultDesc)

      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('checkout_request_id', checkoutRequestId)
    }

    res.json({ ResultCode: 0, ResultDesc: 'Callback received' })

  } catch (error) {
    console.error('Callback error:', error)
    res.json({ ResultCode: 0, ResultDesc: 'Callback received' })
  }
})

// ─── ROUTE 3: Check payment status ────────────────────────────────────────
router.get('/status/:orderId', async function(req, res) {
  try {
    var orderId = req.params.orderId
    var result = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    res.json({ payment: result.data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── ROUTE 4: Manual payment confirmation (for testing) ───────────────────
router.post('/confirm-test', async function(req, res) {
  var orderId = req.body.orderId
  await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId)
  await supabase.from('payments').update({ status: 'completed', mpesa_reference: 'TEST123' }).eq('order_id', orderId)
  res.json({ success: true, message: 'Test payment confirmed' })
})

module.exports = router