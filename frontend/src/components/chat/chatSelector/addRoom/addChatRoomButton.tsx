import { useDispatch } from "react-redux";
import { openChatRoomCreationModal } from "features/chat/chat.slice";

export default function AddChatRoomButton() {

    /** Tools */
    const dispatch = useDispatch();

    /** Opens a modal to create rooms */
    function handleRoomCreationModal() {
        dispatch(openChatRoomCreationModal());
    }

    return (
        <button onClick={handleRoomCreationModal}>Add</button>
    );
}