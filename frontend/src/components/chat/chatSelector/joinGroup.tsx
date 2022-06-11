import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import Button from "assets/Button/Button";
import { closeChatRoomCreationModal } from "features/chat/chat.slice";
import { createRoom } from "services/api.service";
import { updateUser } from "features/user/user.slice";
import GroupList from "./groupList";

interface Props {
    className: string;
    swap: () => void;
}

export default function JoinGroup({ className, swap }: Props) {

    /** Global data */
    const { user } = useSelector((store: Store) => store);

    /** Variables */
    const [groupName, setGroupName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");
    const [successText, setSuccessText] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [users, setUsers] = useState<string[]>([user.id]);

    /** Tools */
    const dispatch = useDispatch();

    async function handleRoomCreation() {
        if (groupName === "") return false;

        if (step === 0) {
            setStep((step: number) => step + 1);
            return false;
        }

        const response = await createRoom({
            name: groupName,
            ids: users,
            password: password,
        });

        if (!response.data) {
            setErrorText(response.error);
            return false;
        }

        dispatch(updateUser(response.data));
        dispatch(closeChatRoomCreationModal());
        return false;
    }

    useEffect(() => {
        setErrorText("");
        setSuccessText("");
    }, [groupName, password]);

    return (
        <div className={"room_creation " + className}>
            <h2>Join group</h2>
            <GroupList onClick={async () => { return false; }} />

            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">Create group</p>
                <Button onClick={handleRoomCreation}>Next</Button>
            </div>
        </div>
    );
}