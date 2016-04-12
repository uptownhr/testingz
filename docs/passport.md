##Configuring Authentication with Passport Strategies

Hackathon Starter Lite provides a simplified, straightforward workflow for authentication with multiple passport strategies. Instead of creating a custom callback for each OAuth provider, all strategies are passed through a general handler. 

Please follow the steps below to add a new passport strategy to your app: 

###Step 1

Add the Oauth provider with its client id/key and secret to the config.js file. 

```
module.exports = {
  social: {
    twitter:{
      consumer_key: process.env.TWITTER_CONSUMER_KEY || 'Jw6gdI0TGsuFzGq9ClIoqWuHu',
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'rQnElaPgiUUixe0viJ0dbd1M70RpO2a7P2R07pVEk4MPbxBxK7'
    }
  }
}
```

NOTE: Do not commit sensitive information like keys and secrets to your public repo. 

###Step 2

In config/passport.js, require your passport strategy.

```
var TwitterStrategy = require('passport-twitter').Strategy;
```

###Step 3

Instantiate your Passport strategy, setting the appropriate id/key and secret from the config file. The callback url will always follow the format, '/auth/o/:provider/callback', as specified in controllers/Auth.js. 

Create a function following the map*Provider*Profile naming convention. Map the provider's profile information to the profile field from the userSchema (models/user.js). This will store this data with the user in the database. Pass this function inside the callback handler, handleOauthLogin. 

```
passport.use(new TwitterStrategy({
  consumerKey: config.social.twitter.consumer_id,
  consumerSecret: config.social.twitter.consumer_secret,
  callbackURL: '/auth/o/twitter/callback',
  passReqToCallback: true
}, handleOauthLogin(mapTwitterProfile)) )


function mapTwitterProfile(profile){
  return {
    id: profile.id,
    name: profile.displayName,
    gender: '',
    location: profile._json.location,
    website: '',
    picture: profile._json.profile_image_url_https
  }
}

```

### Step 4

Authentication for your app is now available via GET to the '/o/:provider' route. Existing OAuth accounts can be unlinked via GET to the '/user/account/unlink/:provider' route.

#### (Optional)
The buttons to link and unlink the new provider accounts can now be added to the login and account pages, as shown below:

#### Login

*views/login.jade*

```
.col-md-4(style='text-align: left;')
      p.lead Or sign in with ...
      a.btn.btn-block.btn-social.btn-twitter(href='/auth/o/twitter')
        i.fa.btn-xs.fa-twitter
        |  Sign in with Twitter
```
#### Account 

*controllers/User.js*

Add the provider to the providers object and set it to a default value of false. The providers object will then be checked to see if the provider account is linked for the user.

```
router.get('/account', function(req,res){
  var user = req.user

  var providers = {
    twitter: false
  };
  
  user.providers.forEach(function(p){
    if (providers[p.name] !== "undefined"){ 
      providers[p.name] = true;
    }
  })
  
  res.render('account', { user, providers } )
})
```

*views/account.jade*

Locate the div with the "providers" class. Add the following jade with the conditional inside the div for each provider:

```
.col-sm-6
    p
      if providers.twitter
        a.btn.btn-block.btn-primary.btn-social.btn-twitter(href='/user/account/unlink/twitter')
          i.fa.btn-xs.fa-twitter
          | Unlink your Twitter account
      else
        a.btn.btn-block.btn-default.btn-social.btn-twitter(href='/auth/o/twitter')
          i.fa.btn-xs.fa-twitter
          | Link your Twitter account
```