import fs from "fs";
import path from "path";
import { Context } from "./context";
import { TextLogger } from "./log";

export interface FileObj {
  filename: string;
  filepath: string;
}

const DOCS_EXTENSION_NAME = [".doc", ".docx", ".dotx"];

export async function listDocFiles(dir: string): Promise<FileObj[]> {
  const list = await fs.promises.readdir(dir);
  return list
    .filter((fileName) =>
      DOCS_EXTENSION_NAME.includes(path.extname(fileName).toLowerCase())
    )
    .map((fileName) => ({
      filename: fileName,
      filepath: path.join(dir, fileName),
    }));
}

const LOG_NAME = "log.txt";
const LOG_FILE = path.join(Context.PWD, LOG_NAME);

export const logger = new TextLogger(LOG_FILE);
