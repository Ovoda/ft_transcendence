import UsersList, { UserListTypeEnum } from "../lists/usersList";

interface Props {
    swap: () => void;
}

export default function AddFriend({ swap }: Props) {

    return (
        <div className={"room_creation "}>
            <h2>Manage relations</h2>
            <UsersList type={UserListTypeEnum.RELATIONS} />
        </div>
    );
}