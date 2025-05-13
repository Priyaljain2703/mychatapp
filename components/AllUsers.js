import { useEffect, useState } from "react";
import { database, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import Link from "next/link";
import '../src/app/globals.css'

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data).map(([username, details]) => ({
          username,
          email: details.email,
          lastMessage: ""
        }));

        const updatedUsers = [...userList];

        userList.forEach((user, index) => {
          const chatId = [currentUser.displayName, user.username].sort().join("_");
          const messagesRef = ref(database, `PersonalChats/${chatId}`);

          onValue(messagesRef, (snapshot) => {
            const messages = snapshot.val();
            if (messages) {
              const sorted = Object.entries(messages)
                .map(([key, val]) => ({ ...val }))
                .sort((a, b) => b.timestamp - a.timestamp);

              updatedUsers[index].lastMessage = sorted[0]?.text || "No messages yet";
            } else {
              updatedUsers[index].lastMessage = "No messages yet";
            }
            setUsers([...updatedUsers]);
          });
        });
      }
    });
  }, [currentUser]);

  return (
    <div className="w-[25vw] border-r-2 border-[#dcdcdc] bg-[#fff] overflow-y-auto">
      <h2 className="text-[16px] font-semibold m-2">Messages</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="hover:bg-[#ededed] m-2 border rounded-sm border-[#dcdcdc] bg-[#f8f7f7]">
            <Link href={`/chat/${encodeURIComponent(user.username)}`}>
              <div className="flex gap-2 items-center px-2">
                <div className="py-1">
                  <p className="cursor-pointer hover:underline font-semibold text-[#3f3f3f]">
                    {user.username}
                  </p>
                  <span className="text-[14px] text-[#6d6d6d] font-normal">
                    {user.lastMessage}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllUsers;
