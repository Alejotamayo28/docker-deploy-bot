export interface EC2InstanceMetrics {
  instanceId: string,
  cpuUtilization: {
    average: number,
    max: number,
    timestamps: Date[]
  }
  diskRead: {
    average: number,
    max: number,
    sum: number
  },
  diskWrite: {
    average: number,
    max: number,
    sum: number
  }
  networkInOut: {
    in: number,
    out: number
  }
}
