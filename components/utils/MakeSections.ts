import dayjs from "dayjs";
import { IDM, IChat } from "types/db";

export default function makeSections<T extends IDM | IChat>(chatList: T[]) {
  const sections: { [key: string]: T[] } = {};
  chatList.forEach((chat) => {
    const date = dayjs(chat.createdAt).format("YYYY-MM-DD");
    if (Array.isArray(sections[date])) {
      sections[date].push(chat);
    } else {
      sections[date] = [chat];
    }
  });
  return sections;
}
