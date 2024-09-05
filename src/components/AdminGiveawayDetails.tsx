import { useDarkMode } from "@/context/DarkModeContext";
import { useEffect, useState } from "react";
import { UploadGiveaway } from "./giveaways/UploadGiveaway";
import { ListGiveaways } from "./giveaways/ListGiveaways";

export const AdminGiveawayDetails = () => {

    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode]);

    const [tabs, setTabs] = useState({
        upload: true,
        list: false
    })

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="admin-main-card h-full flex-col flex justify-between gap-3 dark:bg-slate-800">
                <div className="leader-board-title flex items-center px-2">
                    <div className={`tab-box p-2 cursor-pointer ${tabs.upload && "border-b-2 border-b-sky-500"} `} onClick={()=> setTabs({upload: true, list: false})}>
                        <h2 className="md:text-xl text-center sm:text-left py-1 title-font dark:text-white">Upload Giveaway</h2>
                    </div>
                    <div className={`tab-box p-2 cursor-pointer ${tabs.list && "border-b-2 border-b-sky-500"}`} onClick={()=> setTabs({upload: false, list: true})}>
                        <h2 className="md:text-xl text-center sm:text-left py-1 title-font dark:text-white">List Giveaways</h2>
                    </div>
                </div>
                {tabs.upload && <UploadGiveaway />}
                {tabs.list && <ListGiveaways />}
            </div>
        </div>
    )
}