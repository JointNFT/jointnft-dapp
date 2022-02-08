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

// console.log(process.env.MUMBAI_WS);

const web3 = new Web3(Web3.givenProvider || process.env.ETH_WS);

const CONTRACT_ADDRESS = '0x9c780C7a5b5a817431D3DCD71BE6F6198E4aA2b2';
const CONTRACT_ADDRESS2 = '0x2c4C64fF4cFc16901EFB5aF6c4F2E2b9709651A8';

const getEvents = () => {
	let options = {
		fromBlock: null,
		address: [CONTRACT_ADDRESS, CONTRACT_ADDRESS2], //Only get events from specific addresses,
		topics: [],
	};

	let subscription = web3.eth.subscribe('logs', options);

	subscription.on('data', (event) => {
		console.log('event');
		console.log(event);
		const address = event.address;
		const hash = event.transactionHash;
		const contract = new web3.eth.Contract(abi, address);
		contract
			.getPastEvents(
				'allEvents',
				{
					fromBlock: 0,
					toBlock: 'latest',
				},
				function(error, events) {
					// console.log(events);
				}
			)
			.then(async (events) => {
				// console.log(events);
				const curr = events.filter((e) => e.transactionHash === hash)[0];
				console.log(curr);
				if (curr.event === 'TokenPriceChanged') {
					console.log('Price Change');
					try {
						const text = `update collections.collection_master cm set token_buy_price = $1 ,token_sell_price = $2 where cm.contract_address = $3 returning *;`;
						const values = [
							curr.returnValues.value,
							curr.returnValues.value,
							CONTRACT_ADDRESS,
						];
						console.log(curr.returnValues.value);
						const query = await pool.query(text, values);
						console.log(query.rows);
						// res.json({ a: query.rows });
					} catch (err) {
						console.log(err.stack);
					}
				} else if (curr.event === 'TokensBought') {
					console.log('TokensBought');
					try {
						const text = `update collections.collection_master cm set items = $1  where cm.contract_address = $2 returning *;`;
						const currentquery =
							'select * from collections.collection_master cm where cm.contract_address = $1;';
						const currentvalues = [CONTRACT_ADDRESS];
						const current = await pool.query(currentquery, currentvalues);
						let curr_items = current.rows[0].items;
						let new_items = curr_items + curr.returnValues.amount;
						const values = [new_items, CONTRACT_ADDRESS];
						const query = await pool.query(text, values);
						console.log(query.rows);
					} catch (err) {
						console.log(err.stack);
					}
				} else if (curr.event === 'TokensSold') {
					console.log('TokensSold');
					try {
						const text = `update collections.collection_master cm set items = $1  where cm.contract_address = $2 returning *;`;
						const currentquery =
							'select * from collections.collection_master cm where cm.contract_address = $1;';
						const currentvalues = [CONTRACT_ADDRESS];
						const current = await pool.query(currentquery, currentvalues);
						let curr_items = current.rows[0].items;
						let new_items = curr_items - curr.returnValues.amount;
						const values = [new_items, CONTRACT_ADDRESS];
						const query = await pool.query(text, values);
						console.log(query.rows);
					} catch (err) {
						console.log(err.stack);
					}
				}
			});
	});
	subscription.on('changed', (changed) => console.log(changed));
	subscription.on('error', (err) => {
		throw err;
	});
	subscription.on('connected', (nr) => {
		console.log('connected');
		console.log(nr);
	});
};

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
