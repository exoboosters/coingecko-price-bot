const dotenv = require('dotenv')
const fetch = require('node-fetch')

dotenv.config()

exports.fetchData = async () => {
  try {
    const tokenData = await (await fetch(`https://api.coingecko.com/api/v3/coins/${process.env.TOKEN_ID}`)).json()

    const price = tokenData.market_data.current_price.usd
    const symbol = tokenData.symbol.toUpperCase()
    let change
    if (tokenData.market_data.price_change_percentage_24h > 0) {
      change = '⬆️' + tokenData.market_data.price_change_percentage_24h + '%'
    }
    else {
      change = '⬇️' + tokenData.market_data.price_change_percentage_24h + '%'
    }
    console.log('Price ' + price + 'Change ' + change)

    return { price, symbol, change }
  } catch (err) {
    console.log(err)
    return undefined
  }
}
