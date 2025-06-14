// clerk-frontend/pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-300">
        Welcome to the Healthcare Chatbot
      </h1>
      <p className="mb-4">Please sign in or sign up to get started:</p>
      <div className="flex justify-center gap-4">
        <Link href="/sign-in">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
