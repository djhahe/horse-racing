import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CasperDashConnector, CasperProvider, createClient } from '@casperdash/usewallet'

const client = createClient({
  connectors: [new CasperDashConnector()],
  autoConnect: true,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
           <CasperProvider client={client}>
    <App />
    </CasperProvider>
  </React.StrictMode>,
)
