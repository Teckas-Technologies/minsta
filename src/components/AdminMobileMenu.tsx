import InlineSVG from "react-inlinesvg"

export const AdminMobileMenu = ({setAdminPage}: any) => {
    return (
        <>
        <div>
            <ul>
                <li onClick={()=>setAdminPage("Leaderboard")}>
                    <h4 className="flex items-center gap-3">
                        <InlineSVG
                            src="/images/leader.svg"
                            className="fill-current h-12"
                            color="#222f3e"
                            />Leaderboard
                    </h4>
                </li>
                <li onClick={()=>setAdminPage("Share Settings")}>
                    <h4 className="flex items-center gap-3">
                        <InlineSVG
                            src="/images/slider.svg"
                            className="fill-current h-12"
                            color="#222f3e"
                            />Share Settings
                    </h4>
                </li>
                <li onClick={()=>setAdminPage("Giveaway Details")}>
                    <h4 className="flex items-center gap-3">
                        <InlineSVG
                            src="/images/details.svg"
                            className="fill-current h-12"
                            color="#222f3e"
                            />Giveaway Details
                    </h4>
                </li>
            </ul>
        </div>
        </>
    )
}