import { client } from "@/libs/client";
import Layout from "../layout";
import { Works } from "@/types/work";
import { formatDate } from "@/libs/common";
import { SeoHead } from "@/components/SeoHead";

export default function Work({ works }: { works: Works }) {
  return (
    <Layout title="Work" tooltipText="インターンや業務委託の経験をまとめたもの">
      <SeoHead
        title="Work"
        titleTemplate="Work"
        description="Work List"
        imgUrl="/favicon.ico"
      ></SeoHead>
      <ul>
        {works.map((work) => (
          <li key={work.id} className="my-10">
            <h3 className="font-semibold text-lg">{work.title}</h3>
            <div className="flex gap-2 items-center">
              <p className="text-slate-400 font-semibold text-sm">
                {formatDate(work.fromAt)}
              </p>
              <p>-</p>
              <p className="text-slate-400 font-semibold text-sm">
                {work.toAt ? formatDate(work.toAt) : "現在"}{" "}
              </p>
            </div>
            <p className="text-sm">{work.description}</p>
            <a href={work.link} className="underline text-sm">
              会社情報
            </a>
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
