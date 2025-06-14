// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-100 flex gap-6">
      <Link href="/public">Home</Link>
      <Link href="/chatbot">Chatbot</Link>
      <Link href="/doctors">Doctors</Link>
      <Link href="/patients">Patients</Link>
      <Link href="/sign-in">Sign In</Link>
    </nav>
  );
}


