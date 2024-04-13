import Link from "next/link";
import Layout from "./layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout title="Home">
      <div>
        <Image
          src="/profile.jpg"
          alt="profile"
          width={200}
          height={200}
        />
        <p className="text-xl font-bold mt-5">金城翔太郎</p>
        <p className="text-md font-semibold text-gray-400">kinjo shotaro</p>
      </div>
      <p className="mt-10 ">
        プロダクトを作って、ユーザーに価値を届けることが好きです。そのために、プログラミングなどを活用して、色んなことを学んでいきたいと思っています。
      </p>
    </Layout>
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
