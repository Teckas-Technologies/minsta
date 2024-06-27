import { useState } from "react"
import { AccordianItem } from "./AccordianItem"

export const AdminShareSettings = () => {

    type MessageKeys = 'facebook' | 'twitter' | 'whatsapp';

    const [open, setOpen] = useState<number | null>(null);
    const [socialMedias, setSocialMedias] = useState<Array<{name: MessageKeys, title: string, path: string, message: string, enabled: boolean}>>([
        { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: false },
        { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg",  message: "", enabled: false },
        { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg",  message: "", enabled: false },
    ]);

    const toggle = (index: number, key: MessageKeys) => {
        setOpen(open === index ? null : index);
        handleCheckboxChange(key);
    }

    const handleCheckboxChange = (key: MessageKeys) => {
        setSocialMedias((prev) =>
            prev.map((item) =>
                item.name === key ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const handleSave = () => {
        const enabledMessages = socialMedias.filter(item => item.enabled);
        console.log("Saved messages: ", enabledMessages);
    };

    const handleCancel = () => {
        setSocialMedias([
            { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: false },
            { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg", message: "", enabled: false },
            { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg", message: "", enabled: false },
        ]);
        console.log("Erased messages: ", socialMedias);
    };

    return (
        <>
         <div className="admin-main-card h-full flex-col flex justify-between gap-3">
                <div className="leader-board-title">
                    <h2 className="text-xl text-center sm:text-left py-1 title-font">Share Settings</h2>
                </div>
                <div className="admin-leaderboard h-full">
                    {socialMedias.map((socialMedia, i)=> {
                        return <AccordianItem 
                            key={i} open={open === i} 
                            title={socialMedia.title} 
                            path={socialMedia.path} 
                            toggle={() => toggle(i, socialMedia.name as MessageKeys)}
                            message={socialMedia.message}
                            setMessage={(text: string) =>
                                setSocialMedias((prev) =>
                                    prev.map((item) =>
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
