import type { GetServerSideProps } from "next";
export default function About() {
  return null;
}
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/#process", permanent: true },
});
