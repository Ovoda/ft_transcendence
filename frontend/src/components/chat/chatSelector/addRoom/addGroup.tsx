import { ChangeEvent, useEffect, useState } from "react";
import TextInput from "../../../../assets/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import Button from "assets/Button/Button";
import { closeChatRoomCreationModal } from "features/chat/chat.slice";
import { createRoom, getAllRoles, getUserData } from "services/api.service";
import { updateUserData } from "features/user/user.slice";
import UsersList, { UserListTypeEnum } from "../lists/usersList";
import UpdateAvatar from "src/components/user/updateUserAvatar";
import { uploadGroupAvatar } from "services/image.api.service";
import Group from "src/shared/interfaces/group.interface";
import { setRoles } from "features/roles/roles.slice";
import CreateRoomDto from "services/interfaces/CreateRoom.dto";

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
    const [groupAvatar, setGroupAvatar] = useState<File | null>(null);

    /** Tools */
    const dispatch = useDispatch();

    function addUserToRoom(userId: string) {

        if (users.includes(userId)) {
            return;
        }

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

		let dto: CreateRoomDto = (password !== "") ?
			{
				name: groupName,
				ids: users,
				password: password
			} :
			{
				name: groupName,
				ids: users
			};


        const { data, error }:{ data: Group | null, error: string } = await createRoom(dto);

        if (error) {
            setErrorText(error);
            return false;
        }

        if (groupAvatar)
            await uploadGroupAvatar(groupAvatar, data?.id as string);

        const { userData } = await getUserData();

        if (!userData) return false;
        dispatch(updateUserData(userData));

        const { userRoles } = await getAllRoles();
        if (!userRoles) return false;
        dispatch(setRoles(userRoles));

        dispatch(closeChatRoomCreationModal());
        return false;
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null || event.target.files.length <= 0) return;
        const imageType = /^image\//;

        if (!imageType.test(event.target.files[0].type)) {
            setErrorText("Avatar must be an image");
            return;
        }
        setErrorText("");
        setGroupAvatar(event.target.files[0]);
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
                    <input type="file" name="avatar" id="avatar_input" onChange={onFileChange} />
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
                <UsersList type={UserListTypeEnum.GROUP} onClick={addUserToRoom} addedUsers={users} />
            }

            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">Join group</p>
                <Button onClick={handleRoomCreation}>Next</Button>
            </div>
        </div>
    );
}