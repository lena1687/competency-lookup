import { useEffect, useState } from 'react';
import { CompetencyData } from '../types';

export function useCompetencyData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<CompetencyData[] | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/json/competencyData.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => setData(data))
      .finally(() => setIsLoading(false));
  }, [setIsLoading]);

  return { isLoading, data };
}
