import { useEffect, useState } from "react";
import { RoomTypeEnum } from "enums/RoomType.enum";
import TextInput from "../../../../assets/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import Button from "assets/Button/Button";
import { closeChatRoomCreationModal, openChatRoomCreationModal } from "features/chat/chat.slice";
import close from 'images/close.png';
import { createRoom, getUserData } from "services/api.service";
import { updateUserData } from "features/user/user.slice";
import UsersList, { UserListTypeEnum } from "../lists/usersList";

interface Props {
    className: string;
    swap: () => void;
}

export default function AddGroup({ className, swap }: Props) {

    /** Global data */
    const { user, chat } = useSelector((store: Store) => store);

    /** Variables */
    const [groupName, setGroupName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");
    const [successText, setSuccessText] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [users, setUsers] = useState<string[]>([user.id]);

    /** Tools */
    const dispatch = useDispatch();

    function addUserToRoom(userId: string) {
        setUsers((users: string[]) => {
            return [...users, userId];
        });
    }

    async function handleRoomCreation() {
        if (groupName === "") return false;

        if (step === 0) {
            setStep((step: number) => step + 1);
            return false;
        }

        const { data, error } = await createRoom({
            name: groupName,
            ids: users,
            password: password,
        });

        if (error) {
            setErrorText(error);
            return false;
        }

        const { userData } = await getUserData();
        if (!userData) return false;
        dispatch(updateUserData(userData));
        dispatch(closeChatRoomCreationModal());
        return false;
    }

    useEffect(() => {
        setErrorText("");
        setSuccessText("");
    }, [groupName, password]);

    return (
        <div className={"room_creation " + className}>
            <h2>Create a group</h2>
            {
                step === 0 &&
                <>
                    <TextInput id="" text={groupName} setText={setGroupName} type="text" name="" placeholder="Group name" />
                    <TextInput id="" text={password} setText={setPassword} type="password" name="" placeholder="Password (optional)" />
                    {
                        errorText ?
                            <p className="error_text">{errorText}</p>
                            :
                            <p className="success_text">{successText}</p>
                    }
                </>
            }

            {
                step === 1 &&
                <UsersList type={UserListTypeEnum.GROUP} onClick={addUserToRoom} />
            }

            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">Join group</p>
                <Button onClick={handleRoomCreation}>Next</Button>
            </div>
        </div>
    );
}