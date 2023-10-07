import { ANY_TYPE, CLErrorCodes, CLKeyBytesParser, CLKeyParameters, CLListBytesParser, CLListType, CLTuple2, CLTuple2Type, CLType, CLTypeTag, CLU32, CLU32BytesParser, CLU32Type, CLU512, CLU512BytesParser, CLValue, CLValueBytesParsers, ResultAndRemainder, resultHelper, ToBytesResult } from "casper-js-sdk";
import { Ok, Err } from 'ts-results';

export type Race = {

  /**
   * Account hash of player
   */
  player: CLKeyParameters,

  bet_amount: number,
  bet_on: number,

  /**
   * Results of racers (0-index is winner)
   */
  racers: number[],
}

export class CLRaceType extends CLType {
  tag = CLTypeTag.Any;
  linksTo = ANY_TYPE;

  toString(): string {
    return "Race";
  }

  toJSON(): string {
    return this.toString();
  }
}

export class CLRace extends CLValue {
  data: Race;

  constructor(data: Race) {
    super();
    this.data = data;
  }

  clType(): CLType {
    return new CLRaceType();
  }

  value(): Race {
    return this.data;
  }

  toBytes(): ToBytesResult {
    return new CLRaceBytesParser().toBytes(this);
  }

  toJSON() {
    return JSON.stringify(this.data)
  }
}

export class CLRaceBytesParser extends CLValueBytesParsers {
  toBytes(_: CLRace): ToBytesResult {
    throw new Error("Method not implemented." + _);
  }

  fromBytesWithRemainder(bytes: Uint8Array): ResultAndRemainder<CLRace, CLErrorCodes> {
    const { result: playerResult, remainder: remainder1 } = new CLKeyBytesParser().fromBytesWithRemainder(bytes);
    const { result: betAmountResult, remainder: remainder2 } = new CLU512BytesParser().fromBytesWithRemainder(remainder1 as Uint8Array);
    const { result: betOnResult, remainder: remainder3 } = new CLU32BytesParser().fromBytesWithRemainder(remainder2 as Uint8Array);
    const { result: racersResult, remainder: remainder4 } = new CLListBytesParser().fromBytesWithRemainder(remainder3 as Uint8Array, new CLListType(new CLU32Type()));

    if (playerResult.ok && racersResult.ok) {
      const user: Race = {
        player: playerResult.unwrap().data,
        bet_amount: betAmountResult.unwrap().data.toNumber(),
        bet_on: betOnResult.unwrap().data.toNumber(),
        racers: racersResult.unwrap().data.map((v: CLValue) => v.data)
      };
      return resultHelper(Ok(new CLRace(user)), remainder4);
    }
    return resultHelper<CLRace, CLErrorCodes>(Err(CLErrorCodes.Formatting));
  }
}

