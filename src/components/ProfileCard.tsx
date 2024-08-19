import Image from "next/image"
import InlineSVG from "react-inlinesvg"
import { CoptText } from "./CopyText"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { CreditsType, HashesType, NEARSocialUserProfile, ProfileType } from "@/data/types"
import { useDarkMode } from "@/context/DarkModeContext"
import { NearContext } from "@/wallet/WalletSelector"
import { useFetchCredits, useSaveCredits } from "@/hooks/db/CreditHook"
import useNEARTransfer from "@/utils/useTransfer"
import { useFetchHashes, useSaveHashes } from "@/hooks/db/HashHook"

interface props {
    profile: NEARSocialUserProfile | undefined;
    // dbProfile: ProfileType | undefined;
    images: string[] | undefined,
    accountId: string;
    setHandleToast: (s:string, e: boolean) => void
}

export const ProfileCard = ({ profile, images, accountId, setHandleToast }: props) => {
    const [animation, setAnimation] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const { wallet, signedAccountId } = useContext(NearContext);
    const { fetchCredits } = useFetchCredits();
    const { saveCredits } = useSaveCredits();
    const [credits, setCredits] = useState<number | null>();
    const [buyCredit, setBuyCredit] = useState(false);
    const [txhash, setTxhash] = useState("");
    const [balance, setBalance] = useState<any>();

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])

    useEffect(() => {
        if (signedAccountId) {
            const fetchDbCredit = async () => {
                try {
                    let credit = await fetchCredits(signedAccountId);
                    if (credit === null) {
                        const data: CreditsType = {
                            accountId: signedAccountId,
                            credit: 3
                        };
                        await saveCredits(data);
                        credit = await fetchCredits(signedAccountId);
                    }
                    setCredits(credit ? credit.credit : 0);
                } catch (error) {
                    console.error("Error fetching or saving credits:", error);
                    setCredits(0);
                }
            };
            fetchDbCredit();
        }
    }, [signedAccountId, profile]);

    const { transfer } = useNEARTransfer();
    const { fetchHashes } = useFetchHashes();
    const { saveHashes } = useSaveHashes();

    useEffect(() => {
        const getresult = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams) {
                const hash = searchParams.get('transactionHashes');
                if (hash) {
                    setTxhash(hash);
                    const res = await fetchHashes(hash as string);
                    if (res?.exist) {
                        return;
                    }
                    try {
                        const result = await wallet?.getTransactionResult(hash);
                        if (result?.success) {
                            if (result.signerId) {
                                const data: CreditsType = {
                                    accountId: result.signerId,
                                    credit: 5
                                };
                                await saveCredits(data);

                                let credit = await fetchCredits(result.signerId);
                                setCredits(credit?.credit);
                                const hashData: HashesType = {
                                    accountId: result.signerId,
                                    amount: result.amount,
                                    hash: hash
                                }
                                await saveHashes(hashData)
                            }
                        }
                    } catch (err) {
                        console.log("error >> ", err)
                    }
                }
            }
        }
        getresult();
    }, [txhash])

    const handleSignIn = async () => {
        return wallet?.signIn();
      };

    const handleTransfer = async () => {
        try {
          if (!signedAccountId) {
            handleSignIn();
          } else if(balance < 0.05) {
            setHandleToast("Insufficient Balance!", true);
          } else {
            await transfer();
          }
        } catch (error) {
          console.error("Failed to sign and send transaction:", error);
        }
    }

    useEffect(()=>{
        const fetchBalance = async () =>{
          const res = await wallet?.getBalance(signedAccountId);
          setBalance(res)
          console.log("Balance >>",balance)
        }
        if(signedAccountId){
          fetchBalance()
        }
    },[])

    return (
        <div className="container_profile absolute bottom-[-50%]">
            <div className="card_profile relative bg-slate-800 dark:bg-white">
                {(profile?.active === true || profile?.active === false) && <div className="profile-active right-2 top-2 absolute flex items-center gap-1 py-1 px-2 rounded-2xl bg-white dark:bg-slate-800">
                    <InlineSVG
                        src="/images/circle.svg"
                        className={`fill-current w-4 h-4 ${profile?.active ? "text-green-500" : "text-red-500"} font-xl cursor-pointer`}
                        color="#222f3e"
                    />
                    <p className="text-slate-800 dark:text-white text-sm">{profile?.active ? "Active" : "Inactive"}</p>
                </div>}
                {profile?.location &&
                    <div className="profile-active left-2 top-2 absolute flex items-center gap-1 py-1 px-2 rounded-2xl bg-white dark:bg-slate-800 w-[8rem]">
                        <InlineSVG
                            src="/images/location.svg"
                            className={`fill-current w-4 h-4 text-sky-500 font-xl cursor-pointer`}
                            color="#222f3e"
                        />
                        <p className="text-slate-800 dark:text-white text-sm overflow-hidden text-ellipsis whitespace-nowrap">{profile?.location}</p>
                    </div>}
                <div className="card__border w-[7rem] h-[7rem] p-1">
                    <div className={`${!darkMode && 'bg-white rounded-full'} relative w-full h-full`}>
                        <Image src={(images && images.length > 0 && images[0] !== "no_image" ? images[0] : "/images/contact2.png")} alt="Profile NFt" layout="fill" sizes="(max-width: 100%) 100%, (max-width: 100%) 100%, 100%" objectFit="cover" className="rounded-full object-cover" />
                        {/* <div className="set-profile-pic absolute bottom-0 right-0 dark:bg-slate-800 rounded-full bg-white cursor-pointer">
                            <div className="cam relative p-2">
                                <InlineSVG
                                    src="/images/camera_fill.svg"
                                    className={`fill-current w-4 h-4 text-sky-500 font-xl cursor-pointer`}
                                    color="#222f3e"
                                />
                                <div className="plus-icon absolute top-1 right-1">
                                    <InlineSVG
                                        src="/images/plus.svg"
                                        className={`fill-current w-3 h-3 text-sky-500 font-2xl cursor-pointer`}
                                        color="#222f3e"
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                {profile?.name && <h3 className="card__name">{profile?.name}</h3>}
                {accountId && <div className="flex gap-1 items-center justify-center mt-1"> <span className="card__profession h-5 pr-2">{accountId}</span> <CoptText text={accountId || ''} profilePage={true} /></div>}
                {profile?.tagline && <h5 className="quote-font text-white dark:text-slate-800">“{profile?.tagline}”</h5>}
                {accountId === signedAccountId && <div className="credits-section w-full flex justify-center items-center gap-2">
                    <div className="credits flex justify-center items-center dark:bg-slate-800 bg-white rounded-md gap-2 px-2 py-1 my-1">
                        <h2 className="dark:text-white">Credits</h2>
                        <div className="fire flex justify-center items-center gap-1">
                            <InlineSVG
                                src="/images/fire.svg"
                                className="fill-current w-6 h-6 text-red-500 font-xl cursor-pointer"
                            />
                            <h2 className="dark:text-white">{credits}</h2>
                        </div>
                    </div>
                    {credits && credits <= 0 &&
                        <div className="buy-credit bg-green-500 flex justify-center items-center rounded-md gap-2 px-2 py-1 my-1 cursor-pointer" onClick={handleTransfer}>
                            <h2>{"Buy"}</h2>
                        </div>}
                </div>}
                {(profile?.linktree?.github || profile?.linktree?.telegram || profile?.linktree?.twitter || profile?.linktree?.website) &&
                    <div className={`card__social ${animation && 'animation'}`} id="card-social">
                        <div className="card__social-control">
                            <div className="card__social-toggle bg-slate-800" id="card-toggle" onClick={() => setAnimation(!animation)}>
                                <InlineSVG
                                    src="/images/plus.svg"
                                    className="fill-current w-6 h-6 text-sky-500 dark:text-white font-xl cursor-pointer"
                                    color="#222f3e"
                                />
                            </div>

                            <span className="card__social-text">My social networks</span>

                            <ul className="card__social-list">
                                {(profile?.linktree?.twitter && profile?.linktree?.twitter !== undefined) &&
                                    <Link href={`${profile?.linktree?.twitter?.includes("https://x.com/") ? profile?.linktree?.twitter : `https://x.com/${profile?.linktree?.twitter}`}`} className="card__social-link bg-slate-800">
                                        <InlineSVG
                                            src="/images/twitter_x.svg"
                                            className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                            color="#222f3e"
                                        />
                                    </Link>
                                }
                                {(profile?.linktree?.telegram && profile?.linktree?.telegram !== undefined) &&
                                    <Link href={`${profile?.linktree?.telegram?.includes("https://t.me/") ? profile?.linktree?.telegram : `https://t.me/${profile?.linktree?.telegram}`}`} className="card__social-link bg-slate-800">
                                        <InlineSVG
                                            src="/images/telegram.svg"
                                            className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                            color="#222f3e"
                                        />
                                    </Link>
                                }
                                {(profile?.linktree?.github && profile?.linktree?.github !== undefined) &&
                                    <Link href={`${profile?.linktree?.github?.includes("https://github.com/") ? profile?.linktree?.github : `https://github.com/${profile?.linktree?.github}`}`} className="card__social-link bg-slate-800">
                                        <InlineSVG
                                            src="/images/github.svg"
                                            className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                            color="#222f3e"
                                        />
                                    </Link>
                                }
                            </ul>
                        </div>
                    </div>}
            </div>
        </div>
    )
}