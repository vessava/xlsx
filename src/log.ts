import fs from "fs";
import os from "os";

export interface Logger {
  write(str: string): void;
}

export class TextLogger implements Logger {
  private readonly logs: string[] = [];
  constructor(private readonly logPath: string) {}
  write(str: string) {
    this.logs.push(str);
  }
  async finish() {
    return fs.promises.writeFile(this.logPath, this.logs.join(os.EOL));
  }
}
