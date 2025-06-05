export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id === m?.sender?._id &&
    m?.sender?._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1]?.sender?._id !== m?.sender?._id &&
      m?.sender?._id !== userId) ||
    (i === messages.length - 1 && m?.sender?._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id !== m?.sender?._id &&
    m?.sender?._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[i]?.sender?._id !== userId
  );
};

export const isSameUser = (messages, m, i) => {
  return (
    i > 0 &&
    messages[i - 1]?.sender?._id === m?.sender?._id
  );
};

export const getSender = (loggedUser, users) => {
  if (!loggedUser || !Array.isArray(users) || users.length !== 2) return "Unknown User";
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
  if (!Array.isArray(users) || users.length !== 2 || !loggedUser) return null;
  return users[0]?._id === loggedUser._id ? users[1] : users[0];
};
