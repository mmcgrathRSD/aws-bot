const { BotFrameworkAdapter, ConversationState, InputHints, MemoryStorage, UserState, ActivityTypes } = require('botbuilder');

import { ApplicationBot } from './bot';

// Import required packages
const path = require('path');
const restify = require('restify');

// Note: Microsoft Stuffs
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});


// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

server.get('/testing', (request, response) => {
    response.send('HEy!');
});


const bot = new ApplicationBot();

// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (context) => {
        await bot.onTurn(context);
    });
});

// Listen for Upgrade requests for Streaming.
// server.on('upgrade', (req, socket, head) => {
//     // Create an adapter scoped to this WebSocket connection to allow storing session data.
//     const streamingAdapter = new BotFrameworkAdapter({
//         appId: process.env.APP_ID,
//         appPassword: process.env.APP_SECRET
//     });
//     // Set onTurnError for the BotFrameworkAdapter created for each connection.
//     streamingAdapter.onTurnError = onTurnErrorHandler;

//     streamingAdapter.useWebSocket(req, socket, head, async (context) => {
//         // After connecting via WebSocket, run this logic for every request sent over
//         // the WebSocket connection.
//         //await bot.run(context);
//     });
// });