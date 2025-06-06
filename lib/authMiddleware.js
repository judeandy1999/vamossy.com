export function authenticate(req, res) {
  const internalHeader = req.headers['x-internal-request'];
  if (!internalHeader || internalHeader !== process.env.INTERNAL_API_KEY) {
    res.status(403).json({ error: 'Forbidden: You have no access, Access is not allowed' });
    return false;
  }
  return true;
}