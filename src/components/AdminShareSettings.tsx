import { title } from "process"
import { AccordianItem } from "./AccordianItem"
import { useState } from "react"

export const AdminShareSettings = () => {

    const socialMedias = [
        {
            title: "Facebook",
            path: "/images/facebook.svg",
            description: "Description for facebook"
        },
        {
            title: "Twitter",
            path: "/images/twitter_x.svg",
            description: "Description for twitter"
        },
        {
            title: "Whatsapp",
            path: "/images/whatsapp.svg",
            description: "Description for whatsapp"
        }
    ]

    const [open, setOpen] = useState<any>(false)

    const toggle = (index: any) =>{
        if(open === index) {
            return setOpen(null);
        }
        setOpen(index);
    }

    return (
        <>
         <div className="admin-main-card h-full flex-col flex justify-between gap-3">
                <div className="leader-board-title">
                    <h2 className="text-xl text-center sm:text-left py-1 title-font">Share Settings</h2>
                </div>
                <div className="admin-leaderboard h-full">
                    {socialMedias.map((socialMedia, i)=> {
                        return <AccordianItem key={i} open={open === i} title={socialMedia.title} path={socialMedia.path} description={socialMedia.description} toggle={()=>toggle(i)}/>
                    })}
                </div>
                <div className="admin-leaderboard-footer flex justify-end">
                    <div className="leaderboard-actions flex gap-5">
                        <button 
                            className="cancel-btn btn" 
                            
                        >
                            Cancel
                        </button>
                        <button 
                            className="success-btn btn" 
                            
                        >
                            Save
                        </button>
                    </div>
                </div>
         </div>
        </>
    )

}