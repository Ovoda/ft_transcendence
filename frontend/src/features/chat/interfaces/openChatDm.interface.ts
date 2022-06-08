import UserRelation from "src/shared/interfaces/userRelation";


export default interface OpenChatDm {
    payload: {
        relation: UserRelation;
        messages: any[];
    },
    type: string;
}