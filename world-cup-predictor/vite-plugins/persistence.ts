import type { Plugin } from 'vite'

export function persistencePlugin(): Plugin {
  return {
    name: 'persistence',
    enforce: 'pre',

    // Middleware to handle data persistence
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/data')) {
          // Read data from file
          const fs = require('fs')
          const path = require('path')
          const dataPath = path.resolve(__dirname, '../../data/world-cup.json')

          if (req.method === 'GET') {
            if (fs.existsSync(dataPath)) {
              const data = fs.readFileSync(dataPath, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(data)
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Data not found' }))
            }
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => body += chunk.toString())
            req.on('end', () => {
              try {
                const data = JSON.parse(body)
                fs.mkdirSync(path.dirname(dataPath), { recursive: true })
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true }))
              } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Invalid data' }))
              }
            })
          }
        } else {
          next()
        }
      })
    }
  }
}