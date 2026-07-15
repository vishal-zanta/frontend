

export const normalizedUserList = (data = [], currentUserId) => {
  const normalized = data.map((item) => {
    const user = item.participants.find((v) => v._id !== currentUserId);
    return {
      _id: item?._id,
      user: {
        ...user,
        name: user?.name || "-",
        email: user?.email || "",
        status: user?.status || "",
        isBreak: user?.isBreak || false,
        role: user?.role?.designationEnglish,
      },
      unreadCounts: item?.unreadCounts[currentUserId],
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
      __v: item?.__v,
      lastMessage: item?.lastMessage,
      apiData: item,
    };
  });
  return normalized;
};


export const normalizeMessage = (rawMsg, currentUserId) => {
  const senderId =
    rawMsg?.sender?._id || rawMsg?.sender || rawMsg?.senderId || "";
  return {
    id: rawMsg._id,
    fromUserId: senderId,
    toUserId: currentUserId === senderId ? rawMsg?.receiver : currentUserId,
    content: rawMsg.content || "",
    type: rawMsg.type || "TEXT",
    fileUrl: rawMsg.fileUrl,
    fileName: rawMsg.fileName,
    attachments: rawMsg.fileUrl
      ? [
          {
            url: rawMsg.fileUrl,
            name: rawMsg.fileName || "file",
            type:
              rawMsg.type === "IMAGE"
                ? "image/webp"
                : "application/octet-stream",
          },
        ]
      : [],
    createdAt: rawMsg.createdAt,
    readBy: rawMsg.readBy || [],
    senderName: rawMsg?.sender?.name,
  };
};
