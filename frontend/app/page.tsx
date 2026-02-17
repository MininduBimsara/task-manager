"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/Store/store";

export default function Home() {
  const { isAuthenticated, userId } = useSelector(
    (state: RootState) => state.auth,
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center w-full mb-8 text-indigo-600">
          Task Manager
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        <p className="text-lg text-gray-700 mb-8 text-center">
          Organize your tasks efficiently. Join us today!
        </p>

        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <div className="text-center">
              <p className="mb-4 text-green-600 font-semibold">
                Welcome back, User {userId}!
              </p>
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
