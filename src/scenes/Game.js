import { Scene } from 'phaser';
import TwitchExtensionManager from '../TwitchExtensionManager';

export class Game extends Scene
{
    twitch;
    emitter;
    
    constructor ()
    {
        super('Game');
        this.twitch = TwitchExtensionManager.getInstance();
    }

    create ()
    {
        this.add.image(50, 50, 'logo').setOrigin(0);

        this.add.text(50, 175, `Make something fun!\nand share it with us:\nsupport@phaser.io\n`, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        }).setOrigin(0);

        //  To reward Twitch viewers for following the Twitch Channel, you can celebrate by emitting a particle explosion.
        this.emitter = this.add.particles(this.cameras.main.width / 2, this.cameras.main.height / 2, 'avatar', {
            lifespan: 4000,
            speed: { min: 250, max: 350 },
            scale: { start: 0.5, end: 0 },
            radial: true,
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        });

        //  In the `Preloader` we dynamically loaded the streamer's avatars that we can use for gameobjects.
        const avatar = this.physics.add.sprite(0, 0, 'avatar').setImmovable().setDisplaySize(200, 200)

        //  The streamerAvatar ignores gravity to keep moving up and down on track.
        avatar.body.allowGravity = false

        const name = this.add.text(0, -avatar.displayHeight / 2 - 16, this.twitch.getBroadcasterName().toUpperCase(), {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 1);

        //  Here a new container to display the streamer's name above the streamer is created.
        //  This is helpful for animations and other manipulations that affect both gameobjects.
        const streamer = this.add.container(this.cameras.main.width - 350, this.cameras.main.height - 200)
        streamer.add([avatar, name])
        streamer.setSize(avatar.displayWidth, avatar.displayHeight)
        streamer.setInteractive({ cursor: "pointer" })

        this.tweens.add({
            targets: [streamer],
            y: 250,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // When the streamer's avatar is clicked, the native Twitch Follow Dialogue is opened.
        streamer.on('pointerdown', () => {
            this.twitch.openFollowDialog()
        }, this);

        //  You can listen to the followChannel event with the Twitch Helper callback
        //  `onFollow`. It returns two parameters. The first parameter, `didFollow`, is a boolean 
        //  that tells you if follow request was successful or not. It is not when the user cancels or 
        //  closes the dialogue. The second callback parameter is the `channelName`.
        //  https://dev.twitch.tv/docs/extensions/reference/#onfollow
        this.twitch.getExtActions().onFollow((callback) => {
            this.onFollowHandler(callback);
        });
    }

    onFollowHandler (didFollow) 
    {
        //  Anytime a viewer has interacted with the follow twitch channels dialogue this callback is triggered. he callback includes a flag 
        //  that tells if the follow was successful, which comes in handy to trigger further events when the streamer gained a new follower.

        //  Uncomment this code if you want trigger the particles only when the channel follow was successful.
        //  if (didFollow)
        //  { 
            
        //  We want to reward viewers who followed the channel. 
        //  Let's celebrate by emitting the avatars texture as particles.
        this.emitter.explode(32);

        const followText = this.add.text(this.emitter.x, this.emitter.y, `Thanks for the follow!`, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(.5);

        this.emitter.on('complete', function ()
        {

            //  You are adviced to remove any overlay gameobjects from further appearance.
            //  The Twitch Extension should not distract from the main content put up by the streamer (but really, that is up to you!).
            //  See it as an enriched user experiences for special moments on Twitch, underlined by your Twitch Extension built with Phaser!
            followText.destroy();
        });
        
        //  ... }
    }
}
