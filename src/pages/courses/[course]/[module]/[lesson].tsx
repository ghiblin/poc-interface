import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Link from "next/link";
import path from "path";
import remarkGemoji from "remark-gemoji";
import {
  getCourseModuleSlugs,
  getCourseSlugs,
  getModuleLessonSlugs,
} from "../../../../lib/api/courses";
import { LessonType } from "../../../../types/lesson";
import { getValueFromParams } from "../../../../utils";
import { COURSES_PATH } from "../../../../utils/mdxUtils";

type LessonPageProps = {
  course: string;
  module: string;
  lesson: string;
  source: MDXRemoteSerializeResult;
  frontMatter: LessonType;
};

export default function LessonPage({
  course,
  module,
  lesson,
  source,
  frontMatter,
}: LessonPageProps): JSX.Element {
  return (
    <>
      <span>
        <Link href="/courses/[course]" as={`/courses/${course}`}>
          {course}
        </Link>{" "}
        /{" "}
        <Link
          href="/courses/[course]/[module]"
          as={`/courses/${course}/${module}`}
        >
          {module}
        </Link>{" "}
        / {lesson}
      </span>
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...source} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getCourseSlugs()
    .flatMap((course) => {
      return getCourseModuleSlugs(course).map((module) => {
        return { course, module };
      });
    })
    .flatMap(({ course, module }) => {
      return getModuleLessonSlugs(course, module).map((lesson) => {
        return {
          params: {
            course,
            module,
            lesson,
          },
        };
      });
    });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<LessonPageProps> = async ({
  params,
}) => {
  const course = getValueFromParams("course", params)!;
  const module = getValueFromParams("module", params)!;
  const lesson = getValueFromParams("lesson", params)!;

  const lessonFilePath = path.join(
    COURSES_PATH,
    course,
    module,
    `${lesson}.mdx`
  );
  const source = fs.readFileSync(lessonFilePath);

  const { content, data } = matter(source);

  // TODO: move this to an utility function
  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkGemoji],
      rehypePlugins: [],
      format: "mdx",
    },
    scope: data,
  });

  return {
    props: {
      course,
      module,
      lesson,
      source: mdxSource,
      frontMatter: data as LessonType,
    },
  };
};
