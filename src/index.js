require('dotenv').config()
const app = require('./app')
const sequelize = require('./config/database')
const config = require('./config/config')
const cors = require('cors')
// Allow specific origin
const allowedOrigins = ['https://assignment-05-jm6cqifes-rianontus-projects.vercel.app']

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true // if you're using cookies or auth headers
}))

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    // Force true will drop and recreate tables - use only in development
    await sequelize.sync({ force: false })
    console.log('Database synchronized')

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`)
    })
  } catch (error) {
    console.error('Unable to start the server:', error)
    process.exit(1)
  }
}

startServer()

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})
