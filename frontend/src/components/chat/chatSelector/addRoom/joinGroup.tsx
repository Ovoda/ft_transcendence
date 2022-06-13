import { useEffect, useState } from "react";
import { Store } from "src/app/store";
import GroupList from "../lists/groupList";
import Group from "src/shared/interfaces/group.interface";
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import { useSelector } from "react-redux";
import { checkGroupProtection, joinGroup } from "services/group.api.service";

interface Props {
    className: string;
    swap: () => void;
}

export default function JoinGroup({ className, swap }: Props) {

    /** Global data */
    const { user } = useSelector((store: Store) => store);

    /** Variables */
    const [password, setPassword] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");
    const [successText, setSuccessText] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupIsProtected, setGroupIsProtected] = useState<boolean>(false);

    async function handleJoinGroup() {
        if (!selectedGroup) return false;

        const { response, error } = await joinGroup(selectedGroup.id, password);
        if (error) {
            setErrorText(error);
        } else if (response) {
            setSuccessText("Group joined");
        }

        return false;
    }

    useEffect(() => {
        setErrorText("");
        setSuccessText("");
    }, [password]);

    useEffect(() => {
        if (!selectedGroup) return;

        async function fetchGroupProtection() {
            const { isProtected, error } = await checkGroupProtection(selectedGroup?.id as string);
			console.log("isPro", isProtected, "error", error);
            if (!error && isProtected === false) {
                handleJoinGroup();
            } else if (!error && isProtected) {
                setGroupIsProtected(true);
            } else {
                console.log(error);
            }
        }
        fetchGroupProtection();
    }, [selectedGroup]);

    return (
        <div className={"room_creation " + className}>
            <h2>Join group</h2>
            {
                groupIsProtected ?
                    <>
                        <TextInput type="password" text={password} setText={setPassword} placeholder="Password" />
                        <Button onClick={handleJoinGroup}>Next</Button>
                    </>
                    :
                    <GroupList onClick={setSelectedGroup} />
            }
            <p className="error_text">{errorText}</p>
            <p className="success_text">{successText}</p>
            <div id="room_creation_modal_nav">
                <p onClick={swap} className="link">Create group</p>
            </div>
        </div>
    );
}