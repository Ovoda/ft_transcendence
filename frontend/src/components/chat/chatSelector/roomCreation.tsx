import { useState } from "react";
import { RoomTypeEnum } from "enums/RoomType.enum";
import TextInput from "../../../assets/TextInput/TextInput";
import { createDm, getUserData } from "services/api.service";
import UserData from "../../../features/user/interfaces/user.interface";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { updateUser } from "../../../features/user/user.slice";

export default function RoomCreation() {

    /** Global data */
    const user: UserData = useSelector((store: Store) => store.user);

    /** Variables */
    const [login, setLogin] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");

    /** Tools */
    const dispatch = useDispatch();

    async function handleRoomCreation() {

        if (login === user.login) {
            setErrorText("You cannot add yourself");
            return;
        }

        const userData = await createDm({
            name: login,
            logins: [user.login, login],
            password: "",
            roomType: RoomTypeEnum.DM
        });

        if (!userData) return;
        dispatch(updateUser(userData));
    }

    return (
        <>
            <TextInput id="" text={login} setText={setLogin} type="text" name="" placeholder="user" />
            <button onClick={handleRoomCreation}>Create room</button>
            <p>{errorText}</p>
        </>
    );
}