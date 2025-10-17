export function notFound(_req, res, _next) {
    res.status(404).json({ message: 'Not found' });
    }
    
    
    export function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const message = err.message || 'Server error';
    const details = err.details;
    if (status >= 500) console.error('[ERROR]', err);
    res.status(status).json({ message, details });
    }