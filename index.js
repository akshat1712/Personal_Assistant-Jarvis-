// Getting important functionality to call API in Javascript

const fetch = require("node-fetch");
const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

// Weather API key
const api_weather = config.WEATHER_API_KEY;
const news_api=config.NEWS_API_KEY;
const prefix = "!";

// used to get weather functionality
async function weather(message, place) {
  const weather = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${api_weather}&q=${place}&aqi=yes`
  );

  if (!weather.ok) {
    message.reply("Please enter a nearby town.");
    return;
  }

  const data = await weather.json();
  let temp = data.current.temp_c;
  let location = data.location.name + ", " + data.location.region;
  let aqi = data.current.air_quality.pm2_5.toFixed(3);
  let weather_cond = data.current.condition.text;
  message.reply(
    `Temperature at ${location} is ${temp} C, Weather is ${weather_cond} and PM 2.5 Level is ${aqi}`
  );
}

// Used for forecast functionaloity
async function forecast(message, place) {
  const forecast = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${api_weather}&q=${place}&days=3&aqi=yes&alerts=yes`
  );

  if (!forecast.ok) {
    message.reply("Please enter a nearbuy town.");
    return;
  }

  const data = await forecast.json();
  for (let i = 0; i < 3; i++) {
    let final_reply = "";
    final_reply = final_reply.concat(
      `On ${data.forecast.forecastday[i].date}:\n`
    );
    final_reply = final_reply.concat(
      `   Weather is ${data.forecast.forecastday[i].day.condition.text}, Average Temperature is ${data.forecast.forecastday[i].day.avgtemp_c} C and Humidity is ${data.forecast.forecastday[i].day.avghumidity}\n`
    );
    final_reply = final_reply.concat(
      `   Chances of Rain are ${data.forecast.forecastday[i].day.daily_will_it_rain} %\n`
    );
    final_reply = final_reply.concat(
      `   Sunrise is at ${data.forecast.forecastday[i].astro.sunrise} and Sunset at ${data.forecast.forecastday[i].astro.sunset}\n`
    );
    message.reply(final_reply);
  }
}

async function bnews_country( message,country = "in", category = "general") {
  const news_country = await fetch(
    `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&sortBy=popularity&apiKey=${news_api}`
  );

  const data= await news_country.json();
  let reply_news="";
  for( let i=0;i<5;i++){
    reply_news=reply_news.concat(`${i+1}: `);
    reply_news=reply_news.concat(data.articles[i].title).concat('\n\n');

    reply_news=reply_news.concat( data.articles[i].description).concat('...\n\n'); 
  }
  message.reply(reply_news);
}

// When User puts a message, this is initiated
bot.on("messageCreate", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const argument = message.content.slice(prefix.length).split(" ");
  argument.shift();

  if (argument[0].toLowerCase() == "weather")
  {
      if (argument.length > 2)
        message.reply("Enter a valid command to see weather.");
      else weather(message, argument[1].toLowerCase());
  }
  else if (argument[0].toLowerCase() == "forecast")
  {
      if (argument.length > 2)
        message.reply("Enter a valid command to see forecast.");
      else forecast(message, argument[1].toLowerCase());
  } 
  else if( argument[0].toLowerCase()=='news')
  {
      if( argument.length==1)
          bnews_country(message);
      else if( argument.length==2)
          bnews_country(message,argument[1]);
      else if( argument.length==3)
          bnews_country(message,argument[1],argument[2]);
      else  
          message.reply("Enter a valid command to see News");
  }  
   else message.reply("Enter a valid command");
});



// To login the bot into Discord server
bot.login(config.BOT_TOKEN);
