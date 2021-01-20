const fetch = require("node-fetch");
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

client.login(process.env.botToken);

client.on("ready", () => {
    console.log("logged in as " + client.user.tag);
    var general = client.channels.cache.get("798792038518620161");
    client.user.setActivity("CSGO");
    general.send("Bot logged in");
    });

client.on("message", checkCommand);

var commandList = ["poll","hello","help","youtube","unsplash"];
function checkCommand(msg){
    let m = msg.toString();
    if(m[0] === "!")
    {
        let commandStatement = m.split(" ");
        let command = commandStatement[0];
        command = command.slice(1,command.length);
        if(commandList.includes(command))
        {
            if(command === "poll")
                poll(m.slice(5,m.length), msg);
            else if(command === "hello")
                msg.channel.send(`hello, ${msg.author.username}`);
            else if(command === "help")
                msg.reply(commandList);
            else if(command === "youtube")
                youtube(m.slice(command.length+1,m.length),msg);
            else if(command === "unsplash")
                unsplash(m.slice(command.length+1,m.length),msg);
        }
    }
}

function poll(statement, msg)
{
    if(statement.length === 0){
        msg.reply("Use this template to create a poll: !poll question: <question>? <option1> | <option2>....");
        return;
    }

    statement = statement.split("?");
    if(!statement[0].includes("question") && !statement[0].includes("Question") && !statement[0].includes("QUESTION"))
    {
        msg.reply("Question required");
        return;
    }
    question = statement[0];
    options = statement[1].split("|");
    if(options.length < 2)
    {
        msg.reply("Everyone knows you need just two to four options to start a poll");
        return;
    }
    let optionEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣"];
    const embed = new Discord.MessageEmbed();
    embed.setColor("#FF0000");
    embed.setTitle("Poll");
    embed.setDescription(`Participate in the poll created by ${msg.author.username}`);
    embed.addField("Question",question);
    embed.addField("Options",options);
    sendEmbed(embed);
    async function sendEmbed(embed){
        let send = await msg.channel.send(embed);
        let reply = await send;
        for(emoji of optionEmojis)
        {
            reply.react(emoji);
        }
    }

}


async function youtube(statement, msg)
{
    statement = statement.trim();
    let url = `https://youtube.googleapis.com/youtube/v3/search?q=${statement}&maxResults=10&key=${process.env.youtubeAPI}`;

    let endPoint = await fetch(url);
    let response = await endPoint.json();
    // console.log(response.items[0].id);

    if(response.items[0].id.kind !== "youtube#video"){
        msg.channel.send("Try searching for a video instead of a channel");
        return;
    }
    let videoId = response.items[0].id.videoId;
    let videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    msg.channel.send(videoUrl);
}


async function unsplash(statement,msg)
{
    statement = statement.trim();
    let url = `https://api.unsplash.com/search/photos?&client_id=${process.env.unsplashAPI}&page=1&query=${statement}`;

    let result = await fetch(url);
    let data = await result.json();
    console.log(statement);
    // console.log(data.results[0].urls);
    msg.channel.send(data.results[0].urls.regular);
}

