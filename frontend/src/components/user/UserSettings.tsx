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
	const { user, uiState }: Store = useSelector((store: Store) => store);

	/** Variables */
	const [windowClass, setWindowClass] = useState<string>("");
	const [tfaEnabled, setTfaEnabled] = useState<boolean>(user.tfaEnabled);

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
		if (user.tfaEnabled !== tfaEnabled) {
			toggleTfa({
				dispatch,
				uiTfaEnabled: tfaEnabled,
			});
		}
	}, [tfaEnabled]);

	useEffect(() => {
		setTfaEnabled(user.tfaEnabled);
	}, [uiState.showTfaRegistration]);

	return (
		<div id="user_settings" className={windowClass}>
			<div id="close_settings"><FaChevronRight onClick={() => setSettingsWindowAction()} /></div>
			<img src={user.avatar} alt={user.login + "'s profile picture"} />
			<p>{user.login}</p>
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