const discord = require('discord.js')

const { prefix } = require('./config.json');
const { token } = require('./api_keys.json');

const client = new discord.Client();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const green = '#33FF4C'
const red = '#FF3333'

function formatMoney(number) {
	return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
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
				{ name:"$AUD" ,value: "$" + formatMoney(data["data"]["market_data"]["current_price"]["aud"])},
				{ name:"$USD" ,value: "$" + formatMoney(data["data"]["market_data"]["current_price"]["usd"])},
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
					{ name:"$AUD" ,value: "$" + formatMoney(data["data"]["market_data"]["current_price"]["aud"])} ,
					{ name:"$USD" ,value: "$" + formatMoney(data["data"]["market_data"]["current_price"]["usd"])} ,
					{ name:"% Difference" ,value: data["data"]["market_data"]["price_change_percentage_24h"] + "%" }
				]
				message.channel.send(printEmbed(coinName.toUpperCase(), fields, data["data"]["image"]["large"]))
				return
		
			}

			if (message.content.toLowerCase().includes('stock')){
				message.channel.send("Not working yet.")
			}

		}

	// STOCK DATA COMMAND
		if (message.content.toLowerCase().includes(prefix + 'stock ')){
			
			return
		}

});

client.login(token)
