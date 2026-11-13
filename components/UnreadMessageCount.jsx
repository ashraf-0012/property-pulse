import { useGlobalContext } from "@/context/GlobalContext";

const UnreadMessageCount = () => {
  const { unreadCount } = useGlobalContext();
  return <div>{unreadCount}</div>;
};

export default UnreadMessageCount;
