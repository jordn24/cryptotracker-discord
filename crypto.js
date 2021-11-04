const discord = require('discord.js')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();


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

function printEmbed(title, data) {

    console.log(data)

    // Send embed
    fields = [
        { name:"$AUD" ,value: formatMoney(data["data"]["market_data"]["current_price"]["aud"])},
        { name:"$USD" ,value: formatMoney(data["data"]["market_data"]["current_price"]["usd"])},
        { name:"Market Cap $USD" ,value: formatMoney(data["data"]["market_data"]["market_cap"]["usd"])},
        { name:"24 HR Difference" ,value: data["data"]["market_data"]["price_change_percentage_24h"]},
        { name:"7 Day Difference" ,value: data["data"]["market_data"]["price_change_percentage_7d"] + "%"},
        { name:"30 Day Difference" ,value: data["data"]["market_data"]["price_change_percentage_30d"] + "%"},
        { name:"Volume $USD" ,value: formatMoney(data["data"]["market_data"]["total_volume"]["usd"])}
    ]

	// Green or red colour
	if(fields[3].value > 0){
		colour = green
	} else {
		colour = red
	}
    fields[3].value = fields[3].value + "%"

    for  (var i = 0; i < fields.length; i++){
        if (fields[i].value == "$0.000" || fields[i].value == "0%"){
            fields[i].value = "N/A"
        }
    }

	return embed = new discord.MessageEmbed()
				.setColor(colour)
				.setTitle(title)
				.addFields(fields)
				.setImage(data["data"]["image"]["large"])
}

async function getCryptoByTicker(input){
    
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
        return "No Ticker Found for " + input
    }

    // Retrieve Data
    data = await CoinGeckoClient.coins.fetch(coinId, {});
    
    return printEmbed(coinName.toUpperCase(), data)
}

async function getCryptoPrice(ticker, currency="aud"){
    currency = currency.toLowerCase()
    
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
        return null
    }

    // Retrieve Data
    data = await CoinGeckoClient.coins.fetch(coinId, {});

    return data["data"]["market_data"]["current_price"][currency]
}

async function getRandomCrypto(){
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

    return printEmbed(coinName.toUpperCase(), data)
}

async function getSortedCryptoList(sort){

    switch(input.toLowerCase().replace(/\s+/g, '')) {
        case "gainers":
            sort = CoinGecko.ORDER.HOUR_24_DESC
            break;
        case "losers":
            sort = CoinGecko.ORDER.HOUR_24_ASC
            break;
        case "marketcap":
            sort = CoinGecko.ORDER.MARKET_CAP_DESC
            break;
        case "volume":
            sort = CoinGecko.ORDER.VOLUME_DESC
            break;
        default:
            return "Thats not an option. Use help sort command"
    }

    params = {order: sort}
    // Get list of coins in order
    data = await CoinGeckoClient.coins.all(params);
    coinIds = [data['data'][0]['id'], data['data'][1]['id'], data['data'][2]['id']]

    outputMsg = []

    for (var i = 0; i < coinIds.length; i++) {

        // Retrieve Data
        data = await CoinGeckoClient.coins.fetch(coinIds[i], {});
        coinName = data["data"]["name"]

        outputMsg.push(printEmbed(coinName.toUpperCase(), data))
    }
    return outputMsg
}

module.exports = { getCryptoByTicker, getRandomCrypto, getSortedCryptoList, getCryptoPrice };