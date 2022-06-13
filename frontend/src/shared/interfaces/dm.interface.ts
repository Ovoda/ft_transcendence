import UserRelation from "./userRelation";

/**
 * @interface Dm
 * @field content: string - text content of the message
 * @field from: string - sender of the message
 * @field date: string - date of message creation
 * @field room: string - room ID where message should be sent
 */
export default interface Dm {
    id?: string;
    date: string;
    username: string;
    avatar: string;
    userId: string;
    content: string;
    relation: UserRelation;
}