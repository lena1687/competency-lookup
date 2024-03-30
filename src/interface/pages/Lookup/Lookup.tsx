import { LookupParameters } from '../../composites/Lookup/LookupParameters';
import { useCompetencyData } from '../../../hooks/useCompetencyData';
import React, { useState } from 'react';
import { LookupResult } from '../../composites/Lookup/LookupResult';
import { LookupSettings } from '../../../types';

export const Lookup: React.FC = () => {
  const { data, isLoading } = useCompetencyData();
  const [parameters, setParameters] = useState<LookupSettings | null>(null);

  if (isLoading || !data) {
    return <div>Loading data</div>;
  }

  return (
    <div>
      <LookupParameters
        data={data}
        onSubmit={(output) => setParameters(output)}
      />
      {parameters && <LookupResult parameters={parameters} data={data} />}
    </div>
  );
};
