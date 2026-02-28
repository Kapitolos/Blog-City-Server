/**
 * Blocklist of words/phrases that are not allowed in posts or comments.
 * Kept server-side only. Add terms in lowercase; matching is case-insensitive.
 * Use whole words where possible to reduce false positives.
 */
const BLOCKLIST = [
  // Add terms here. Examples (customize for your community):
  // 'slur1', 'slur2', 'hate term', 'spam phrase'
];

/**
 * Check if text contains any blocklisted term.
 * Strips HTML tags first, then does case-insensitive phrase match.
 * @param {string} text - Raw text (may include HTML)
 * @returns {{ blocked: boolean, matched?: string }} - blocked true if content should be rejected
 */
function containsBlockedContent(text) {
  if (!text || typeof text !== 'string') return { blocked: false };
  const stripped = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  for (const term of BLOCKLIST) {
    if (!term || typeof term !== 'string') continue;
    const lower = term.trim().toLowerCase();
    if (!lower) continue;
    // Phrase match: look for the term as a whole word or phrase
    const regex = new RegExp('\\b' + lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (regex.test(stripped)) return { blocked: true, matched: term };
    // Also check as substring for multi-word phrases
    if (lower.includes(' ') && stripped.includes(lower)) return { blocked: true, matched: term };
  }
  return { blocked: false };
}

module.exports = { BLOCKLIST, containsBlockedContent };
