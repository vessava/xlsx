
import XLSX from "xlsx"
import path from "path";

const REFERENCE_FILE = "ref.xlsx";
const DUPLICATE_DEPART_NAME = "Duplicate";

export class EmployeeMap {
  private readonly map;
  constructor(root: string) {
    const file = path.join(root, REFERENCE_FILE);
    this.map = createMap(file)
  }

  getDepartment(filename: string): string | null {
    for(let [name, depart] of this.map.entries()) {
      if(filename.includes(name)) {
        return depart
      }
    }
    return null;
  }
}

function createMap(file: string) {
  const workbook = XLSX.readFile(file);
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