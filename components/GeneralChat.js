import React, { useState, useEffect } from 'react';
import { ref, set, push, onValue, update, remove } from 'firebase/database';
import { database, auth } from '../firebase';
import { useRouter } from 'next/router';
import '../src/app/globals.css'

const GeneralChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push('/');
    } else {
      setUser(currentUser);
    }

    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = Object.keys(data).map(id => ({ id, ...data[id] }));
      setMessages(loadedMessages);
    });
  }, [router]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        user: user.displayName,
        message,
        timestamp: new Date().toISOString(),
      };

      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);
      setMessage('');
    }
  };

  const startEditing = (msg) => {
    setEditingMessage(msg.id);
    setEditedText(msg.message);
  };

  const saveEditedMessage = async (id) => {
    if (editedText.trim()) {
      const msgRef = ref(database, `messages/${id}`);
      await update(msgRef, { message: editedText });
      setEditingMessage(null);
      setEditedText('');
    }
  };

  const deleteMessage = async (id) => {
    const msgRef = ref(database, `messages/${id}`);
    await remove(msgRef);
  };

  return (
    <div className='w-full'>
      <h1 className='p-3 border-b-2 border-[#dcdcdc] font-semibold text-[#4d4d4d]'>General Chat</h1>

      <div className="flex flex-col space-y-4 overflow-y-auto flex-grow px-4 h-[35vw] pt-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.user === user.displayName ? "justify-end" : "justify-start"}`}
            onClick={() => setSelectedMessage(selectedMessage === msg.id ? null : msg.id)}
          >
            {msg.user === user.displayName ? (
              <div className="flex flex-col items-end">
                <div className="max-w-xs px-4 py-1.5 bg-[#5290e8] text-white rounded-lg">
                  {editingMessage === msg.id ? (
                    <div className="flex">
                      <input
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditedMessage(msg.id)}
                        className="bg-white text-black p-1 rounded w-full"
                        autoFocus
                      />
                      <button onClick={() => saveEditedMessage(msg.id)} className="ml-2 text-blue-500">Save</button>
                    </div>
                  ) : (
                    <span>{msg.message}</span>
                  )}
                </div>
                <p className="text-[12px] text-gray-500 mt-1">{msg.user}</p>

                {msg.user === user.displayName && selectedMessage === msg.id && !editingMessage && (
                  <div className="flex gap-2 mt-1 text-[12px] text-blue-500">
                    <button onClick={() => startEditing(msg)}>Edit</button>
                    <button onClick={() => deleteMessage(msg.id)} className="text-red-500">Delete</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <div className="max-w-xs px-4 py-1.5 bg-[#a6d0ea] text-black rounded-lg">
                  <span>{msg.message}</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-1">{msg.user}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex items-center bg-white border-t border-gray-300 px-2 py-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
        />
        <button type="submit" className="ml-3 bg-[#47718a] text-white py-2 px-4 rounded-lg hover:bg-[#6a8da1] focus:outline-none focus:ring-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default GeneralChat;
