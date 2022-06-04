import { useState } from "react";
import { RoomTypeEnum } from "enums/RoomType.enum";
import TextInput from "../../../assets/TextInput/TextInput";
import { createRoom } from "services/api.service";

export default function RoomCreation() {

    /** Variables */
    const [name, setName] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    function handleRoomCreation() {
        createRoom({
            name,
            userIds: [userId],
            password: "",
            roomType: RoomTypeEnum.DM
        });
    }

    return (
        <>
            <TextInput id="" text={name} setText={setName} type="text" name="" placeholder="room name" />
            <TextInput id="" text={userId} setText={setUserId} type="text" name="" placeholder="user" />
            <button onClick={handleRoomCreation}></button>
        </>
    );
}