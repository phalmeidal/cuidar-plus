import { useCallback, useEffect, useState } from 'react';
import { getMonitoringData } from '../services/apiClient.js';

export function useMonitoring() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getMonitoringData());
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? 'Não foi possível conectar à API. Confirme se o serviço está em execução.'
          : requestError.message || 'Não foi possível carregar os dados de monitoramento.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, loading, reload };
}
