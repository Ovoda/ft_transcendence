import React, { Dispatch, SetStateAction } from "react";
import UserData from "src/features/user/interfaces/user.interface";
import { logout } from "../../services/auth.service";

interface Props {
    userData: UserData;
    openSettingsWindow: () => void;
}

export default function LoggedInMenu({ userData, openSettingsWindow }: Props) {

    return (
        <div id="navbar_logged_in">
            <div id="navbar_infos">
                <p>{userData.login}</p>
                <button onClick={logout}>Log out</button>
            </div>
            <img
                onClick={openSettingsWindow}
                src={userData.avatar}
                alt={userData.login + "'s avatar"} />
        </div>
    );
}