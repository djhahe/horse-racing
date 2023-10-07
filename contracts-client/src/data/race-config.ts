import { BYTE_ARRAY_TYPE, CLByteArrayBytesParser, CLByteArrayType, CLErrorCodes, CLKeyBytesParser, CLKeyParameters, CLListBytesParser, CLListType, CLString, CLStringBytesParser, CLStringType, CLType, CLTypeTag, CLU32BytesParser, CLU512BytesParser, CLU64BytesParser, CLValue, CLValueBytesParsers, ResultAndRemainder, resultHelper, ToBytesResult } from "casper-js-sdk";
import { Ok, Err } from 'ts-results';

export class CLRaceConfigType extends CLType {
  tag = CLTypeTag.Any;
  linksTo = BYTE_ARRAY_TYPE;

  toString(): string {
    return "RaceConfig";
  }

  toJSON(): string {
    return this.toString();
  }
}

export type RaceConfig = {
  /**
   * Name of race
   */
  name: string,

  /**
   * Number of racers
   */
  racers: number,

  /**
   * Fee to pay for host
   */
  fee_percent: number,

  /**
   * Mininum bet amount
   */
  min_bet: number,

  /**
   * Maximum bet amount
   */
  max_bet: number
}

export class CLRaceConfigBytesParser extends CLValueBytesParsers {
  toBytes(_: CLRaceConfig): ToBytesResult {
    throw new Error("Method not implemented." + _);
  }

  fromBytesWithRemainder(bytes: Uint8Array): ResultAndRemainder<CLRaceConfig, CLErrorCodes> {
    const { result: nameResult, remainder: remainder1 } = new CLStringBytesParser().fromBytesWithRemainder(bytes);
    const { result: racersResult, remainder: remainder2 } = new CLU32BytesParser().fromBytesWithRemainder(remainder1 as Uint8Array);
    const { result: feePercentResult, remainder: remainder3 } = new CLU32BytesParser().fromBytesWithRemainder(remainder2 as Uint8Array);
    const { result: minBet, remainder: remainder4 } = new CLU512BytesParser().fromBytesWithRemainder(remainder3 as Uint8Array);
    const { result: maxBet, remainder: remainder5 } = new CLU512BytesParser().fromBytesWithRemainder(remainder4 as Uint8Array);

    if (nameResult.ok && maxBet.ok) {
      const user: RaceConfig = {
        name: nameResult.unwrap().data,
        racers: racersResult.unwrap().data.toNumber(),
        fee_percent: feePercentResult.unwrap().data.toNumber(),
        min_bet: minBet.unwrap().data.toNumber(),
        max_bet: maxBet.unwrap().data.toNumber(),
      };
      return resultHelper(Ok(new CLRaceConfig(user)), remainder5);
    }
    return resultHelper<CLRaceConfig, CLErrorCodes>(Err(CLErrorCodes.Formatting));
  }
}

export class CLRaceConfig extends CLValue {
  data: RaceConfig;
  bytesParser: CLRaceConfigBytesParser;

  constructor(v: RaceConfig) {
    super();
    this.bytesParser = new CLRaceConfigBytesParser();
    this.data = v;
  }

  clType(): CLType {
    return new CLRaceConfigType();
  }

  value(): RaceConfig {
    return this.data;
  }

  toBytes(): ToBytesResult {
    return this.bytesParser.toBytes(this);
  }
}
