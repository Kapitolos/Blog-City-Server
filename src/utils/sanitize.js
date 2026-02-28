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
    let sanitized = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
    
    // Sanitize img tags - only allow src from trusted sources
    sanitized = sanitized.replace(/<img([^>]*)>/gi, (match, attributes) => {
      // Extract src attribute (allow quoted URLs; be careful with nested quotes)
      const srcMatch = attributes.match(/src\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return ''; // Remove img without src
      
      const src = srcMatch[1].trim();
      // Allow: our uploads path, relative /uploads/, data URIs, or external https? image URLs
      const isUploadsPath = /\/uploads\/(images|avatars)\//.test(src) || src.startsWith('/uploads/');
      const isDataUri = src.startsWith('data:image/');
      const isExternalUrl = /^https?:\/\//i.test(src) && !/javascript:/i.test(src);
      
      if (!isUploadsPath && !isDataUri && !isExternalUrl) {
        return ''; // Remove untrusted images
      }
      
      // Clean up attributes - only allow safe ones (preserve src exactly)
      const safeAttrs = attributes
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
        .replace(/javascript:/gi, '') // Remove javascript: URLs
        .replace(/src\s*=\s*["']([^"']+)["']/i, `src="${src}"`) // Keep only src
        .replace(/\s*alt\s*=\s*["']([^"']*)["']/i, (m, alt) => ` alt="${alt.replace(/"/g, '&quot;')}"`) // Keep alt if present
        .replace(/\s*class\s*=\s*["']([^"']*)["']/i, (m, cls) => ` class="${cls.replace(/"/g, '&quot;')}"`) // Keep class if present
        .replace(/\s*style\s*=\s*["']([^"']*)["']/i, (m, style) => {
          // Only allow safe CSS properties
          const safeStyle = style
            .replace(/javascript:/gi, '')
            .replace(/expression\s*\(/gi, '')
            .replace(/url\s*\(\s*["']?javascript:/gi, '');
          return ` style="${safeStyle.replace(/"/g, '&quot;')}"`;
        });
      
      return `<img${safeAttrs}>`;
    });
    
    // Sanitize iframe tags - only allow YouTube and Bandcamp embeds
    sanitized = sanitized.replace(/<iframe([^>]*)>/gi, (match, attributes) => {
      // Extract src attribute
      const srcMatch = attributes.match(/src\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return ''; // Remove iframe without src
      
      const src = srcMatch[1];
      // Only allow YouTube and Bandcamp embeds
      const isYouTube = /^https?:\/\/(www\.)?(youtube\.com\/embed\/|youtu\.be\/)/.test(src);
      const isBandcamp = /^https?:\/\/.*\.bandcamp\.com\/EmbeddedPlayer\//.test(src) || 
                         /^https?:\/\/bandcamp\.com\/EmbeddedPlayer\//.test(src);
      
      if (!isYouTube && !isBandcamp) {
        return ''; // Remove non-allowed iframes
      }
      
      // Clean up attributes - only allow safe ones
      const safeAttrs = attributes
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
        .replace(/javascript:/gi, '') // Remove javascript: URLs
        .replace(/src\s*=\s*["']([^"']+)["']/i, `src="${src}"`) // Keep only src
        .replace(/\s*width\s*=\s*["']?(\d+)["']?/i, (m, w) => ` width="${w}"`) // Keep width if present
        .replace(/\s*height\s*=\s*["']?(\d+)["']?/i, (m, h) => ` height="${h}"`) // Keep height if present
        .replace(/\s*frameborder\s*=\s*["']?(\d+)["']?/i, (m, fb) => ` frameborder="${fb}"`) // Keep frameborder if present
        .replace(/\s*allow\s*=\s*["']([^"']*)["']/i, (m, allow) => ` allow="${allow.replace(/"/g, '&quot;')}"`) // Keep allow if present
        .replace(/\s*allowfullscreen/gi, ' allowfullscreen') // Keep allowfullscreen if present
        .replace(/\s*seamless/gi, ' seamless'); // Keep seamless attribute (for Bandcamp)
      
      // Extract content between iframe tags (fallback link for Bandcamp)
      const contentMatch = match.match(/<iframe[^>]*>([^<]*)<\/iframe>/i);
      const fallbackContent = contentMatch ? contentMatch[1] : '';
      
      return `<iframe${safeAttrs}>${fallbackContent}</iframe>`;
    });
    
    return sanitized.trim();
  }
};

module.exports = sanitize;



