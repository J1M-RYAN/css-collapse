import { ObjectID } from "bson";
import { MongoClient } from "mongodb";
import { postFactory } from "./models/posts.js";
import { userFactory } from "./models/users.js";
export default async function initaliseDB() {
  const client = await MongoClient.connect(
    `mongodb://${
      process.env.NODE_ENV === "production" ? "db" : "localhost"
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

  const usersCollection = db.collection("users");
  await usersCollection.insertOne(userFactory("jim"));
  await usersCollection.insertOne(userFactory("tom"));
  await usersCollection.insertOne(userFactory("joe"));
  await usersCollection.insertOne(userFactory("bob"));
  await usersCollection.insertOne(userFactory("tim"));

  const users = await usersCollection.find({}).toArray();
  const postsCollection = db.collection("posts");
  await postsCollection.insertOne(
    postFactory(
      "Link to google",
      "https://google.com",
      ObjectID(users[Math.floor(Math.random() * users.length)]._id)
    )
  );
  await postsCollection.insertOne(
    postFactory(
      "Link to bing",
      "https://bing.com",
      ObjectID(users[Math.floor(Math.random() * users.length)]._id)
    )
  );
  await postsCollection.insertOne(
    postFactory(
      "Link to duckduckgo",
      "https://duckduckgo.com",
      ObjectID(users[Math.floor(Math.random() * users.length)]._id)
    )
  );
  await postsCollection.insertOne(
    postFactory(
      "Link to yahoo",
      "https://yahoo.com",
      ObjectID(users[Math.floor(Math.random() * users.length)]._id)
    )
  );
  await postsCollection.insertOne(
    postFactory(
      "New post",
      "https://google.com",
      ObjectID(users[Math.floor(Math.random() * users.length)]._id)
    )
  );
  await postsCollection.insertOne(
    postFactory(
      "Show HN: HackerNews",
      "https://news.ycombinator.com/",
      ObjectID(users[Math.floor(Math.random() * users.length)]._id)
    )
  );
};
