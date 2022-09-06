import expres from 'express'
import axios from 'axios'
import morgan from 'morgan'

const { create } = axios

const port = 8095

const headers = {
  Accept: 'application/json'
}

const api = create({
  baseURL: 'http://localhost:8091',
  timeout: 1000,
  headers
})

const app = expres()
app.use(morgan('combined'))

app.get('/', async function (req, res) {
  const { method, path } = req.query
  delete (req.query.method)
  delete (req.query.path)

  let ok = false
  let message = 'Gagal'
  let data = {}

  let config = { method, headers }
  if (Object.keys(req.query).length > 0) {
    const body = JSON.stringify(req.query)
    config = { method, headers: { ...headers, 'Content-Type': 'application/json' }, data: body }
  }
  try {
    const apirespon = await api(path, config)
    ok = true
    data = apirespon.data
    message = 'Berhasil'
  } catch (error) {
    data = typeof error.code !== 'undefined' ? error.code : 'Unknown'
  }

  res.json({ ok, message, data })
})

app.listen(port)
console.log(`API sudah aktif pada port ${port}`)
