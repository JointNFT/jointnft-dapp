var https = require("https");
var fs = require("fs");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.PGPORT);
// create application/json parser
var jsonParser = bodyParser.json();

// optional: allow environment to specify port
const port = process.env.PORT || 3000;
var bearerToken = "AAAAAAAAAAAAAAAAAAAAAATcWwEAAAAA9tgsDCzhJRO%2Bi8dpvqy8SJRX1tc%3D94RiMCLHGtujKzjQJpzGOGfoDwWEss39mSvtBZcCAZm4g5mcfo";

// create server instance
const app = express();
app.use(express.static(path.join(__dirname, "/dist")));
// bind the request to an absolute path or relative to the CWD

// connect to db
const client = new Client();
client.connect();

// Add headers before the routes are defined
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});

app.get("/api/isTwitterHandler", jsonParser, async (req, res) => {
  var handle = req.query.handle;
  console.log(handle);
  if (handle == "") {
    res.send({ error: "empty userId" });
  }
  var twitterResponse = await getTwitterResponseForUserCheck(handle);
  console.log(twitterResponse);
  if (JSON.parse(twitterResponse).data) {
    res.json({ isTwitterHandle: true });
  }
  res.send({ error: "request failed" });
});

app.get("/getCollections", async (req, res) => {
  const pg_res = await client.query("select * from collections.collection_master;");
  const collectionList = [];
  for (var i = 0; i < pg_res.rows.length; i += 1) {
    var row = pg_res.rows[i];
    var collectionDetails = {
      image_url:
        row['image_url'],
      name: row['collection_name'],
      price: row['token_buy_price'],
      members: row['members'],
      verified: true,
      est_value: {
        amount: row['est_value'],
        currency: row['est_value_type'],
      },
      symbol: row['token_symbol'],
      chain: row['collection_chain'],
      items: row['items'],
      contract_id: row['contract_address'],
    }
    collectionList.push(collectionDetails);
  }
  res.send(collectionList);
});

app.get("/getNFTs", async (req, res) => {
  
  const pg_res = await client.query("select * from collections.nfts n;");
  const nftList = [];
  for (var i = 0; i < pg_res.rows.length; i += 1) {
    var row = pg_res.rows[i];
    var nftDetails = {  
      imageUrl: row['image_url'],
      collection: row['nft_collection_name'],
      name: row['nft_collection_details'],
      in_collection: row['in_collection'],
      purchase_price: { amount: row['purchase_price'], currency: row['purchase_price_type'] },
      purchase_price_dollars: { amount: parseFloat(row['purchase_price'])*2500 },
      floor_price: { amount: row['floor_price'], currency: row['floor_price_type'] },
      floor_price_dollars: { amount: parseFloat(row['floor_price'])*2500 } ,
   }
   nftList.push(nftDetails);
  }
  res.send(nftList);
});

async function getTwitterResponseForUserCheck(userId) {
  console.log(userId);
  var options = {
    method: "GET",
    hostname: "api.twitter.com",
    path: "/2/users/by/username/" + userId,
    headers: {
      Authorization: "Bearer " + bearerToken,
    },
    maxRedirects: 20,
  };

  const response = await new Promise((resolve, reject) => {
    var req = https.request(options, function(res) {
      var chunks = [];

      res.on("data", function(chunk) {
        chunks.push(chunk);
      });

      res.on("end", function(chunk) {
        var body = Buffer.concat(chunks);
        resolve(body.toString());
      });

      res.on("error", function(error) {
        console.error(error);
        reject(error);
      });
    });

    req.end();
  });

  return response;
}

app.get("/HealthCheck", (req, res) => {
  res.send("Server is working!");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

// start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
