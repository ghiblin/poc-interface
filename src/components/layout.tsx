import { MetaProps } from "../types/layout";
import Head from "./head";
import Navigation from "./navigation";

type LayoutProps = {
  children: React.ReactNode;
  customMeta?: MetaProps;
};

export default function Layout({
  children,
  customMeta,
}: LayoutProps): JSX.Element {
  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Navigation />
      </header>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
}
