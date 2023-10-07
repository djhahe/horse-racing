import { CLKeyParameters, CLValueBuilder } from "casper-js-sdk";
import { Utils, ContractInfo, DeployArgs, Logger, BaseClient } from "casper-contracts-client";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { CLRaceConfigBytesParser, RaceConfig } from "./data/race-config";
import { CLRaceBytesParser, Race } from "./data/race";

export interface RaceInstallArgs extends DeployArgs {
    wasm: Uint8Array,
    id: string,
    name: string,
    admins: Uint8Array[],
}

export interface RaceRegisterConfigArgs extends DeployArgs {
    config: RaceConfig
}

export interface RaceQuickPlayArgs extends DeployArgs {
    wasm: Uint8Array,
    host: Uint8Array,
    id: number,
    bet_on: number,
    bet_amount: number
}

export interface RaceTopUpArgs extends DeployArgs {
    wasm: Uint8Array,
    host: Uint8Array,
    amount: number
}

export class RaceClient extends BaseClient {

    public async install(args: RaceInstallArgs): Promise<ContractInfo> {
        const deploy = await this.createDeploy_install(args);
        await this.deploy("Deploy race host", deploy);
        return this.getInstalledContract(args.key, args.id);
    }

    public async getOrInstall(args: RaceInstallArgs) {
        const contract = await this.getOrInstallContract(args.key, args.id, async () => {
            await this.install(args);
        });
        return contract;
    }

    public async createDeploy_install(args: RaceInstallArgs) {
        const runtimeArgs = this.createRuntimeArgs({
            id: CLValueBuilder.string(args.id),
            name: CLValueBuilder.string(args.name),
            admins: Utils.getCLValueByteArrayList(args.admins)
        });
        const contractClient = await this.getContractClient();
        return contractClient.install(args.wasm, runtimeArgs, String(args.paymentAmount), args.key.publicKey, this.config.chainName, [args.key]);
    }

    public async registerRaceConfig(host: ContractInfo | string, args: RaceRegisterConfigArgs) {
        const runtimeArgs = this.createRuntimeArgs({
            name: CLValueBuilder.string(args.config.name),
            racers: CLValueBuilder.u32(args.config.racers),
            fee_percent: CLValueBuilder.u32(args.config.fee_percent),
            min_bet: CLValueBuilder.u512(args.config.min_bet),
            max_bet: CLValueBuilder.u512(args.config.max_bet)
        });
        
        const contractClient = await this.getContractClient(host);
        const deploy = contractClient.callEntrypoint("register_race_config", runtimeArgs, args.key.publicKey, this.config.chainName, String(args.paymentAmount), [args.key]);
        await this.deploy(`Register race config`, deploy);
    }

    public async getRaceConfig(host: ContractInfo | string, race_config_id: string): Promise<RaceConfig> {
        const itemData = await Utils.getDictionaryItemByName(this.getContractHashString(host), "races_config", race_config_id, true);
        const bytes = JSON.parse(JSON.stringify(itemData.CLValue))["bytes"] as string;
        const data = new CLRaceConfigBytesParser().fromBytesWithRemainder(hexToBytes(bytes));
        const value = data.result.unwrap().data;
        Logger.debug(() => `Race config data: ${JSON.stringify(value)}`);
        return value;
    }

    public async quickPlay(args: RaceQuickPlayArgs) {
        const runtimeArgs = this.createRuntimeArgs({
            host: Utils.getCLValueByteArray(args.host),
            id: CLValueBuilder.u256(args.id),
            bet_on: CLValueBuilder.u32(args.bet_on),
            bet_amount: CLValueBuilder.u512(args.bet_amount)
        });
        
        const contractClient = await this.getContractClient();
        const deploy = contractClient.install(args.wasm, runtimeArgs, String(args.paymentAmount), args.key.publicKey, this.config.chainName, [args.key]);
        await this.deploy(`Quick play ${args.id}`, deploy);
    }

    public async topUp(args: RaceTopUpArgs) {
        const runtimeArgs = this.createRuntimeArgs({
            host: Utils.getCLValueByteArray(args.host),
            amount: CLValueBuilder.u512(args.amount)
        });
        
        const contractClient = await this.getContractClient();
        const deploy = contractClient.install(args.wasm, runtimeArgs, String(args.paymentAmount), args.key.publicKey, this.config.chainName, [args.key]);
        await this.deploy(`Top up ${args.amount}`, deploy);
    }

    public async getRacesConfigCounter(host: ContractInfo | string): Promise<number> {
        return this.getContractData_BigNumber(host, "race_config_counter");
    }

    public async getRacesCounter(host: ContractInfo | string, raceConfigID: number): Promise<number> {
        const contractClient = await this.getContractClient(host);
        const data = await contractClient.queryContractDictionary("races_counter", String(raceConfigID));
        Logger.debug(() => `Last id of ${raceConfigID} is ${JSON.stringify(data)}`);
        return data.data;
    }

    public async getRaces(host: ContractInfo | string, owner: CLKeyParameters): Promise<Race[]> {
        const counter = await this.getRacesConfigCounter(host);
        const races = [];

        for (let i = 1; i <= counter; i++) {
            let raceCounter = await this.getRacesCounter(host, i);
            for (let j = 1; j <= raceCounter; j++) {
                const race = await this.getRace(host, `${i}_${j}`);
                if (!owner || bytesToHex(race.player.value() as Uint8Array) == bytesToHex(owner.value() as Uint8Array)) {
                    races.push(race);
                }
            }
        }
        Logger.debug(() => `Found ${races.length} races`);
        return races;
    }

    public async getLastRace(host: ContractInfo | string): Promise<Race> {
        const counter = await this.getRacesConfigCounter(host);
        const raceCounter = await this.getRacesCounter(host, counter);
        const race = await this.getRace(host, `${counter}_${raceCounter}`);
        return race;
    }

    /**
     * id is: raceConfigID_raceID (e.g, 1_1, 1_2, 2_4)
     */
    public async getRace(host: ContractInfo | string, id: string): Promise<Race> {
        const itemData = await Utils.getDictionaryItemByName(this.getContractHashString(host), "races", id, true);
        const bytes = JSON.parse(JSON.stringify(itemData.CLValue))["bytes"] as string;
        const data = new CLRaceBytesParser().fromBytesWithRemainder(hexToBytes(bytes));
        const payment = data.result.unwrap().data;
        Logger.debug(() => `Get race ${id}: ${JSON.stringify(payment)}`);
        return payment;
    }

    public async getPurseBalance(Race: ContractInfo | string): Promise<number> {
        return this.getContractData_BigNumber(Race, "purse_balance");
    }

}