const TelegramApi = require('node-telegram-bot-api');

const {gameOption, againOption} = require('./options');

const token = '6071925762:AAGKWLgOWix6n9IMw3rCvUiRdjZB9h2azfM';

const bot = new TelegramApi(token, {polling: true});

const chats = {};



const startGame = async  (chatId) => {
    await  bot.sendMessage(chatId, 'Now I will think of a number from 0 to 9, and you have to guess it');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess, Guess', gameOption)
};


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Initial greeting'},
        {command: '/info', description: 'Getting information about the user'},
        {command: '/game', description: 'Start the game'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/2.webp');
            return  bot.sendMessage(chatId, `Welcome to Telegram Bot`)
        }
        if (text === '/info'){
            return  bot.sendMessage(chatId, `Your name ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}`)
        }

        if (text === '/game'){
            return  startGame(chatId)
        }

        return bot.sendMessage(chatId, `i don't understand, try again`)
    });
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again'){
            return startGame(chatId)
        }

        if (data === chats[chatId]){
            return bot.sendMessage(chatId, `Congratulations, you guessed the number ${chats[chatId]}`,againOption)
        } else {
            return bot.sendMessage(chatId, `Unfortunately, you did't guess, bot guessed the number ${chats[chatId]}`,againOption)
        }
    })
};

start();
