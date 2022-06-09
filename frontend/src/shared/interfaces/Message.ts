import UserRelation from "./userRelation";

/**
 * @interface Message
 * @field content: string - text content of the message
 * @field from: string - sender of the message
 * @field date: string - date of message creation
 * @field room: string - room ID where message should be sent
 */
export default interface Message {
    id: string;
    date: string;
    login: string;
    group: string;
    avatar: string;
    content: string;
    relation: UserRelation;
}