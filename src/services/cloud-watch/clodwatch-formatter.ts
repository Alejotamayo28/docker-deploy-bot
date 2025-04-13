import { EC2InstanceMetrics } from "./interfaces/cloud-watch-types";

export class CloudWatchFormatter {
  public static metricsToText(metrics: EC2InstanceMetrics[]): string {
    const groupedMetrics: Record<string, EC2InstanceMetrics[]> = {};
    metrics.forEach((metric: EC2InstanceMetrics) => {
      groupedMetrics[metric.instanceId] ??= []
      groupedMetrics[metric.instanceId].push(metric);
    });
    let text = 'Métricas de las instancias EC2:\n\n';
    for (const instanceId in groupedMetrics) {
      text += `📌 Instancia: ${instanceId}\n`;

      groupedMetrics[instanceId].forEach((metric, index) => {
        text += `🔹 Métrica ${index + 1}:\n` +
          `   CPU: avg=${metric.cpuUtilization.average}% max=${metric.cpuUtilization.max}%\n` +
          `   Disk Read: sum=${metric.diskRead.sum} ops\n` +
          `   Disk Write: sum=${metric.diskWrite.sum} ops\n` +
          `   Network: in=${metric.networkInOut.in} bytes, out=${metric.networkInOut.out} bytes\n\n`;
      });
    }
    return text;
  }
}
