const discord = require('discord.js')

const { prefix } = require('./config.json');
const { token } = require('./api_keys.json');

const client = new discord.Client();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const yahooFinance = require('yahoo-finance');
const util = require('util');

var fs = require("fs");
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumSignificantDigits: 4
  })

const green = '#33FF4C'
const red = '#FF3333'
const usStockImg = "https://eturbonews.com/wp-content/uploads/2017/03/0a13_2.jpg"
const us_stocks_file = "us_stocks.txt"
const num_of_stocks = 607

function formatMoney(number) {
	return formatter.format(number);
}

function printEmbed(title, fields, image) {

	// Green or red colour
	if(fields[2].value > 0){
		colour = green
	} else {
		colour = red
	}
	fields[2].value = fields[2].value + "%"

	return embed = new discord.MessageEmbed()
				.setColor(colour)
				.setTitle(title)
				.addFields(fields)
				.setImage(image)
}

client.on('message', async message => {

	// HELP COMMAND
		if (message.content.toLowerCase() === prefix + 'it help'){
			message.channel.send("Link to help")
			return
		}

	// CRYPTO DATA COMMAND
		if (message.content.toLowerCase().includes(prefix + 'crypto ')){
			
			input = message.content.toLowerCase().substr(8)
		
			// Search with ticker
			data = await CoinGeckoClient.coins.list();
			length = data["data"].length
			coinId = "empty"
			for (var i = 0; i < length; i++) {
				if (data["data"][i]["symbol"] == input) {
					coinId = data["data"][i]["id"]
					coinName = data["data"][i]["name"]
				}
			}

			// If no ticker found
			if (coinId == "empty"){
				message.channel.send("Error: No coin found for ticker " + input)
				return
			}
			
			// Retrieve Data
			data = await CoinGeckoClient.coins.fetch(coinId, {});

			// Send embed
			fields = [
				{ name:"$AUD" ,value: formatMoney(data["data"]["market_data"]["current_price"]["aud"])},
				{ name:"$USD" ,value: formatMoney(data["data"]["market_data"]["current_price"]["usd"])},
				{ name:"% Difference" ,value: data["data"]["market_data"]["price_change_percentage_24h"]}
			]
			message.channel.send(printEmbed(coinName.toUpperCase(), fields, data["data"]["image"]["large"]))

			return
		}

	// RANDOM COMMANDS
		if (message.content.toLowerCase().includes(prefix + 'random ')){
			
			if (message.content.toLowerCase().includes('crypto')){
				// Get list of coins
				data = await CoinGeckoClient.coins.list();
				length = data["data"].length

				// Random number within length
				i = Math.floor(Math.random() * length);

				// Find corresponding
				data["data"][i]["symbol"]
				coinId = data["data"][i]["id"]
				coinName = data["data"][i]["name"]

				// Retrieve Data
				data = await CoinGeckoClient.coins.fetch(coinId, {});

				// Send embed
				fields = [
					{ name:"$AUD" ,value: formatMoney(data["data"]["market_data"]["current_price"]["aud"])} ,
					{ name:"$USD" ,value: formatMoney(data["data"]["market_data"]["current_price"]["usd"])} ,
					{ name:"% Difference" ,value: data["data"]["market_data"]["price_change_percentage_24h"]}
				]
				message.channel.send(printEmbed(coinName.toUpperCase(), fields, data["data"]["image"]["large"]))
				return
		
			}

			if (message.content.toLowerCase().includes('stock')){
				// Read text file and randomly pick one ticker
				var text = fs.readFileSync(us_stocks_file).toString('utf-8');
				text = text.split("\n")
				randomStockTicker = text[Math.floor(Math.random() * num_of_stocks)]

				// Get Data for random stock
				yahooFinance.quote({
					symbol: randomStockTicker,
					modules: ['price', 'summaryDetail', 'summaryProfile']       // optional; default modules.
				  }, function(err, quote) {
					{
					  output: {
						// Output from API
						stockName = quote["price"]["shortName"]
						if (stockName == null) {
							stockName = "ERROR: No Name found"
						}
						stockPrice = quote["price"]["regularMarketPrice"]
						if (stockPrice == null) {
							stockPrice = 0
						}
						stockPercentageDiff = quote["price"]["regularMarketChangePercent"]
						if (stockPercentageDiff == null) {
							stockPercentageDiff = 0
						}
						previousClose = quote["summaryDetail"]["previousClose"]
						if (previousClose == null) {
							previousClose = 0
						}
						marketCap = quote["summaryDetail"]["marketCap"]
						if (marketCap == null) {
							marketCap = 0
						}
						volume = quote["summaryDetail"]["volume"]
						if (volume == null) {
							volume = 0
						}
	
						// Send embed
						fields = [
							{ name:"Current Price (USD)" ,value: formatMoney(stockPrice)},
							{ name:"Previous Close", value: formatMoney(previousClose)},
							{ name:"Difference (%)" ,value: 100 * stockPercentageDiff},
							{ name:"Market Cap" ,value: formatMoney(marketCap)},
							{ name:"Volume" ,value: volume}
						]
						message.channel.send(printEmbed(stockName, fields, usStockImg))
					  }
					}
				  });
			}
		}

	// STOCK DATA COMMAND
		if (message.content.toLowerCase().includes(prefix + 'stock ')){
			
			input = message.content.toLowerCase().substr(7)

			// Get data from API
			yahooFinance.quote({
				symbol: input,
				modules: ['price', 'summaryDetail', 'summaryProfile']       // optional; default modules.
			  }, function(err, quote) {
				{
				  output: {
					// Output from API
					stockName = quote["price"]["shortName"]
					if (stockName == null) {
						stockName = "ERROR: No Name found"
					}
					stockPrice = quote["price"]["regularMarketPrice"]
					if (stockPrice == null) {
						stockPrice = 0
					}
					stockPercentageDiff = quote["price"]["regularMarketChangePercent"]
					if (stockPercentageDiff == null) {
						stockPercentageDiff = 0
					}
					previousClose = quote["summaryDetail"]["previousClose"]
					if (previousClose == null) {
						previousClose = 0
					}
					marketCap = quote["summaryDetail"]["marketCap"]
					if (marketCap == null) {
						marketCap = 0
					}
					volume = quote["summaryDetail"]["volume"]
					if (volume == null) {
						volume = 0
					}

					// Send embed
					fields = [
						{ name:"Current Price (USD)" ,value: formatMoney(stockPrice)},
						{ name:"Previous Close", value: formatMoney(previousClose)},
						{ name:"Difference (%)" ,value: 100 * stockPercentageDiff},
						{ name:"Market Cap" ,value: formatMoney(marketCap)},
						{ name:"Volume" ,value: volume}
					]
					message.channel.send(printEmbed(stockName, fields, usStockImg))

				  }
				}
			  });
		}
});

client.login(token)
