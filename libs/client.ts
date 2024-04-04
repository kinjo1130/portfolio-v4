import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN as string,
  apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
});