import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { courseFilePaths, COURSES_PATH } from "../../utils/mdxUtils";

export function getCourseSlugs(): string[] {
  return courseFilePaths.map((path) => path.replace(/\.mdx?$/, ""));
}

type CourseItems = {
  [key: string]: string;
};

type ModuleItems = {
  title: string;
  slug: string;
};

export function getCourseBySlug(
  slug: string,
  fields: string[] = []
): CourseItems {
  const fullPath = join(COURSES_PATH, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const items: CourseItems = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    switch (field) {
      case "slug":
        items[field] = slug;
        break;
      case "content":
        items[field] = content;
        break;
      default:
        if (data[field]) {
          items[field] = data[field];
        }
        break;
    }
  });

  return items;
}

export function getAllCourses(fields: string[] = []): CourseItems[] {
  return getCourseSlugs()
    .map((slug) => getCourseBySlug(slug, fields))
    .sort((c1, c2) => (c1.date > c2.date ? -1 : 1));
}

export function getCourseModules(slug: string): ModuleItems[] {
  return fs
    .readdirSync(join(COURSES_PATH, slug))
    .filter((path) => fs.statSync(join(COURSES_PATH, slug, path)).isDirectory)
    .map((path) => {
      const fileContents = fs.readFileSync(
        join(COURSES_PATH, slug, path, "index.mdx"),
        "utf-8"
      );
      const { data } = matter(fileContents);
      return {
        slug: path,
        title: data.title,
      };
    });
}

export function getCourseModuleSlugs(course: string): string[] {
  return fs
    .readdirSync(join(COURSES_PATH, course))
    .filter((path) => fs.statSync(join(COURSES_PATH, course, path)).isDirectory)
    .map((path) => path.replace(/\.mdx?$/, ""));
}

export function getModuleSlugs(): string[] {
  return getCourseSlugs().flatMap(getCourseModuleSlugs);
}

export function getModuleLessonSlugs(course: string, module: string): string[] {
  return fs
    .readdirSync(join(COURSES_PATH, course, module))
    .filter((path) => !path.endsWith("index.mdx"))
    .map((path) => path.replace(/\.mdx?$/, ""));
}
