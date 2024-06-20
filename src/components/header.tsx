"use client";
import { useApp } from "@/providers/app";
import { useMbWallet } from "@mintbase-js/react";
import { usePathname, useRouter} from "next/navigation";
import { ReactEventHandler, useState ,useEffect,useRef } from "react";
import InlineSVG from "react-inlinesvg";

const Header = () => {
  const pathname = usePathname();
  const { isConnected, selector, connect } = useMbWallet();
  const { push } = useRouter();
  const { openModal } = useApp();
  const[pop,setPop] = useState(false);
  const[color,SetColor] = useState('');
  const[net,SetNet] = useState('');
  const popRef = useRef<HTMLDivElement | null>(null);
  const handleNet = ()=>{
    if(process.env.NEXT_PUBLIC_NETWORK=='mainnet'){
      console.log(process.env.NEXT_PUBLIC_NETWORK);
      SetColor("green");
      SetNet("mainnet");
    }else{
      SetColor("yellow");
      SetNet("testnet");
    }
  }

 

  useEffect(() => {
    handleNet();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(event.target as Node)) {
        setPop(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 
  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    return connect();
  };

  const handlePopUp = ()=>{
    setPop(true);
  }
  const handleCloseMain = ()=>{
    setPop(false);
    SetColor('green')
  }

  const handleCloseTest = ()=>{
    setPop(false);
    SetColor('yellow')
  }



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
                <button onClick={handleSignout} > Logout</button>
              ) : (
                <button onClick={handleSignIn}> Login</button>
              )}
              <button onClick={() => push("/leaderboard")}>Leaderboard</button>
              <button onClick={() => push("/admin")}>Admin</button>
              <div className="relative inline-block">
      <button
        onClick={handlePopUp}
        className="h-8 w-8 rounded-md flex items-center justify-center pointer"
      >
        <div className={`h-5 w-5 ${color=='green'?`bg-green-600`:`bg-yellow-400`} rounded-full`}></div>
      </button>

      {pop && (
        <div ref={popRef} className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
         <a href={net==`mainnet`?undefined:`https://www.mintbase.xyz/`}>  <button
              onClick={handleCloseMain}
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
              role="menuitem"
            >
              <div className="h-5 w-5 bg-green-600 rounded-full inline-block mr-2"></div>
            Mainnet
            </button>
            </a> 
          <a href={net==`testnet`?undefined:`https://testnet.mintbase.xyz/`}>  <button
              onClick={handleCloseTest}
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
              role="menuitem"
            >
              <div className="h-5 w-5 bg-yellow-400 rounded-full inline-block mr-2"></div>
            Testnet
            </button>
            </a>
          </div>
        </div>
      )}
    </div>
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
