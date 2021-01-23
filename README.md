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

**5- Start the bot :**

With Node command :
```
node scheduled.js
```

Or if you want to run the script continuously in the background, you should to use [forever](https://www.npmjs.com/package/forever) :
```
forever start scheduled.js
```