import { Utils } from "casper-contracts-client";
import { Workflow } from "../workflow";

const execute = async () => {
  let flow = new Workflow();
  await flow.topUp(flow.config.admin, Utils.toMotes(5000));
};

execute();