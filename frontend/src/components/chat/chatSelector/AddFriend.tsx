import { useEffect, useState } from "react";
import { RoomTypeEnum } from "enums/RoomType.enum";
import { createRoom } from "services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { updateUser } from "../../../features/user/user.slice";
import Button from "assets/Button/Button";
import { closeChatRoomCreationModal } from "features/chat/chat.slice";
import UsersList from "./usersList";

interface Props {
    className: string;
    swap: () => void;
}

export default function AddFriend({ className, swap }: Props) {

    return (
        <div className={"room_creation " + className}>
            <h2>Add a user</h2>
            <UsersList />
            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">
                    Create a group chat
                </p>
            </div>
        </div>
    );
}