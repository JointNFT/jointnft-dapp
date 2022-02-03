var https = require("https");
var fs = require("fs");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const dotenv = require("dotenv");
const Web3 = require("web3");
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

function getOpenseaUrlFromNFT(nft) {
  if (nft.collection_chain == "MATIC" || nft.collection_chain == "MUMBAI") {
    return "https://opensea.io/assets/matic/"+nft.nft_address+"/"+nft.nft_token;
  }
  else {
    return "https://opensea.io/assets/"+nft.nft_address+"/"+nft.nft_token;
  }
}

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
      collection_id: row["collection_id"],
      image_url: row["image_url"],
      name: row["collection_name"],
      price: { amount: Web3.utils.fromWei(row["token_buy_price"]), type: row["price_type"] },
      members: row["members"],
      verified: true,
      est_value: {
        amount: row["est_value"],
        currency: row["est_value_type"],
      },
      symbol: row["token_symbol"],
      chain: row["collection_chain"],
      items: row["items"],
      contract_id: row["contract_address"],
    };
    collectionList.push(collectionDetails);
  }
  res.send(collectionList);
});

app.get("/getCollectionDetails", async (req, res) => {
  var collection_id = req.query.collection_id;
  if (collection_id == null || collection_id == "") {
    collection_id = 0;
  }
  var query = "select * from collections.collection_master cm where cm.collection_id = "+collection_id.toString()+";"
  // console.log(query);
  const pg_res = await client.query(query);
  if(pg_res.rows.length >= 1){
    var row = pg_res.rows[0];
    var collectionDetails = {
      collection_id: row["collection_id"],
      image_url: row["image_url"],
      name: row["collection_name"],
      price: { amount: Web3.utils.fromWei(row["token_buy_price"]), type: row["price_type"] },
      members: row["members"],
      verified: true,
      est_value: {
        amount: row["est_value"],
        currency: row["est_value_type"],
      },
      symbol: row["token_symbol"],
      chain: row["collection_chain"],
      items: row["items"],
      contract_id: row["contract_address"],
    };
    res.send(collectionDetails);
  }
  else {
    res.send({});
  }
});

app.get("/getNFTs", async (req, res) => {
  var collection_id = req.query.collection_id;
  if (collection_id == null || collection_id == "") {
    collection_id = 0;
  }

  const pg_res = await client.query("select * from collections.nfts n inner join (select collection_chain, collection_id from collections.collection_master) cm on cm.collection_id = n.collection_id where n.collection_id =" + collection_id + ";");
  const nftList = [];
  for (var i = 0; i < pg_res.rows.length; i += 1) {
    var row = pg_res.rows[i];
    var nftDetails = {
      imageUrl: row["image_url"],
      openseaUrl: getOpenseaUrlFromNFT(row),
      collection: row["nft_collection_name"],
      name: row["nft_collection_details"],
      in_collection: row["in_collection"],
      purchase_price: { amount: row["purchase_price"], currency: row["purchase_price_type"] },
      purchase_price_dollars: { amount: parseFloat(row["purchase_price"]) * 2500 },
      floor_price: { amount: row["floor_price"], currency: row["floor_price_type"] },
      floor_price_dollars: { amount: parseFloat(row["floor_price"]) * 2500 },
    };
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
