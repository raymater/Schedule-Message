# Schedule-Message
A Discord bot writted by raymater : schedule a message to be sent.

## Dependencies
This bot works with [Node.js](https://nodejs.org/)

You need to have these libraries :
* **[Discord.js](https://discord.js.org/)**
* **[FS](https://nodejs.org/api/fs.html)** - included in Node.js
* **[forever](https://www.npmjs.com/package/forever)** - recommanded

## Get started
**1- Install [Node.js](https://nodejs.org/)**


**2- Download bot files with [Git](https://git-scm.com/) :**
```
git clone https://github.com/raymater/Schedule-Message.git
```

**3- Install [Discord.js](https://discord.js.org/) library :**
```
npm install discord.js
```

(Recommanded) Install [forever](https://www.npmjs.com/package/forever) library :
```
npm install forever -g
```


**4- Make sure that messages.json file is readable and writtable.**


**5- Create and configure your bot account :**
* Go to [Discord Developper Portal](https://discord.com/developers/applications).
* Click on "New Application" button, enter your bot name and confirm.
* Click on "Bot" tab, then on "Add bot" button and confirm.
* In the "Token" section, click on "Copy" button.
* Edit the schedule.js file in line 5 and paste your token in quotes.


**6- Invite your bot in a Discord server :**
* In your bot settings in [Discord Developper Portal](https://discord.com/developers/applications), click on "OAuth2" tab.
* In "OAuth2 URL Generator" section, in "Scopes" list, check "bot" checkbox.
* In "Bot Permissions" list, you have to check these checkboxes : 
    * View Channels
    * Send Messages
    * Embeded Links
    * Read Message History
* Copy your link generated in "Scopes" section and paste it in a new tab on your web browser.
* Once you are authenticated in Discord, select your server.


**7- Start the bot :**

With Node command :
```
node scheduled.js
```

Or if you want to run the script continuously in the background, you should to use [forever](https://www.npmjs.com/package/forever) :
```
forever start scheduled.js
```