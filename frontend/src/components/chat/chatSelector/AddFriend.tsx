import { addFriend } from "services/api.service";
import UsersList from "./usersList";

interface Props {
    className: string;
    swap: () => void;
}

export default function AddFriend({ className, swap }: Props) {

    async function handleAddFriend(userId: string) {
        await addFriend(userId);
        return false;
    }

    return (
        <div className={"room_creation " + className}>
            <h2>Add a user</h2>
            <UsersList
                firstButtonClick={handleAddFriend}
                secondButtonClick={handleAddFriend}
                firstButtonContent="Add"
                secondButtonContent="Add"
            />
            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">
                    Create a group chat
                </p>
            </div>
        </div>
    );
}