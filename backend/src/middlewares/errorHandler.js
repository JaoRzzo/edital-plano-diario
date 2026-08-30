const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Erro não tratado:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
