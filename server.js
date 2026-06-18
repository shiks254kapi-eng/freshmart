require('dotenv').config()

// ── DEBUG ──
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_KEY defined?', !!process.env.SUPABASE_SERVICE_KEY)
    // ──────────

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mpesaRoutes = require('./routes/mpesa')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/mpesa', mpesaRoutes)

app.get('/', (req, res) => {
    res.json({ status: 'FreshMart backend is running 🌿', time: new Date() })
})

app.listen(PORT, () => {
    console.log(`✅ FreshMart backend running on http://localhost:${PORT}`)
})