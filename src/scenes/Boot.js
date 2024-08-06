import { Scene } from 'phaser';
import logoImg from '/assets/logo.png';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        //  This is an example of an imported bundled image.
        //  Remember to import it at the top of this file

        this.load.image('logo', logoImg);

        //  This is an example of loading a static image
        //  from the public/assets folder:

        //  this.load.image('logo', 'assets/logo.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
