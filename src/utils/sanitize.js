// Basic HTML sanitization to prevent XSS attacks
const sanitize = {
  // Escape HTML special characters
  escapeHtml: (text) => {
    if (!text || typeof text !== 'string') {
      return '';
    }
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  },

  // Sanitize user input (escape HTML)
  sanitizeInput: (input) => {
    if (typeof input === 'string') {
      return sanitize.escapeHtml(input.trim());
    }
    if (Array.isArray(input)) {
      return input.map(item => sanitize.sanitizeInput(item));
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized = {};
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          sanitized[key] = sanitize.sanitizeInput(input[key]);
        }
      }
      return sanitized;
    }
    return input;
  },

  // Sanitize text content (for blog posts, comments) - allows some HTML but escapes dangerous tags
  sanitizeText: (text) => {
    if (!text || typeof text !== 'string') {
      return '';
    }
    // Remove script tags and event handlers
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
};

module.exports = sanitize;



