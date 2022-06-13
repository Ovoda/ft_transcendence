import SwitchButton from "../../assets/SwitchButton/SwitchButton";
import './UserSettings.scss';
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../app/store";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { toggleTfa } from "../../services/tfa.service";
import UserData from "features/user/interfaces/user.interface";

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
	}, []);

	return (
		<div id="user_settings" className={windowClass}>
			<div id="close_settings"><FaChevronRight onClick={() => setSettingsWindowAction()} /></div>
			<img src={userData.avatar} alt={userData.login + "'s profile picture"} />
			<p>{userData.login}</p>
			<div id="user_settings_stats">
				<p>{Math.round((userData.victories / (userData.victories + userData.defeats)) * 100)}% win rate</p>
				<p>{userData.victories} victories</p>
				<p>{userData.defeats} defeats</p>
			</div>
			<div id="tfa_option">
				<p>Two-factor authentication</p>
				<SwitchButton value={tfaEnabled} setValue={setTfaEnabled} />
			</div>
		</div>
	);
}