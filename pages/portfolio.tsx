import type { GetServerSideProps } from "next";
export default function Portfolio() {
  return null;
}
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/#packages", permanent: true },
});
