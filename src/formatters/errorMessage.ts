export function errorMessageFormatter(err: any): string {
  if (typeof err === 'string') {
    return err;
  }

  const status: any = {
    '-1': 'Servidor não encontrado',
    400: 'Dados inválidos',
    401: 'Sem permissão de acesso',
    403: 'Sem permissão de acesso',
    422: 'Dados inválidos'
  };

  switch ((err || {}).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      return 'Sem conexão com a internet';
    case 'api-error':
      if (err.status == -1) {
        return 'Não conseguimos se comunicar com o servidor';
      }

      return status[err.status] || 'Algo deu errado...';
    default:
      return 'Algo deu errado...';
  }
}