const discord = require('discord.js')

const { prefix } = require('./config.json');
const { token } = require('./api_keys.json');

const client = new discord.Client();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

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
			message.channel.send(coinName.toUpperCase())
			message.channel.send("AUD: $" + data["data"]["market_data"]["current_price"]["aud"])
			message.channel.send("USD: $" + data["data"]["market_data"]["current_price"]["usd"])
			message.channel.send("24 Hour Change: " + data["data"]["market_data"]["price_change_percentage_24h"] +
				"%")
			
			return
		}

	// STOCK DATA COMMAND
		if (message.content.toLowerCase().includes(prefix + 'stock ')){
			
			return
		}

});

client.login(token)
