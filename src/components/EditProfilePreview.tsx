import { useDarkMode } from "@/context/DarkModeContext";
import { NearContext } from "@/wallet/WalletSelector";
import Image from "next/image"
import { useContext, useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg"

interface Props {
    name: string;
    about: string;
    images: string[] | undefined;
    profile_cid: string;
    bg_cid: string;
    twitter: string;
    github: string;
    telegram: string;
    website: string;
    tags: string[];
}

export const EditProfilePreview = ({ name, about, images, profile_cid, bg_cid, twitter, github, telegram, website, tags }: Props) => {
    const { wallet, signedAccountId } = useContext(NearContext);
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])

    console.log("Tags >> ", tags)

    return (<div className={`edit-preview ${darkMode ? "image-holder-dark" : "image-holder"} profile-form-holder w-full md:w-[40%] rounded-md p-3`}>
        <div className="edit-preview-title py-2">
            <h2 className="title-font dark:text-white text-center">Preview</h2>
        </div>
        <div
            className="banner h-[15rem] w-full rounded-md relative"
            style={{
                backgroundImage: `url(${images && images.length > 0 && images[1] !== "no_image" && !bg_cid
                    ? images[1] :
                    bg_cid ? `https://ipfs.near.social/ipfs/${bg_cid}`
                        : "/images/dark_banner.jpg"})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="absolute top-[60%] left-0 right-0 flex flex-col items-center gap-5 pb-10">
                <div className="card-profile-preview box-shadow w-[15rem] h-auto pb-3 flex flex-col items-center bg-white rounded-md">
                    <div className="pre-profile-pic w-[5rem] h-[5rem] relative my-3 mt-5">
                        <Image
                            src={
                                images && images.length > 0 && images[0] !== "no_image" && !profile_cid
                                    ? images[0] :
                                    profile_cid ? `https://ipfs.near.social/ipfs/${profile_cid}`
                                        : "/images/contact2.png"
                            }
                            alt="Profile NFT"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    </div>
                    <h2 className="my-2">{name ? name : "No name"}</h2>
                    <p>{signedAccountId}</p>
                    <div className="profile-icons flex items-center gap-2 my-4">
                        {twitter && <InlineSVG
                            src="/images/twitter_x.svg"
                            className={`fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer`}
                            color="#222f3e"
                        />}
                        {github && <InlineSVG
                            src="/images/github.svg"
                            className={`fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer`}
                            color="#222f3e"
                        />}
                        {telegram && <InlineSVG
                            src="/images/telegram.svg"
                            className={`fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer`}
                            color="#222f3e"
                        />}
                        {website && <InlineSVG
                            src="/images/globe.svg"
                            className={`fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer`}
                            color="#222f3e"
                        />}
                    </div>
                </div>
                {about && <div className="edit-about">
                    <h2 className="dark:text-white text-center title-font">About</h2>
                    <h3 className="dark:text-white text-center">{about}</h3>
                </div>}
                {tags.length > 0 && <div className="edit-tags">
                    <h2 className="dark:text-white text-center title-font">Tags</h2>
                    <div className="tags-list flex items-center gap-2 py-2">
                        {tags.length > 0 && tags.map((tag: any) => (
                            <div key={tag} className="tags-profile py-1 px-2 border border-sky-600 rounded-md">
                                <h3 key={tag} className="text-sky-500 flex items-center gap-1">#{tag}</h3>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>

    </div>)
}
