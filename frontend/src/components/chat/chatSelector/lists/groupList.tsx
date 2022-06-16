import { useEffect, useState } from "react";
import { getAllGroups } from "services/group.api.service";
import Group from "src/shared/interfaces/group.interface";
import './usersList.scss';
import './groupList.scss';
import Button from "assets/Button/Button";

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
        <div id="join_group_list" >
            {
                groups.length > 0 &&
                groups.map((group: Group, index: number) =>
                    <div key={index} className="join_group_list_item">
                        <img className="join_group_list_item_image" src={group.groupAvatar} alt="" />
                        <p>{group.name}</p>
                        <Button onClick={async () => { return onClick(group) }}>Join</Button>
                    </div>
                )
            }
            {
                groups.length <= 0 &&
                <p>No groups yet...</p>
            }
        </div >
    );
}