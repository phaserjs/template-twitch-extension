import { Scene } from 'phaser';
import TwitchExtensionManager from '../TwitchExtensionManager';

export class Preloader extends Scene
{
    twitch;

    constructor ()
    {
        super('Preloader');
        this.twitch = TwitchExtensionManager.getInstance();
    }

    init ()
    {
        //  We loaded these images in our Boot Scene, so we can display it here.
        //  Customize the loader to your liking
        this.add.image(50, 50, 'logo').setOrigin(0);
    }

    preload ()
    {
        // Set the base path to resolve for your assets. This avoids "assets/" repition when you have more assets in place.

        this.load.setPath('assets');
    }

    create ()
    {
        // The Twitch Extension Manager is a singleton class that manages the Twitch Extension lifecycle.
        // onAuthorized is a callback that is called when the Twitch Extension is authorized.
        this.twitch.onAuthorized(() => {

            this.load.image('avatar', this.twitch.getAvatarUrl());
            
            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                this.add.text(200, 200, this.twitch.getAvatarUrl(), { fill: '#00ff00', fontSize: '60px' });
                //  Now that the twitch user data is accessible. You can use it to fetch the avatar of the user
                //  and use it as a texture in the Gamescene.
                this.scene.start('Game');
            });

            this.load.start();
            
        });
    }
}
