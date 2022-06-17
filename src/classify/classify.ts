import path from "path";
import fs from "fs";
import { FileObj, listDocFiles, logger } from "../utils";
import { EmployeeMap } from "./employee";
import { ClassifyChecker } from "./checker";
import { ClassifyStatistics } from "./statistics";
import { StatisticsLogger } from "./logger";
import { Logger } from "../log";
import { Context } from "../context";

process.on("uncaughtException", (e) => {
  logger.write(e.toString());
  logger.finish();
});

process.on("unhandledRejection", (reason) => {
  if (reason instanceof Error) {
    logger.write(reason.toString());
  } else if ((reason as any).toString) {
    logger.write((reason as any).toString());
  } else {
    logger.write("Unknown unhandled rejection.");
  }
  logger.finish();
});

main();

async function main() {
  const root = Context.PWD;

  const map = new EmployeeMap(root);
  const files = await listDocFiles(root);

  const statistics = new ClassifyStatistics();
  const checker = new ClassifyChecker(logger, statistics);
  const statisticsLogger = new StatisticsLogger(logger, statistics);

  logger.write(`${files.length} document files found.`);

  const handleFile = async (file: FileObj) => {
    const name = file.filename.split(".")[0].trim();
    const depart = map.getDepartment(name) || "Unknown";
    const departPath = path.join(root, depart);
    const destPath = path.join(departPath, file.filename);
    return moveToDestFolder(departPath, file.filepath, destPath, logger);

    async function moveToDestFolder(
      folder: string,
      src: string,
      dest: string,
      logger: Logger
    ) {
      if (!fs.existsSync(folder)) {
        await fs.promises.mkdir(folder);
      }
      if (fs.existsSync(destPath)) {
        logger.write(
          "[Warning] The target file path already exists: " + destPath + "."
        );
      }
      statistics.add({ name, depart });
      return fs.promises.copyFile(src, dest);
    }
  };

  for (let file of files) {
    await handleFile(file);
  }

  checker.checkTotal(files.length);
  statisticsLogger.write();
  await logger.finish();
}
