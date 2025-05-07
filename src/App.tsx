import { BrowserRouter } from "react-router-dom"
import RoutesControl361 from "./routes/RoutesControl361"
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoutesControl361 />
      </BrowserRouter>
    </PrimeReactProvider>
  )
}

export default App
