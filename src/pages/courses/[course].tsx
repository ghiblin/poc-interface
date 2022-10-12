import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import { WEBSITE_HOST_URL } from "../../components/head";
import Layout from "../../components/layout";
import { getCourseModules, getCourseSlugs } from "../../lib/api/courses";
import { CourseType } from "../../types/course";
import { MetaProps } from "../../types/layout";
import { ModuleType } from "../../types/module";
import { COURSES_PATH } from "../../utils/mdxUtils";

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  Head,
  Image,
  Link,
};

type CoursePageProps = {
  course: string;
  source: MDXRemoteSerializeResult;
  frontMatter: CourseType;
  modules: ModuleType[];
};

export default function CoursePage({
  course,
  source,
  frontMatter,
  modules,
}: CoursePageProps): JSX.Element {
  const customMeta: MetaProps = {
    title: frontMatter.title,
    description: frontMatter.description,
    image: frontMatter.image
      ? `${WEBSITE_HOST_URL}${frontMatter.image}`
      : undefined,
    date: frontMatter.date,
    type: "article",
  };

  return (
    <Layout customMeta={customMeta}>
      <article>
        <h1>{frontMatter.title}</h1>
      </article>
      <div>
        <MDXRemote {...source} components={components} />
      </div>
      <div>
        <h3>Modules</h3>
        <ul>
          {modules.map((module) => (
            <li key={module.slug}>
              <Link
                as={`/courses/${course}/${module.slug}`}
                href="/courses/[course]/[module]"
              >
                <a>{module.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let course: string = Array.isArray(params!.course)
    ? params!.course[0]
    : params!.course!;
  const courseFilePath = path.join(COURSES_PATH, `${course}.mdx`);
  const source = fs.readFileSync(courseFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      format: "mdx",
    },
    scope: data,
  });

  const modules = getCourseModules(course);

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
      modules,
      course,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getCourseSlugs().map((course) => ({ params: { course } }));

  return {
    paths,
    fallback: false,
  };
};
