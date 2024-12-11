import { Button } from "@/components/Button";
import { SeoHead } from "@/components/SeoHead";
import Link from "next/link";
import Layout from "../layout";
import FormContainer from "./reactHookForm/container";

const TechPlayground: React.FC = () => {
	return (
		<>
			<SeoHead
				title="Products"
				titleTemplate="技術的な試行錯誤一覧"
				description="TechPlayGround List"
				imgUrl="/favicon.ico"
			/>
			<Layout title="Tech PlayGround List">
				<Button className="mt-10">
					<Link href="/techPlayGround/reactHookForm">
						ReactHookFormを試したみた
					</Link>
				</Button>
			</Layout>
		</>
	);
};
export default TechPlayground;
