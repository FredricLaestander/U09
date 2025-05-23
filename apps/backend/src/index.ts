import express from 'express'
import { router } from './routes'

const app = express()
app.use(router)

app.listen(process.env.PORT, () => {
  console.log(`server ready on http://localhost:${process.env.PORT}`)
})

export default app
