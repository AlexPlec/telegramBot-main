const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const cron = require('node-cron');
const keys = require('./keys');
const postsParametrs = require('./postsParametrs');

let isTaskRunning = false;

const bot = new TelegramBot(keys.token, { polling: true });

bot.on("polling_error", console.log);

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  try {
    if (msg.text === '/menu') {
      // Create the menu button object with inline keyboard
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: 'start bot', callback_data: 'start_bot' },
              { text: 'stop bot', callback_data: 'stop_bot' },
              { text: 'test post', callback_data: 'test_post' },
            ],
          ],
        }),
      };

      // Send the message with the menu buttons
      await bot.sendMessage(chatId, 'Select an action:', options);
    } else {
      await bot.sendMessage(chatId, 'Unknown command. Use /menu to see available options.');
    }
  } catch (error) {
    handleError(chatId, error);
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    await bot.answerCallbackQuery(query.id); // Acknowledge the button click

    switch (data) {
      case 'start_bot':
        if (isTaskRunning) {
          await bot.sendMessage(chatId, 'The bot is already running.');
        } else {
          isTaskRunning = true;
          await bot.sendMessage(chatId, 'The bot is now started.');
        }
        break;
      case 'stop_bot':
        isTaskRunning = false;
        await bot.sendMessage(chatId, 'The bot is stopped.');
        break;
        case 'test_post':
          await testPost();
          break;
      default:
        await bot.sendMessage(chatId, 'Invalid button selection.');
    }
  } catch (error) {
    // handleError(chatId, error);
    console.log(error);
  }
});

function testPost() {
  sendFiles(postsParametrs.timeRanges[1].content, 7, 10000, '#memes');
};

function sendMessage(messageArray) {
  bot.sendMessage(keys.chanelChatIdTest, getRandomMessage(messageArray));
};

async function sendFiles(filesFolder,numberOfPosts,postInterval,caption) {
  try {
      const files = fs.readdirSync(filesFolder);
    for (let i = 0; i < numberOfPosts; i++) {
      const isImage = files[i].endsWith('.jpg') || files[i].endsWith('.jpeg') || files[i].endsWith('.png'); // Check file extension
      const isVideo = files[i].endsWith('.mp4'); // Check file extension

      const filePath = `${filesFolder}/${files[i]}`;
      setTimeout(async () => {
      if (isImage) {
        console.log(`Sending image: ${filePath}`);
          await bot.sendPhoto(keys.chanelChatIdTest, filePath,{caption:caption,contentType: 'image/jpeg' });
      } else if (isVideo) {
        console.log(`Sending video: ${filePath}`);
         await bot.sendVideo(keys.chanelChatIdTest, filePath,{caption:caption,contentType: 'video/mp4' });
      }
      fs.unlink(filePath, (err) => {
        if(err) throw err;
        console.log(`file was deleted ${filePath}`);
      });
    }, postInterval * i);
     
    }
  } catch (error) {
    console.error(`Error reading file list: ${error.message}`);
    console.log(error);
  }
};

function getRandomMessage(messageArray) {
  return messageArray[Math.floor(Math.random() * messageArray.length)];
} 

function createPostIntervalInMs(start, end, numberOfPosts) {
  const durationInHours = Math.abs(start - end);
  return ((durationInHours * 60) / numberOfPosts) * 60 * 1000;
}

function createPostinterval() {
  postsParametrs.timeRanges.forEach((range) => {
    if (range.message !== 'text') {
      range.postInterval = createPostIntervalInMs(range.start, range.end, range.numberOfPosts);
    }
  });
};

createPostinterval();

cron.schedule('0 */1 * * *',async () => {
  if(isTaskRunning) {
    const currentHour = new Date().getHours();
    for (const range of postsParametrs.timeRanges) {
      if (currentHour >= range.start && currentHour <= range.end) {
        const { message, content, numberOfPosts, postInterval, caption } = range;
  
        if (message === 'text') {
          sendMessage(content); // Send text messages
        } else {
          await sendFiles(content, numberOfPosts, postInterval,caption); // Send files folder path
        }
        break; // Exit after matching case
      }
    }
  } else {
    console.log('running a task every one minutes');
  }
 
});