import { Logger } from "../log";
import { ClassifyStatistics } from "./statistics";

export class ClassifyChecker {
  constructor(
    private readonly logger: Logger,
    private readonly statistics: ClassifyStatistics
  ) {}

  checkTotal(expectTotal: number) {
    const actualTotal = this.statistics.getStatistics().total;
    this.logger.write(
      `${expectTotal} data should be processed and ${actualTotal} data were actually processed.`
    );
    if (actualTotal === expectTotal) {
      this.logger.write(`In line with expectations.`);
    } else {
      this.logger.write(`[Warning] The numbers don't add up.`);
    }
  }
}
