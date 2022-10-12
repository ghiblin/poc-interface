import { ModuleType } from "./module";

export type CourseType = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  image?: string;
  modules?: ModuleType[];
};
