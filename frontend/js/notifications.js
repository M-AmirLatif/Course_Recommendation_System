;(function () {
  function ensureContainer() {
    let container = document.getElementById('appToastContainer')
    if (!container) {
      container = document.createElement('div')
      container.id = 'appToastContainer'
      container.className = 'app-toast-container'
      document.body.appendChild(container)
    }
    return container
  }

  window.showAppAlert = function showAppAlert(message, type = 'info') {
    if (!message) return

    const container = ensureContainer()
    const toast = document.createElement('div')
    toast.className = `app-toast app-toast-${type}`
    toast.innerHTML = `
      <div class="app-toast-body">${String(message)}</div>
      <button class="app-toast-close" aria-label="Dismiss notification">&times;</button>
    `

    const removeToast = () => {
      toast.classList.add('closing')
      setTimeout(() => toast.remove(), 220)
    }

    toast.querySelector('.app-toast-close').addEventListener('click', removeToast)
    container.appendChild(toast)

    requestAnimationFrame(() => {
      toast.classList.add('visible')
    })

    setTimeout(removeToast, 3200)
  }
})()
