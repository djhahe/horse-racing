import { CasperProvider } from '@casperdash/usewallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { browserRouter } from './configs/browser-router';
import { client } from './configs/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 * 365 * 100, // 100 years
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CasperProvider client={client}>
        <RouterProvider router={browserRouter} />
        <Toaster position="top-center" richColors closeButton />
      </CasperProvider>
    </QueryClientProvider>
  );
}

export default App;
