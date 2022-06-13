import { useEffect, useState } from "react";
import TextInput from 'assets/TextInput/TextInput';
import Button from "assets/Button/Button";
import { updateUser } from "services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "features/user/user.slice";
import './editProfile.scss';
import { closeEditProfile } from "features/uiState/uiState.slice";
import { Store } from "src/app/store";
<<<<<<< HEAD
import UpdateAvatar from "./updateUserAvatar";
import UpdateUserAvatar from "./updateUserAvatar";
=======

>>>>>>> d008819 (Profile)

export default function EditProfile() {

    /** Global data */
<<<<<<< HEAD
    const { uiState, user } = useSelector((store: Store) => store);
=======
    const { uiState } = useSelector((store: Store) => store);
>>>>>>> d008819 (Profile)

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
<<<<<<< HEAD
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
=======
                    <div id="edit_profile_input">
                        <TextInput type="text" text={username} setText={setUsername} placeholder="username" />
                        <Button onClick={handleProfileUpdate}>Update</Button>
                    </div>
                    <div id="edit_profile_texts">
                        <p className="error_text">{errorText}</p>
                        <p onClick={close} className="edit_profile_cancel">cancel</p>
                    </div>
                </div>
            </div>
>>>>>>> d008819 (Profile)
        )
    }
    return <></>;
}