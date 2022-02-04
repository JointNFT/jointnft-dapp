const express = require('express');
const bodyParser = require('body-parser');
var Web3 = require('web3');
var abi = require('./abi.json');

// optional: allow environment to specify port
const port = process.env.PORT || 8080;

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
// var subscription = web3.eth
// 	.subscribe(
// 		'logs',
// 		{
// 			address: '0x598e209747Ee2Bc96f39AfdC206dad86aDD2282c',
// 			// topics: ['0x12345...'],
// 		},
// 		(error, result) => {
// 			if (!error) console.log(result);
// 			// console.log(error);
// 		}
// 	)
// 	.on('connected', (subscriptionId) => {
// 		console.log(subscriptionId);
// 	})
// 	.on('data', (log) => {
// 		console.log(log);
// 	})
// 	.on('changed', (log) => {});

// // unsubscribes the subscription
// subscription.unsubscribe(function(error, success) {
// 	if (success) console.log('Successfully unsubscribed!');
// });

const contract = new web3.eth.Contract(
	abi,
	'0x9c780C7a5b5a817431D3DCD71BE6F6198E4aA2b2'
);

async function getEvents(events) {
	let latest_block = await web3.eth.getBlockNumber();
	let historical_block = latest_block - 10000; // you can also change the value to 'latest' if you have a upgraded rpc
	console.log('latest: ', latest_block, 'historical block: ', historical_block);
	// const aaa = await contract.getPastEvents(
	// 	'allEvents', // change if your looking for a different event
	// 	{ fromBlock: historical_block, toBlock: 'latest' }
	// );
	// console.log(aaa);

	// const a = web3.eth.abi.decodeParameters(
	// 	['bool', 'uint256'],
	// 	'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064'
	// );
	// console.log(a);

	// const a = web3.utils.hexToUtf8(
	// 	'0x0000000000000000000000000000000000000000000000000000000000000005'
	// );
	// console.log(a);
	contract.events
		.allEvents({}, function(error, event) {
			// console.log('event');
			// console.log(event);
		})
		.on('connected', function(subscriptionId) {
			console.log('connected');
			console.log(subscriptionId);
		})
		.on('data', function(event) {
			console.log('data');
			console.log(event); // same results as the optional callback above
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

// start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
