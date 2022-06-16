import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { listDocFiles } from "./utils";

main();

interface SheetItem {
  filename: string;
  filepath: string;
  foldername: string;
}

async function main() {
  const folders = await listFolder(process.cwd());

  const listPms = folders.map(async (folder) => {
    const root = folder.folderpath;
    const files = await listDocFiles(root);
    const sheets: SheetItem[] = files.map((f) => ({
      ...f,
      foldername: folder.foldername,
    }));
    return sheets;
  });

  const list = await Promise.all(listPms);

  const final = list.flat().map(f => ({"人名": f.filename, "部门": f.foldername, "链接": f.filepath}));

  const worksheet = XLSX.utils.json_to_sheet(final, { header: ["人名", "部门", "链接"] });
  for (let key in worksheet) {
    if (key.startsWith("C") && parseInt(key.substring(1)) > 1) {
      const link = worksheet[key].v;
      worksheet[key].l = { Target: `file://${link}` };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  XLSX.writeFile(workbook, "./result.xlsx");
}

interface FolderObj {
  foldername: string;
  folderpath: string;
}

async function listFolder(dir: string): Promise<FolderObj[]> {
  const list = await fs.promises.readdir(dir);
  const readPms = list
    .map((fileName) => ({ foldername: fileName, p: path.join(dir, fileName) }))
    .map(async (folderObj) => {
      const stat = await fs.promises.stat(folderObj.p);
      return { ...folderObj, is: stat.isDirectory() };
    });

  const dirs = await Promise.all(readPms);
  return dirs
    .filter((o) => o.is)
    .map((o) => ({ foldername: o.foldername, folderpath: o.p }));
}

