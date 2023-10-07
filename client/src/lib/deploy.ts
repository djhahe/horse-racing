import { CLValueBuilder, Contracts, CasperClient, CLPublicKey, RuntimeArgs, DeployUtil } from 'casper-js-sdk';

const createRuntimeArgs = (args: any) => {
  for (const key of Object.keys(args)) {
    if (args[key] == null) {
      delete args[key];
    }
  }

  const runtimeArgs = RuntimeArgs.fromMap(args);

  return runtimeArgs;
};

const getClient = () => {
  return new CasperClient('https://caspertest.codsay.dev/rpc');
};

export const buildPlayDeploy = (id: number, stake: number, publicKey: string) => {
  const client = getClient();
  const contract = new Contracts.Contract(client);
  contract.setContractHash('hash-of-contract');
  const plKey = CLPublicKey.fromHex(publicKey);
  const args = {
    id: CLValueBuilder.u64(1),
    bet_amount: CLValueBuilder.u512(stake),
    bet_on: CLValueBuilder.u32(id),
  };
  const deploy = contract.callEntrypoint('quick_play', createRuntimeArgs(args), plKey, 'casper-test', '10_000_000_000');
  return DeployUtil.deployToJson(deploy);
};

export const sendDeploy = async (deploy: any) => {
  const client = getClient();
  const deployHash = await client.putDeploy(deploy);
  return deployHash;
};
