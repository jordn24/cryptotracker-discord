

const discord = require('discord.js')
const { token } = require('./api_keys.json');
const client = new discord.Client();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const { prefix } = require('./config.json');


const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumSignificantDigits: 4
  })

function formatMoney(number) {
	return formatter.format(number);
}

client.on('message', async message => {
	
	if (message.content.toLowerCase().includes(prefix + 'convert ')){
		input = message.content.toLowerCase().substr(9);
		input_f = input.split(" ");
		
		if (input_f.length != 2){
			console.log("Array didn't work");
			return
		}

		ticker = input_f[1]
		amount = input_f[0]
	
		if(!(/^\d+$/.test(amount))){
			if(amount.includes(".")){
				console.log("Theres a full stop...");
				amount_test = amount.replace(".", "");
				console.log(amount_test);
				if(!(/^\d+$/.test(amount_test))){
					return;
				}
			} else {
				return;
			}
		}

		// Search with ticker
		data = await CoinGeckoClient.coins.list();
		length = data["data"].length
		coinId = "empty"
		for (var i = 0; i < length; i++) {
			if (data["data"][i]["symbol"] == ticker) {
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

		current_aud_val = data["data"]["market_data"]["current_price"]["aud"] * amount;

		message.channel.send(amount + " " + ticker.toUpperCase() + " is " + formatMoney(current_aud_val) + " AUD");

	}

});

client.login(token)

