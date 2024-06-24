import InlineSVG from "react-inlinesvg"

export const AdminSideMenu = ({setAdminPage}: any) => {
    
    return (
        <>
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    <h2>Admin Menu</h2>
                </div>
            </div>
            <div className="card-content">
                <ul className="admin-menu-list">
                    <li className="admin-menu" onClick={()=>setAdminPage("Leaderboard")}><h4>Leaderboard</h4> <InlineSVG
                        src="/images/arrow_right.svg"
                        className="icon fill-current text-headerText"
                        style={{color: "#ff3572"}}
                    /></li>
                    <li className="admin-menu" onClick={()=>setAdminPage("Share Settings")}><h4>Share Settings</h4> <InlineSVG
                        src="/images/arrow_right.svg"
                        className="icon fill-current text-headerText"
                        style={{color: "#ff3572"}}
                    /></li>
                    <li className="admin-menu" onClick={()=>setAdminPage("Giveaway Details")}><h4>Giveaway Details</h4> <InlineSVG
                        src="/images/arrow_right.svg"
                        className="icon fill-current text-headerText"
                        style={{color: "#ff3572"}}
                    /></li>
                </ul>
            </div>
        </div>
        </>
    )
}