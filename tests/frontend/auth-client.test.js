const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const authScript = fs.readFileSync(
  path.join(__dirname, '..', '..', 'frontend', 'js', 'auth.js'),
  'utf8',
)

const createSandbox = ({ fetchImpl, setTimeoutImpl } = {}) => {
  const window = {
    APP_CONFIG: {
      API_BASE_URL: 'https://api.example.com/api',
    },
    location: {
      href: 'login.html',
    },
  }

  const sandbox = {
    window,
    fetch: fetchImpl || (() => Promise.reject(new Error('fetch not mocked'))),
    showAppAlert: () => {},
    setTimeout: setTimeoutImpl || ((fn) => fn()),
    console,
    URL,
    Buffer,
    encodeURIComponent,
    decodeURIComponent,
    Error,
  }

  window.window = window
  vm.createContext(sandbox)
  vm.runInContext(authScript, sandbox)

  return sandbox
}

const run = async () => {
  let requestUrl
  let requestOptions
  let sandbox = createSandbox({
    fetchImpl: async (url, options) => {
      requestUrl = url
      requestOptions = options
      return {
        ok: true,
        text: async () => JSON.stringify({ ok: true }),
      }
    },
  })

  const data = await sandbox.window.AUTH_CLIENT.apiFetch('/auth/login', {
    method: 'POST',
    body: { email: 'user@example.com' },
  })

  assert.equal(requestUrl, 'https://api.example.com/api/auth/login')
  assert.equal(requestOptions.credentials, 'include')
  assert.equal(requestOptions.method, 'POST')
  assert.equal(
    requestOptions.headers['Content-Type'],
    'application/json',
  )
  assert.equal(
    requestOptions.body,
    JSON.stringify({ email: 'user@example.com' }),
  )
  assert.equal(data.ok, true)

  const fetchCalls = []
  const alerts = []
  const timers = []

  sandbox = createSandbox({
    fetchImpl: async (url, options) => {
      fetchCalls.push({ url, options })
      return {
        ok: true,
        text: async () => JSON.stringify({ message: 'Logged out successfully' }),
      }
    },
    setTimeoutImpl: (fn, delay) => {
      timers.push(delay)
      fn()
    },
  })

  sandbox.showAppAlert = (message, type) => alerts.push({ message, type })

  await sandbox.window.AUTH_CLIENT.logout()

  assert.equal(fetchCalls.length, 1)
  assert.equal(fetchCalls[0].url, 'https://api.example.com/api/auth/logout')
  assert.equal(fetchCalls[0].options.method, 'POST')
  assert.equal(fetchCalls[0].options.credentials, 'include')
  assert.deepEqual(alerts, [
    { message: 'Logged out successfully.', type: 'success' },
  ])
  assert.deepEqual(timers, [500])
  assert.equal(sandbox.window.location.href, 'login.html')
}

module.exports = {
  run,
}
