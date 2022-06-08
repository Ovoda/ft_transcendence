

export default interface OpenChatRoom {
    payload: {
        roomId: string;
        roleId: string;
        messages: any[];
    },
    type: string;
}