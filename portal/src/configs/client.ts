import { CasperDashConnector, createClient } from '@casperdash/usewallet';

export const client = createClient({
  connectors: [new CasperDashConnector()],
  autoConnect: true,
});
