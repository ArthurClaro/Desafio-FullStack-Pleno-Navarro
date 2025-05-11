import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.scss'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
