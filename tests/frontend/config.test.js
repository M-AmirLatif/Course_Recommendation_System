const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const configScript = fs.readFileSync(
  path.join(__dirname, '..', '..', 'frontend', 'js', 'config.js'),
  'utf8',
)

const loadConfig = ({
  hostname = 'course-recommendation-system-beta.vercel.app',
  runtimeConfig = {},
  localStorage = null,
  metaValue = '',
} = {}) => {
  const metaElement = metaValue
    ? {
        getAttribute: () => metaValue,
      }
    : null

  const sandbox = {
    window: {
      location: {
        hostname,
        origin: `https://${hostname}`,
      },
      localStorage,
      RUNTIME_CONFIG: runtimeConfig,
    },
    document: {
      querySelector: () => metaElement,
    },
  }

  sandbox.window.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(configScript, sandbox)
  return sandbox.window.APP_CONFIG
}

const run = async () => {
  const runtimeConfig = loadConfig({
    runtimeConfig: {
      API_BASE_URL: 'https://live-api.example.com/',
    },
  })

  assert.equal(runtimeConfig.API_BASE_URL, 'https://live-api.example.com/api')

  const localhostConfig = loadConfig({
    hostname: '127.0.0.1',
  })

  assert.equal(localhostConfig.API_BASE_URL, 'http://127.0.0.1:5000/api')
}

module.exports = {
  run,
}
