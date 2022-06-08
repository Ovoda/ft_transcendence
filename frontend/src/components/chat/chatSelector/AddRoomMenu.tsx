import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import AddFriend from "./AddFriend";
import './AddRoomMenu.scss';
import AddGroup from "./AddGroup";
import close from 'images/close.png';
import { closeChatRoomCreationModal } from "features/chat/chat.slice";

export default function AddRoomMenu() {

    /** Global data */
    const { user, chat } = useSelector((store: Store) => store);

    /** Variables */
    const [isSwapped, setIsSwapped] = useState<boolean>(true);
    const [pos, setPos] = useState<string>("");

    /** Tools */
    const dispatch = useDispatch();

    function swapCreation() {
        setPos((pos: string) => {
            return pos === "right" ? "left" : "right";
        });
    }

    if (chat.displayRoomCreationModal) {
        return (
            <div id="room_creation_modal_container">
                <div id="room_creation_menu" >
                    <img id="close_button_img" onClick={() => dispatch(closeChatRoomCreationModal())} src={close} alt="Close modal icon" />
                    <div id="room_creation_container">
                        <AddFriend className={pos} swap={swapCreation} />
                        <AddGroup className={pos} swap={swapCreation} />
                    </div>

                </div>
            </div>
        );
    }
    return (<></>);
}