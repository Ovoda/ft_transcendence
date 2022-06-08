import React, { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { mainSocketContext } from "../../App";
import UserData from "src/features/user/interfaces/user.interface";
import { logout } from "../../services/auth.service";

interface Props {
    userData: UserData;
    openSettingsWindow: () => void;
}

export default function LoggedInMenu({ userData, openSettingsWindow }: Props) {

    /** Global data */
    const mainSocket = useContext(mainSocketContext);

    function handleLogout(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        mainSocket?.emit("RemoveClient");
        logout();
    }

    return (
        <div id="navbar_logged_in">
            <div id="navbar_infos">
                <p>{userData.login}</p>
                <button onClick={handleLogout}>Log out</button>
            </div>
            <img
                onClick={openSettingsWindow}
                src={userData.avatar}
                alt={userData.login + "'s avatar"} />
        </div>
    );
}