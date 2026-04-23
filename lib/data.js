import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "invoices.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
  } catch (err) {
    // create directory and file
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {}
    await fs.writeFile(DATA_PATH, "[]", "utf8");
  }
}

export async function readInvoices() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  try {
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}

export async function writeInvoices(data) {
  await ensureDataFile();
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

