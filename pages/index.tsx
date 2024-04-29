import Link from "next/link";
import Layout from "./layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout title="Welcome!!">
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
      <p className="mt-10">
        プロダクトを作って、ユーザーに価値を届けることが好きです。そのために、プログラミングなどを活用して、色んなことを学んでいきたいと思っています。
      </p>
      {/* SNS一覧 */}
      <div className="mt-10">
        <h3 className="font-bold text-2xl">SNS</h3>
        <ul className="flex gap-3">
          <li>
            <a
              href="https://twitter.com/kinjyo1130"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/sns/twitter.png"
                alt="twitter"
                width={40}
                height={40}
              />
            </a>
          </li>
          <li>
            <a href="https://github.com/kinjo1130" target="_black" rel="noopener noreferrer">
              <Image
                src="/sns/github.png"
                alt="github"
                width={40}
                height={40}
              />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/kinjyo1130/" target="_black" rel="noopener noreferrer">
              <Image
                src="/sns/instagram.png"
                alt="instagram"
                width={40}
                height={40}
              />
            </a>
          </li>

         </ul>
      </div>
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
