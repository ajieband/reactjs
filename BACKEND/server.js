require('dotenv').config() // Load environment variables from .env

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // Import cors
const wheelRoutes = require('./routes/wheelRoutes')

const app = express()

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend running on localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods if needed
}));

// Middleware
app.use(express.json()) // Parse JSON body in requests

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Routes
app.get('/', (req, res) => {
  res.json({ mssg: 'Welcome to the app' })
})

// Use Routes
app.use('/api/wheels', wheelRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error)
  })
