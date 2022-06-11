import UsersList, { UserListTypeEnum } from "./usersList";

interface Props {
    className: string;
    swap: () => void;
}

export default function AddFriend({ className, swap }: Props) {

    return (
        <div className={"room_creation " + className}>
            <h2>Manage relations</h2>
            <UsersList type={UserListTypeEnum.RELATIONS} />
            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">
                    Create a group chat
                </p>
            </div>
        </div>
    );
}