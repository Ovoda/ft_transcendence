import { useEffect, useState } from "react";
import TextInput from 'assets/TextInput/TextInput';
import Button from "assets/Button/Button";
import { updateUser } from "services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "features/user/user.slice";
import './editProfile.scss';
import { closeEditProfile } from "features/uiState/uiState.slice";
import { Store } from "src/app/store";
import UpdateAvatar from "./updateUserAvatar";
import UpdateUserAvatar from "./updateUserAvatar";

export default function EditProfile() {

    /** Global data */
    const { uiState, user } = useSelector((store: Store) => store);

    /** Tools */
    const dispatch = useDispatch();

    /** Variables */
    const [username, setUsername] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");

    async function handleProfileUpdate() {
        if (!username || username === "") return false;

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

    function close() {
        dispatch(closeEditProfile());
    }

    if (uiState.showEditProfile) {
        return (
            <div id="edit_profile_container">
                <div id="edit_profile">
                    <h2>Set profile</h2>
                    <TextInput type="text" text={username} setText={setUsername} placeholder="username" />
                    <p className="error_text">{errorText}</p>
                    <UpdateUserAvatar />
                    <Button onClick={handleProfileUpdate}>Update</Button>
                    {
                        user.username &&
                        < p onClick={close} className="edit_profile_cancel">cancel</p>
                    }
                </div>
            </div >
        )
    }
    return <></>;
}