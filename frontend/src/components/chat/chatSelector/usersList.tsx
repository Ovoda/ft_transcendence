import Button from "assets/Button/Button";
import UserData from "features/user/interfaces/user.interface";
import { useEffect, useState } from "react";
import { addFriend, getAllUsers } from "services/api.service";
import './usersList.scss';

export default function UsersList() {

    /** Variables */
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAllUsers() {
            const response = await getAllUsers(10, 1);
            if (response.error !== "") {
                return;
            }
            setUsers(response.data);
        }
        fetchAllUsers();
    }, []);

    async function handleAddFriend(userId: string) {
        const response = await addFriend(userId);
        console.log(response);
        return false;
    }

    return (
        <div id="users_list">
            {
                users &&
                users.map((user: UserData, index: number) =>
                    <div key={index} className="users_list_item">
                        <img className="users_list_item_img" src={user.avatar} alt={user.login + "'s avatar"} />
                        <p>{user.login}</p>
                        <Button onClick={async () => { return handleAddFriend(user.id) }}>+</Button>
                        <Button id="block_button" onClick={async () => { return handleAddFriend(user.id) }}>x</Button>
                    </div>
                )
            }
        </div>
    );
}