export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (window.gtag) {
    window.gtag("event", action, params);
  }
};
