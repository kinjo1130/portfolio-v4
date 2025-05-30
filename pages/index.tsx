import Achievement from "@/components/Achievement";
import Button from "@/components/Button";
import MembershipList from "@/components/MembershipList";
import SNS from "@/components/SNS";
import { SeoHead } from "@/components/SeoHead";
import Image from "next/image";
import Link from "next/link";
import Layout from "./layout";
export default function Home() {
	return (
		<>
			<Layout title="Welcome!!">
				<SeoHead
					title="Home"
					titleTemplate="Welcome!!"
					description="Welcome to my portfolio site"
					imgUrl="/favicon.ico"
				/>
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
						<Achievement />
						<div className="my-10">
							{/* <MembershipList /> */}
						</div>
						{/* <Button className="mt-10">
							<Link href="/work">詳細なプロフィール</Link>
						</Button> */}
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
