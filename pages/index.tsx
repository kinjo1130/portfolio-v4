import Link from "next/link";
import Layout from "./layout";
import Image from "next/image";
import SNS from "@/components/SNS";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
export default function Home() {
  return (
    <>
      <Layout title="Welcome!!">
        <div className="lg:grid lg:grid-cols-10">
          <div className="col-span-5">
            <Image
              src="/profile.jpg"
              alt="profile"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <p className="text-xl font-bold mt-5">
              金城翔太郎 / ソフトウェアエンジニア
            </p>
            <p className="text-md font-semibold text-gray-400">
              kinjo shotaro / Software Engineer
            </p>
          </div>
          <div className="col-span-5">
            <div className="mb-10">
              <Heading level={2}>受賞歴</Heading>
              <ul className="list-disc ml-5">
                <li>
                  <a
                    href="https://ccc2021.code4japan.org/"
                    target="_blank"
                    className="underline"
                  >
                    Civictech Challenge Cup u-21 Code for japan賞
                  </a>
                </li>
                <li>
                  <a
                    href="https://hackz.team/news/28VSpLaigPOw6KcqbgbVZT"
                    target="_blank"
                    className="underline"
                  >
                    ハックツハッカソン ツマジロカップ studist賞
                  </a>
                </li>
              </ul>
            </div>
            <div className="my-10">
              <Heading level={2}>所属</Heading>
              <ul className="list-disc ml-5">
                <li>
                  <a href="" target="_blank" className="underline">
                    関西大学 総合情報学部 総合情報学科
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.kansai-u.ac.jp/Fc_inf/fm/staff/yonezawa.html"
                    target="_blank"
                    className="underline"
                  >
                    米澤ゼミ
                  </a>
                  所属
                </li>
              </ul>
            </div>
            <Button className="mt-10">
              <Link href="/about">詳細なプロフィール</Link>
            </Button>
          </div>
        </div>

        {/* SNS一覧 */}
        <SNS />
        {/* 屋号などの情報を掲載 */}
      </Layout>
    </>
  );
}

// // データをテンプレートに受け渡す部分の処理を記述します
// export const getStaticProps = async () => {
//   const data = await client.get({ endpoint: "blogs" });

//   return {
//     props: {
//       blog: data.contents,
//     },
//   };
// };
