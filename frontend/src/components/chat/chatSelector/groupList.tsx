import Button from "assets/Button/Button";
import UserData from "features/user/interfaces/user.interface";
import { useEffect, useState } from "react";
import { getAllGroups, getAllUsers } from "services/api.service";
import Group from "src/shared/interfaces/group.interface";
import { BlockAddButtons } from "./blockAddButtons";
import './usersList.scss';

interface Props {
    onClick?: any;
}

export default function GroupList({ onClick }: Props) {

    /** Variables */
    const [groups, setGroups] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAllGroups() {
            const { groups, error } = await getAllGroups();
            if (error !== "") {
                return;
            }
            setGroups(groups);
        }
        fetchAllGroups();
    }, []);

    return (
        <div className="users_list" >
            {
                groups &&
                groups.map((group: Group, index: number) =>
                    <div key={index} className="users_list_item">
                        <img src="https://42.fr/wp-content/uploads/2021/08/42.jpg" alt="" />
                        <p>{group.name}</p>
                    </div>
                )
            }
        </div >
    );
}