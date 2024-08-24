import Image from "next/image"
import InlineSVG from "react-inlinesvg"
import { CoptText } from "./CopyText"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { CreditsType, CreditsTypeReq, HashesType, NEARSocialUserProfile, ProfileType } from "@/data/types"
import { useDarkMode } from "@/context/DarkModeContext"
import { NearContext } from "@/wallet/WalletSelector"
import { useFetchCredits, useSaveCredits } from "@/hooks/db/CreditHook"
import * as nearAPI from "near-api-js";
import { useFetchHashes, useSaveHashes } from "@/hooks/db/HashHook"
import FollowButton from "./buttons/follow-button"
import useNearSocialDB from "@/utils/useNearSocialDB"
import { constants } from "@/constants"

interface props {
    profile: NEARSocialUserProfile | undefined;
    // dbProfile: ProfileType | undefined;
    images: string[] | undefined,
    accountId: string;
    setHandleToast: (s: string, e: boolean) => void
    handleUpload: (text: string, cid: string, open: boolean) => void
    handleBuyCredit: (open: boolean)=> void;
    creditAdded: boolean
}

export const ProfileCard = ({ profile, images, accountId, setHandleToast, handleUpload, handleBuyCredit, creditAdded }: props) => {
    const [animation, setAnimation] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const { wallet, signedAccountId } = useContext(NearContext);
    const { fetchCredits } = useFetchCredits();
    const { saveCredits } = useSaveCredits();
    const [credits, setCredits] = useState<number | null>();
    const [buyCredit, setBuyCredit] = useState(false);
    const [txhash, setTxhash] = useState("");
    const [balance, setBalance] = useState<number>(0);
    const [profileFileName, setProfileFileName] = useState('');
    const [profileImageCid, setProfileImageCid] = useState('');
    const { getBalance, uploadIPFS } = useNearSocialDB();

    useEffect(() => {
        if (profileImageCid) {
            handleUpload("Profile Image", profileImageCid, true);
        }
    }, [profileImageCid])

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
                        const data: CreditsTypeReq = {
                            accountId: signedAccountId,
                            credit: 3,
                            detuct: false
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
    }, [signedAccountId, profile, creditAdded]);

    const { fetchHashes } = useFetchHashes();
    const { saveHashes } = useSaveHashes();

    const calculateCredit = (amount: number) => {
        const creditValue = Math.round((amount / constants.creditAmount) * 100) / 100;
        return Math.floor(creditValue);
    };

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
                                const amt = nearAPI.utils.format.formatNearAmount(result.amount);
                                const resCredit = calculateCredit(parseFloat(amt));
                                const data: CreditsTypeReq = {
                                    accountId: result.signerId,
                                    credit: resCredit,
                                    detuct: false
                                };
                                await saveCredits(data);

                                let credit = await fetchCredits(result.signerId);
                                setCredits(credit?.credit);
                                const hashData: HashesType = {
                                    accountId: result.signerId,
                                    amount: parseFloat(amt),
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
            } else if (balance < 0.05) {
                setHandleToast("Insufficient Balance!", true);
            } else {
                handleBuyCredit(true);
            }
        } catch (error) {
            console.error("Failed to sign and send transaction:", error);
        }
    }

    useEffect(() => {
        const fetchBalance = async () => {
            const res = await getBalance();
            if(res !== undefined){
                setBalance(res)
            }
        }
        if (signedAccountId) {
            fetchBalance()
        }
    }, [signedAccountId])

    const handleFileClick = (inputId: string) => {
        const fileInput = document.getElementById(inputId);
        if (fileInput) {
            (fileInput as HTMLInputElement).click();
        }
    };

    const handleProfileFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileFileName(file.name);
            try {
                const profileCid = await uploadIPFS(file);
                console.log("Separate Profile Cid >> ", profileCid);
                setProfileImageCid(profileCid);
            } catch (error) {
                console.error('Error converting file to Base64:', error);
            }
        } else {
            setProfileFileName('');
            setProfileImageCid("");
        }
    };

    return (
        <div className="container_profile absolute bottom-[-70%]">
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
                        {accountId === signedAccountId && <div className="set-profile-pic absolute bottom-0 right-0 dark:bg-slate-800 rounded-full bg-white cursor-pointer" onClick={() => handleFileClick('profileInput')}>
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
                        </div>}
                        <input type="file" name="picture" id="profileInput" accept="image/*" onChange={handleProfileFileChange} className={`hidden w-full p-2 text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`} />
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
                    {/* {credits && credits <= 0 && */}
                        <div className="buy-credit bg-green-500 flex justify-center items-center rounded-md gap-2 px-2 py-1 my-1 cursor-pointer" onClick={handleTransfer}>
                            <h2>{"Buy"}</h2>
                        </div>
                        {/* } */}
                </div>}
                <FollowButton accountId={accountId} />
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