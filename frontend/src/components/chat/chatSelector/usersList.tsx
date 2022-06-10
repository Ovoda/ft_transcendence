import Button from "assets/Button/Button";
import UserData from "features/user/interfaces/user.interface";
import { ReactNode, useEffect, useState } from "react";
import { addFriend, getAllUsers } from "services/api.service";
import { Node } from "typescript";
import './usersList.scss';

interface Props {
    firstButtonClick: any;
    firstButtonContent: string;
    secondButtonClick: any;
    secondButtonContent: string;
}


export default function UsersList({ firstButtonClick, secondButtonClick, firstButtonContent, secondButtonContent }: Props) {

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

    return (
        <div className="users_list" >
            {
                users &&
                users.map((user: UserData, index: number) =>
                    <div key={index} className="users_list_item">
                        <img className="users_list_item_img" src={user.avatar} alt={user.login + "'s avatar"} />
                        <p>{user.login}</p>
                        <Button onClick={async () => { return firstButtonClick(user.id) }}>{firstButtonContent}</Button>
                        <Button onClick={async () => { return secondButtonClick(user.id) }}>{secondButtonContent}</Button>
                    </div>
                )
            }
        </div >
    );
}