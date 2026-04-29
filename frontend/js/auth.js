;(function () {
  const API = window.APP_CONFIG.API_BASE_URL

  const getApiUrl = (path) =>
    `${API}${path.startsWith('/') ? path : `/${path}`}`

  const readJsonSafely = async (response) => {
    const text = await response.text()

    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch (error) {
      return { message: text }
    }
  }

  const apiFetch = async (path, options = {}) => {
    const { headers = {}, body, ...rest } = options
    const requestHeaders = {
      ...headers,
    }

    const requestOptions = {
      credentials: 'include',
      ...rest,
      headers: requestHeaders,
    }

    if (body !== undefined) {
      requestOptions.body =
        typeof body === 'string' ? body : JSON.stringify(body)

      if (!requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json'
      }
    }

    const response = await fetch(getApiUrl(path), requestOptions)
    const data = await readJsonSafely(response)

    if (!response.ok) {
      const error = new Error(data?.message || 'Request failed')
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  }

  const redirectToLogin = () => {
    window.location.href = 'login.html'
  }

  const requireAuth = async () => {
    try {
      return await apiFetch('/auth/profile')
    } catch (error) {
      if (error.status === 401) {
        redirectToLogin()
        return null
      }

      throw error
    }
  }

  const requireAdmin = async () => {
    const profile = await requireAuth()
    if (!profile) {
      return null
    }

    if (profile.role !== 'admin') {
      window.location.href = 'dashboard.html'
      return null
    }

    return profile
  }

  const redirectIfAuthenticated = async () => {
    try {
      const profile = await apiFetch('/auth/profile')
      window.location.href =
        profile.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html'
      return profile
    } catch (error) {
      if (error.status === 401) {
        return null
      }

      return null
    }
  }

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch (error) {
      // Fall through to local redirect even if the server session has expired.
    }

    showAppAlert('Logged out successfully.', 'success')
    setTimeout(() => {
      redirectToLogin()
    }, 500)
  }

  window.AUTH_CLIENT = {
    apiFetch,
    getApiUrl,
    logout,
    redirectIfAuthenticated,
    requireAdmin,
    requireAuth,
  }

  window.logout = logout
})()
