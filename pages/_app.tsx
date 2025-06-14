import "@/styles/globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs";
import type { AppProps } from "next/app";
import Link from "next/link";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      {...pageProps}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
        {/* Navigation Bar */}
        <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center font-medium text-blue-600 dark:text-blue-300">
            <Link href="/">🏠 Home</Link>
            <Link href="/chatbot">💬 Chatbot</Link>
            <Link href="/doctors">👩‍⚕️ Doctors</Link>
            <Link href="/patients">🧑‍⚕️ Patients</Link>
          </div>
          <div>
            {/* When signed out, show our custom Sign In button */}
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            {/* When signed in, show the User profile button */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>

        {/* Render the active page */}
        <main className="p-6">
          <Component {...pageProps} />
        </main>
      </div>
    </ClerkProvider>
  );
}

