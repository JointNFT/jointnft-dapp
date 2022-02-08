const express = require('express');
var Web3 = require('web3');
var abi = require('./abi.json');
const { Pool, Client } = require('pg');
require('dotenv').config();
const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
});

// optional: allow environment to specify port
const port = process.env.PORT || 5000;

// create server instance
const app = express();

// Add headers before the routes are defined
app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	);
	next();
});

const web3 = new Web3(
	Web3.givenProvider ||
		'wss://rinkeby.infura.io/ws/v3/f0851ca048234e2a8b9fce6423433441'
);

const CONTRACT_ADDRESS = '0x04d489aa53f8ded34066efca6747d7811a896bcd';

const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

async function getEvents(events) {
	let latest_block = await web3.eth.getBlockNumber();
	let historical_block = latest_block - 10000; // you can also change the value to 'latest' if you have a upgraded rpc
	console.log('latest: ', latest_block, 'historical block: ', historical_block);
	contract.events
		.allEvents({}, function(error, event) {
			// console.log('event');
			// console.log(event);
		})
		.on('connected', function(subscriptionId) {
			console.log('connected');
			console.log(subscriptionId);
		})
		.on('data', async (event) => {
			console.log('data');
			console.log(event); // same results as the optional callback above
			if (event.event === 'TokenPriceChanged') {
				console.log('Price Change');
				try {
					const text = `update collections.collection_master cm set token_buy_price = $1 ,token_sell_price = $2 where cm.contract_address = $3 returning *;`;
					const values = [
						event.returnValues.value,
						event.returnValues.value,
						CONTRACT_ADDRESS,
					];
					console.log(event.returnValues.value);
					const query = await pool.query(text, values);
					console.log(query.rows);
					// res.json({ a: query.rows });
				} catch (err) {
					console.log(err.stack);
				}
			} else if (event.event === 'TokensBought') {
				console.log('TokensBought');
				try {
					const text = `update collections.collection_master cm set items = $1  where cm.contract_address = $2 returning *;`;
					const currentquery =
						'select * from collections.collection_master cm where cm.contract_address = $1;';
					const currentvalues = [CONTRACT_ADDRESS];
					const current = await pool.query(currentquery, currentvalues);
					let curr_items = current.rows[0].items;
					let new_items = curr_items + event.returnValues.amount;
					const values = [new_items, CONTRACT_ADDRESS];
					const query = await pool.query(text, values);
					console.log(query.rows);
				} catch (err) {
					console.log(err.stack);
				}
			} else if (event.event === 'TokensSold') {
				console.log('TokensSold');
				try {
					const text = `update collections.collection_master cm set items = $1  where cm.contract_address = $2 returning *;`;
					const currentquery =
						'select * from collections.collection_master cm where cm.contract_address = $1;';
					const currentvalues = [CONTRACT_ADDRESS];
					const current = await pool.query(currentquery, currentvalues);
					let curr_items = current.rows[0].items;
					let new_items = curr_items - event.returnValues.amount;
					const values = [new_items, CONTRACT_ADDRESS];
					const query = await pool.query(text, values);
					console.log(query.rows);
				} catch (err) {
					console.log(err.stack);
				}
			}
		})
		.on('changed', function(event) {
			// remove event from local database
			console.log('changed');
			console.log(event);
		})
		.on('error', function(error, receipt) {
			// If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
			console.log('error');
			console.log(error);
		});
}

getEvents();

// Trial Route
app.get('/a', async (req, res) => {
	try {
		const currentquery =
			'select * from collections.collection_master cm where cm.contract_address = $1;';
		const currentvalues = [CONTRACT_ADDRESS];
		const current = await pool.query(currentquery, currentvalues);
		console.log(current.rows[0]);
		let curr_items = current.rows[0].items;
		// res.json({ a: query.rows });
	} catch (err) {
		console.log(err.stack);
	}
});

// start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
