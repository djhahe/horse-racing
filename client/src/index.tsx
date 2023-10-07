import { CasperDashConnector, CasperProvider, createClient } from "@casperdash/usewallet";
import App from "./App";
import './index.css';
import { useState } from "react";

export const GhostRacingGame = () => {
    const [client] = useState(() => createClient({
        connectors: [new CasperDashConnector()],
        autoConnect: true,
    }))

    return (
       <CasperProvider client={client}>
         <App />
       </CasperProvider>
    )
}