import Link from "next/link";
import { Logo } from "./logo";

export function Navigation() {
  return (
    <header className="px-6 py-6">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="w-10 h-10" />
        <h1 className="text-2xl font-semibold text-gray-900">TrailPrint</h1>
      </Link>
    </header>
  );
}
