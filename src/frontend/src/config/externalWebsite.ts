/**
 * External website configuration module
 * Reads VITE_WEBSITE_URL and VITE_WEBSITE_LABEL from environment variables
 * and provides a validated external link object for use in navigation and footer
 */

interface ExternalWebsiteConfig {
  url: string;
  label: string;
}

/**
 * Returns the external website configuration if a valid URL is configured,
 * otherwise returns null
 */
export function getExternalWebsiteConfig(): ExternalWebsiteConfig | null {
  const url = import.meta.env.VITE_WEBSITE_URL;
  const label = import.meta.env.VITE_WEBSITE_LABEL || 'Website';

  // Only return config if URL is present and uses http/https protocol
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }

  const trimmedUrl = url.trim();
  
  // Validate that URL starts with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    console.warn('External website URL must start with http:// or https://');
    return null;
  }

  return {
    url: trimmedUrl,
    label: label.trim() || 'Website',
  };
}
