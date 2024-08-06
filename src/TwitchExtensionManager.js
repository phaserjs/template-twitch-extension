class TwitchExtensionManager
{
    static STATE_LIST = {
        INIT: 'INIT',
        AUTHENTICATED: 'AUTHENTICATED'
    }

    static getInstance()
    {
        if (!TwitchExtensionManager.instance)
        {
            TwitchExtensionManager.instance = new TwitchExtensionManager();
        }
        return TwitchExtensionManager.instance;
    }

    constructor()
    {
        if (TwitchExtensionManager.instance)
        {
            throw new Error('Use TwitchExtensionManager.getInstance() to get the single instance of this class.');
        }

        this.setState(TwitchExtensionManager.STATE_LIST.INIT);
        this.authData = null;
        this.broadcasterName = '';
    }

    onAuthorized(callback)
    {
        
        //  For Twitch Extensions it is essential to handle the `onAuthorized` callback. Without it
        //  your Extension will not work. 
        //  https://dev.twitch.tv/docs/extensions/reference/#onauthorized

        //  It is handy to bind the callback context to `this`. It allows you to store the auth data globally
        //  whenever the onAuthorized callback is executed by accessing the Phaser DataManager. 
        //  The callback can happen more than one time while the Extension is running.
        if (window.top !== window.self && window.Twitch) 
        {
            window.Twitch.ext.onAuthorized((auth) => {
                this.handleOnAuthorized(auth, callback);
            });
        } 
        else
        {
            console.error('To utilize Twitch extension features, run the Overlay Extension on a live twitch channel.');
        }
    }

    //  We want the chick to open the native Twitch Follow Dialogue to open when the gameobjects collide.
    //  In the Preloader the this.twitch.getBroadcasterName() allows us to use the `followChannel` actions to do so.
    //  https://dev.twitch.tv/docs/extensions/reference/#followchannel 
    openFollowDialog()
    {
        this.getExtActions().followChannel(this.getBroadcasterName());
    }

    async handleOnAuthorized(auth, callback)
    {

        //  The 'helixToken' can be used for client-side requests to use the Twitch API. 
        //  It is important to mention that this JWT does not have scopes or special permissions and 
        //  therefore it does not work for all API endpoints.
        const { helixToken, channelId } = auth;

        try
        {
            //  The Twitch Helix API allows you to access Twitch related content or execute CRUD operations. In this template
            //  we request more information about the currently channel that is using the extension. The `broadcaster_name` 
            //  is not available out of the box, but the channelId is - which you can use to get more information, like the `broadcaster_name`.
            //  https://dev.twitch.tv/docs/api/reference/#get-channel-information

            const userInformationResponse = await fetch(`https://api.twitch.tv/helix/users?id=${channelId}`, {
                headers: {
                    //  Twitch API commonly uses the Bearer authentication scheme with app access tokens and user OAuth tokens which includes
                    //  information about scopes and permissions. You can also use the Extension authentication scheme, which comes in handy
                    //  for client-side only Extension that can utilize the Helix JWT.
                    //  https://dev.twitch.tv/docs/extensions/frontend-api-usage/#making-a-twitch-api-request

                    'Authorization': `Extension ${helixToken}`,
                    'Client-Id': auth.clientId
                }
            });

            const userInformation = await userInformationResponse.json();
            const user = userInformation.data[0];

            // Store the auth data and user information
            this.authData = auth;
            this.broadcasterName = user.display_name;
            this.avatarUrl = user.profile_image_url;

            //  The `onAuthorized` can be called multiple times during the lifetime of a user viewing your Twitch Extension. 
            //  This happens when the Helix JWT is refreshed for example. Note that we do not want to re-fetch avatar data or start the Gamescene again.
            //  You need to manually check if the initial request has been made to avoid side-effects.
            if (this.state === TwitchExtensionManager.STATE_LIST.INIT)
            {
                this.setState(TwitchExtensionManager.STATE_LIST.AUTHENTICATED);
                if (callback)
                {
                    callback();
                }
            }
            else if (callback)
            {
                callback();
            }

        } 
        catch (e)
        {
            console.error('Error fetching user information:', e);
        }
    }

    getExtActions()
    {
        return window.Twitch.ext.actions;
    }

    getAuthData()
    {
        return this.authData;
    }

    getBroadcasterName()
    {
        return this.broadcasterName;
    }

    getAvatarUrl()
    {
        return this.avatarUrl;
    }

    getState()
    {
        return this.state;
    }

    setState(newState)
    {
        this.state = newState;
    }
}

export default TwitchExtensionManager;
