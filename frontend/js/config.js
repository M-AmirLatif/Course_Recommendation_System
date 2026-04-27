;(function () {
  const isLocalHost = ['localhost', '127.0.0.1'].includes(
    window.location.hostname,
  )

  const runtimeBaseUrl = window.localStorage
    ? window.localStorage.getItem('apiBaseUrlOverride')
    : ''

  const metaBaseUrl =
    document
      .querySelector('meta[name="api-base-url"]')
      ?.getAttribute('content')
      ?.trim() || ''

  const fileBaseUrl =
    window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_BASE_URL
      ? String(window.RUNTIME_CONFIG.API_BASE_URL).trim()
      : ''

  const defaultBaseUrl = isLocalHost
    ? `http://${window.location.hostname}:5000`
    : window.location.origin

  const normalizedBaseUrl = (
    runtimeBaseUrl ||
    fileBaseUrl ||
    metaBaseUrl ||
    defaultBaseUrl
  ).replace(/\/+$/, '')

  window.APP_CONFIG = {
    API_BASE_URL: normalizedBaseUrl + '/api',
  }
})()

