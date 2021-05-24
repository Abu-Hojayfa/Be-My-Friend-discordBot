const Discord = require('discord.js');
const client = new Discord.Client();
const myToken = process.env['TOKEN'];
const fetch = require('node-fetch');
const Database = require('@replit/database');
const myWhter = process.env['whter Api']
const myGifi = process.env['gifi']
const keepAlive = require('./server');
const db = new Database();


const sadWords = [
	'sad',
	'depressed',
	'unhappy',
	'angry',
	'lose',
	'break',
	'down'
];

const starterEncouragements = [
	'Cheer up!',
	'You are a great person',
	'Just chill Man',
	'Everything will be okay',
	'Be patient',
	'Do for yourself'
];

db.get('encouragements').then(encouragements => {
	if (!encouragements || encouragements.length < 1) {
		db.set('encouragements', starterEncouragements);
	}
});

const quotes = () => {
	return fetch('https://zenquotes.io/api/random')
		.then(res => {
			return res.json();
		})
		.then(data => {
			return data[0]['q'] + '-' + data[0]['a'];
		});
};


const gifs = (text) => {
	return fetch(`http://api.giphy.com/v1/gifs/search?q=${text}&api_key=${myGifi}&limit=1`)
		.then(res => {
			return res.json();
		})
		.then(data => {
			return data.data[0].embed_url;
		});
};

const stickersApi = (sText) => {
	return fetch(`https://api.giphy.com/v1/stickers/search?q=${sText}&api_key=${myGifi}&limit=25&offset=0&rating=g&lang=en`)
		.then(res => {
			return res.json();
		})
		.then(data => {
			return data.data[0].embed_url;
		});
};

const weather = (location) => {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location?location:'dhaka'}&appid=${myWhter}&units=metric`)
  .then(res => {
			return res.json();
		})
		.then(data => {
			return data;
		});
}


const updateEncouragements = encouragingMessage => {
	db.get('encouragements').then(encouragements => {
		encouragements.push([encouragingMessage]);
		db.set('encouragements', encouragements);
	});
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content === '!inspire') {
    msg.react('❤');
		quotes().then(quote => msg.channel.send(quote));
	}

	if (sadWords.some(word => msg.content.includes(word))) {
    msg.react('😥');
		db.get('encouragements').then(encouragements => {
			const encouragement =
			  encouragements[Math.floor(Math.random() * encouragements.length)];
			msg.reply(encouragement);
		});
	}

  if(msg.content.startsWith("!gif")){
      const gifName = msg.content;
      const findGif = gifName.split("!gif ")[1];
      if(findGif !== ""){
        gifs(findGif)
       .then(gif => msg.channel.send(gif))
       .catch(err => msg.channel.send("Cannot send any gif right now")) 
      }
  }

  
  if(msg.content.startsWith("!sticker")){
      const stickerName = msg.content;
      const findSticker = stickerName.split("!sticker ")[1];
      if(findSticker !== ""){
        stickersApi(findSticker)
       .then(sticker => msg.channel.send(sticker))
       .catch(err => msg.channel.send("Cannot send any sticker right now")) 
      }
  }

  if(msg.content.startsWith("!weather")){
    const locationName = msg.content;
    const findLocation = locationName.split("!weather ")[1];

    weather(findLocation)
    .then(tempData => msg.reply(`In ${findLocation?findLocation.toUpperCase():'DHAKA'}, weather is ${tempData.weather[0].description}. Current temperature is ${tempData.main.temp}°C. But feels like ${tempData.main.feels_like}°C  for  ${tempData.main.humidity}% humidity.`))
    .catch(err => msg.channel.send("Cannot send any weather Info right now foe internal server ERROR or For your spell mistake. Hope I will Okay soon")) 
  }

  if(msg.content.startsWith("!Hello")){
    msg.reply("Hi, my gorgeous friend! type ' !inspire ' for a wonderful quote")
  }
  if(msg.content.startsWith("!hello")){
    msg.reply("Hi, my gorgeous friend! type ' !inspire ' for a wonderful quote")
  }
  if(msg.content.startsWith("!hi")){
    msg.reply("Hi, my gorgeous friend! type ' !inspire ' for a wonderful quote")
  }
  if(msg.content.startsWith("!Hi")){
    msg.reply("Hi, my gorgeous friend! type ' !inspire ' for a wonderful quote")
  }
  if(msg.content.startsWith("!hey")){
    msg.reply("Hi, my gorgeous friend! type ' !inspire ' for a wonderful quote")
  }

	if (msg.content.startsWith('!new')) {
		encouragingMessage = msg.content.split('!new ')[1];
		updateEncouragements(encouragingMessage);
		msg.channel.send('New encouraging message added.');
	}
});

keepAlive();
client.login(myToken);
