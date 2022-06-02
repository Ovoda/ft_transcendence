import UserData from "../../features/user/interfaces/user.interface";
import SwitchButton from "../../assets/SwitchButton/SwitchButton";
import './UserSettings.scss';
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../app/store";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { toggleTfa } from "../../services/tfa.service";

interface Props {
    settingsWindowState: boolean;
    setSettingsWindowAction: () => void;
}

export default function UserSettings({ settingsWindowState, setSettingsWindowAction }: Props) {

    /** Global data */
    const store: Store = useSelector((store: Store) => store);
    const userData: UserData = store.user;

    /** Variables */
    const [windowClass, setWindowClass] = useState<string>("");
    const [tfaEnabled, setTfaEnabled] = useState<boolean>(userData.tfaEnabled);

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        if (settingsWindowState) {
            setWindowClass("");
        } else {
            setWindowClass("closing");
        }
    }, [settingsWindowState]);

    useEffect(() => {

        if (userData.tfaEnabled !== tfaEnabled) {
            toggleTfa({
                dispatch,
                uiTfaEnabled: tfaEnabled,
            });
        }
    }, [tfaEnabled]);

    useEffect(() => {
        setTfaEnabled(userData.tfaEnabled);
    }, [userData]);

    return (
        <div id="user_settings" className={windowClass}>
            <div id="close_settings"><FaChevronRight onClick={() => setSettingsWindowAction()} /></div>
            <img src={userData.avatar} alt={userData.login + "'s profile picture"} />
            <p>{userData.login}</p>
            <div id="user_settings_stats">
                <p>50% win rate</p>
                <p>21 victories</p>
                <p>21 defeats</p>
            </div>
            <div id="tfa_option">
                <p>Two-factor authentication</p>
                <SwitchButton value={tfaEnabled} setValue={setTfaEnabled} />
            </div>
        </div>
    );
}