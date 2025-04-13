import { prodEc2Config } from "./prod.config";
import { testEc2Config } from "./test.config";

export namespace Ec2Config {
  export const Production = prodEc2Config
  export const Test = testEc2Config
}
