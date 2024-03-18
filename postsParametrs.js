const goodMorningMessegesArray = ['Доброе Утро', 'Доблое Утло', 'Доброе Утро Котики', 'Доброе Утро Злючки'];
const goodNightMessegesArray = ['Спокойной Ночи', 'Спокойной Спатьки', 'Спокойной Спатьки Котики', 'Спокойной спатьки Злючки'];
const memesFolderPath = "files/posts/memes";
const cuteFilesFolderPath = "files/posts/cuteFiles";
const nsfwFolderPath = "files/posts/nsfw";

const timeRanges = [
  { start: 9.00, end: 9.10, message: 'text', content: goodNightMessegesArray},
  { start: 10, end: 12, message: 'file', content: memesFolderPath, numberOfPosts: 2, caption:'#memes'},
  { start: 13, end: 17, message: 'file', content: cuteFilesFolderPath, numberOfPosts: 2,caption:'#cute'},
  { start: 18, end: 20, message: 'file', content: memesFolderPath, numberOfPosts: 2,caption:'#memes'},
  { start: 21, end: 22, message: 'file', content: nsfwFolderPath, numberOfPosts: 10,caption:'#nsfw'},
  { start: 23.00, end: 23.10, message: 'text', content: goodMorningMessegesArray},
];

module.exports = {
    timeRanges,
  };