import express from "express";
import fs from "fs";
import { JSDOM } from "jsdom";
import buildUI from "./utils/buildUI.js";
import initaliseDB from "./database-driver.js";
import { createPostListItem } from "./models/posts.js";

async function main() {
  const PORT = 3000;
  const app = express();
  app.use(express.static("../ui/build"));

  const index = fs.readFileSync("../ui/index.html").toString();
  buildUI();
  const client = await initaliseDB();
  const db = client.db("test");
  const postsCollection = db.collection("posts");

  const jsdom = new JSDOM(index, { includeNodeLocations: true });
  const { window } = jsdom;
  const { document } = window;

  const frontPagePosts = document.getElementById("front-page-posts");

  app.get("/", async (req, res) => {
    const posts = await postsCollection.find({}).toArray();
    posts.forEach((post) => {
      frontPagePosts.appendChild(createPostListItem(post, document));
    });

    //frontPagePosts.appendChild(newPostListItem);
    res.send(jsdom.serialize());

    //reset frontPagePosts
    frontPagePosts.innerHTML = "";
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
}

main();
