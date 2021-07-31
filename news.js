const discord = require('discord.js')
const Cryptopanic = require('cryptopanic')
const { prefix } = require('./config.json');
const { token, news_API } = require('./api_keys.json');

const client = new discord.Client();
let cp = new Cryptopanic({auth_token: news_API})

news_limit = 3;

client.on('message', async message => {

    if (message.content.toLowerCase().includes(prefix + "news ")){

        input = message.content.toUpperCase().substr(5)

        cp.currencies([input])
        .filter('trending')
        .fetchPosts()
        .then((value) => {
          for (let i = 0; i < news_limit; i++ ) {
            date_pub = value[i]["published_at"].split("T")[0]
            message.channel.send(date_pub + ": " + value[i]["url"])
          }
        })
        .catch((err) => {
            message.reply("Couldn't find any news for that coin.")
            console.log(err)
        })
    }

});

client.login(token)