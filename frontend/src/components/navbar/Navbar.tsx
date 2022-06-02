import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { openSettingWindow } from "../../features/uiState/uiState.slice";
import ChatButton from "./ChatButton";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import './Navbar.scss';

export default function Navbar() {

    /** Global Data */
    const store: Store = useSelector((store: Store) => store);
    const userData = store.user;
    const uiState = store.uiState;

    /** Tools */
    const dispatch = useDispatch();

    return (
        <nav id="navbar" className={userData.login === "" ? "logged_out_nav" : ""}>
			<img id="logo" src="https://is4-ssl.mzstatic.com/image/thumb/Purple128/v4/a1/f2/f0/a1f2f0c8-357a-3398-68c7-f6b0c5e164da/AppIcon-1x_U007emarketing-85-220-6.png/434x0w.webp"></img>
			{
				userData.login !== "" &&
				<ChatButton />
			}
            {
                userData.login === ""
                    ?
                    <LoggedOutMenu />
                    :
                    <LoggedInMenu
                        userData={userData}
                        openSettingsWindow={() => dispatch(openSettingWindow())} />
            }
        </nav>
    )
}