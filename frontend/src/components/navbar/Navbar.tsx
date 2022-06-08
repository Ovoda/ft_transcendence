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