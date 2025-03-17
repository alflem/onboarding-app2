import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">Welcome to My Next.js App</h1>
      </main>
    </div>
  );
}
