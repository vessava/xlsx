import XLSX from "xlsx";
import fs from "fs";
import path from "path";

main();

async function main() {
  const files = await listFiles();
  const worksheet = XLSX.utils.json_to_sheet(files);
  for (let key in worksheet) {
    if (key.startsWith("B") && parseInt(key.substring(1)) > 1) {
      const link = worksheet[key].v;
      worksheet[key].l = { Target: `file://${link}` };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  XLSX.writeFile(workbook, "./result.xlsx");
}

const DOCS_EXTENSION_NAME = [".doc", ".docx", ".dotx"];

interface FileObj {
  filename: string;
  filepath: string;
}

async function listFiles(): Promise<FileObj[]> {
  const pwd = process.cwd();
  const list = await fs.promises.readdir(pwd);
  return list
    .filter((fileName) => DOCS_EXTENSION_NAME.includes(path.extname(fileName)))
    .map((fileName) => ({
      filename: fileName,
      filepath: path.join(pwd, fileName),
    }));
}
