const fetch = require("node-fetch");
const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const api_weather=config.WEATHER_API_KEY;
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
  message.reply(
    `Temperature at ${location} is ${temp} C and PM 2.5 Level is ${aqi}`
  );
}

const prefix = "#";

bot.on("messageCreate", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const argument = message.content.slice(prefix.length).split(" ");
  argument.shift();

  if (argument[0].toLowerCase() == "weather") {
    if (argument.length > 2) {
      message.reply("Enter a valid command to see weather.");
    } else {
      weather(message, argument[1].toLowerCase());
    }
  } else message.reply("Enter a valid command");
});

bot.login(config.BOT_TOKEN);
