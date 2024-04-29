import { client } from "@/libs/client";
import Layout from "../layout";
import { Works } from "@/types/work";
import { formatDate } from "@/libs/commom";

export default function Work({ works }: { works: Works }) {
  return (
    <Layout title="Work">
      <ul>
        {works.map((work) => (
          <li key={work.id}>
            <p>{work.title}</p>
            <div className="flex gap-4 items-center">
              <p>{formatDate(work.fromAt)}</p>
              <p>-</p>
              <p>{work.toAt ? formatDate(work.toAt) : "現在"} </p>
            </div>
            <p>{work.description}</p>
            <a href={work.link}>Link</a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await client.get({
    endpoint: "work",
    queries: { orders: "-fromAt" },
  });
  return {
    props: {
      works: data.contents,
    },
  };
};
