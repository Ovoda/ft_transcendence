import { useEffect, useState } from "react";
import { RoomTypeEnum } from "enums/RoomType.enum";
import TextInput from "../../../assets/TextInput/TextInput";
import { createRoom } from "services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { updateUser } from "../../../features/user/user.slice";
import Button from "assets/Button/Button";
import { closeChatRoomCreationModal } from "features/chat/chat.slice";

interface Props {
    className: string;
    swap: () => void;
}

export default function AddFriend({ className, swap }: Props) {

    /** Global data */
    const { user, chat } = useSelector((store: Store) => store);

    /** Variables */
    const [login, setLogin] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");
    const [successText, setSuccessText] = useState<string>("");

    /** Tools */
    const dispatch = useDispatch();

    async function handleRoomCreation() {
        if (login === "") return false;
        if (login === user.login) {
            setErrorText("You cannot add yourself");
            return false;
        }

        const response = await createRoom({
            name: user.login,
            logins: [user.login, login],
            password: "",
            roomType: RoomTypeEnum.DM
        });

        if (!response.data) {
            setErrorText(response.error);
            return false;
        }

        dispatch(updateUser(response.data));
        // setSuccessText("User added successfully");
        dispatch(closeChatRoomCreationModal())
        return false;
    }

    useEffect(() => {
        setErrorText("");
        setSuccessText("");
    }, [login]);

    return (
        <div className={"room_creation " + className}>
            <h2>Add a user</h2>
            <TextInput id="" text={login} setText={setLogin} type="text" name="" placeholder="Login" />
            {
                errorText ?
                    <p className="error_text">{errorText}</p>
                    :
                    <p className="success_text">{successText}</p>
            }
            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">
                    Create a group chat
                </p>
                <Button onClick={handleRoomCreation}>Next</Button>
            </div>
        </div>
    );
}