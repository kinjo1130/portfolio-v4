import { Header } from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="mx-20 mt-10">{children}</div>
    </div>
  );
}
