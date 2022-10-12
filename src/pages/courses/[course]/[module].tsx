import { readFileSync } from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { join } from "path";
import {
  getCourseModules,
  getCourseSlugs,
  getModuleLessonSlugs,
} from "../../../lib/api/courses";
import { LessonType } from "../../../types/lesson";
import { getValueFromParams } from "../../../utils";
import { COURSES_PATH } from "../../../utils/mdxUtils";

type ModulePageProps = {
  course: string;
  module: string;
  lessons: LessonType[];
};

export default function ModulePage({
  course,
  module,
  lessons,
}: ModulePageProps): JSX.Element {
  return (
    <>
      <h1>
        {course} / {module}
      </h1>
      <p>Lessons</p>
      <ul>
        {lessons.map(({ slug, title }) => (
          <li key={slug}>
            <Link
              as={`/courses/${course}/${module}/${slug}`}
              href="/courses/[course]/[module]/[lesson]"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export const getStaticProps: GetStaticProps<ModulePageProps> = ({ params }) => {
  const course = getValueFromParams("course", params)!;
  const module = getValueFromParams("module", params)!;

  const lessons: LessonType[] = getModuleLessonSlugs(course, module).map(
    (lesson) => {
      const content = readFileSync(
        join(COURSES_PATH, course, module, `${lesson}.mdx`)
      );

      const { data } = matter(content);

      return {
        slug: lesson,
        title: data.title as string,
        // type: data.type as string,
      };
    }
  );

  console.log("lessons:", lessons);

  return {
    props: {
      course,
      module,
      lessons,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getCourseSlugs().flatMap((course) => {
    const modules = getCourseModules(course);
    return modules.map((module) => ({
      params: {
        course,
        module: module.slug,
      },
    }));
  });

  return { paths, fallback: false };
};
