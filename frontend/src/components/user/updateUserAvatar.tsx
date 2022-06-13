import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { updateUserAvatar, uploadGroupAvatar } from "services/image.api.service";
import { Store } from "src/app/store";

export default function UpdateUserAvatar() {

    /** Global data */
    const { user, chat } = useSelector((store: Store) => store);

    /** Variables */
    const [errorText, setErrorText] = useState<string>("");

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null || event.target.files.length <= 0) return;
        const imageType = /^image\//;

        if (!imageType.test(event.target.files[0].type)) {
            setErrorText("Avatar must be an image");
            return;
        }
        setErrorText("");
        updateUserAvatar(event.target.files[0]);

    }

    return (
        <>
            <p>Upload avatar</p>
            <input type="file" name="avatar" id="avatar_input" onChange={onFileChange} />
            <p className="error_text">{errorText}</p>
        </>
    )
} 