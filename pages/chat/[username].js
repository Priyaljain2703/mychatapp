import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { database, auth } from "../../firebase";
import { ref, onValue, set, remove, update } from "firebase/database";
import { format } from "date-fns";
import Navbar from "../../components/Navbar";
import AllUsers from "../../components/AllUsers";
import '../../src/app/globals.css'

export default function Chat() {
  const router = useRouter();
  const { username } = router.query;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [selectedMessageKey, setSelectedMessageKey] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!username || !currentUser) return;

    const chatId = getChatId(currentUser.displayName, username);
    const messagesRef = ref(database, `PersonalChats/${chatId}`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgList = Object.entries(data).map(([key, value]) => ({
          ...value,
          key,
        }));
        msgList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });
  }, [username, currentUser]);

  const getChatId = (user1, user2) => {
    return [user1, user2].sort().join("_");
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const chatId = getChatId(currentUser.displayName, username);
    const timestampKey = format(new Date(), "yyyy-MM-dd HH:mm:ss_SSSSSS");

    const messageRef = ref(database, `PersonalChats/${chatId}/${timestampKey}`);

    const newMessage = {
      sender: currentUser.displayName,
      text: messageInput,
      timestamp: Date.now(),
    };

    set(messageRef, newMessage);

   
    const lastMessageRef = ref(database, `LastMessages/${chatId}`);
    set(lastMessageRef, newMessage);

    setMessageInput("");
  };

  const deleteMessage = (key) => {
    const chatId = getChatId(currentUser.displayName, username);
    const msgRef = ref(database, `PersonalChats/${chatId}/${key}`);
    remove(msgRef);
  };

  const startEditing = (key, currentText) => {
    setEditingKey(key);
    setEditedText(currentText);
  };

  const saveEditedMessage = (key) => {
    if (!editedText.trim()) return;
    const chatId = getChatId(currentUser.displayName, username);
    const msgRef = ref(database, `PersonalChats/${chatId}/${key}`);

    update(msgRef, { text: editedText });
    setEditingKey(null);
    setEditedText("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da]">
      <div className="flex bg-[#fff] w-[96vw] h-[42vw] rounded-sm shadow-lg">
        <Navbar />
        <AllUsers />
        <div className="w-full">
          <h2 className="p-3 border-b-2 border-[#dcdcdc] font-semibold text-[#4d4d4d]">
            Chat with {username}
          </h2>
          <div className="flex flex-col space-y-4 overflow-y-auto flex-grow px-4 h-[35vw] pt-3">
            {messages.map((msg, i) => {
  const isSender = msg.sender === currentUser?.displayName;
  const isSelected = selectedMessageKey === msg.key;

  return (
    <div
      key={i}
      className={`mb-2 flex ${isSender ? "justify-end" : "justify-start"}`}
      onClick={() =>
        isSender
          ? setSelectedMessageKey((prev) => (prev === msg.key ? null : msg.key))
          : null
      }
    >
      <div className={`flex flex-col items-${isSender ? "end" : "start"}`}>
        <div
          className={`max-w-xs px-4 py-1.5 rounded-lg cursor-pointer ${
            isSender ? "bg-[#5290e8] text-white" : "bg-[#a6d0ea] text-black"
          }`}
        >
          {editingKey === msg.key ? (
            <input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEditedMessage(msg.key);
              }}
              className="bg-white text-black p-1 rounded w-full"
              autoFocus
            />
          ) : (
            <span>{msg.text}</span>
          )}
        </div>
        <p className="text-[12px] text-gray-500 mt-1">{msg.sender}</p>

        {/* Show edit/delete only when selected */}
        {isSender && isSelected && (
          <div className="flex gap-2 mt-1 text-[12px] text-blue-500">
            {editingKey === msg.key ? (
              <>
                <button onClick={() => saveEditedMessage(msg.key)}>Save</button>
                <button onClick={() => setEditingKey(null)} className="text-red-500">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => startEditing(msg.key, msg.text)}>Edit</button>
                <button onClick={() => deleteMessage(msg.key)} className="text-red-500">Delete</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
})}

          </div>

          {/* Message Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center bg-white border-t border-gray-300 px-2 py-2"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
            />
            <button
              type="submit"
              className="ml-3 bg-[#47718a] text-white py-2 px-4 rounded-lg hover:bg-[#6a8da1] focus:outline-none focus:ring-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
