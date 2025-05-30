import useGetChats from "../hooks/useGetchats.jsx";
import useGetMessages from "../hooks/useGetmessages.jsx";
import useListenMessages from "../hooks/useListenmessages.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import MessageInput from "../components/MessageInput.jsx";
import useGetFriends from "../hooks/useGetfriends.jsx";
import useGetrequests from "../hooks/useGetrequests.jsx";
import useUpdateuser from "../hooks/useUpdateuser.jsx";
const home = () => {
  useGetChats();
  useGetMessages();
  useListenMessages();
  useGetFriends();
  useGetrequests();
  useUpdateuser();
  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMessages />
          <MessageInput />
        </div>
      </div>
    </div>
  )
}

export default home