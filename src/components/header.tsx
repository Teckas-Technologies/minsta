"use client";
import { useApp } from "@/providers/app";
import { usePathname, useRouter } from "next/navigation";
import { ReactEventHandler, useState, useEffect, useRef, useContext } from "react";
import InlineSVG from "react-inlinesvg";
import '../app/style.css'
import { constants } from "@/constants";
import Link from "next/link";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBackContext } from "@/context/BackContext";
import { NearContext } from "@/wallet/WalletSelector";
import { useFetchProfile, useSaveProfile } from "@/hooks/db/ProfileHook";

const Header = () => {
  const pathname = usePathname();
  const { wallet, signedAccountId } = useContext(NearContext);
  const { mode, toggleMode } = useDarkMode();
  const { push } = useRouter();
  const { openModal } = useApp();
  const [pop, setPop] = useState(false);
  const [color, SetColor] = useState('');
  const [net, SetNet] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);
  const headerAccountRef = useRef<HTMLDivElement | null>(null);
  const [subMenu, setSubmenu] = useState(false);
  const { back, toggleBack, onBackButtonClick } = useBackContext();
  const { fetchDBProfile } = useFetchProfile();
  const { saveDBProfile } = useSaveProfile()

  const router = useRouter();

  const handleNet = () => {
    if (process.env.NEXT_PUBLIC_NETWORK == 'mainnet') {
      console.log(process.env.NEXT_PUBLIC_NETWORK);
      SetColor("green");
      SetNet("mainnet");
    } else {
      SetColor("yellow");
      SetNet("testnet");
    }
  }

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(()=>{
    if(signedAccountId) {
      const fetchId = async () => {
        const fetchedId = await fetchDBProfile(signedAccountId);
        if(fetchedId === null) {
          await saveDBProfile({accountId: signedAccountId});
        }
      }
      fetchId();
    }
  },[signedAccountId])

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

  const handleClickOutside = (event: MouseEvent) => {
    if (headerAccountRef.current && !headerAccountRef.current.contains(event.target as Node)) {
      setSubmenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSignout = async () => {
    return wallet?.signOut();
  };

  const handleSignIn = async () => {
    return wallet?.signIn();
  };

  const handlePopUp = () => {
    setPop(true);
  }
  const handleCloseMain = () => {
    setPop(false);
    // SetColor('green')
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NETWORK === "mainnet") {
      SetColor('green')
    } else {
      SetColor('yellow')
    }
  }, [])

  const handleCloseTest = () => {
    setPop(false);
    // SetColor('yellow')
  }


  useEffect(() => {
    const handleIsAdmin = () => {
      if (signedAccountId) {
        if (constants.adminId.includes(signedAccountId)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    }
    handleIsAdmin();
  }, [isAdmin, signedAccountId]);

  const updateQueryParam = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newRelativePathQuery);
  };

  const handleBackClick = () => {
    onBackButtonClick();
  };
  
  const handleClearSearch = () => {
    handleBackClick();
    updateQueryParam("search", "");
    toggleBack(false)
  };

  const headerButtonsNotHome = (onClick: ReactEventHandler) => (
    <div className="minsta-header flex gap-2 w-full justify-between px-2 lg:px-12 items-center">

      <div className="dashboard-menu">
        <button className="h-8 w-auto text-headerText font-bold text-xl flex items-center gap-3" onClick={onClick}>
          <InlineSVG
            src="/images/arrow_back.svg"
            className="fill-current text-headerText"
            style={{ color: "#fff" }}
          />
          <h2>{process.env.NEXT_PUBLIC_APP_TITLE || "Moments"}</h2>
        </button>
      </div>
      <div className="flex md:gap-4 gap-1 items-center">

        <div className="dark-mode flex justify-center items-center">
          <button onClick={toggleMode} className="flex justify-center items-center">
            {mode === "dark" ?
              <InlineSVG
                src="/images/sun.svg"
                className="fill-current w-6 h-6 font-xl cursor-pointer"
                color="#fff"
              /> :
              <InlineSVG
                src="/images/moon.svg"
                className="fill-current w-6 h-6 font-xl cursor-pointer"
                color="#fff"
              />}
          </button>
        </div>


        {!signedAccountId ? (
          <div className="menu">
            <button onClick={() => openModal("default")}>About</button>
          </div>
        ) : null}

        <div className="menu">
          <button onClick={() => push("/leaderboard")}>Leaderboard</button>
        </div>

        <div className="menu">
          <button onClick={() => push("/stats")}>Stats</button>
        </div>

        <div className="menu">
          <Link href="https://github.com/Teckas-Technologies/minsta" target="_blank" rel="noopener noreferrer">
            <div className="github flex items-center gap-2">
              <InlineSVG
                src="/images/github.svg"
                className="fill-current"
                color="#fff"
              />
              <h2 className="text-white">GitHub</h2>
            </div>
          </Link>
        </div>

        <button
          onClick={handlePopUp}
          className="h-8 w-8 rounded-md flex items-center justify-center pointer"
        >
          <div className={`h-5 w-5 ${color == 'green' ? `bg-green-600` : `bg-yellow-400`} rounded-full`}></div>
        </button>

        {signedAccountId ? (
          // <div className="login-btn">
          //   <button className="gradientButton" onClick={handleSignout}> Logout I</button>
          // </div>
          <div className="new relative" ref={headerAccountRef}>
            <div className="header-account bg-slate-700 flex items-center gap-3 md:px-3 px-2 rounded-3xl cursor-pointer" onClick={() => setSubmenu(!subMenu)}>
              <div className="profile-icon">
                <InlineSVG
                  src="/images/profile.svg"
                  className="fill-current text-camera h-12"
                />
              </div>
              <div className="owner-name max-w-[4.5rem] overflow-hidden md:max-w-[8rem] md:overflow-hidden">
                <h2 className="text-white overflow-hidden text-ellipsis whitespace-nowrap">{signedAccountId}</h2>
              </div>
              <div className="profile-dropdown">
                {!subMenu ?
                  <InlineSVG
                    src="/images/right_arrow.svg"
                    className="fill-current text-camera h-12"
                  /> :
                  <InlineSVG
                    src="/images/down_arrow.svg"
                    className="fill-current text-camera h-12"
                  />
                }
              </div>
            </div>
            {subMenu &&
              <div className="absolute bg-slate-700 rounded-md top-[110%] md:left-0 left-[-5rem] md:w-full w-[15rem]">
                <ul className="sub-menu-list flex flex-col gap-2 px-3 py-2">
                  {isAdmin && signedAccountId ?
                    (
                      <>
                        <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push(`/profile/?accountId=${signedAccountId}`); setSubmenu(false); }}>
                          <div className="sub-menu-icon">
                            <InlineSVG
                              src="/images/edit_profile.svg"
                              className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                            />
                          </div>
                          <div className="sub-menu">
                            <h2 className="text-slate-300 group-hover:text-white">Profile</h2>
                          </div>
                        </li>
                        <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push("/admin"); setSubmenu(false); }}>
                          <div className="sub-menu-icon">
                            <InlineSVG
                              src="/images/edit_profile.svg"
                              className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                            />
                          </div>
                          <div className="sub-menu">
                            <h2 className="text-slate-300 group-hover:text-white">Admin</h2>
                          </div>
                        </li>
                      </>
                    ) : signedAccountId && !isAdmin ? (
                      <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push(`/profile/?accountId=${signedAccountId}`); setSubmenu(false); }}>
                        <div className="sub-menu-icon">
                          <InlineSVG
                            src="/images/edit_profile.svg"
                            className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                          />
                        </div>
                        <div className="sub-menu">
                          <h2 className="text-slate-300 group-hover:text-white">Profile</h2>
                        </div>
                      </li>
                    ) : ""}

                  <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push("/hiddenposts"); setSubmenu(false); }}>
                    <div className="sub-menu-icon">
                      <InlineSVG
                        src="/images/eye_hide.svg"
                        className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                      />
                    </div>
                    <div className="sub-menu">
                      <h2 className="text-slate-300 group-hover:text-white">Hidden Moments</h2>
                    </div>
                  </li>
                  <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push("/blockeduser"); setSubmenu(false); }}>
                    <div className="sub-menu-icon">
                      <InlineSVG
                        src="/images/blocked_user.svg"
                        className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                      />
                    </div>
                    <div className="sub-menu">
                      <h2 className="text-slate-300 group-hover:text-white">Blocked Users</h2>
                    </div>
                  </li>
                  <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={handleSignout}>
                    <div className="sub-menu-icon">
                      <InlineSVG
                        src="/images/sign_out.svg"
                        className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                      />
                    </div>
                    <div className="sub-menu">
                      <h2 className="text-slate-300 group-hover:text-white">Sign Out</h2>
                    </div>
                  </li>
                </ul>
              </div>
            }
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
                <a href={net == `mainnet` ? undefined : `${process.env.MAINNET_URL || 'https://minsta.org'}`}>  <button
                  onClick={handleCloseMain}
                  className="block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center"
                  role="menuitem"
                >
                  <div className="h-5 w-5 bg-green-600 rounded-full inline-block mr-2"></div>
                  <p>Mainnet</p>
                </button>
                </a>
                <a href={net == `testnet` ? undefined : `${process.env.TESTNET_URL || 'https://testnet.minsta.org'}`}>  <button
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
          <div className="minsta-header flex w-full gap-2 justify-between px-2 lg:px-12  items-center">
            <div>
              <div className="dashboard-menu">
                {!back && <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                  <InlineSVG
                    src="/images/menu.svg"
                    className="fill-current text-camera h-12"
                  />
                </div>}
                <button className="h-8 w-auto text-headerText border-none outline-none font-bold text-xl flex items-center gap-3" onClick={() => {back ? handleClearSearch() : push("/")}}>
                  {back && <InlineSVG
                    src="/images/arrow_back.svg"
                    className="fill-current text-headerText"
                    style={{ color: "#fff" }}
                  />}
                  <h2>{process.env.NEXT_PUBLIC_APP_TITLE || "Moments"}</h2>
                </button>
              </div>
            </div>
            <div className="flex md:gap-4 gap-1 items-center">
              <div className="dark-mode flex justify-center items-center">
                <button onClick={toggleMode} className="flex justify-center items-center">
                  {mode === "dark" ?
                    <InlineSVG
                      src="/images/sun.svg"
                      className="fill-current w-6 h-6 font-xl cursor-pointer"
                      color="#fff"
                    /> :
                    <InlineSVG
                      src="/images/moon.svg"
                      className="fill-current w-6 h-6 font-xl cursor-pointer"
                      color="#fff"
                    />}
                </button>
              </div>
              {!signedAccountId ? (
                <div className="menu">
                  <button onClick={() => openModal("default")}>About</button>
                </div>
              ) : null}

              <div className="menu">
                <button onClick={() => push("/leaderboard")}>Leaderboard</button>
              </div>
              <div className="menu">
                <button onClick={() => push("/stats")}>Stats</button>
              </div>
              <div className="menu">
                <Link href="https://github.com/Teckas-Technologies/minsta" target="_blank" rel="noopener noreferrer">
                  <div className="github flex items-center gap-2">
                    <InlineSVG
                      src="/images/github.svg"
                      className="fill-current"
                      color="#fff"
                    />
                    <h2 className="text-white">GitHub</h2>
                  </div>
                </Link>
              </div>
              <button
                onClick={handlePopUp}
                className="h-8 w-8 rounded-md flex items-center justify-center pointer"
              >
                <div className={`h-5 w-5 ${color == 'green' ? `bg-green-600` : `bg-yellow-400`} rounded-full`}></div>
              </button>
              {signedAccountId ? (
                // <div className="login-btn">
                //   <button onClick={handleSignout} > Logout I</button>
                // </div>
                <div className="new relative" ref={headerAccountRef}>
                  <div className="header-account bg-slate-700 flex items-center gap-1 md:gap3 px-3 rounded-3xl cursor-pointer" onClick={() => setSubmenu(!subMenu)}>
                    <div className="profile-icon">
                      <InlineSVG
                        src="/images/profile.svg"
                        className="fill-current text-camera h-12"
                      />
                    </div>
                    <div className="owner-name max-w-[5rem] overflow-hidden md:max-w-[8rem] md:overflow-hidden">
                      <h2 className="text-white overflow-hidden text-ellipsis whitespace-nowrap">{signedAccountId}</h2>
                    </div>
                    <div className="profile-dropdown">
                      {!subMenu ?
                        <InlineSVG
                          src="/images/right_arrow.svg"
                          className="fill-current text-camera h-12"
                        /> :
                        <InlineSVG
                          src="/images/down_arrow.svg"
                          className="fill-current text-camera h-12"
                        />
                      }
                    </div>
                  </div>
                  {subMenu &&
                    <div className="absolute z-50 bg-slate-700 rounded-md top-[110%] md:left-0 left-[-5rem] md:w-full w-[15rem]">
                      <ul className="sub-menu-list flex flex-col gap-2 px-3 py-2">
                        {isAdmin && signedAccountId ?
                          (
                            <>
                              <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push(`/profile/?accountId=${signedAccountId}`); setSubmenu(false); }}>
                                <div className="sub-menu-icon">
                                  <InlineSVG
                                    src="/images/edit_profile.svg"
                                    className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                                  />
                                </div>
                                <div className="sub-menu">
                                  <h2 className="text-slate-300 group-hover:text-white">Profile</h2>
                                </div>
                              </li>
                              <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push("/admin"); setSubmenu(false); }}>
                                <div className="sub-menu-icon">
                                  <InlineSVG
                                    src="/images/admin_profile.svg"
                                    className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                                  />
                                </div>
                                <div className="sub-menu">
                                  <h2 className="text-slate-300 group-hover:text-white">Admin</h2>
                                </div>
                              </li>
                            </>
                          ) : signedAccountId && !isAdmin ? (
                            <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push(`/profile/?accountId=${signedAccountId}`); setSubmenu(false); }}>
                              <div className="sub-menu-icon">
                                <InlineSVG
                                  src="/images/edit_profile.svg"
                                  className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                                />
                              </div>
                              <div className="sub-menu">
                                <h2 className="text-slate-300 group-hover:text-white">Profile</h2>
                              </div>
                            </li>
                          ) : ""}

                        <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push("/hiddenposts"); setSubmenu(false); }}>
                          <div className="sub-menu-icon">
                            <InlineSVG
                              src="/images/eye_hide.svg"
                              className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                            />
                          </div>
                          <div className="sub-menu">
                            <h2 className="text-slate-300 group-hover:text-white">Hidden Moments</h2>
                          </div>
                        </li>
                        <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={() => { push("/blockeduser"); setSubmenu(false); }}>
                          <div className="sub-menu-icon">
                            <InlineSVG
                              src="/images/blocked_user.svg"
                              className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                            />
                          </div>
                          <div className="sub-menu">
                            <h2 className="text-slate-300 group-hover:text-white">Blocked Users</h2>
                          </div>
                        </li>
                        <li className="group flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-all hover:bg-slate-800" onClick={handleSignout}>
                          <div className="sub-menu-icon">
                            <InlineSVG
                              src="/images/sign_out.svg"
                              className="fill-current text-camera h-6 text-slate-300 group-hover:text-white"
                            />
                          </div>
                          <div className="sub-menu">
                            <h2 className="text-slate-300 group-hover:text-white">Sign Out</h2>
                          </div>
                        </li>
                      </ul>
                    </div>}
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
                      <a href={net == `mainnet` ? undefined : `${process.env.MAINNET_URL || 'https://minsta.org'}`}>  <button
                        onClick={handleCloseMain}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center"
                        role="menuitem"
                      >
                        <div className="h-5 w-5 bg-green-600 rounded-full inline-block mr-2"></div>
                        <p>Mainnet</p>
                      </button>
                      </a>
                      <a href={net == `testnet` ? undefined : `${process.env.TESTNET_URL || 'https://testnet.minsta.org'}`}>  <button
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
        <div className="side-mobile-nav side-bar z-10">
          <div className="close" onClick={() => setIsOpen(!isOpen)}>
            <div className="close-icon">
              <InlineSVG
                src="/images/close.svg"
                className="icon fill-current text-headerText"
                style={{ color: "#fff" }}
              />
            </div>
          </div>
          <ul className="side-menu-list">
            {!signedAccountId ? (
              <li className="side-menu" onClick={() => openModal("default")}>
                <h4>About</h4>
                <InlineSVG
                  src="/images/arrow_right.svg"
                  className="icon fill-current text-headerText"
                  style={{ color: "#ff3572" }}
                />
              </li>

            ) : null}

            {/* {pathname === "/admin" ? <AdminSideMenu setAdminPage={setAdminPage}/> : "User"} */}

            <li className="side-menu" onClick={() => push("/stats")}>
              <h4>Stats</h4>
              <InlineSVG
                src="/images/arrow_right.svg"
                className="icon fill-current text-headerText"
                style={{ color: "#ff3572" }}
              />
            </li>
            <li className="side-menu" onClick={() => push("/leaderboard")}>
              <h4>Leaderboard</h4>
              <InlineSVG
                src="/images/arrow_right.svg"
                className="icon fill-current text-headerText"
                style={{ color: "#ff3572" }}
              />
            </li>
            {isAdmin && signedAccountId ? (
              <>
                <li className="side-menu" onClick={() => push("/admin")}>
                  <h4>Admin</h4>
                  <InlineSVG
                    src="/images/arrow_right.svg"
                    className="icon fill-current text-headerText"
                    style={{ color: "#ff3572" }}
                  />
                </li>
                <li className="side-menu" onClick={() => push(`/profile/?accountId=${signedAccountId}`)}>
                  <h4>Profile</h4>
                  <InlineSVG
                    src="/images/arrow_right.svg"
                    className="icon fill-current text-headerText"
                    style={{ color: "#ff3572" }}
                  />
                </li>
              </>
            ) : signedAccountId && !isAdmin ? (
              <li className="side-menu" onClick={() => push(`/profile/?accountId=${signedAccountId}`)}>
                <h4>Profile</h4>
                <InlineSVG
                  src="/images/arrow_right.svg"
                  className="icon fill-current text-headerText"
                  style={{ color: "#ff3572" }}
                />
              </li>
            ) : ""}

            <Link href="https://github.com/Teckas-Technologies/minsta" target="_blank" rel="noopener noreferrer">
              <li className="side-men flex justify-center items-center gap-3 mt-4">
                <InlineSVG
                  src="/images/github.svg"
                  className="fill-current"
                  color="#222f3e"
                />
                <h4>GitHub</h4>
              </li>
            </Link>

            {/* <div className="menu">
          <Link href="https://github.com/Teckas-Technologies/minsta" target="_blank" rel="noopener noreferrer">
          <div className="github flex items-center gap-2">
            <InlineSVG
                src="/images/github.svg"
                className="fill-current"
                color="#fff"
                />
            <h2 className="text-white">GitHub</h2>
          </div>
          </Link>
        </div> */}
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
