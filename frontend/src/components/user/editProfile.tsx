import { useEffect, useState } from "react";
import TextInput from 'assets/TextInput/TextInput';
import Button from "assets/Button/Button";
import { updateUser } from "services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "features/user/user.slice";
import './editProfile.scss';
import { closeEditProfile } from "features/uiState/uiState.slice";
import { Store } from "src/app/store";
import UpdateUserAvatar from "./updateUserAvatar";
import close from 'images/close.png';

export default function EditProfile() {

	/** Global data */
	const { uiState, user } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [username, setUsername] = useState<string>("");
	const [errorText, setErrorText] = useState<string>("");

	async function handleProfileUpdate() {
		if (!username || username === "") {
			setErrorText("Username cannot be empty");
			return false;
		}

		const { newUser, error } = await updateUser({ username });
		if (error) {
			setErrorText(error);
			return false;
		}
		dispatch(updateUserData(newUser));
		dispatch(closeEditProfile());
		return false;
	}

	useEffect(() => {
		setErrorText("");
	}, [username]);

	if (uiState.showEditProfile) {
		return (
			<div id="edit_profile_container">
				<div id="edit_profile">
					{
						user.username &&
						<img id="close_button_img" onClick={() => dispatch(dispatch(closeEditProfile()))} src={close} alt="Close modal icon" />
					}
					<UpdateUserAvatar />
					<h2>Set username</h2>
					<TextInput type="text" text={username} setText={setUsername} placeholder="username" />
					<p className="error_text">{errorText}</p>
					<Button onClick={handleProfileUpdate}>Confirm</Button>
				</div >
			</div >
		)
	}
	return <></>;
}