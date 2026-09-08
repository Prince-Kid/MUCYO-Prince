import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { IdentityCard } from './components/IdentityCard';
import { Terminal } from './components/Terminal/Terminal';
import { Footer } from './components/Footer';
import { useTerminal } from './hooks/useTerminal';

function App() {
  const [mobileProfileVisible, setMobileProfileVisible] = useState(true);

  const hideProfileOnMobile = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setMobileProfileVisible(false);
    }
  }, []);

  const terminal = useTerminal({ onUserCommand: hideProfileOnMobile });

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-bg text-primary">
      <Header onContact={() => terminal.runShortcut('contact')} />

      <main className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-3 overflow-hidden px-4 py-3 md:gap-4 md:px-6 md:py-4 lg:flex-row lg:gap-5">
        <div
          className={`min-h-0 w-full shrink-0 overflow-y-auto lg:flex lg:h-full lg:max-h-none lg:w-[34%] lg:max-w-md lg:flex-col ${
            mobileProfileVisible ? 'max-h-[38vh]' : 'hidden lg:flex'
          }`}
        >
          <IdentityCard onRunCommand={terminal.runShortcut} />
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:w-[66%]">
          {!mobileProfileVisible && (
            <button
              type="button"
              onClick={() => setMobileProfileVisible(true)}
              className="mb-2 shrink-0 self-start rounded-sm border border-border px-2.5 py-1 font-sans text-xs text-muted transition-colors hover:text-primary lg:hidden"
            >
              Show profile
            </button>
          )}
          <Terminal {...terminal} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
