import Head from 'next/head'
import { Inter } from '@next/font/google'
import Layout from '../components/Layout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout title="Todo Web Application">
      <main className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold mb-4">Todo Web Application</h1>
          <p className="text-xl mb-8">A secure, multi-user todo application</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <a 
              href="/login" 
              className="rounded-lg border bg-white px-8 py-6 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <h2 className="mb-4 text-xl font-semibold">Login</h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-60">
                Sign in to your account
              </p>
            </a>
            <a 
              href="/register" 
              className="rounded-lg border bg-white px-8 py-6 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <h2 className="mb-4 text-xl font-semibold">Register</h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-60">
                Create a new account
              </p>
            </a>
            <a 
              href="/todos" 
              className="rounded-lg border bg-white px-8 py-6 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <h2 className="mb-4 text-xl font-semibold">Todos</h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-60">
                Manage your todo list
              </p>
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}