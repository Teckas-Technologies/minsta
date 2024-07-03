import InlineSVG from "react-inlinesvg"

export const AdminSideMenu = ({setAdminPage}: any) => {
    
    return (
        <>
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    <h2 className="dark:text-white">Admin Menu</h2>
                </div>
            </div>
            <div className="card-content">
                <ul className="admin-menu-list">
                    <li className="admin-menu dark:bg-white" onClick={()=>setAdminPage("Leaderboard")}>
                        <h4 className="flex items-center gap-3">
                            <InlineSVG
                                src="/images/leader.svg"
                                className="menu-icon fill-current text-camera h-12"
                                />Leaderboard
                        </h4> 
                        <InlineSVG
                        src="/images/arrow_right.svg"
                        className="icon fill-current text-headerText"
                        style={{color: "#0ea5e9"}}
                    /></li>
                    <li className="admin-menu dark:bg-white" onClick={()=>setAdminPage("Share Settings")}>
                        <h4 className="flex items-center gap-3"> 
                            <InlineSVG
                                src="/images/slider.svg"
                                className="menu-icon fill-current text-camera h-12"
                                />Share Settings
                        </h4> 
                        <InlineSVG
                        src="/images/arrow_right.svg"
                        className="icon fill-current text-headerText"
                        style={{color: "#0ea5e9"}}
                    /></li>
                    <li className="admin-menu dark:bg-white" onClick={()=>setAdminPage("Giveaway Details")}>
                        <h4 className="flex items-center gap-3">
                            <InlineSVG
                                src="/images/details.svg"
                                className="menu-icon fill-current text-camera h-12"
                                />Giveaway Details
                        </h4> 
                        <InlineSVG
                        src="/images/arrow_right.svg"
                        className="icon fill-current text-headerText"
                        style={{color: "#0ea5e9"}}
                    /></li>
                </ul>
            </div>
        </div>
        </>
    )
}