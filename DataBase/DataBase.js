
var debug = require('debug')(require('path').basename(__filename));

var fs = require("fs");
var path = require('path');
var appDir = path.dirname(require.main.filename);

var mongodb_client = require('mongodb').MongoClient;

class DataBase
{

  constructor()
  {
    try {
      this.mongo_client = null;

      this.db_type = 0;
      this.db_list = [];
    }
    catch (e) {
      debug("[DataBase] DataBase_Constructor() Error " + e);
    }
  }

  async DataBase_Open(database_name)
  {
    try{
      var result = false;

      if(this.mongo_client==null)
      {
        var connected_client = null;
        const do_mongodb_connect = function(){
          return new Promise(function(resolve, reject) {
            mongodb_client.connect("mongodb://localhost:27017", function(err, client) {
              if (err) {
                reject();
                return;
              }
              connected_client = client;
              resolve();
            });
          });
        };
  
        await do_mongodb_connect();

        this.mongo_client = connected_client;
      }

      if(this.db_list[database_name]!=null)
      {
        return true;
      }
      
      this.db_list[database_name] = this.mongo_client.db(database_name);

      result = true;

      return result;
    }
    catch(e)
    {
      debug("[DataBase] DataBase_Open() Error " + e);
    }
  }

  DataBase_Close(database_name)
  {
    try{
      var result = false;

      if(this.mongo_client==null)
      {
        return true;
      }
      
      if(this.db_list[database_name]==null)
      {
        return true;
      }
      
      result = true;

      delete this.db_list[database_name];

      var num_op_opened_db = this.db_list.filter(db =>db!=null).length;
      
      if(num_op_opened_db<=0)
      {
        this.mongo_client.close();
        this.mongo_client = null;
      }

      return result;
    }
    catch(e)
    {
      debug("[DataBase] DataBase_Close() Error " + e);
    }
  }

  async Database_ListCollections(database_name)
  {
    try{
      var result = [];

      if(query==null)
      {
        query = {};
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_ListCollections() MongoDB Server Not Initialized");
        return null;
      }

      if(this.db_list[database_name]==null)
      {
        return null;
      }
      
      const do_db_list_collection = function(db){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.listCollections().toArray(function(err, items) {
              if (err) { 
                reject();
                throw err;
              }
              result = items;
              resolve();
            });
          });
        });
      }

      await do_db_list_collection(this.db_list[database_name]);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_ListCollections() Error " + e);
    }
  }

  async Database_Find(database_name, collection_name, query, option)
  {
    try{
      var result = [];

      if(query==null)
      {
        query = {};
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_Find() MongoDB Server Not Initialized");
        return null;
      }

      if(this.db_list[database_name]==null)
      {
        return null;
      }
      
      const do_db_find = function(db, collection_name, query){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).find(query).sort({_id:1}).toArray(function(err, items) {
              if (err) { 
                reject();
                throw err;
              }
              result = items;
              resolve();
            });
          });
        });
      }

      await do_db_find(this.db_list[database_name], collection_name, query);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_Find() Error " + e);
    }
  }
  
  async Database_FindLimit(database_name, collection_name, query, limit_counts, option)
  {
    try{
      var result = [];

      if(query==null)
      {
        query = {};
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_Find() MongoDB Server Not Initialized");
        return null;
      }

      if(this.db_list[database_name]==null)
      {
        return null;
      }
      
      const do_db_find_limit = function(db, collection_name, query){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).find(query).sort({_id:1}).limit(limit_counts).toArray(function(err, items) {
              if (err) { 
                reject();
                throw err;
              }
              result = items;
              resolve();
            });
          });
        });
      }

      await do_db_find_limit(this.db_list[database_name], collection_name, query);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_Find() Error " + e);
    }
  }
  
  async Database_FindOne(database_name, collection_name, query)
  {
    try{
      var result = [];

      if(query==null)
      {
        query = {};
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_FindOne() MongoDB Server Not Initialized");
        return null;
      }

      if(this.db_list[database_name]==null)
      {
        return null;
      }
      
      const do_db_findone = function(db, collection_name, query){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            result = db.collection(collection_name).findOne(query);
            resolve();
          });
        });
      }

      await do_db_findone(this.db_list[database_name], collection_name, query);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_FindOne() Error " + e);
    }
  }
  
  async Database_Count(database_name, collection_name, condition)
  {
    try{
      var result = -1;

      if(condition==null)
      {
        condition = {};
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_Count() MongoDB Server Not Initialized");
        return -1;
      }

      if(this.db_list[database_name]==null)
      {
        return -1;
      }
      
      const do_db_count = function(db, collection_name, condition){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).count(condition, function(err, count) {
              if (err) { 
                reject();
                throw err;
              }
              result = count;
              resolve();
            });
          });
        });
      }

      await do_db_count(this.db_list[database_name], collection_name, condition);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_Count() Error " + e);
    }
  }

  async Database_Insert(database_name, collection_name, new_doc)
  {
    try{
      var result = false;

      if(new_doc["_id"]!=null){
        delete new_doc["_id"];
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_Insert() MongoDB Server Not Initialized");
        return false;
      }

      if(this.db_list[database_name]==null)
      {
        return false;
      }
      
      const do_db_insert = function(db, collection_name, new_doc){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).insert(new_doc, {w:1}, function(err, op_result) {
              if (err) { 
                reject();
                throw err;
              }
              result = true;
              resolve();
            });
          });
        });
      }

      await do_db_insert(this.db_list[database_name], collection_name, new_doc);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_Insert() Error " + e);
    }
  }
  
  async Database_Update(database_name, collection_name, query, new_doc, multi)
  {
    try{
      var result = false;

      if(new_doc["_id"]!=null){
        delete new_doc["_id"];
      }

      if(query==null)
      {
        query = {};
      }

      if(multi==null)
      {
        multi = false;
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_Update() MongoDB Server Not Initialized");
        return false;
      }

      if(this.db_list[database_name]==null)
      {
        return false;
      }
      
      var justone = !multi;

      const do_db_update = function(db, collection_name, query, new_doc, justone){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).update(query, new_doc, {'safe': true, 'justOne': justone}, function(err) {
              if (err) { 
                reject();
                throw err;
              }
              result = true;
              resolve();
            });
          });
        });
      }

      await do_db_update(this.db_list[database_name], collection_name, query, new_doc, justone);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_Update() Error " + e);
    }
  }

  async Database_Remove(database_name, collection_name, condition, justone)
  {
    try{
      var result = false;

      if(condition==null)
      {
        condition = {};
      }

      if(justone==null)
      {
        justone = false;
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_Remove() MongoDB Server Not Initialized");
        return false;
      }

      if(this.db_list[database_name]==null)
      {
        return false;
      }
      
      const do_db_remove = function(db, collection_name, condition, justone){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).remove(condition, {"justOne":justone}, function(err) {
              if (err) { 
                reject();
                throw err;
              }
              result = true;
              resolve();
            });
          });
        });
      }

      await do_db_remove(this.db_list[database_name], collection_name, condition, justone);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_Remove() Error " + e);
    }
  }

  async Database_EnsureIndex(database_name, collection_name, fieldname, unique)
  {
    try{
      return true;
      
      var result = false;

      if(fieldname==null)
      {
        return false;
      }

      if(unique==null)
      {
        unique = false;
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_EnsureIndex() MongoDB Server Not Initialized");
        return false;
      }

      if(this.db_list[database_name]==null)
      {
        return false;
      }
      
      const do_db_ensureIndex = function(db, collection_name, fieldname, unique){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).ensureIndex(fieldname, { 'unique': unique }, function(err) {
              if (err) { 
                reject();
                throw err;
              }
              result = true;
              resolve();
            });
          });
        });
      }

      await do_db_ensureIndex(this.db_list[database_name], collection_name, fieldname, unique);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_EnsureIndex() Error " + e);
    }
  }

  async Database_RemoveIndex(database_name, collection_name, fieldname)
  {
    try{
      var result = false;

      if(fieldname==null)
      {
        return false;
      }

      if(this.mongo_client==null)
      {
        debug("[DataBase] Database_RemoveIndex() MongoDB Server Not Initialized");
        return false;
      }

      if(this.db_list[database_name]==null)
      {
        return false;
      }
      
      const do_db_removeIndex = function(db, collection_name, fieldname){
        return new Promise(function(resolve, reject) {
          process.nextTick(() => {
            db.collection(collection_name).removeIndex(fieldname, function(err) {
              if (err) { 
                reject();
                throw err;
              }
              result = true;
              resolve();
            });
          });
        });
      }

      await do_db_removeIndex(this.db_list[database_name], collection_name, fieldname);

      return result;
    }
    catch(e)
    {
      debug("[DataBase] Database_RemoveIndex() Error " + e);
    }
  }
}

module.exports = DataBase;