export type EC2InstanceState =
  | "pending"
  | "running"
  | "stopping"
  | "stopped"
  | "terminated";

export interface EC2Instance {
  instanceId: string,
  name: string,
  type: string,
  state: EC2InstanceState
  publicIpAddress: string
}
