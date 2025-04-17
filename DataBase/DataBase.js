// DataBase.js – updated for mongodb driver v6.x  (CommonJS)
// ---------------------------------------------------------------
// 用法範例：
//   const DataBase = require('./DataBase');
//   const db = new DataBase();
//   await db.DataBase_Open('demo');
//   await db.Database_Insert('demo', 'pets', { name: 'Mochi', age: 2 });
//   const pets = await db.Database_Find('demo', 'pets', {});
// ---------------------------------------------------------------

const debug = require('debug')(require('path').basename(__filename));
const { MongoClient } = require('mongodb');
const path = require('path');

class DataBase {
  constructor() {
    try {
      /** @type {MongoClient|null} */
      this.mongo_client = null; // 單一連線池 (singleton)

      /**
       * 已開啟的資料庫快取
       * key: db name  value: Db instance
       * @type {Record<string, import('mongodb').Db>}
       */
      this.db_list = {};
    } catch (e) {
      debug('[DataBase] constructor() Error', e);
    }
  }

  /**
   * 連到 MongoDB 並快取指定資料庫
   * @param {string} database_name
   */
  async DataBase_Open(database_name) {
    try {
      if (!this.mongo_client) {
        this.mongo_client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
          // 建議開 strict API，提早發現 deprecated 語法
          serverApi: { version: '1', strict: true },
        });
        await this.mongo_client.connect();
      }

      if (!this.db_list[database_name]) {
        this.db_list[database_name] = this.mongo_client.db(database_name);
      }
      return true;
    } catch (e) {
      debug('[DataBase] DataBase_Open() Error', e);
      return false;
    }
  }

  /**
   * 關閉指定資料庫；若所有資料庫都關閉則關 client
   * @param {string} database_name
   */
  async DataBase_Close(database_name) {
    try {
      if (!this.mongo_client || !this.db_list[database_name]) return true;

      delete this.db_list[database_name];

      if (Object.keys(this.db_list).length === 0) {
        await this.mongo_client.close();
        this.mongo_client = null;
      }
      return true;
    } catch (e) {
      debug('[DataBase] DataBase_Close() Error', e);
      return false;
    }
  }

  /* ----------------------------- Helper ----------------------------- */
  /** @private */ _ensureReady(database_name) {
    if (!this.mongo_client) throw new Error('MongoDB client not initialised');
    const db = this.db_list[database_name];
    if (!db) throw new Error(`DB ${database_name} not opened`);
    return db;
  }

  /* ----------------------------- LIST ----------------------------- */
  async Database_ListCollections(database_name) {
    try {
      const db = this._ensureReady(database_name);
      return await db.listCollections().toArray();
    } catch (e) {
      debug('[DataBase] Database_ListCollections() Error', e);
      return null;
    }
  }

  /* ----------------------------- READ ----------------------------- */
  async Database_Find(database_name, collection_name, query = {}, option = {}) {
    try {
      const db = this._ensureReady(database_name);
      return await db.collection(collection_name).find(query, option).sort({ _id: 1 }).toArray();
    } catch (e) {
      debug('[DataBase] Database_Find() Error', e);
      return null;
    }
  }

  async Database_FindLimit(database_name, collection_name, query = {}, limit_counts = 0, option = {}) {
    try {
      const db = this._ensureReady(database_name);
      let cursor = db.collection(collection_name).find(query, option).sort({ _id: 1 });
      if (limit_counts > 0) cursor = cursor.limit(limit_counts);
      return await cursor.toArray();
    } catch (e) {
      debug('[DataBase] Database_FindLimit() Error', e);
      return null;
    }
  }

  async Database_FindOne(database_name, collection_name, query = {}, option = {}) {
    try {
      const db = this._ensureReady(database_name);
      return await db.collection(collection_name).findOne(query, option);
    } catch (e) {
      debug('[DataBase] Database_FindOne() Error', e);
      return null;
    }
  }

  async Database_Count(database_name, collection_name, condition = {}) {
    try {
      const db = this._ensureReady(database_name);
      return await db.collection(collection_name).countDocuments(condition);
    } catch (e) {
      debug('[DataBase] Database_Count() Error', e);
      return -1;
    }
  }

  /* ----------------------------- CREATE ----------------------------- */
  async Database_Insert(database_name, collection_name, new_doc) {
    try {
      const db = this._ensureReady(database_name);
      if (new_doc._id) delete new_doc._id;
      await db.collection(collection_name).insertOne(new_doc);
      return true;
    } catch (e) {
      debug('[DataBase] Database_Insert() Error', e);
      return false;
    }
  }

  /* ----------------------------- UPDATE ----------------------------- */
  async Database_Update(database_name, collection_name, query = {}, new_doc = {}, multi = false) {
    try {
      const db = this._ensureReady(database_name);
      if (new_doc._id) delete new_doc._id;

      // 如果 new_doc 沒有操作符，預設走 $set
      const updatePayload = Object.keys(new_doc).some(k => k.startsWith('$')) ? new_doc : { $set: new_doc };

      if (multi) {
        await db.collection(collection_name).updateMany(query, updatePayload);
      } else {
        await db.collection(collection_name).updateOne(query, updatePayload);
      }
      return true;
    } catch (e) {
      debug('[DataBase] Database_Update() Error', e);
      return false;
    }
  }

  /* ----------------------------- DELETE ----------------------------- */
  async Database_Remove(database_name, collection_name, condition = {}, justone = false) {
    try {
      const db = this._ensureReady(database_name);
      if (justone) {
        await db.collection(collection_name).deleteOne(condition);
      } else {
        await db.collection(collection_name).deleteMany(condition);
      }
      return true;
    } catch (e) {
      debug('[DataBase] Database_Remove() Error', e);
      return false;
    }
  }

  /* ----------------------------- INDEX ----------------------------- */
  async Database_EnsureIndex(database_name, collection_name, fieldname, unique = false) {
    try {
      const db = this._ensureReady(database_name);
      await db.collection(collection_name).createIndex({ [fieldname]: 1 }, { unique });
      return true;
    } catch (e) {
      debug('[DataBase] Database_EnsureIndex() Error', e);
      return false;
    }
  }

  async Database_RemoveIndex(database_name, collection_name, fieldname) {
    try {
      const db = this._ensureReady(database_name);
      await db.collection(collection_name).dropIndex(fieldname);
      return true;
    } catch (e) {
      debug('[DataBase] Database_RemoveIndex() Error', e);
      return false;
    }
  }
}

module.exports = DataBase;
