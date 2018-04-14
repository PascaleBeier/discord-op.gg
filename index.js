const Discord = require("discord.js");
const puppeteer = require("puppeteer");

const commandPrefix = "!op.gg";
const commandDelimiter = '"';
const client = new Discord.Client();
const btnSpectate = "a.SpectateTabButton";
const frameSpectate = "div.SpectateSummoner";
let channel = null;

formatCommand = async message => {
    const args = message.content.split(commandDelimiter);
    if (!args || args.length < 2) {
        return channel.send(
            `Usage: ${commandPrefix} ${commandDelimiter}${message.author
                .username}${commandDelimiter}`
        );
    }
    channel.send("Hold on ...");
    let screenshot = await lookup(args[1]);
    return channel.send({ files: [{ attachment: screenshot, name: "op.gg.png" }] });
};

lookup = async (summoner) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://euw.op.gg/summoner/userName=${encodeURI(summoner)}`, {waitUntil: 'networkidle2'});
    await page.$(btnSpectate);
    await Promise.all([
        page.waitForSelector(frameSpectate),
        page.click(btnSpectate),
    ]);
    const elFrameSpectate = await page.$(frameSpectate);
    const screenshot = await elFrameSpectate.screenshot({
        omitBackground: true,
    });

    await browser.close();

    return screenshot;
};

client.on("ready", () => {
     if (!client.user.avatarURL) {
         let setAvatar = client.user.setAvatar("./avatar.png");
    }
    channel = client.channels.find("name", "bot-proving-grounds");
});

client.on("message", msg => {
    if (msg.content.startsWith(commandPrefix)) {
        return formatCommand(msg);
    }
});

client.on("presenceUpdate", async (oldMember, newMember) => {
    if (
        newMember.presence.game !== null &&
        newMember.presence.game.name === "League of Legends"
    ) {
        console.log(newMember.presence.game);
        return formatCommand(`${commandPrefix} ${newMember.displayName}`);
    }
});

return client.login("NDM0NzU5NzI3MTg1MDAyNTI1.DbPFLQ.rOFPYdLWTt3dDgmchyeR6TJLK7g");