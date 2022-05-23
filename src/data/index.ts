import { resolve } from "path";
import { readFileSync } from "fs";

function getJsonData<T>(filename: string): T {
  return JSON.parse(
    readFileSync(resolve(__dirname, `raw/${filename}.json`), "utf8")
  );
}

interface IGovernorate {
  id: number;
  n_ar: string;
  n_en: string;
}
const governorates = getJsonData<IGovernorate[]>("governorates");

const interests = getJsonData<string[]>("interests");

export { governorates, interests };
