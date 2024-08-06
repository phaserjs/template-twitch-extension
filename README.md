# Phaser Twitch Extension Template

**[Read the Tutorial](https://phaser.io/tutorials/creating-twitch-extensions-with-phaser) that goes with this repo first.**

This is a Phaser 3 project template to create a Twitch Overlay Extension that uses Vite for bundling. It supports hot-reloading for quick development workflow and includes scripts to generate production-ready builds to publish on Twitch.tv.

![Testing Extension Live](screenshot.gif "Testing Extension Live")

### Versions

This template has been updated for:

- [Phaser 3.80.1](https://github.com/phaserjs/phaser)
- [Vite 5.3.1](https://github.com/vitejs/vite)
- [Twitch JavaScript Helper 1.0.0](https://dev.twitch.tv/docs/extensions/reference)

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`. See `.nvmrc` or `package.json` about the recommended Node.js version.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder and creates a `dist.zip` file |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the Vite documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Vite will automatically recompile your code and then reload the browser.  

Overlay Twitch Extensions require a Twitch Channel to be live on Twitch to utilize the [Twitch JavaScript Helper Library](https://dev.twitch.tv/docs/extensions/reference/#javascript-helper). 

## Template Project Structure

We have provided a default project structure to get you started. This is as follows:

- `video_overlay.html` - A basic HTML page to contain the Phaser twitch extension.
- `src` - Contains the game source code you will work with most of your time.
- `src/main.js` - The main entry point. 
- `src/TwitchExtensionManager.js` - This contains the game configuration and starts the Phaser twitch extension.
- `src/scenes/` - The Phaser Scenes are in this folder.
- `public/style.css` - Some simple CSS rules to help with page layout.
- `public/assets` - Contains the static assets used by the Phaser twitch extension.

## Twitch Extension Manager

`TwitchExtensionManager` is a singleton class designed to manage the authentication and user data for Twitch Extensions. It ensures that your extension handles the onAuthorized callback correctly and provides easy access to the authenticated user's information throughout your Phaser game scenes.

### Key Features
Singleton Pattern: Ensures that there is only one instance of TwitchExtensionManager throughout the application.
Authentication Handling: Manages the onAuthorized callback to store authentication data and user information.
Global Data Access: Provides methods to access the authenticated user's data, such as the broadcaster's name and avatar URL.
Follow Channel Action: Includes a method to open the native Twitch Follow Dialogue for the broadcaster.

### Usage
```js
import TwitchExtensionManager from './TwitchExtensionManager';

// Get the singleton instance
const twitchManager = TwitchExtensionManager.getInstance();

// Set up the onAuthorized callback
twitchManager.onAuthorized(() =>
{
    if (twitchManager.getState() === 'AUTHENTICATED')
    {
        console.log('User authenticated!');
        console.log('Broadcaster Name:', twitchManager.getBroadcasterName());
    }
});
```
### Methods
- `getInstance()`: Returns the singleton instance of TwitchExtensionManager.
- `onAuthorized(callback)`: Sets up the onAuthorized callback and handles authentication.
- `openFollowDialog()`: Opens the native Twitch Follow Dialogue for the broadcaster.
- `getAuthData()`: Returns the authentication data.
- `getBroadcasterName()`: Returns the broadcaster's name.
- `getAvatarUrl()`: Returns the URL of the broadcaster's avatar.
- `getState()`: Returns the current state of the manager.

```js
import { Scene } from 'phaser';
import TwitchExtensionManager from './TwitchExtensionManager';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
        this.twitchManager = TwitchExtensionManager.getInstance();
    }

    create ()
    {
        this.twitchManager.onAuthorized(() =>
        {
            if (this.twitchManager.getState() === 'AUTHENTICATED')
            {
                this.load.image("avatar", this.twitchManager.getAvatarUrl());

                this.load.once(Phaser.Loader.Events.COMPLETE, () =>
                {
                    this.scene.start('Game');
                });

                this.load.start();
            }
        });
    }
}
```

*NOTE: Please feel free to modify and add any methods your extension needs.*

## Handling Assets

Vite supports loading assets via JavaScript module `import` statements.

This template provides support for both embedding assets and also loading them from a static folder. To embed an asset, you can import it at the top of the JavaScript file you are using it in:

```js
import logoImg from './assets/logo.png'
```

To load static files such as audio files, videos, etc place them into the `public/assets` folder. Then you can use this path in the Loader calls within Phaser:

```js
preload ()
{
    //  This is an example of an imported bundled image.
    //  Remember to import it at the top of this file
    this.load.image('logo', logoImg);

    //  This is an example of loading a static image
    //  from the public/assets folder:
    this.load.image('logo', 'assets/logo.png');
}
```

When you issue the `npm run build` command, all static assets are automatically copied to the `dist/assets` folder. Static assets are also part of the zipped production file when you run `npm run build`.

## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your twitch extension, you will need to upload *all* of the contents inside a `zip` file. The production npm command created `dist.zip` file that can be used instead of manual zipping.

## Customizing the Template

### Vite

If you want to customize your build, such as adding plugin (i.e. for loading CSS or fonts), you can modify the `vite/config.*.mjs` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json`. This can be especially be useful when you want to support multiple Phaser [twitch extension types](https://dev.twitch.tv/docs/extensions/#what-is-a-twitch-extension). Please see the [Vite documentation](https://vitejs.dev/) for more information.

## Join the Phaser Community!

We love to see what developers like you create with Phaser! It really motivates us to keep improving. So please join our community and show-off your work 😄

**Visit:** The [Phaser website](https://phaser.io) and follow on [Phaser Twitter](https://twitter.com/phaser_)<br />
**Play:** Some of the amazing games [#madewithphaser](https://twitter.com/search?q=%23madewithphaser&src=typed_query&f=live)<br />
**Learn:** [API Docs](https://newdocs.phaser.io), [Support Forum](https://phaser.discourse.group/) and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Discord:** Join us on [Discord](https://discord.gg/phaser)<br />
**Code:** 2000+ [Examples](https://labs.phaser.io)<br />
**Read:** The [Phaser World](https://phaser.io/community/newsletter) Newsletter<br />

Created by [Phaser Studio](mailto:support@phaser.io) and [Hammertime Studio](https://hammertime.studio). Powered by coffee, anime, pixels and love.

The Phaser logo and other assets are &copy; 2011 - 2024 Phaser Studio Inc.

All rights reserved.
