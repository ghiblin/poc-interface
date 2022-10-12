import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Layout from "../components/layout";
import { getAllCourses } from "../lib/api/courses";
import { CourseType } from "../types/course";

type IndexProps = {
  courses: CourseType[];
};

export default function Index({ courses }: IndexProps): JSX.Element {
  return (
    <Layout>
      <h1>Home Page</h1>
      {courses.map((course) => (
        <article key={course.slug}>
          <h1>
            <Link as={`/courses/${course.slug}`} href={`/courses/[course]`}>
              <a>{course.title}</a>
            </Link>
          </h1>
          <p>{course.description}</p>
        </article>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const courses = getAllCourses(["title", "slug", "description"]);

  return { props: { courses } };
};
