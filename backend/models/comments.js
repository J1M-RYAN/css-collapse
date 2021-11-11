export const commentFactory = (text, userId, parentId) => {
  return {
    text,
    userId,
    parentId,
    dateCreated: new Date(),
    points: 0,
  };
};
