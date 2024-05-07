import Heading from "./Heading";
const ACHIEVEMENTS = [
  {
    title: "Civictech Challenge Cup u-21 Code for japan賞",
    url: "https://ccc2021.code4japan.org",
  },
  {
    title: "ハックツハッカソン ツマジロカップ studist賞",
    url: "https://hackz.team/news/28VSpLaigPOw6KcqbgbVZT",
  },
];
export default function Achievement() {
  return (
    <div className="mb-10">
      <Heading level={2}>受賞歴</Heading>
      <ul className="list-disc ml-5">
        {ACHIEVEMENTS.map((achievement) => (
          <li key={achievement.title}>
            <a href={achievement.url} target="_blank" className="underline">
              {achievement.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
