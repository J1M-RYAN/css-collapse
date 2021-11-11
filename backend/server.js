import express from "express";
import fs from "fs";
import { JSDOM } from "jsdom";
import buildUI from "./utils/buildUI.js";
import initaliseDB from "./database-driver.js";
import { createPostListItem } from "./models/posts.js";
import { ObjectId } from "mongodb";

async function main() {
  const PORT = 3000;
  const app = express();
  app.use(express.static("../ui/build"));

  const indexHTML = fs.readFileSync("../ui/index.html").toString();
  const postHTML = fs.readFileSync("../ui/post.html").toString();
  buildUI();
  const client = await initaliseDB();
  const db = client.db("test");
  const postsCollection = db.collection("posts");
  const usersCollection = db.collection("users");
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
  const postPagePost = postDocument.getElementById("post");

  app.get("/", async (req, res) => {
    const posts = await postsCollection.find({}).toArray();
    posts.forEach(async (post) => {
      const localUser = await usersCollection.findOne({ _id: post.user });
      frontPagePosts.appendChild(
        createPostListItem(post, localUser, indexDocument)
      );
    });

    //frontPagePosts.appendChild(newPostListItem);
    res.send(indexJSDOM.serialize());

    //reset frontPagePosts
    frontPagePosts.innerHTML = "";
  });

  app.get("/post", async (req, res) => {
    const id = req.query.id;
    const post = await postsCollection.findOne({ _id: ObjectId(id) });
    console.log(post.user);
    const localUser = await usersCollection.findOne({ _id: post.user });
    console.log(localUser);
    console.log("post", post);
    postPagePost.innerHTML = "";
    postPagePost.appendChild(createPostListItem(post, localUser, postDocument));
    res.send(postJSDOM.serialize());
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
}

main();
