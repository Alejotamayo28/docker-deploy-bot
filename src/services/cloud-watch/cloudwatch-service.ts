import { EnvProcess } from "../../config/env.process";
import { createCloudWatchClient, createEc2Client } from "../clien";
import { GetMetricStatisticsCommand, GetMetricStatisticsCommandInput } from "@aws-sdk/client-cloudwatch";
import { EC2InstanceMetrics } from "./interfaces/cloud-watch-types";
import { getRunningEC2Instances } from "../ec2/aws.service";

export async function getEC2Metrics(env: EnvProcess): Promise<EC2InstanceMetrics[]> {
  const CloudWatchClient = createCloudWatchClient(env)
  const Ec2Client = createEc2Client(env)
  const instances = await getRunningEC2Instances(Ec2Client)
  const instanceIds = instances.Reservations?.flatMap(
    reservation => reservation.Instances?.map(
      instance => instance.InstanceId)).filter(Boolean) as string[]
  return Promise.all(
    instanceIds.map(async (instanceId) => {
      // Metricas de CPU 
      const cpuParams: GetMetricStatisticsCommandInput = {
        Namespace: "AWS/EC2",
        MetricName: "CPUUtilization",
        Dimensions: [{ Name: "InstanceId", Value: instanceId }],
        StartTime: new Date(Date.now() - 3600 * 1000), // Última hora
        EndTime: new Date(),
        Period: 300, // Cada 5 minutos 
        Statistics: ["Average", "Maximum"],
      };
      // Metricas de lecture de dico
      const diskReadOpsParams: GetMetricStatisticsCommandInput = {
        Namespace: "AWS/EC2",
        MetricName: "DiskReadOps",
        Dimensions: [{ Name: "InstanceId", Value: instanceId }],
        StartTime: new Date(Date.now() - 3600 * 1000), // Última hora
        EndTime: new Date(),
        Period: 300, // Cada 5 minutos 
        Statistics: ["Average", "Maximum", "Sum"],
      }
      // Metricas de escritura de disco
      const diskWriteOpsParams: GetMetricStatisticsCommandInput = {
        Namespace: "AWS/EC2",
        MetricName: "DiskWriteOps",
        Dimensions: [{ Name: "InstanceId", Value: instanceId }],
        StartTime: new Date(Date.now() - 3600 * 1000), // Última hora
        EndTime: new Date(),
        Period: 300, // Cada 5 minutos 
        Statistics: ["Average", "Maximum", "Sum"],
      }
      // Metricas de red 
      const networkInParams: GetMetricStatisticsCommandInput = {
        ...cpuParams,
        MetricName: "NetworkIn",
        Statistics: ["Sum"],
      };
      const networkOutParams: GetMetricStatisticsCommandInput = {
        ...cpuParams,
        MetricName: "NetworkOut",
        Statistics: ["Sum"]
      }
      const [cpuData, diskRead, diskWrite, networkInData, networkOutData] = await Promise.all([
        CloudWatchClient.send(new GetMetricStatisticsCommand(cpuParams)),
        CloudWatchClient.send(new GetMetricStatisticsCommand(diskReadOpsParams)),
        CloudWatchClient.send(new GetMetricStatisticsCommand(diskWriteOpsParams)),
        CloudWatchClient.send(new GetMetricStatisticsCommand(networkInParams)),
        CloudWatchClient.send(new GetMetricStatisticsCommand(networkOutParams))
      ]);
      return {
        instanceId,
        cpuUtilization: {
          average: cpuData.Datapoints?.[0]?.Average ?? 0,
          max: cpuData.Datapoints?.[0]?.Maximum ?? 0,
          timestamps: cpuData.Datapoints?.map(d => d.Timestamp!) ?? [],
        },
        diskRead: {
          average: diskRead.Datapoints?.[0]?.Average ?? 0,
          max: diskRead.Datapoints?.[0]?.Maximum ?? 0,
          sum: diskRead.Datapoints?.[0]?.Sum ?? 0
        },
        diskWrite: {
          average: diskWrite.Datapoints?.[0]?.Average ?? 0,
          max: diskWrite.Datapoints?.[0]?.Maximum ?? 0,
          sum: diskWrite.Datapoints?.[0]?.Sum ?? 0
        },
        networkInOut: {
          in: networkInData.Datapoints?.[0]?.Sum ?? 0,
          out: networkOutData.Datapoints?.[0]?.Sum ?? 0,
        },
      };
    })
  );
}
