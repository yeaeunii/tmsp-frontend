export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const response = await fetch(input, {
    credentials: 'include',
    ...init,
  })

  if (response.status !== 401) {
    return response
  }

  if (typeof input === 'string' && input.includes('/api/auth/refresh')) {
    return response
  }

  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!refreshResponse.ok) {
    window.dispatchEvent(new CustomEvent('auth-expired'))
    return response
  }

  return fetch(input, {
    credentials: 'include',
    ...init,
  })
}
