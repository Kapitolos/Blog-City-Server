const { containsBlockedContent } = require('./blocklist.js');

/** Max lengths (enforced in addition to DB limits) */
const LIMITS = {
  postTitle: 255,
  postBody: 100000,
  commentText: 1000
};

/**
 * Run content checks (blocklist + length) on user content.
 * @param {{ title?: string, body?: string, comment?: string }} content
 * @returns {{ allowed: boolean, error?: string }}
 */
function checkContent(content) {
  if (!content) return { allowed: true };

  if (content.title !== undefined) {
    if (typeof content.title !== 'string') return { allowed: false, error: 'Invalid title' };
    if (content.title.length > LIMITS.postTitle) {
      return { allowed: false, error: `Title must be ${LIMITS.postTitle} characters or less` };
    }
    const r = containsBlockedContent(content.title);
    if (r.blocked) return { allowed: false, error: 'Your content does not meet our community guidelines. Please revise and try again.' };
  }

  if (content.body !== undefined) {
    if (typeof content.body !== 'string') return { allowed: false, error: 'Invalid content' };
    if (content.body.length > LIMITS.postBody) {
      return { allowed: false, error: `Post content must be ${LIMITS.postBody} characters or less` };
    }
    const r = containsBlockedContent(content.body);
    if (r.blocked) return { allowed: false, error: 'Your content does not meet our community guidelines. Please revise and try again.' };
  }

  if (content.comment !== undefined) {
    if (typeof content.comment !== 'string') return { allowed: false, error: 'Invalid comment' };
    if (content.comment.length > LIMITS.commentText) {
      return { allowed: false, error: `Comment must be ${LIMITS.commentText} characters or less` };
    }
    const r = containsBlockedContent(content.comment);
    if (r.blocked) return { allowed: false, error: 'Your content does not meet our community guidelines. Please revise and try again.' };
  }

  return { allowed: true };
}

module.exports = { checkContent, LIMITS };
