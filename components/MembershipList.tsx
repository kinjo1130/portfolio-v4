import Heading from "./Heading";
const MEMBERSHIPS = [
  {
    title: "関西大学 総合情報学部 総合情報学科",
    url: "https://www.kansai-u.ac.jp/Fc_inf/",
  },
  {
    title: "米澤ゼミ",
    url: "https://www.kansai-u.ac.jp/Fc_inf/fm/staff/yonezawa.html",
  },
];
export  default function MembershipList() {
  return (
    <div className="mb-10">
      <Heading level={2}>所属団体</Heading>
      <ul className="list-disc ml-5">
        {MEMBERSHIPS.map((membership) => (
          <li key={membership.title}>
            <a href={membership.url} target="_blank" className="underline">
              {membership.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}