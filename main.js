const discord = require('discord.js')
const fs = require('fs');;

const { prefix, token, insults } = require('./config.json');
const client = new discord.Client();

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

var users = {}

client.on('ready', () => {
	// read JSON object from file
    fs.readFile('users.json', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    // parse JSON object
    users = JSON.parse(data.toString());
    });
});

client.on('message', async message => {

		// Basic data commands
		if (message.content.toLowerCase() === '!shiba help'){
			message.channel.send("\n!shiba \n !shiba mc \n !shiba ath \n !shiba vol \n !shiba bal \n !shiba buy \n !shiba sell")
			return
		}

		if (message.content.toLowerCase() === '!shiba'){
			let data = await CoinGeckoClient.coins.fetch('shiba-inu', {});
			message.channel.send("\nAUD: $" + data["data"]["market_data"]["current_price"]["aud"])
			message.channel.send("\nUSD: $" + data["data"]["market_data"]["current_price"]["usd"])
                        message.channel.send("24 Hour Change: " + data["data"]["market_data"]["price_change_percentage_24h"] +
				"%")
			return
		}
		if (message.content.toLowerCase() === '!ada'){
			let data = await CoinGeckoClient.coins.fetch('cardano', {});
			message.channel.send("\nAUD: $" + data["data"]["market_data"]["current_price"]["aud"])
			message.channel.send("\nUSD: $" + data["data"]["market_data"]["current_price"]["usd"])
												message.channel.send("24 Hour Change: " + data["data"]["market_data"]["price_change_percentage_24h"] +
				"%")
			return
		}
		if (message.content.toLowerCase() === '!btc'){
			let data = await CoinGeckoClient.coins.fetch('bitcoin', {});
			message.channel.send("\nAUD: $" + data["data"]["market_data"]["current_price"]["aud"])
			message.channel.send("\nUSD: $" + data["data"]["market_data"]["current_price"]["usd"])
												message.channel.send("24 Hour Change: " + data["data"]["market_data"]["price_change_percentage_24h"] +
				"%")
			return
		}
    if (message.content.toLowerCase() === '!doge'){
      let data = await CoinGeckoClient.coins.fetch('dogecoin', {});
      message.channel.send("\nAUD: $" + data["data"]["market_data"]["current_price"]["aud"])
      message.channel.send("\nUSD: $" + data["data"]["market_data"]["current_price"]["usd"])
                        message.channel.send("24 Hour Change: " + data["data"]["market_data"]["price_change_percentage_24h"] +
        "%")
      return
    }

    if (message.content.toLowerCase() === '!shiba ath'){
      let data = await CoinGeckoClient.coins.fetch('shiba-inu', {});
			message.channel.send("All Time Highs: ")
      message.channel.send("AUD: $" + data["data"]["market_data"]["ath"]["aud"])
      message.channel.send("USD: $" + data["data"]["market_data"]["ath"]["usd"])
      return
		}
    if (message.content.toLowerCase() === '!shiba vol'){
      let data = await CoinGeckoClient.coins.fetch('shiba-inu', {});
      message.channel.send("Volume 24 Hrs:\n AUD: $" + data["data"]["market_data"]["total_volume"]["aud"])
    	message.channel.send("USD: $" + data["data"]["market_data"]["total_volume"]["usd"])
			return
		}

});

client.login(token)
