function errorHandler(err, req, res, next) {
  // If response has already been sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  // Handle SQLite constraint violations
  if (err.code === 'SQLITE_CONSTRAINT' || err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: err.message || 'Database constraint violation' });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.url} - Status ${statusCode}:`, err);
  }

  return res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
