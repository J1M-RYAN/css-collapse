import { MongoClient } from "mongodb";
import { postFactory } from "./models/posts.js";
export default async function initaliseDB() {
  const client = await MongoClient.connect(
    `mongodb://${
      process.env.NODE_ENV === "production" ? "localhost" : "db"
    }:27017`,
    {
      useUnifiedTopology: true,
    }
  );
  await client.connect();

  populateDb(client);
  return client;
}

const populateDb = async (client) => {
  const db = client.db("test");
  const posts = db.collection("posts");
  await posts.insertOne(
    postFactory("Link to google", "https://google.com", "jim")
  );
  await posts.insertOne(
    postFactory("Link to bing", "https://bing.com", "user2")
  );
  await posts.insertOne(
    postFactory("Link to duckduckgo", "https://duckduckgo.com", "random")
  );
  await posts.insertOne(
    postFactory("Link to yahoo", "https://yahoo.com", "user")
  );
  await posts.insertOne(
    postFactory("New post", "https://google.com", "whodis")
  );
  await posts.insertOne(
    postFactory("Show HN: HackerNews", "https://news.ycombinator.com/", "pg")
  );
};
