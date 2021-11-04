export const postFactory = (title, link, username) => {
  const { hostname } = new URL(link);
  return {
    title,
    link,
    hostname,
    username,
    points: 0,
    dateCreated: new Date(),
    comments: [],
  };
};

export const createPostListItem = (post, document) => {
  const newPostListItem = document.createElement("li");
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
  postSpan.appendChild(
    document.createTextNode(
      `${post.points} points by ${post.username} in 2 horus | hide | `
    )
  );
  const commentsLink = document.createElement("a");
  commentsLink.href = "/post";
  commentsLink.innerHTML = `${post.comments.length} comments`;
  postSpan.appendChild(commentsLink);
  newPostListItem.appendChild(postSpan);
  return newPostListItem;
};
