const fetch = require("node-fetch");
const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const api_weather = config.WEATHER_API_KEY;

async function weather(message, place) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${api_weather}&q=${place}&aqi=yes`
  );
  if (!response.ok) {
    message.reply("Please enter a nearby town.");
    return;
  }
  const data = await response.json();
  let temp = data.current.temp_c;
  let location = data.location.name + ", " + data.location.region;
  let aqi = data.current.air_quality.pm2_5.toFixed(3);
  let weather = data.current.condition.text;
  message.reply(
    `Temperature at ${location} is ${temp} C, Weather is ${weather} and PM 2.5 Level is ${aqi}`
  );
}

async function forecast(message, place) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${api_weather}&q=${place}&days=3&aqi=yes&alerts=yes`
  );
  const data = await response.json();
  for (let i = 0; i < 3; i++) {
    let final_reply="";
    final_reply=final_reply.concat(`On ${data.forecast.forecastday[i].date}:\n`);
    final_reply=final_reply.concat(`   Weather is ${data.forecast.forecastday[i].day.condition.text}, Average Temperature is ${data.forecast.forecastday[i].day.avgtemp_c} C and Humidity is ${data.forecast.forecastday[i].day.avghumidity}\n`);
    final_reply=final_reply.concat(`   Chances of Rain are ${data.forecast.forecastday[i].day.daily_will_it_rain} %\n`);
    final_reply=final_reply.concat(`   Sunrise is at ${data.forecast.forecastday[i].astro.sunrise} and sunset at ${data.forecast.forecastday[i].astro.sunset}\n`);
    message.reply(final_reply);
  }
}

const prefix = "!";

bot.on("messageCreate", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const argument = message.content.slice(prefix.length).split(" ");
  argument.shift();

  if (argument[0].toLowerCase() == "weather") {
    if (argument.length > 2)
      message.reply("Enter a valid command to see weather.");
    else weather(message, argument[1].toLowerCase());
  } else if (argument[0].toLowerCase() == "forecast") {
    if (argument.length > 2)
      message.reply("Enter a valid command to see forecast.");
    else forecast(message, argument[1].toLowerCase());
  } else message.reply("Enter a valid command");
});

bot.login(config.BOT_TOKEN);
