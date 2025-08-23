'use client';

import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc-client';

export const Client = () => {
  const { data } = useQuery(orpc.healthCheck.queryOptions({}));

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
