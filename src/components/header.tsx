"use client";
import { useApp } from "@/providers/app";
import { useMbWallet } from "@mintbase-js/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactEventHandler } from "react";
import InlineSVG from "react-inlinesvg";

const Header = () => {
  const pathname = usePathname();
  const { isConnected, selector, connect } = useMbWallet();
  const { push } = useRouter();
  const { openModal } = useApp();

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    return connect();
  };

  const headerButtonsNotHome = (onClick: ReactEventHandler) => (
    <div className="flex w-full justify-between px-4 lg:px-12 items-center">
      <button className="h-8 w-8 text-headerText" onClick={onClick}>
        <InlineSVG
          src="/images/arrow_back.svg"
          className="fill-current text-headerText"
        />
      </button>
      <div className="flex gap-4">
        
      
        {!isConnected ? (
          <button onClick={() => openModal("default")}>About</button>
        ) : null}

        {isConnected ? (
          <button onClick={handleSignout}> Logout</button>
        ) : (
          <button onClick={handleSignIn}> Login</button>
        )}
        <button onClick={() => push("/leaderboard")}>Leaderboard</button>
        <button onClick={() => push("/admin")}>Admin</button>

      </div>
    </div>
  );

  const renderHeaderButtons = () => {
    switch (pathname) {
      case "/":
        return (
          <div className="flex w-full justify-between px-4 lg:px-12  items-center">
            <div>
              <button className="font-bold text-xl" onClick={() => push("/")}>
                {process.env.NEXT_PUBLIC_APP_TITLE || "Minsta"}
              </button>
            </div>
            <div className="flex gap-4">
              {!isConnected ? (
                <button onClick={() => openModal("default")}>About</button>
              ) : null}

              {isConnected ? (
                <button onClick={handleSignout}> Logout</button>
              ) : (
                <button onClick={handleSignIn}> Login</button>
              )}
              <button onClick={() => push("/leaderboard")}>Leaderboard</button>
              <button onClick={() => push("/admin")}>Admin</button>
              <button className="bg-gray-500 h-8 w-8 rounded-md flex items-center justify-center">
                <div className="h-3 w-3 bg-green-400 rounded-full"> </div>
              </button>
            </div>
          </div>
        );
      case "/leaderboard":
        return headerButtonsNotHome(() => push("/"));
      case "/camera":
        return headerButtonsNotHome(() => push("/"));
      case "/admin":
        return headerButtonsNotHome(() => push("/"));
      default:
        return headerButtonsNotHome(() => push("/"));
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 flex w-full justify-center h-12 bg-primary text-headerText">
        {renderHeaderButtons()}
      </header>
    </>
  );
};

export default Header;
