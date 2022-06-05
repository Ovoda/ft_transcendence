import { useEffect, useState } from "react";
import { RoomTypeEnum } from "enums/RoomType.enum";
import TextInput from "../../../assets/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import Button from "assets/Button/Button";
import { closeChatRoomCreationModal } from "features/chat/chat.slice";
import close from 'images/close.png';

interface Props {
    className: string;
    swap: () => void;
}

export default function AddGroup({ className, swap }: Props) {

    /** Global data */
    const { user, chat } = useSelector((store: Store) => store);

    /** Variables */
    const [groupName, setGroupName] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");
    const [successText, setSuccessText] = useState<string>("");

    /** Tools */
    const dispatch = useDispatch();

    // async function handleRoomCreation() {
    //     if (login === "") return false;
    //     if (login === user.login) {
    //         setErrorText("You cannot add yourself");
    //         return false;
    //     }

    //     const response = await createDm({
    //         name: login,
    //         logins: [user.login, login],
    //         password: "",
    //         roomType: RoomTypeEnum.DM
    //     });

    //     if (!response.data) {
    //         setErrorText(response.error);
    //         return false;
    //     }

    //     dispatch(updateUser(response.data));
    //     setSuccessText("User added successfully");
    //     return false;
    // }

    // useEffect(() => {
    //     setErrorText("");
    //     setSuccessText("");
    // }, [login]);

    return (
        <div className={"room_creation " + className}>
            <h2>Create a group</h2>
            <TextInput id="" text={groupName} setText={setGroupName} type="text" name="" placeholder="Group name" />
            <TextInput id="" text={groupName} setText={setGroupName} type="password" name="" placeholder="Password (optional)" />
            {
                errorText ?
                    <p className="error_text">{errorText}</p>
                    :
                    <p className="success_text">{successText}</p>
            }
            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">Add a friend</p>
                <Button onClick={async () => { return false }}>Next</Button>
            </div>
        </div>
    );
}