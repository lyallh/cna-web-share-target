export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Web Share Target PWA
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Investigate the Web Share Target API
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Installation Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Open this app in Chrome on Android</li>
              <li>Tap the menu (three dots) in the browser</li>
              <li>Select &quot;Add to Home screen&quot; or &quot;Install app&quot;</li>
              <li>Confirm the installation</li>
              <li>The app will appear on your home screen</li>
            </ol>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              How to Test
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>After installing, open Chrome on Android</li>
              <li>Select some text on a webpage</li>
              <li>Tap the share icon</li>
              <li>Select &quot;Share Target&quot; from the share menu</li>
              <li>The app will open and display all received data</li>
            </ol>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              About
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              This PWA demonstrates the Web Share Target API, which allows installed
              PWAs to receive shared content from other apps. When you share text from
              Chrome, this app will receive and display the title, text, and URL (if available).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
