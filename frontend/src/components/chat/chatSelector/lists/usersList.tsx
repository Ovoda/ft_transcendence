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
    addedUsers?: string[];
}

export default function UsersList({ type, onClick, addedUsers }: Props) {

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


    async function handleOnclick(event: any, userId: string) {
        event.preventDefault();
        onClick(userId);
        return false;
    }

    return (
        <div className="users_list" >
            {
                users &&
                users.map((user: UserData, index: number) =>
                    <div key={index} className="users_list_item">
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <img className="users_list_item_img" src={user.avatar} alt={user.username + "'s avatar"} />
                            <p>{user.username}</p>
                        </div>
                        {
                            type === UserListTypeEnum.RELATIONS &&
                            <BlockAddButtons selectedUser={user} />
                        }
                        {
                            type === UserListTypeEnum.GROUP &&
                            <Button onClick={async (e) => handleOnclick(e, user.id)}>
                                {
                                    addedUsers?.includes(user.id) ? "Added" : "Add"
                                }
                            </Button>
                        }
                    </div>
                )
            }
        </div >
    );
}