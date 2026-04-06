/**
 * Returns true if combined lead text matches the spam regex.
 * Env LEAD_SPAM_REGEX: one JavaScript regex pattern, e.g. `(?i)(viagra|click here)`
 * If unset, uses a small default.
 */
function getSpamRegex() {
  const raw = process.env.LEAD_SPAM_REGEX;
  if (raw && raw.trim()) {
    try {
      return new RegExp(raw.trim());
    } catch {
      return null;
    }
  }
  return /(viagra|cialis|click\s*here|congratulations\s+you\s+won|bit\.ly\/)/i;
}

function isSpamLead(parts) {
  const text = parts.filter(Boolean).join('\n');
  if (!text.trim()) return false;
  const re = getSpamRegex();
  if (!re) return false;
  return re.test(text);
}

module.exports = { isSpamLead };
