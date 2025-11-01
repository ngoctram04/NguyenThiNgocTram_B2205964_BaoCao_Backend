import { MongoClient } from "mongodb";

class MongoDB {
  static client = null;
  static db = null;

  static connect = async (uri) => {
    if (this.client) return this.client;
    this.client = await MongoClient.connect(uri);
    this.db = this.client.db();
    return this.client;
  };

  static getDB = () => {
    if (!this.db) throw new Error("Database chưa được kết nối!");
    return this.db;
  };
}

export default MongoDB;
