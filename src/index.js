const express = require('express');
const app = express();
const port = 3000;
const request = require('request')

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const {
    Client
} = require('discord.js')
const {
    MessageEmbed
} = require('discord.js');
const dotenv = require('dotenv')

const {
    fetchData
} = require('./fetchData')
const {
    numberWithCommas
} = require('./utils')

dotenv.config()

const client = new Client()

// eslint-disable-next-line
client.on('ready', () => console.log(`Bot successfully started as ${client.user.tag} 🤖`))

// Updates token price on bot's nickname every X amount of time
client.setInterval(async () => {
    const data = await fetchData()

    if (!data) return

    const {
        price,
        symbol,
        change
    } = data
    console.log('Price ' + price + ' Change ' + change)

    client.user.setActivity(
        `${symbol} Price: $${numberWithCommas(price)} ${change}`, {
            type: 'WATCHING'
        },
    )
}, 1 * 60 * 1000)


client.login(process.env.DISCORD_API_TOKEN)

client.on('message', (msg) => {

    if (msg.content === `$price`) {
        return request('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=boring-protocol', (err, response, body) => {
            //console.log(body);
            if (err) throw (err);
            var object = JSON.parse(body);
            var val = object[0].current_price;
            var ch = object[0].price_change_percentage_24h + '%';
            msg.channel.send(`BOP current price: **$${val}**. Percentage changed in the last 24 hrs is **${ch}**`)
            msg.react("💹");
        });
    }
});
