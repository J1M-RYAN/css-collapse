export const userFactory = (username) => {
  return {
    username,
    dateJoined: new Date(),
    comments: [],
  };
};
