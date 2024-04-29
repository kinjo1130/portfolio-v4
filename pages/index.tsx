import Link from "next/link";
import Layout from "./layout";
import Image from "next/image";
import SNS from "@/components/SNS";

export default function Home() {
  return (
    <>
      <Layout title="Welcome!!">
        <div>
          <Image src="/profile.jpg" alt="profile" width={200} height={200} className="rounded-lg" />
          <p className="text-xl font-bold mt-5">金城翔太郎</p>
          <p className="text-md font-semibold text-gray-400">kinjo shotaro</p>
        </div>
        <p className="mt-10">
          プロダクトを作って、ユーザーに価値を届けることが好きです。そのために、プログラミングなどを活用して、色んなことを学んでいきたいと思っています。
        </p>
        <p>
          自分はものづくりが好きです。ソフトウェアに限らずに、ハードウェアだったり、
          コードを書くことを通じて、少しでも役に立てるものができたらいいけど、毎回作るたびに役に立つなにかを生み出すのは、とてもしんどいことだし、すごいことだと思っています。
          なので、それが実現できて、誰かの役立つようなものやサービスを提供できるように、日々の技術の研鑽を怠らないようにしています。
        </p>
        {/* SNS一覧 */}
        <SNS />
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
