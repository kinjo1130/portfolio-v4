import Heading from "./Heading";
import { currentWorkList } from "@/libs/common";
const MEMBERSHIPS = [
  {
    title: "関西大学 総合情報学部 総合情報学科",
    url: "https://www.kansai-u.ac.jp/Fc_inf/",
  },
  {
    title: "米澤ゼミ",
    url: "https://www.kansai-u.ac.jp/Fc_inf/fm/staff/yonezawa.html",
  },
  // ここの所属をworkから取得してきたい、それで自動でリンクを貼る
  {
    title: "株式会社ohmygod ソフトウェアエンジニア",
    url: "https://ohmygod.jp/",
  },
];
export default function MembershipList() {
  const workList = currentWorkList();
  console.log(workList);
  return (
    <div className="mb-10">
      <Heading level={2}>所属</Heading>
      <ul className="list-disc ml-5">
        {[...MEMBERSHIPS].map((membership) => (
          <li key={membership.title} className="my-2">
            <a href={membership.url} target="_blank" className="underline">
              {membership.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
