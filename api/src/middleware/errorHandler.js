export function notFoundHandler(request, response) {
  response.status(404).json({ error: `Rota não encontrada: ${request.method} ${request.path}` });
}

export function errorHandler(error, _request, response, _next) {
  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  }
  response
    .status(status)
    .json({ error: status >= 500 ? 'Erro interno do serviço.' : error.message });
}
