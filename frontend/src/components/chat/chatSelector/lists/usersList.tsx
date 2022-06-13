import Button from "assets/Button/Button";
import UserData from "features/user/interfaces/user.interface";
import { useEffect, useState } from "react";
import { getAllUsers } from "services/api.service";
import { BlockAddButtons } from "../addRoom/blockAddButtons";
import './usersList.scss';

export const enum UserListTypeEnum {
    RELATIONS = "RELATIONS",
    GROUP = "GROUP",
}

interface Props {
    type: UserListTypeEnum;
    onClick?: any;
}

export default function UsersList({ type, onClick }: Props) {

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
                        {
                            type === UserListTypeEnum.RELATIONS &&
                            <BlockAddButtons selectedUser={user} />
                        }
                        {
                            type === UserListTypeEnum.GROUP &&
                            <Button onClick={async () => { return onClick(user.id) }}>Add</Button>
                        }
                    </div>
                )
            }
        </div >
    );
}