"use strict";

const debug = require('debug')('db');
const prettybytes = require('pretty-bytes');
const MongoClient = require('mongodb').MongoClient;
// const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSPHRASE}@${process.env.DB_URI}`
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSPHRASE}@${process.env.DB_URI}`;

function DB() {

    this.client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    this.db = null;
    this.collection = null;


    this.connect = function(done) {
        let self = this;

        this.client.connect(err => {
            if(err) {
                console.log(`Database conection error: ${err.message}`);
                process.exit(1);
            }
            console.log("Connected correctly to server");
            self.db = self.client.db('roll-slackbot');
            self.db.collection('roll-requests', { strict: true }, ( err, col ) => {
                self.collection = col;
                done(err);
            });

        });
    };


    this.insert = function(ob, done) {
        this.collection.insertOne(ob, err => {
            done(err);
        });
    };


    this.getCollections = function(done) {
        this.db.listCollections(res => {
            done(res);
        });
    };


    this.printStat = function(done) {
        this.collection.stats((err, res) => {
            console.log(`Namespace ${res.ns} ${res.capped} indexsize: ${res.nindexes} storage size: ${prettybytes(res.storageSize)} `);
            done(err, res);
        });
    };


    this.close = function() {
        this.client.close();
    };
}



module.exports = DB;