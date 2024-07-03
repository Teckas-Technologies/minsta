import { useState } from "react"
import { AccordianItem } from "./AccordianItem"
import { useFetchSocialMedias, useSaveSocialMedia } from "@/hooks/db/SocialMediaHook";
import { SocialMedia } from "@/data/types";

export const AdminShareSettings = () => {

    type MessageKeys = 'facebook' | 'twitter' | 'whatsapp';

    const [open, setOpen] = useState<number | null>(null);
    const { socialMedias } = useFetchSocialMedias();
    const {saveSocialMedia} = useSaveSocialMedia();
    // const [socialMediasLocal, setSocialMediasLocal] = useState<SocialMedia[] | null>(socialMedias);
    const [socialMediasLocal, setSocialMediasLocal] = useState<SocialMedia[] | null>([
        { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: false },
        { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg",  message: "", enabled: false },
        { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg",  message: "", enabled: false },
    ]);

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
        // const enabledMessages = socialMedias?.filter(item => item.enabled);
        // console.log("Saved messages: ", enabledMessages);
        console.log("Saved messages 2 : ", socialMediasLocal);
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
            })
            console.log("Saved messages 1: ", socialMediasLocal);
        }
    };

    const handleCancel = () => {
        // setSocialMediasLocal(socialMedias);
        // console.log("Erased messages: ", socialMediasLocal);
    };

    return (
        <>
         <div className="admin-main-card h-full flex-col flex justify-between gap-3">
                <div className="leader-board-title">
                    <h2 className="text-xl text-center sm:text-left py-1 title-font">Share Settings</h2>
                </div>
                <div className="admin-leaderboard h-full">
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
        </>
    )
}
