import posthog from 'posthog-js'

// Initialize PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    const apiKey = import.meta.env.PUBLIC_POSTHOG_API_KEY
    const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
    
    if (!apiKey) {
      console.warn('PostHog API key not found. Please set PUBLIC_POSTHOG_API_KEY in your .env file')
      return
    }
    
    posthog.init(apiKey, {
      api_host: apiHost,
      // Enable debug mode in development
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          posthog.debug()
        }
      },
      // Capture pageviews automatically
      capture_pageview: true,
      // Capture pageleaves automatically
      capture_pageleave: true,
      // Other options
      autocapture: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
      }
    })
  }
  
  return posthog
}

// Export posthog instance
export { posthog }