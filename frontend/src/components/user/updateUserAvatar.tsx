import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAvatar } from "services/image.api.service";
import { Store } from "src/app/store";
import upload_img from "images/upload.png";
import { getUserData, updateUser } from "services/api.service";
import { updateUserData } from "features/user/user.slice";

export default function UpdateUserAvatar() {

    /** Tools */
    const dispatch = useDispatch();

    /** Variables */
    const [errorText, setErrorText] = useState<string>("");

    async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null || event.target.files.length <= 0) return;
        const imageType = /^image\//;

        if (!imageType.test(event.target.files[0].type)) {
            setErrorText("Avatar must be an image");
            return;
        }
        setErrorText("");
        const { error } = await updateUserAvatar(event.target.files[0]);
        if (error) {
            setErrorText(error);
        }
        const user = await getUserData();
        if (user.error) {
            setErrorText(user.error);
            return false;
        }
        dispatch(updateUserData(user.userData));
    }

    return (
        <>
            <h2>Upload avatar</h2>
            <label id="avatar_upload">
                <input type="file" name="avatar" id="avatar_input" onChange={onFileChange} />
                <img src={upload_img} alt="Upload image" />
                Upload avatar
            </label>
            <p className="error_text">{errorText}</p>
        </>
    )
} 