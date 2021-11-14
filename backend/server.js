import express from "express";
import fs from "fs";
import { JSDOM } from "jsdom";
import buildUI from "./utils/buildUI.js";
import initaliseDB from "./database-driver.js";
import { createPostListItem } from "./models/posts.js";
import { ObjectId } from "mongodb";
import { commentFactory, createCommentDiv } from "./models/comments.js";

async function main() {
  const PORT = 3000;
  const app = express();
  app.use(express.static("../ui/build"));
  app.use(express.urlencoded({ extended: true }));
  const indexHTML = fs.readFileSync("../ui/index.html").toString();
  const postHTML = fs.readFileSync("../ui/post.html").toString();
  const replyHTML = fs.readFileSync("../ui/reply.html").toString();
  buildUI();
  const client = await initaliseDB();
  const db = client.db("test");
  const postsCollection = db.collection("posts");
  const usersCollection = db.collection("users");
  const commentsCollection = db.collection("comments");
  // index.html to jsdom
  const indexJSDOM = new JSDOM(indexHTML, {
    includeNodeLocations: true,
  });
  const { window: indexWindow } = indexJSDOM;
  const { document: indexDocument } = indexWindow;
  const frontPagePosts = indexDocument.getElementById("front-page-posts");

  //post.html to jdom
  const postJSDOM = new JSDOM(postHTML, {
    includeNodeLocations: true,
  });
  const { window: postWindow } = postJSDOM;
  const { document: postDocument } = postWindow;

  //reply.html to jsdom
  const replyJSDOM = new JSDOM(replyHTML, {
    includeNodeLocations: true,
  });
  const { window: replyWindow } = replyJSDOM;
  const { document: replyDocument } = replyWindow;

  const replyPageMain = replyDocument.getElementById("main");

  const postPagePost = postDocument.getElementById("post");
  const postPageCommentSection = postDocument.getElementById("comment-section");
  const postPageCommentForm = postDocument.getElementById("comment-form");
  postPageCommentSection.innerHTML = "";

  app.get("/", async (req, res) => {
    const posts = await postsCollection.find({}).toArray();
    console.log("postlength", posts.length);
    for (let post of posts) {
      const localUser = await usersCollection.findOne({ _id: post.user });
      const topLevelComments = await commentsCollection
        .find({ parentId: ObjectId(post._id) })
        .toArray();
      frontPagePosts.appendChild(
        createPostListItem(
          post,
          localUser,
          topLevelComments.length,
          indexDocument,
          true
        )
      );
    }
    //frontPagePosts.appendChild(newPostListItem);
    res.send(indexJSDOM.serialize());

    //reset frontPagePosts
    frontPagePosts.innerHTML = "";
  });

  app.get("/post", async (req, res) => {
    const id = req.query.id;
    const post = await postsCollection.findOne({ _id: ObjectId(id) });
    const localUser = await usersCollection.findOne({ _id: post.user });
    const topLevelComments = await commentsCollection
      .find({ parentId: ObjectId(post._id) })
      .toArray();

    postPagePost.innerHTML = "";
    postPageCommentForm.action = `/createcomment?parent=${
      post._id
    }&user=${"jim"}`;
    postPagePost.appendChild(
      createPostListItem(
        post,
        localUser,
        topLevelComments.length,
        postDocument,
        false
      )
    );
    for (let comment of topLevelComments) {
      const commentPoster = await usersCollection.findOne({
        _id: ObjectId(comment.userId),
      });

      postPageCommentSection.appendChild(
        createCommentDiv(comment, commentPoster, postDocument, false)
      );
    }
    res.send(postJSDOM.serialize());
    postPageCommentSection.innerHTML = "";
  });

  app.post("/createcomment", async (req, res) => {
    const parent = req.query.parent;
    const user = req.query.user;
    console.log("req.body", req.body);
    const userfromDb = await usersCollection.findOne({ username: user });
    console.log("user is", userfromDb);
    console.log("userId is", userfromDb._id);
    await commentsCollection.insertOne(
      commentFactory(
        req.body.comment,
        ObjectId(userfromDb._id),
        ObjectId(parent)
      )
    );
    res.redirect(`/post?id=${parent}`);
  });

  app.post("/createreply", async (req, res) => {
    const parent = req.query.parent;
    const user = req.query.user;
    console.log("req.body", req.body);
    const userfromDb = await usersCollection.findOne({ username: user });
    console.log("user is", userfromDb);
    console.log("userId is", userfromDb._id);
    await commentsCollection.insertOne(
      commentFactory(
        req.body.comment,
        ObjectId(userfromDb._id),
        ObjectId(parent)
      )
    );
    res.send("reply sent");
  });

  app.get("/reply", async (req, res) => {
    const parent = req.query.parent;
    const parentComment = await commentsCollection.findOne({
      _id: ObjectId(parent),
    });
    const parentUser = await usersCollection.findOne({
      _id: parentComment.userId,
    });
    replyPageMain.innerHTML = "";
    replyPageMain.appendChild(
      createCommentDiv(parentComment, parentUser, replyDocument, true)
    );
    res.send(replyJSDOM.serialize());
  });
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
}

main();
