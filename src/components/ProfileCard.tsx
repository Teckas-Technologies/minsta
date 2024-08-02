import Image from "next/image"
import InlineSVG from "react-inlinesvg"
import { CoptText } from "./CopyText"
import Link from "next/link"
import { NEARSocialUserProfile } from "@/contracts/social"
import { useEffect, useState } from "react"
import { ProfileType } from "@/data/types"
import { useDarkMode } from "@/context/DarkModeContext"

interface props {
    profile: NEARSocialUserProfile | undefined;
    dbProfile: ProfileType | undefined;
    images: string[] | undefined,
    accountId: string;
}

export const ProfileCard = ({ profile, dbProfile, images, accountId }: props) => {
    const [animation, setAnimation] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const [profilePhoto, setProfilePhoto] = useState<string>();

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])

    function isBase64(str: string) {
        try {
          return btoa(atob(str)) === str;
        } catch (err) {
          return false;
        }
    }

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
                            <Image src={ dbProfile?.profileImage ? dbProfile?.profileImage : images && images?.length > 0 ? images?.[0] : "/images/contact2.png"} alt="Profile NFt" layout="fill" sizes="(max-width: 100%) 100%, (max-width: 100%) 100%, 100%" objectFit="cover" className="rounded-full object-cover" />
                        </div>
                    </div>

                {(dbProfile?.name || profile?.name) && <h3 className="card__name">{dbProfile?.name || profile?.name}</h3>}
                {(dbProfile?.accountId || accountId) && <div className="flex gap-1 items-center justify-center mt-1"> <span className="card__profession h-5 pr-2">{dbProfile?.accountId || accountId}</span> <CoptText text={dbProfile?.accountId || accountId || ''} profilePage={true} /></div>}
                {profile?.tagline && <h5 className="quote-font text-white dark:text-slate-800">“{profile?.tagline}”</h5>}

                {(dbProfile?.linkTree?.github || dbProfile?.linkTree?.telegram || dbProfile?.linkTree?.twitter || dbProfile?.linkTree?.website) &&
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
                                {(dbProfile?.linkTree?.twitter && dbProfile?.linkTree?.twitter !== undefined) &&
                                    <Link href={`${dbProfile?.linkTree?.twitter?.includes("https://x.com/") ? dbProfile?.linkTree?.twitter : `https://x.com/${dbProfile?.linkTree?.twitter}`}`} className="card__social-link bg-slate-800">
                                        <InlineSVG
                                            src="/images/twitter_x.svg"
                                            className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                            color="#222f3e"
                                        />
                                    </Link>
                                }
                                {(dbProfile?.linkTree?.telegram && dbProfile?.linkTree?.telegram !== undefined) &&
                                    <Link href={`${dbProfile?.linkTree?.telegram?.includes("https://t.me/") ? dbProfile?.linkTree?.telegram : `https://t.me/${dbProfile?.linkTree?.telegram}`}`} className="card__social-link bg-slate-800">
                                        <InlineSVG
                                            src="/images/telegram.svg"
                                            className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                            color="#222f3e"
                                        />
                                    </Link> 
                                }
                                {(dbProfile?.linkTree?.github && dbProfile?.linkTree?.github !== undefined) &&
                                    <Link href={`${dbProfile?.linkTree?.github?.includes("https://github.com/") ? dbProfile?.linkTree?.github : `https://github.com/${dbProfile?.linkTree?.github}`}`} className="card__social-link bg-slate-800">
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