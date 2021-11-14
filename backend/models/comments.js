import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");
export const commentFactory = (text, userId, parentId) => {
  return {
    text,
    userId,
    parentId,
    dateCreated: new Date(),
    points: 0,
  };
};

export const createCommentDiv = (comment, user, document, isReply) => {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");

  const commentHeadingDiv = document.createElement("div");
  commentHeadingDiv.classList.add("comment-heading");

  commentDiv.appendChild(commentHeadingDiv);
  const span = document.createElement("span");

  const usernameLink = document.createElement("a");
  usernameLink.innerHTML = user.username + "&nbsp;";

  usernameLink.classList.add("commenter-username");
  usernameLink.href = `/user/${user.username}`;
  span.appendChild(usernameLink);

  const timeCommented = document.createElement("span");
  timeCommented.classList.add("time-commented");
  timeCommented.innerHTML = timeAgo.format(comment.dateCreated);
  span.appendChild(timeCommented);
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = "collapsible";
  checkBox.classList.add("toggle", "collapsible-input");
  span.appendChild(checkBox);
  const label = document.createElement("label");
  label.htmlFor = "collapsible";
  label.classList.add("lbl-toggle");

  span.appendChild(label);
  const collapsibleContent = document.createElement("div");
  collapsibleContent.classList.add("collapsible-content");

  const innerContent = document.createElement("div");
  innerContent.classList.add("content-inner");
  const commentPTag = document.createElement("p");
  commentPTag.innerHTML = comment.text;
  innerContent.appendChild(commentPTag);

  if (isReply) {
    // make form here
    const commentForm = document.createElement("form");
    commentForm.classList.add("comment-form");
    commentForm.id = "comment-form";
    commentForm.method = "post";
    commentForm.action = `createreply?parent=${comment._id}&user=${"jim"}`;
    const textArea = document.createElement("textarea");
    textArea.id = "comment";
    textArea.name = "comment";
    textArea.rows = 7;
    textArea.cols = 80;
    commentForm.appendChild(textArea);
    commentForm.appendChild(document.createElement("br"));
    commentForm.appendChild(document.createElement("br"));

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.appendChild(document.createTextNode("add reply"));
    commentForm.appendChild(submitButton);
    innerContent.appendChild(commentForm);
  } else {
    const replyLink = document.createElement("a");
    replyLink.href = `/reply?parent=${comment._id}`;
    replyLink.appendChild(document.createTextNode("reply"));
    innerContent.appendChild(replyLink);
  }
  collapsibleContent.appendChild(innerContent);
  span.appendChild(collapsibleContent);
  commentHeadingDiv.appendChild(span);

  return commentDiv;
};
