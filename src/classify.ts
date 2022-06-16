import XLSX from "xlsx";
import path from "path";
import { listDocFiles } from "./utils";
import fs from "fs";

const referenceFile = "ref.xlsx";

const DUPLICATE_DEPART_NAME = "Duplicate";
const PWD = process.cwd();

main();

async function main() {

  const map = createMap()

  const files = await listDocFiles(PWD);

  const classifyPromise = files.map(async file => {
    const name = file.filename.split(".")[0].trim();
    const depart = map.get(name) || "Unknown"
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

function createMap() {
  const workbook = XLSX.readFile(referenceFile);
  const sheets = workbook.Sheets[workbook.SheetNames[0]];

  const map = new Map<string, string>();

  for (let i = 2; ; i++) {
    const name = sheets[`A${i}`];
    const depart = sheets[`B${i}`];

    if(!name && !depart) {
      break;
    }
    if (name && depart) {
      const name_v = name.v;
      const depart_v = depart.v;
      if (map.has(name_v)) {
        map.set(name_v, DUPLICATE_DEPART_NAME);
      } else {
        map.set(name_v, depart_v);
      }
    }
  }

  return map;
}