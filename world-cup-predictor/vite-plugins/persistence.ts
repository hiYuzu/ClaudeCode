import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.resolve(__dirname, '../data/prediction.json')

export function persistencePlugin(): Plugin {
  return {
    name: 'prediction-persistence',
    configureServer(server) {
      server.middlewares.use('/api/prediction', async (req, res) => {
        // GET: read prediction data
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8')
            res.end(data)
          } catch {
            res.end('{}')
          }
          return
        }

        // PUT: save prediction data
        if (req.method === 'PUT') {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          const body = Buffer.concat(chunks).toString()

          try {
            // Validate it's valid JSON
            JSON.parse(body)
            const dir = path.dirname(DATA_FILE)
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true })
            }
            fs.writeFileSync(DATA_FILE, body, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end('{"ok":true}')
          } catch {
            res.statusCode = 400
            res.end('{"error":"invalid json"}')
          }
          return
        }

        res.statusCode = 405
        res.end('{"error":"method not allowed"}')
      })
    },
  }
}