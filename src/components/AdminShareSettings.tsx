import { useEffect, useState } from "react"
import { AccordianItem } from "./AccordianItem"
import { useFetchSocialMedias, useSaveSocialMedia } from "@/hooks/db/SocialMediaHook";
import { SocialMedia } from "@/data/types";
import { useDarkMode } from "@/context/DarkModeContext";

export const AdminShareSettings = () => {

    type MessageKeys = 'facebook' | 'twitter' | 'whatsapp';

    const [open, setOpen] = useState<number | null>(null);
    const {saveSocialMedia} = useSaveSocialMedia();
    const [toast, setToast] = useState(false);
    const { darkMode } = useDarkMode();
    // const [socialMediasLocal, setSocialMediasLocal] = useState<SocialMedia[] | null>(socialMedias);
    const { socialMedias } = useFetchSocialMedias();
    const [socialMediasLocal, setSocialMediasLocal] = useState<SocialMedia[] | null>([
        { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: false },
        { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg",  message: "", enabled: false },
        { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg",  message: "", enabled: false },
        { name: 'telegram', title: "Telegram", path: "/images/telegram.svg",  message: "", enabled: false },
    ]);

    useEffect(() => {
        if (socialMedias && socialMediasLocal) {
            const updatedSocialMediasLocal = socialMediasLocal?.map((mediaLocal) => {
                const matchedMedia = socialMedias.find(media => media.name === mediaLocal.name);
                return matchedMedia ? { ...mediaLocal, message: matchedMedia.message } : mediaLocal;
            });
            setSocialMediasLocal(updatedSocialMediasLocal);
        }
    }, [socialMedias]);

    const toggle = (index: number, key: MessageKeys) => {
        setOpen(open === index ? null : index);
        handleCheckboxChange(key);
    }

    const handleCheckboxChange = (key: MessageKeys) => {
        setSocialMediasLocal((prev) =>
            (prev ?? []).map((item) =>
                item.name === key ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const handleSave = () => {
        if(socialMediasLocal) {
            socialMediasLocal.map((media, i)=> {
                const updatedMedia: SocialMedia = {
                    name: media.name,
                    title: media.title,
                    path: media.path,
                    message: media.message,
                    enabled: media.enabled
                };
                saveSocialMedia(updatedMedia);
            });
            setSocialMediasLocal([
                { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: false },
                { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg",  message: "", enabled: false },
                { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg",  message: "", enabled: false },
                { name: 'telegram', title: "Telegram", path: "/images/telegram.svg",  message: "", enabled: false },

            ])
            setToast(true);
        }
    };

    const handleCancel = () => {
        setSocialMediasLocal([
            { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: false },
            { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg",  message: "", enabled: false },
            { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg",  message: "", enabled: false },
            { name: 'telegram', title: "Telegram", path: "/images/telegram.svg",  message: "", enabled: false },
        ])
    };

    useEffect(()=> {
        if(toast) {
            setTimeout(()=> {
                setToast(false);
            }, 5000)
        }
    }, [toast])

    return (
        <div className={`${darkMode ? "dark" : ""}`}>
         <div className="admin-main-card h-full flex-col flex justify-between gap-3 dark:bg-slate-800">
                <div className="leader-board-title">
                    <h2 className="text-xl text-center sm:text-left py-1 title-font dark:text-white">Share Settings</h2>
                </div>
                <div className="admin-leaderboard bg-white h-full">
                    {socialMediasLocal?.map((socialMedia, i)=> {
                        return <AccordianItem 
                            key={i} open={open === i} 
                            title={socialMedia.title} 
                            path={socialMedia.path} 
                            toggle={() => toggle(i, socialMedia.name as MessageKeys)}
                            message={socialMedia.message}
                            setMessage={(text: string) =>
                                setSocialMediasLocal((prev) =>
                                    (prev ?? []).map((item) =>
                                        item.name === socialMedia.name
                                            ? { ...item, message: text }
                                            : item
                                    )
                                )
                            }
                            enabled={socialMedia.enabled}
                            onCheckboxChange={() => handleCheckboxChange(socialMedia.name as MessageKeys)}
                        />
                    })}
                </div>
                <div className="admin-leaderboard-footer flex justify-end">
                    <div className="leaderboard-actions flex gap-5 mr-3">
                        <button 
                            className="cancel-btn btn" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            className="success-btn btn" 
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
         </div>
         {toast && 
         <div id="toast-default" className="toast-container top-20 left-1/2 transform -translate-x-1/2 absolute ">
            <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ms-1 text-sm font-normal">Share Settings Updated Successfully!</div>
            </div>
            <div className="border-bottom-animation"></div>
        </div>}
        </div>
    )
}
