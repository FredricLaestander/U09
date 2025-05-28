import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { router } from './routes'

const app = express()
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.use(router)

app.listen(process.env.PORT, () => {
  console.log(`server ready on http://localhost:${process.env.PORT}`)
})

export default app
