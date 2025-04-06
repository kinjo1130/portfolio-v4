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
  {
    title: "ハックツハッカソン スピノカップ 最優秀賞受賞",
    url: "https://x.com/Hackz_team/status/1839224546358079765"

  }
];
export default function Achievement() {
  return (
    <div className="mb-10">
      <Heading level={2}>受賞歴</Heading>
      <ul className="list-disc ml-5">
        {ACHIEVEMENTS.map((achievement) => (
          <li key={achievement.title} className="my-2">
            <a href={achievement.url} target="_blank" className="underline" rel="noreferrer">
              {achievement.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
