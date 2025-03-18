import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white text-black p-8 border-b border-gray-100">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <ul className="flex space-x-4">
          <li>
          <Button variant="ghost"asChild>
            <Link href="/">Hem</Link>
          </Button>
          </li>
          <li>
          <Button variant="ghost" asChild>
            <Link href="/onboarding">Onboarding</Link>
          </Button>
          </li>
          <li>

          <Button  asChild>
            <Link href="/login">Login</Link>
          </Button>



          </li>
        </ul>
      </nav>
    </header>
  );
}
