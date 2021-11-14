import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
export const postFactory = (title, link, user) => {
  const { hostname } = new URL(link);
  return {
    title,
    link,
    hostname,
    user,
    points: 0,
    dateCreated: new Date(),
  };
};

export const createPostListItem = (
  post,
  user,
  numComments,
  document,
  isListItem
) => {
  const newPostListItem = document.createElement(isListItem ? "li" : "div");
  newPostListItem.classList.add("post");
  // add space before link
  newPostListItem.appendChild(document.createTextNode("\u00A0"));

  const postLink = document.createElement("a");
  postLink.innerHTML = post.title;
  postLink.href = post.link;

  newPostListItem.appendChild(postLink);
  // add space after link
  newPostListItem.appendChild(document.createTextNode("\u00A0"));
  const postShortLink = document.createElement("a");
  postShortLink.innerHTML = `(${post.hostname})`;
  postShortLink.href = post.link;
  newPostListItem.appendChild(postShortLink);
  newPostListItem.appendChild(document.createElement("br"));

  const postSpan = document.createElement("span");
  postSpan.classList.add("post-subtext");
  const underSpan = document.createElement("span");
  const localLink = document.createElement("a");
  localLink.href = `/users/${user.username}`;
  console.log("user.username", user.username);
  localLink.appendChild(document.createTextNode(user.username));
  underSpan.appendChild(document.createTextNode(`${post.points} points by `));
  underSpan.appendChild(localLink);
  underSpan.appendChild(
    document.createTextNode(` ${timeAgo.format(post.dateCreated)} `)
  );
  postSpan.appendChild(underSpan);
  const commentsLink = document.createElement("a");
  commentsLink.href = `/post?id=${post._id}`;
  commentsLink.innerHTML = `${numComments} comments`;
  postSpan.appendChild(commentsLink);
  newPostListItem.appendChild(postSpan);
  return newPostListItem;
};
