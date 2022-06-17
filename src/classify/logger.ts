import { Logger } from "../log";
import { ClassifyStatistics } from "./statistics";

export class StatisticsLogger {
  constructor(
    private readonly logger: Logger,
    private readonly statistics: ClassifyStatistics
  ) {}

  write() {
    const stat = this.statistics.getStatistics();
    const map = stat.countMap;
    this.logger.write("部门人数详细统计: ");
    for (let [depart, count] of map.entries()) {
      this.logger.write(`${depart}: ${count} 人`);
    }
  }
}
