import { client } from "@/libs/client";
import Layout from "../layout";
import type { Works } from "@/types/work";
import { formatDate } from "@/libs/common";
import { SeoHead } from "@/components/SeoHead";
import { useState } from "react";

export default function Work({ works }: { works: Works }) {
  return (
    <Layout title="Work" tooltipText="インターンや業務委託の経験をまとめたもの">
      <SeoHead
        title="Work"
        titleTemplate="Work"
        description="Work List"
        imgUrl="/favicon.ico"
      />
      <ul>
        {works.map((work) => (
          <li key={work.id} className="my-10">
            <h3 className="font-semibold text-lg">
              <a href={work.link} className="underline">
                {work.title}
              </a>
            </h3>
            <div className="flex gap-2 items-center">
              <p className="text-slate-400 font-semibold text-sm">
                {formatDate(work.fromAt)}
              </p>
              <p>-</p>
              <p className="text-slate-400 font-semibold text-sm">
                {work.toAt ? formatDate(work.toAt) : "現在"}{" "}
              </p>
            </div>
            <WorkDescription description={work.description} />
          </li>
        ))}
      </ul>
    </Layout>
  );
}
function WorkDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (description.length <= 30) {
    return <p className="text-sm">{description}</p>;
  }

  return (
    <div>
      <p className="text-sm">
        {isExpanded ? description : `${description.substring(0, 30)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-black underline text-sm mt-2"
      >
        {isExpanded ? "閉じる" : "続きを読む"}
      </button>
    </div>
  );
}

export const getStaticProps = async () => {
  const data = await client.get({
    endpoint: "work",
    queries: { orders: "toAt" },
  });
  return {
    props: {
      works: data.contents,
    },
  };
};
