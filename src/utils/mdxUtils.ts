import fs from "fs";
import path from "path";

export const COURSES_PATH = path.join(process.cwd(), "src", "courses");

export const courseFilePaths = fs
  .readdirSync(COURSES_PATH)
  .filter((path) => /\.mdx?$/.test(path));
