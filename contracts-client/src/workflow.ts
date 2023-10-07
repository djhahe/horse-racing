import { config as envConfig } from "dotenv";
envConfig({ path: ".env.local" });

import { CasperClient, Keys } from "casper-js-sdk";
import { config as baseConfig, ContractInfo, Utils } from "casper-contracts-client";
import { RaceClient } from "./race-client";

export const MOTES = 1_000_000_000;

const {
} = process.env;

const workflowConfig = {
    ...baseConfig,
    main: Utils.getAccountKey(baseConfig.accountPaths, "faucet"),
    admin: Utils.getAccountKey(baseConfig.accountPaths, "user-1"),
    token: Utils.getAccountKey(baseConfig.accountPaths, "user-2"),
    token2: Utils.getAccountKey(baseConfig.accountPaths, "user-3"),
    user1: Utils.getAccountKey(baseConfig.accountPaths, "user-4"),
    user2: Utils.getAccountKey(baseConfig.accountPaths, "user-5"),
    user3: Utils.getAccountKey(baseConfig.accountPaths, "user-6"),
    donation: Utils.getAccountKey(baseConfig.accountPaths, "user-7"),
    token_price: 500 * MOTES,
}

export class Workflow {

    public client: CasperClient;
    private host: ContractInfo;
    private hostClient: RaceClient;

    constructor() {
        this.client = new CasperClient(this.config.nodeAddress);
    }

    public get config() {
        return workflowConfig;
    }

    public getHostClient(): RaceClient {
        if (!this.hostClient) {
            this.hostClient = new RaceClient(this.config);
        }
        return this.hostClient;
    }

    public async getHost(forceInstall: boolean = false) {
        if (!this.host) {
            const raceClient = this.getHostClient();
            let args = {
                key: this.config.main,
                paymentAmount: this.config.paymentCommon,
                wasm: Utils.getBinary("../res/contracts/horse-racing-1.0.0.wasm"),
                id: "casperdash_horse_racing",
                name: "Horse Racing",
                admins: [this.config.admin.accountHash()]
            };
            if (forceInstall) {
                this.host = await raceClient.install(args);
            } else {
                this.host = await raceClient.getOrInstall(args);
            }
        }
        return this.host;
    }

    public async quickPlay(user: Keys.AsymmetricKey, race_id: number, bet_amount: number, bet_on: number) {
        console.log(`Quick play ${bet_amount} for ${bet_on}`);
        
        const host = await this.getHost();
        const hostClient = this.getHostClient(); 
        await hostClient.quickPlay({
            wasm: Utils.getBinary("../res/contracts/horse-racing-play-1.0.0.wasm"),
            key: user,
            paymentAmount: this.config.paymentCommon,
            host: host.toByteArray(),
            id: race_id,
            bet_on,
            bet_amount
        });
    }

    public async topUp(user: Keys.AsymmetricKey, amount: number) {
        console.log(`Top up ${amount}`);
        
        const host = await this.getHost();
        const hostClient = this.getHostClient(); 

        await hostClient.topUp({
            wasm: Utils.getBinary("../res/contracts/horse-racing-topup-1.0.0.wasm"),
            key: user,
            paymentAmount: this.config.paymentCommon,
            host: host.toByteArray(),
            amount
        });
    }

    public async getAccountBalance(name: string, keys: Keys.AsymmetricKey) {
        let amount = await this.client.balanceOfByPublicKey(keys.publicKey);
        console.log("Balance of " + name + " is " + amount);
        return amount;
    }
}
