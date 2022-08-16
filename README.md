# Investment Tracker Discord Bot

## Introduction

A Discord bot that sends up to date info on stock and crypto prices. It also can fetch news on any crypto or show you random stocks or cryptos. It can also show you the top results for percentage increase/decrease, market cap, volume for crypto.

## Commands

!stock [ticker]
  - Will send a message with the stock info

!crypto [ticker]
  - Will send a message with the crypto info

!random [stock or crypto]
  - Will send a randomly chosen stock or crypto
  
!sort gainers
  - Sends info on top 3 highest gainers in last 24 hours

!sort losers
  - Sends info on top 3 highest losers in last 24 hours
  
!sort marketcap
  - Sends info on current top 3 highest market caps
  
!sort volume
  - Sends info on top 3 24 hour volumes
  
!news [crypto]
  - Sends latest news stories of any crypto

## Technologies

- Node JS
- Discord JS
- Yahoo Finance API
- Coin Gecko API
- Crypto Panic API

## Running

```sh
node main.js
node news.js
```
