import { useState, useCallback, useEffect } from "react";

// ─── Mock users for UI demonstration ─────────────────────────────────────────
const MOCK_USERS = [
  {
    id: "u1",
    name: "Rajesh Kumar Singh",
    email: "rajesh.singh@bihar.gov.in",
    role: "L1 Field Officer",
    avatar: "RK",
    status: "ACTIVE",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "priya.sharma@bihar.gov.in",
    role: "CCE Agent",
    avatar: "PS",
    status: "ACTIVE",
  },
  {
    id: "u3",
    name: "Arun Kumar Mishra",
    email: "arun.mishra@bihar.gov.in",
    role: "L2 Supervisory Officer",
    avatar: "AM",
    status: "ACTIVE",
  },
  {
    id: "u4",
    name: "Sunita Devi",
    email: "sunita.devi@bihar.gov.in",
    role: "CC Supervisor",
    avatar: "SD",
    status: "ACTIVE",
  },
  {
    id: "u5",
    name: "Ramanuj Prasad",
    email: "ramanuj.prasad@bihar.gov.in",
    role: "SUDA Administrator",
    avatar: "RP",
    status: "ACTIVE",
  },
  {
    id: "u6",
    name: "Kavita Singh",
    email: "kavita.singh@bihar.gov.in",
    role: "Division Admin",
    avatar: "KS",
    status: "ACTIVE",
  },
  {
    id: "u7",
    name: "Mohan Lal",
    email: "mohan.lal@bihar.gov.in",
    role: "ULB Admin",
    avatar: "ML",
    status: "ACTIVE",
  },
  {
    id: "u8",
    name: "Deepa Kumari",
    email: "deepa.kumari@bihar.gov.in",
    role: "CCE Agent",
    avatar: "DK",
    status: "ACTIVE",
  },
  {
    id: "u9",
    name: "Vijay Shankar",
    email: "vijay.shankar@bihar.gov.in",
    role: "L1 Field Officer",
    avatar: "VS",
    status: "ACTIVE",
  },
  {
    id: "u10",
    name: "Rekha Pandey",
    email: "rekha.pandey@bihar.gov.in",
    role: "CC Supervisor",
    avatar: "RP",
    status: "ACTIVE",
  },
];

const CURRENT_USER_ID = "me";

// ─── Mock seed messages ───────────────────────────────────────────────────────
const SEED_MESSAGES = {
  [`me_u1`]: [
    {
      id: "m1",
      fromUserId: "u1",
      toUserId: "me",
      content:
        "Namaste Sir, I wanted to update you on the complaint filed by Mrs. Sharma.",
      createdAt: new Date(Date.now() - 3600_000 * 2).toISOString(),
      attachments: [],
    },
    {
      id: "m2",
      fromUserId: "me",
      toUserId: "u1",
      content: "Yes Rajesh, please go ahead.",
      createdAt: new Date(Date.now() - 3600_000 * 2 + 60_000).toISOString(),
      attachments: [],
    },
    {
      id: "m3",
      fromUserId: "u1",
      toUserId: "me",
      content:
        "The field visit was conducted yesterday. Water supply issue has been resolved. Should I close the ticket?",
      createdAt: new Date(Date.now() - 3600_000 + 30_000).toISOString(),
      attachments: [],
    },
    {
      id: "m4",
      fromUserId: "me",
      toUserId: "u1",
      content: "Yes, please close it and add the resolution notes.",
      createdAt: new Date(Date.now() - 30_000).toISOString(),
      attachments: [],
    },
  ],
  [`me_u2`]: [
    {
      id: "m5",
      fromUserId: "u2",
      toUserId: "me",
      content:
        "Sir, we have received 42 new complaints today. Should I escalate the ones pending for more than 48 hrs?",
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
      attachments: [],
    },
    {
      id: "m6",
      fromUserId: "me",
      toUserId: "u2",
      content: "Yes, please escalate all complaints pending beyond 48 hours.",
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      attachments: [],
    },
  ],
};

// ─── Local Message Store ──────────────────────────────────────────────────────
const CHAT_STORE_KEY = "chat_messages_store";

const getLocalStore = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveLocalStore = (store) => {
  localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(store));
};

// Initialize seed data on first load
const initializeStore = () => {
  const store = getLocalStore();
  let changed = false;
  Object.entries(SEED_MESSAGES).forEach(([key, msgs]) => {
    if (!store[key]) {
      store[key] = msgs;
      changed = true;
    }
  });
  if (changed) saveLocalStore(store);
};

initializeStore();

// ─── useChatUsers ─────────────────────────────────────────────────────────────
export const useChatUsers = (search = "") => {
  const filtered = MOCK_USERS.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  return {
    data: filtered,
    isLoading: false,
    error: null,
  };
};

// ─── useLocalChatMessages ─────────────────────────────────────────────────────
export const useLocalChatMessages = (currentUserId, selectedUserId) => {
  const conversationKey =
    currentUserId && selectedUserId
      ? [currentUserId, selectedUserId].sort().join("_")
      : null;

  const [messages, setMessages] = useState(() => {
    if (!conversationKey) return [];
    const store = getLocalStore();
    return store[conversationKey] || [];
  });

  useEffect(() => {
    if (!conversationKey) {
      setMessages([]);
      return;
    }
    const store = getLocalStore();
    setMessages(store[conversationKey] || []);
  }, [conversationKey]);

  const sendMessage = useCallback(
    (text, attachments = []) => {
      if (!conversationKey || !currentUserId) return;
      const newMsg = {
        id: `msg_${Date.now()}`,
        fromUserId: currentUserId,
        toUserId: selectedUserId,
        content: text,
        attachments: attachments.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          url: URL.createObjectURL(f),
        })),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [...prev, newMsg];
        const store = getLocalStore();
        store[conversationKey] = updated;
        saveLocalStore(store);
        return updated;
      });
    },
    [conversationKey, currentUserId, selectedUserId],
  );

  return { messages, sendMessage };
};

// ─── Current user (mock for UI) ───────────────────────────────────────────────
export const CURRENT_USER = { id: CURRENT_USER_ID, name: "You", avatar: "Me" };

export const getLoggedInUserId = () => {
  try {
    const token =
      localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id || payload?.userId || payload?.sub || null;
  } catch {
    return null;
  }
};

export const normalizedUserList = (data = [], currentUserId) => {
  // const x = {
  //   _id: "6a55cf96f2d9fd522fe8f610",
  //   participants: [
  //     {
  //       _id: "6a4cd72ecca0894bf179398e",
  //       name: "Updated Name",
  //       email: "admin@example.com",
  //       status: "ACTIVE",
  //       isBreak: false,
  //     },
  //     {
  //       _id: "6a523f56478b1301a8b5e00b",
  //       name: "QWER",
  //       email: "niraha90611@bevriz.com",
  //       status: "ACTIVE",
  //       isBreak: false,
  //     },
  //   ],
  //   unreadCounts: {
  //     "6a523f56478b1301a8b5e00b": 2,
  //     "6a4cd72ecca0894bf179398e": 1,
  //   },
  //   createdAt: "2026-07-14T05:56:38.687Z",
  //   updatedAt: "2026-07-14T06:25:28.411Z",
  //   __v: 0,
  //   lastMessage: {
  //     _id: "6a55d65894b0ff8468ca75c0",
  //     conversation: "6a55cf96f2d9fd522fe8f610",
  //     sender: "6a4cd72ecca0894bf179398e",
  //     type: "IMAGE",
  //     content: "hai this msg",
  //     fileUrl:
  //       "/uploads/chats/6a55cf96f2d9fd522fe8f610/file-1784010327487-1591.webp",
  //     fileName:
  //       "1780471789461-1774441161240-Screenshot 2026-03-20 151640.png_large-1.webp.webp",
  //     readBy: ["6a4cd72ecca0894bf179398e"],
  //     createdAt: "2026-07-14T06:25:28.238Z",
  //     updatedAt: "2026-07-14T06:25:28.238Z",
  //     __v: 0,
  //   },
  // };
  const normalized = data.map((item) => {
    const user = item.participants.find((v) => v._id !== currentUserId);
    return {
      _id: item?._id,
      user: {
        ...user,
        name: user.name || "-",
        email: user.email || "",
        status: user.status || "",
        isBreak: user.isBreak || false,
        role : user?.role?.designationEnglish,
      },
      unreadCounts: item?.unreadCounts[user?._id],
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
      __v: item?.__v,
      lastMessage: item?.lastMessage,
      apiData : item,
    };
  });
  return normalized;
};
