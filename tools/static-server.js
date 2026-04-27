const http = require('http')
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const defaultPort = Number(process.env.PORT) || 5500

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function resolvePath(reqUrl) {
  const url = new URL(reqUrl, 'http://localhost')
  let reqPath = decodeURIComponent(url.pathname)

  if (reqPath.includes('..')) return null
  if (reqPath === '/') reqPath = '/index.html'

  const trimmedPath =
    reqPath.length > 1 && reqPath.endsWith('/') ? reqPath.slice(0, -1) : reqPath

  const directPath = path.join(root, reqPath)
  if (fs.existsSync(directPath) && fs.statSync(directPath).isDirectory()) {
    const indexPath = path.join(directPath, 'index.html')
    if (fs.existsSync(indexPath)) return indexPath
  }

  if (fs.existsSync(directPath)) return directPath
  return null
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const rawPath = decodeURIComponent(url.pathname)
    const trimmedPath =
      rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath
    if (!path.extname(trimmedPath)) {
      const htmlPath = path.join(root, `${trimmedPath}.html`)
      if (fs.existsSync(htmlPath)) {
        const target = `${trimmedPath}.html${url.search}`
        res.writeHead(302, { Location: target })
        res.end()
        return
      }
    }

    const filePath = resolvePath(req.url)
    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('404 Not Found')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('500 Server Error')
        return
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      })
      res.end(data)
    })
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1
      console.warn(`Port ${port} in use, trying ${nextPort}`)
      startServer(nextPort)
      return
    }
    throw err
  })

  server.listen(port, () => {
    console.log(`Static server running at http://127.0.0.1:${port}`)
  })
}

startServer(defaultPort)
