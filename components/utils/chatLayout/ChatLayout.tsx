import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  RefObject,
  useState,
} from "react";
import gravatar from "gravatar";
import {
  Mention,
  OnChangeHandlerFunc,
  SuggestionDataItem,
} from "react-mentions";
import SendIcon from "@material-ui/icons/Send";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import autosize from "autosize";
import { IDM, IChat, IUser } from "types/db";
import { Scrollbars } from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "@components/utils/fetcher";
import {
  MentionButton,
  Header,
  ChatList,
  Section,
  ChatBox,
  InputArea,
  ToolBox,
  Form,
  DragOver,
} from "./styles";
import InviteChannelModal from "@components/modal/InviteChannelModal";
import ModalContainer from "../Modal";
import axios from "axios";
interface Props {
  nickname?: string;
  email?: string;

  onSubmit: (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  onChange: OnChangeHandlerFunc;
  placeholder: string;
  value: string;
  scrollBarRef: RefObject<Scrollbars>;
  setSize: (
    f: (size: number) => number
  ) => Promise<(IDM | IChat)[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
  channelMembersData?: IUser[];
  revalidateChannel?: () => Promise<boolean>;
  revalidateDm?: () => Promise<boolean>;
}

const ChatLayout: FC<Props> = (props) => {
  const { workspace, channel, id } = useParams<{
    workspace?: string;
    channel?: string;
    id?: string;
  }>();
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);
  const { data: memberData } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  const inputAreaRef = useRef<HTMLTextAreaElement>(null);
  const [inviteChannelOpen, setInviteChannelOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const handleOpen = useCallback(() => {
    setInviteChannelOpen(!inviteChannelOpen);
  }, [inviteChannelOpen]);
  useEffect(() => {
    if (inputAreaRef.current) {
      autosize(inputAreaRef.current);
    }
  }, [inputAreaRef.current]);
  useEffect(() => {
    if (channel) {
      localStorage.setItem(
        `${workspace}-${channel}`,
        new Date().getTime().toString()
      );
    } else if (id) {
      localStorage.setItem(
        `${workspace}-${id}`,
        new Date().getTime().toString()
      );
    }
  }, [workspace, channel, id]);
  const onKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          props.onSubmit(e);
        }
      }
    },
    [props.onSubmit]
  );
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !props.isReachingEnd) {
        props
          .setSize((prevSize) => prevSize + 1)
          .then(() => {
            const currentScoll = props.scrollBarRef.current;
            if (currentScoll) {
              currentScoll.scrollTop(
                currentScoll.getScrollHeight() - values.scrollHeight
              );
            }
          });
      }
    },
    [props.scrollBarRef, props.isReachingEnd, props.setSize]
  );
  const renderUserSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <MentionButton focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, {
              s: "20px",
              d: "retro",
            })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </MentionButton>
      );
    },
    [memberData]
  );
  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
    },
    [dragOver]
  );
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const formData = new FormData();
      console.log(e.dataTransfer);
      if (e.dataTransfer.items) {
        for (let i = 0; e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === "file") {
            const file = e.dataTransfer.items[i].getAsFile();
            if (file) {
              formData.append("image", file);
            }
          } else {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
              formData.append("image", e.dataTransfer.files[i]);
            }
          }
        }
      }
      if (channel) {
        axios
          .post(
            `/api/workspaces/${workspace}/channels/${channel}/images`,
            formData
          )
          .then(() => {
            if (props.revalidateChannel) {
              props.revalidateChannel();
            }
          });
      } else {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/images`, formData)
          .then(() => {
            if (props.revalidateDm) {
              props.revalidateDm();
            }
          });
      }
      setDragOver(false);
    },
    [
      props.revalidateDm,
      props.revalidateChannel,
      dragOver,
      workspace,
      channel,
      id,
    ]
  );

  return (
    <>
      <Header>
        {" "}
        {props.email && props.nickname ? (
          <>
            {" "}
            <img
              src={gravatar.url(props.email, { s: "30vw", d: "retro" })}
              alt={props.nickname}
            />
            <span>{props.nickname}</span>
          </>
        ) : (
          <>
            <span className="channelName">#{channel}</span>

            <div className="channelRight">
              <span className="channelMembers">
                {props.channelMembersData?.length}
              </span>
              <button type="button" onClick={handleOpen}>
                <PersonAddIcon className="buttonIcon" />
              </button>
            </div>
          </>
        )}
      </Header>
      <ChatList onDragOver={onDragOver} onDrop={onDrop}>
        <Scrollbars autoHide ref={props.scrollBarRef} onScrollFrame={onScroll}>
          <Section>{props.children}</Section>
        </Scrollbars>
        {dragOver && <DragOver>업로드</DragOver>}
      </ChatList>
      <ChatBox>
        <Form onSubmit={props.onSubmit}>
          <InputArea
            onChange={props.onChange}
            placeholder={props.placeholder}
            inputRef={inputAreaRef}
            onKeyPress={onKeydown}
            value={props.value}
            allowSuggestionsAboveCursor
          >
            <Mention
              appendSpaceOnAdd
              trigger="@"
              data={
                memberData?.map((m) => ({ id: m.id, display: m.nickname })) ||
                []
              }
              renderSuggestion={renderUserSuggestion}
            />
          </InputArea>
          <ToolBox>
            <button
              type="submit"
              style={{ border: "transparent", background: "transparent" }}
            >
              <SendIcon />
            </button>
          </ToolBox>
        </Form>
      </ChatBox>
      <ModalContainer open={inviteChannelOpen} handleClose={handleOpen}>
        <InviteChannelModal onClose={handleOpen} />
      </ModalContainer>
    </>
  );
};

export default ChatLayout;
