

const discord = require('discord.js')
const { token } = require('./api_keys.json');
const client = new discord.Client();
const { getCryptoPrice } = require('./crypto');
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

		getCryptoPrice(ticker).then((output) => {
			current_aud_val = output * amount;
			if (current_aud_val == 0){
				message.channel.send("No Ticker Found for " + ticker)
			} else {
				message.channel.send(amount + " " + ticker.toUpperCase() + " is " + formatMoney(current_aud_val) + " AUD");
			}
		})
	}

});

client.login(token)

