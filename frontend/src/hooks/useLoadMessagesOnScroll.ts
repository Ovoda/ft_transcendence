import { addMessageFromBack } from "features/chat/chat.slice";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "services/api.service";
import { Store } from "src/app/store";

interface Props {
    firstMessage: string;
    setFirstMessage: Dispatch<SetStateAction<string>>;
    scrolledToTop: boolean;
}

export default function useLoadMessagesOnScroll({ firstMessage, setFirstMessage, scrolledToTop }: Props) {

    /** Global data */
    const { chat } = useSelector((store: Store) => store);

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchPreviousMessages() {
            if (chat.currentRelation) {
                const { messages } = await getMessages(firstMessage);
                if (messages)
                    dispatch(addMessageFromBack(messages));
            } else if (chat.currentRole) {
                const { messages } = await getMessages(firstMessage, chat.currentRole?.id);
                if (messages)
                    dispatch(addMessageFromBack(messages));
            }
        }
        if (scrolledToTop === true && firstMessage) {
            fetchPreviousMessages();
        }
    }, [scrolledToTop]);

    useEffect(() => {
        if (chat.messages.length > 0) {
            setFirstMessage(chat.messages[0].id as string);
        }
    }, [chat.messages]);
}