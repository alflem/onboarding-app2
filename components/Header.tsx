import Link from "next/link";

export default function Header() {
  return (
    <header className="210 40% 98% text-black p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
