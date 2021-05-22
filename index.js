const Discord = require('discord.js');
const client = new Discord.Client();
const myToken = process.env['TOKEN'];
const fetch = require('node-fetch');
const Database = require('@replit/database');
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
		quotes().then(quote => msg.channel.send(quote));
	}

	if (sadWords.some(word => msg.content.includes(word))) {
    message.react('😥');
		db.get('encouragements').then(encouragements => {
			const encouragement =
			  encouragements[Math.floor(Math.random() * encouragements.length)];
			msg.reply(encouragement);
		});
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
