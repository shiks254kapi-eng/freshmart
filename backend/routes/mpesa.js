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

// ─── Get M-Pesa access token ───────────────────────────────────────────────
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const response = await axios.get(URLS.auth, {
    headers: { Authorization: `Basic ${auth}` }
  })

  return response.data.access_token
}

// ─── Generate STK password ─────────────────────────────────────────────────
function generatePassword() {
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
  const raw = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  const password = Buffer.from(raw).toString('base64')
  return { password, timestamp }
}

// ─── ROUTE 1: STK Push ────────────────────────────────────────────────────
router.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, orderId, customerName } = req.body

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ error: 'phone, amount and orderId are required' })
    }

    let formattedPhone = phone.toString().replace(/^0/, '254')
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1)

    const accessToken = await getAccessToken()
    const { password, timestamp } = generatePassword()

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `FreshMart-${orderId}`,
      TransactionDesc: `FreshMart order ${orderId} by ${customerName || 'Customer'}`,
    }

    const response = await axios.post(URLS.stkpush, payload, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    await supabase.from('payments').insert([{
      order_id: orderId,
      phone: formattedPhone,
      amount: amount,
      status: 'pending',
      checkout_request_id: response.data.CheckoutRequestID,
    }])

    console.log(`📱 STK Push sent to ${formattedPhone} for KES ${amount}`)

    res.json({
      success: true,
      message: 'STK Push sent! Customer should see payment prompt.',
      checkoutRequestId: response.data.CheckoutRequestID,
    })

  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message)
    res.status(500).json({
      error: 'Failed to send STK Push',
      details: error.response?.data || error.message
    })
  }
})

// ─── ROUTE 2: Callback from Safaricom ─────────────────────────────────────
router.post('/callback', async (req, res) => {
  try {
    const { stkCallback } = req.body.Body
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback

    if (ResultCode === 0) {
      const items = CallbackMetadata.Item
      const mpesaRef = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value
      const amount   = items.find(i => i.Name === 'Amount')?.Value
      const phone    = items.find(i => i.Name === 'PhoneNumber')?.Value

      await supabase
        .from('payments')
        .update({ status: 'completed', mpesa_reference: mpesaRef })
        .eq('checkout_request_id', CheckoutRequestID)

      await supabase
        .from('orders')
        .update({ payment_status: 'paid', mpesa_reference: mpesaRef })
        .eq('payment_status', 'pending')

      console.log(`✅ Payment confirmed! Ref: ${mpesaRef} | KES ${amount} from ${phone}`)

    } else {
      console.log(`❌ Payment failed: ${ResultDesc}`)

      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('checkout_request_id', CheckoutRequestID)
    }

    res.json({ ResultCode: 0, ResultDesc: 'Callback received' })

  } catch (error) {
    console.error('Callback error:', error)
    res.json({ ResultCode: 0, ResultDesc: 'Callback received' })
  }
})

// ─── ROUTE 3: Check payment status ────────────────────────────────────────
router.get('/status/:orderId', async (req, res) => {
  try {
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', req.params.orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    res.json({ payment: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── ROUTE 4: Manual confirmation (testing only) ──────────────────────────
router.post('/confirm-test', async (req, res) => {
  const { orderId } = req.body
  await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId)
  await supabase.from('payments').update({ status: 'completed', mpesa_reference: 'TEST123' }).eq('order_id', orderId)
  res.json({ success: true, message: 'Test payment confirmed' })
})

module.exports = router