import { BrowserRouter } from "react-router-dom"
import RoutesControl361 from "./routes/RoutesControl361"
import { PrimeReactProvider } from 'primereact/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <RoutesControl361 />
        </BrowserRouter>
      </PrimeReactProvider>
    </QueryClientProvider>
  )
}

export default App
