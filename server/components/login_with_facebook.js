import { Accounts } from 'meteor/accounts-base';


ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '429076164293822',
    secret: '545a35b1cc07c80e9bae4e9c4c4b529a'
});

Accounts.onCreateUser(function(options, user) {
    console.log(options);
    if (options.profile) {
        // If login by facebook
        if (user.services.facebook) { 
            options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            options.emails = [{
                address: user.services.facebook.email,
                verified: true
            }];
            options.profile.first_name = user.services.facebook.first_name;
            options.profile.last_name = user.services.facebook.last_name;
        } else {// If user signup
            options.emails = [{
                address: options.email,
                verified: false
            }];
        }
        
        options.profile.chef_signup = false;
        options.profile.foodie_signup = true;
        options.profile.district = '';
        user.emails = options.emails;
        user.profile = options.profile;
    }
    return user;
});
