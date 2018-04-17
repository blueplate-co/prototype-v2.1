import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Mongo } from 'meteor/mongo';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';

//set up email envirnoment for sending out email
Meteor.startup(() => {
  process.env.MAIL_URL = "smtps://ACCOUNT%2EADMIN%40BLUEPLATE%2ECO:ilqkgygkgeojntmu@smtp.gmail.com:465";
});

//method to be called to send verification email
Meteor.methods({
  'sendVerificationEmail'(user){
    return Accounts.sendVerificationEmail(user);
  }
});

Accounts.emailTemplates.siteName = 'Blueplate Technologies';
Accounts.emailTemplates.from = 'Alan Anderson <account.admin@blueplate.co>';
Accounts.emailTemplates.verifyEmail = {
  subject(user) {
   return "Blueplate.co - Verify your email address";
 },
 text(user,url) {
   let  emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        emailBody      = `Hi there,\n\n Thank you for joining us. Greeting present to give you is 50 credits. To verify your email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n See you around! \n\n Best,\nAlan`;

 return emailBody;
 }
};
