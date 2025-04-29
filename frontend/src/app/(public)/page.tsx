export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        ola
        <p className="text-center">Welcome to our website!</p>
      </main>
      <footer>
        <p className="text-center">
          © 2023 Your Company Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
