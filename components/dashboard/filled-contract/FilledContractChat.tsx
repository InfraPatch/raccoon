import ChatBubble from '@/components/common/chat-bubble/ChatBubble';
import config from '@/config';
import { IChatMessage } from '@/db/models/chat/ChatMessage';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import apiService from '@/services/apis';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MessageCircle, Send, X } from 'react-feather';

import io, { Socket } from 'socket.io-client';
import { Howl } from 'howler';
import isMobile from 'is-mobile';

import { useBodyScrollbar } from '@/hooks/useBodyScrollbar';
import { useTranslation } from 'react-i18next';

export interface FilledContractChatProps {
  ironSessionValue: string;
  filledContract: IFilledContract;
}

interface MessageEvent {
  message: IChatMessage;
}

const notificationHowl = new Howl({
  src: ['/sounds/notification.ogg'],
  loop: false,
});

const FilledContractChat = ({
  ironSessionValue,
  filledContract,
}: FilledContractChatProps) => {
  const { t } = useTranslation('dashboard');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
  const [requestErrored, setRequestErrored] = useState<boolean>(false);
  const [socketReady, setSocketReady] = useState<boolean>(false);

  const [displayChat, setDisplayChat] = useState<boolean>(false);

  const [isMessageBoxFocused, setIsMessageBoxFocused] =
    useState<boolean>(false);
  const [messageBoxValue, setMessageBoxValue] = useState<string>('');

  const [loggedInUser] = useCurrentUser();

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setDisplayChat((current) => !current);

  const { lockBody, unlockBody } = useBodyScrollbar();

  async function refreshChatMessages() {
    setRequestInProgress(true);

    try {
      const res =
        await apiService.filledContracts.getFilledContractChatMessages(
          filledContract.id,
        );

      setMessages(res.messages);
    } catch (err) {
      console.error(err);
      setRequestErrored(true);
    } finally {
      setRequestInProgress(false);
    }
  }

  async function prepareSocket() {
    if (requestErrored || socketReady) {
      return;
    }

    const instance = io(config.websocket.serverUrl, {
      extraHeaders: {
        'Iron-Session': ironSessionValue,
      },
    });

    instance.on('connect', () => {
      console.log('Connected to socket server');
      setSocketReady(true);

      instance.emit('join', {
        filledContractId: filledContract.id,
      });
    });

    instance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setSocketReady(false);
    });

    instance.on('chat-message', ({ message }: MessageEvent) => {
      setMessages((current) => [...current, message]);

      if (message.user?.id !== loggedInUser?.id && !isMessageBoxFocused) {
        notificationHowl.play();
      }
    });

    setSocket(instance);
  }

  const onMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!socket) {
      return;
    }

    const message = messageBoxValue.trim();

    if (message.length === 0) {
      return;
    }

    socket.emit('chat-message', {
      filledContractId: filledContract.id,
      message,
    });

    setMessageBoxValue('');

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  async function prepare() {
    await refreshChatMessages();
    await prepareSocket();
  }

  useEffect(() => {
    prepare();

    return () => {
      socket?.emit('leave', {
        filledContractId: filledContract.id,
      });

      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (displayChat) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (isMobile()) {
      if (displayChat) {
        lockBody();
        console.log('locked');
      } else {
        unlockBody();
        console.log('unlocked');
      }
    }
  }, [displayChat]);

  if (!socketReady || requestInProgress || requestErrored) {
    return <></>;
  }

  if (!displayChat) {
    return (
      <div className="fixed bottom-8 left-10 md:left-auto md:right-10">
        <button
          className="rounded-full bg-accent text-white w-12 h-12 flex justify-center items-center shadow-md"
          onClick={toggleChat}
        >
          <MessageCircle />
        </button>
      </div>
    );
  }

  const messageSenderSameAsPrevious = (idx: number) => {
    if (idx === 0) {
      return false;
    }

    return messages[idx].user?.id === messages[idx - 1].user?.id;
  };

  const messageSenderSameAsNext = (idx: number) => {
    if (idx === messages.length - 1) {
      return false;
    }

    return messages[idx].user?.id === messages[idx + 1].user?.id;
  };

  return (
    <div className="chatbox z-50 fixed md:h-[480px] md:w-80 bg-secondary bottom-0 right-0 top-0 left-0 md:right-8 md:left-auto md:top-auto md:rounded-t-lg shadow-md overflow-hidden flex flex-col">
      <div
        className="bg-accent text-white px-6 md:px-4 py-4 md:py-2 font-bold flex justify-between cursor-pointer"
        onClick={toggleChat}
      >
        <div>{t('contracts.data.chat')}</div>

        <div className="hidden md:block">
          <ChevronDown />
        </div>

        <div className="block md:hidden">
          <X />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {messages.map((message, idx) => (
          <ChatBubble
            key={message.uuid}
            message={message.message}
            user={message.user}
            isSelf={message.user?.id === loggedInUser?.id}
            showAvatar={!messageSenderSameAsNext(idx)}
            showName={!messageSenderSameAsPrevious(idx)}
          />
        ))}

        <div ref={chatBottomRef} />
      </div>

      <form
        className="flex m-0 px-4 py-2 items-center gap-2"
        onSubmit={onMessageSubmit}
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-field text-sm"
          placeholder="Type a message..."
          value={messageBoxValue}
          onChange={(e) => setMessageBoxValue(e.target.value)}
          onFocus={() => setIsMessageBoxFocused(true)}
          onBlur={() => setIsMessageBoxFocused(false)}
        />

        <button
          type="submit"
          className="rounded-full w-10 h-10 bg-accent text-white text-sm"
        >
          <Send width="16" height="16" className="mx-auto" />
        </button>
      </form>
    </div>
  );
};

export default FilledContractChat;
