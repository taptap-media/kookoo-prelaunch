import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import submitRouter from './routes/submit'

dotenv.config()

const app = express()
app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json({ limit: '1mb' }))

app.use('/submit', submitRouter)

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080
app.listen(PORT, () => console.log(`Submit API listening on ${PORT}`))

export default app
