const discord = require('discord.js')

const { prefix } = require('./config.json');
const { token } = require('./api_keys.json');
const { getCryptoByTicker, getRandomCrypto, getSortedCryptoList } = require('./crypto');
const client = new discord.Client();
const yahooFinance = require('yahoo-finance');
var fs = require("fs");
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumSignificantDigits: 4
  })

const usStockImg = "https://eturbonews.com/wp-content/uploads/2017/03/0a13_2.jpg"
const green = '#33FF4C'
const red = '#FF3333'
const us_stocks_file = "us_stocks.txt"
const num_of_stocks = 607

function formatMoney(number) {
	return formatter.format(number);
}

function printEmbed(title, fields, image) {
	// Green or red colour
	if(fields[3].value > 0){
		colour = green
	} else {
		colour = red
	}
	fields[3].value = fields[3].value + "%"

	if(fields.length == 7){
		if (fields[6].value == "0%"){
			fields[6].value = "N/A"
		}
	}

	if (fields[2].value == "$0.000"){
		fields[2].value = "N/A"
	}

	return embed = new discord.MessageEmbed()
				.setColor(colour)
				.setTitle(title)
				.addFields(fields)
				.setImage(image)
}

client.on('message', async message => {

	// PING COMMAND
		if (message.content.toLowerCase() === prefix + 'ping'){
			message.channel.send("Pinging...").then(m =>{
				// The math thingy to calculate the user's ping
				  var ping = m.createdTimestamp - message.createdTimestamp;
	  
				// Basic embed
				  var embed = new discord.MessageEmbed()
				  .setAuthor(`Your ping is ${ping}`)

				  m.delete()
				  message.reply(embed)
			});
		}

	// CRYPTO DATA COMMAND
		if (message.content.toLowerCase().includes(prefix + 'crypto ')){
			
			input = message.content.toLowerCase().substr(8)
		
			getCryptoByTicker(input).then((output) => {
				message.channel.send(output)
			}).catch(console.log)
			
			return
		}

	// RANDOM COMMANDS
		if (message.content.toLowerCase().includes(prefix + 'random ')){
			
			if (message.content.toLowerCase().includes('crypto')){
				getRandomCrypto().then((output) => {
					message.channel.send(output)
				}).catch(console.log)
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
						stockPostMarket = quote["price"]["postMarketChangePercent"]
						if (stockPostMarket == null) {
							stockPostMarket = 0
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
							{ name:"Market Cap" ,value: formatMoney(marketCap)},
							{ name:"Price Change" ,value: 100 * stockPercentageDiff},
							{ name:"Post Market" ,value: 100 * stockPostMarket},
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
					stockPostMarket = quote["price"]["postMarketChangePercent"]
					if (stockPostMarket == null) {
						stockPostMarket = 0
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

					console.log(quote["price"])

					// Send embed
					fields = [
						{ name:"Current Price (USD)" ,value: formatMoney(stockPrice)},
						{ name:"Previous Close", value: formatMoney(previousClose)},
						{ name:"Market Cap" ,value: formatMoney(marketCap)},
						{ name:"Price Change" ,value: 100 * stockPercentageDiff},
						{ name:"Post Market" ,value: (100 * stockPostMarket) + "%"},
						{ name:"Volume" ,value: volume}
					]
					message.channel.send(printEmbed(stockName, fields, usStockImg))

				  }
				}
			  });
		}

	// SORT CRYPTO COMMAND
		if (message.content.toLowerCase().includes(prefix + 'sort ')){
			input = message.content.toLowerCase().substr(6)
			sort = ""

			getSortedCryptoList(sort).then((output) => {
				for(var i = 0; i < output.length; i++){
					message.channel.send(output[i])
				}
			}).catch(console.log)
		}

	// HELP SORT COMMAND
	if (message.content.toLowerCase().includes(prefix + 'help sort')){

		fields = [
			{name: "gainers", value: "Highest 24 hour growth"},
			{name: "losers", value: "Lowest 24 hour growth"},
			{name: "marketcap", value: "Highest Market Cap"},
			{name: "volume", value: "Highest Volume"}
		]

		embed = new discord.MessageEmbed()
			.setTitle("Sort Commands")
			.addFields(fields)
		message.channel.send(embed)
		return
	}
});

client.login(token)
