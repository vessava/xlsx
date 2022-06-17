import path from "path";
import { listDocFiles } from "./utils";
import fs from "fs";
import { EmployeeMap } from "./employee";


const PWD = process.cwd();
// const PWD = './test';

main();

async function main() {

  const map = new EmployeeMap(PWD);
  const files = await listDocFiles(PWD);
  const classifyPromise = files.map(async file => {
    const name = file.filename.split(".")[0].trim();
    const depart = map.getDepartment(name) || "Unknown"
    const departPath = path.join(PWD, depart);
    return moveToDestFolder(departPath, file.filepath, path.join(departPath, file.filename))
  })
  
  Promise.all(classifyPromise);
}

async function moveToDestFolder(folder: string, src: string, dest: string) {
  if(!fs.existsSync(folder)) {
    await fs.promises.mkdir(folder);
  }

  return fs.promises.copyFile(src, dest)
}
