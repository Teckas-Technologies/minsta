"use client";
import { useApp } from "@/providers/app";
import { useMbWallet } from "@mintbase-js/react";
import { usePathname, useRouter} from "next/navigation";
import { ReactEventHandler, useState ,useEffect,useRef } from "react";
import InlineSVG from "react-inlinesvg";
import '../app/style.css'
import { AdminSideMenu } from "./AdminSideMenu";
import { constants } from "@/constants";

const Header = () => {
  const pathname = usePathname();
  const { activeAccountId, isConnected, selector, connect } = useMbWallet();
  const { push } = useRouter();
  const { openModal } = useApp();
  const[pop,setPop] = useState(false);
  const[color,SetColor] = useState('');
  const[net,SetNet] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(()=>{
    setIsOpen(false)
  },[pathname])

 

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


  useEffect(()=>{
    const handleIsAdmin = () => {
      if(activeAccountId === constants.adminId) {
        setIsAdmin(true);
        console.log("Its a admin")
      } else {
        setIsAdmin(false);
        console.log("Not a admin")
      }
    }
    handleIsAdmin();
  },[isAdmin, isConnected, activeAccountId])



  const headerButtonsNotHome = (onClick: ReactEventHandler) => (
    <div className="minsta-header flex w-full justify-between px-4 lg:px-12 items-center">
      
      <div className="dashboard-menu">
        <button className="h-8 w-auto text-headerText font-bold text-xl flex items-center gap-3" onClick={onClick}>
          <InlineSVG
            src="/images/arrow_back.svg"
            className="fill-current text-headerText"
            style={{color: "#fff"}}
          />
          <h2>{process.env.NEXT_PUBLIC_APP_TITLE || "Minsta"}</h2>
        </button>
      </div>
      <div className="flex gap-4 items-center">
        
      
        {!isConnected ? (
          <div className="menu">
            <button onClick={() => openModal("default")}>About</button>
          </div>
        ) : null}

        <div className="menu">
          <button onClick={() => push("/leaderboard")}>Leaderboard</button>
        </div>

        {isAdmin && isConnected ? 
          (
          <div className="menu">
            <button onClick={()=>push("/admin")}>Admin</button>
          </div>
          ) : (
          <div className="menu">
            <button onClick={()=>push("/profile")}>Profile</button>
          </div>
        )}

        <button
            onClick={handlePopUp}
            className="h-8 w-8 rounded-md flex items-center justify-center pointer"
          >
            <div className={`h-5 w-5 ${color=='green'?`bg-green-600`:`bg-yellow-400`} rounded-full`}></div>
        </button>

        {isConnected ? (
          <div className="login-btn">
            <button onClick={handleSignout}> Logout</button>
          </div>
        ) : (
          <div className="login-btn">
            <button onClick={handleSignIn}> Login</button>
          </div>
        )}

        <div className="relative inline-block">

        {pop && (
          <div ref={popRef} className="absolute right-0 mt-5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href={net==`mainnet`?undefined:`${process.env.MAINNET_URL || 'https://minsta.org'}`}>  <button
                onClick={handleCloseMain}
                className="block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center"
                role="menuitem"
              >
                <div className="h-5 w-5 bg-green-600 rounded-full inline-block mr-2"></div>
                <p>Mainnet</p>
              </button>
              </a> 
            <a href={net==`testnet`?undefined:`${process.env.TESTNET_URL || 'https://testnet.minsta.org'}`}>  <button
                onClick={handleCloseTest}
                className="block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center"
                role="menuitem"
              >
                <div className="h-5 w-5 bg-yellow-400 rounded-full inline-block mr-2"></div>
                <p>Testnet</p>
              </button>
              </a>
            </div>
          </div>
        )}

        </div>

      </div>
    </div>
  );

  const renderHeaderButtons = () => {
    switch (pathname) {
      case "/":
        return (
          <div className="minsta-header flex w-full justify-between px-4 lg:px-12  items-center">
            <div>
              <div className="dashboard-menu">
                <div className="hamburger" onClick={()=>setIsOpen(!isOpen)}>
                  <InlineSVG
                    src="/images/menu.svg"
                    className="fill-current text-camera h-12"
                  />
                </div>
                <button className="font-bold text-xl" onClick={() => push("/")}>
                  {process.env.NEXT_PUBLIC_APP_TITLE || "Minsta"}
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              {!isConnected ? (
                <div className="menu">
                  <button onClick={() => openModal("default")}>About</button>
                </div>
              ) : null}

              <div className="menu">
                <button onClick={() => push("/leaderboard")}>Leaderboard</button>
              </div>
              {isAdmin && isConnected ? 
                (
                <div className="menu">
                  <button onClick={()=>push("/admin")}>Admin</button>
                </div>
                ) : (
                <div className="menu">
                  <button onClick={()=>push("/profile")}>Profile</button>
                </div>
              )}
              <button
                  onClick={handlePopUp}
                  className="h-8 w-8 rounded-md flex items-center justify-center pointer"
                >
                  <div className={`h-5 w-5 ${color=='green'?`bg-green-600`:`bg-yellow-400`} rounded-full`}></div>
              </button>
              {isConnected ? (
                <div className="login-btn">
                  <button onClick={handleSignout} > Logout</button>
                </div>
              ) : (
                <div className="login-btn">
                  <button onClick={handleSignIn}> Login</button>
                </div>
              )}
              <div className="relative inline-block">

                {pop && (
                  <div ref={popRef} className="absolute right-0 mt-5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a href={net==`mainnet`?undefined:`${process.env.MAINNET_URL || 'https://minsta.org'}`}>  <button
                        onClick={handleCloseMain}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center"
                        role="menuitem"
                      >
                        <div className="h-5 w-5 bg-green-600 rounded-full inline-block mr-2"></div>
                         <p>Mainnet</p>
                      </button>
                      </a> 
                    <a href={net==`testnet`?undefined:`${process.env.TESTNET_URL || 'https://testnet.minsta.org'}`}>  <button
                        onClick={handleCloseTest}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center"
                        role="menuitem"
                      >
                        <div className="h-5 w-5 bg-yellow-400 rounded-full inline-block mr-2"></div>
                         <p>Testnet</p>
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
      <header className="header fixed left-0 top-0 flex w-full justify-center h-12 bg-primary text-headerText">
        {renderHeaderButtons()}
      </header>
      <div className={isOpen ? "side-bar-open" : "side-bar-close"}>
      <div className="side-mobile-nav side-bar">
        <div className="close" onClick={()=>setIsOpen(!isOpen)}>
          <div className="close-icon">
            <InlineSVG
              src="/images/close.svg"
              className="icon fill-current text-headerText"
              style={{color: "#fff"}}
            />
          </div>
        </div>
        <ul className="side-menu-list">
            {!isConnected ? (
              <li className="side-menu" onClick={() => openModal("default")}>
                <h4>About</h4>
                <InlineSVG
                  src="/images/arrow_right.svg"
                  className="icon fill-current text-headerText"
                  style={{color: "#ff3572"}}
                />
              </li>
              
            ) : null}

            {/* {pathname === "/admin" ? <AdminSideMenu setAdminPage={setAdminPage}/> : "User"} */}

            <li className="side-menu" onClick={() => push("/leaderboard")}>
              <h4>Leaderboard</h4> 
              <InlineSVG
                  src="/images/arrow_right.svg"
                  className="icon fill-current text-headerText"
                  style={{color: "#ff3572"}}
              />
            </li>
            {isAdmin && isConnected ? (
              <li className="side-menu" onClick={ ()=> push("/admin")}>
                <h4>Admin</h4> 
                <InlineSVG
                  src="/images/arrow_right.svg"
                  className="icon fill-current text-headerText"
                  style={{color: "#ff3572"}}
                />
              </li>
            ):(
              <li className="side-menu" onClick={ ()=> push("/profile")}>
                <h4>Profile</h4> 
                <InlineSVG
                  src="/images/arrow_right.svg"
                  className="icon fill-current text-headerText"
                  style={{color: "#ff3572"}}
                />
              </li>
            )}
        </ul>
      </div>
      {/* {isAdminModal && 
            <div className="admin-hide-modal-page">
              <div className="admin-hide-modal">
                <h2>Only Admins can authorise this page!</h2>
                <button className="btn ok-btn" onClick={()=>setIsAdminModal(false)}>Ok</button>
              </div>
            </div>
      } */}
      </div>
    </>
  );
};

export default Header;
