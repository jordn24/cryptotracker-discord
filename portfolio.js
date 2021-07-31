const discord = require('discord.js')

const { prefix } = require('./config.json');
const { token, MONGO_SRV } = require('./api_keys.json');

const client = new discord.Client();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const mongoose = require('mongoose');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumSignificantDigits: 4
  })

const green = '#33FF4C'
const red = '#FF3333'

function formatMoney(number) {
	return formatter.format(number);
}

function portfolioEmbed(){
    // returns nice embed message
}
// Connect to Mongo DB 
mongoose.connect(MONGO_SRV,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    userFindAndModify: false
}).then(() => {
    console.log("Connected to DB!")
}).catch((err) => {
    console.log(err)
});

client.on('message', async message => {

    if (message.content.toLowerCase().includes(prefix + 'portfolio help')){
        // Send help embed message
        title = ":briefcase: Portfolio Commands"
        command_string = "portfolio, portfolio create, portfolio buy , portfolio sell, portfolio delete"

        message.channel.send(embed = new discord.MessageEmbed()
        .setTitle(title)
        .setDescription(command_string)
        )
    }

    if (message.content.toLowerCase().includes(prefix + 'portfolio ')){
        // Show your own portfolio or who ever you tagged
          
        return
    }

    if (message.content.toLowerCase().includes(prefix + 'portfolio create ')){
        // Creates portfolio with name specified after create
        return
    }

    if (message.content.toLowerCase().includes(prefix + 'portfolio buy ')){
        // Adds crypto and amount from parameters
        return
    }

    if (message.content.toLowerCase().includes(prefix + 'portfolio sell ')){
        // Removes crypto and amount from parameters
        return
    }

    if (message.content.toLowerCase().includes(prefix + 'portfolio delete ')){
        // Deletes specified portfolio
        return
    }

});

client.login(token)
