require('dotenv').config();

const { readFileSync } = require("fs");
const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const VONAGE_APPLICATION_ID = process.env.VONAGE_APPLICATION_ID;
const VONAGE_PRIVATE_KEY = process.env.VONAGE_PRIVATE_KEY;

const FB_RECIPIENT_ID = process.env.FB_RECIPIENT_ID;
const FB_SENDER_ID = process.env.FB_SENDER_ID;

const { Vonage } = require('@vonage/server-sdk');
const { MessengerText, MessengerType } = require('@vonage/messages');

console.log(VONAGE_PRIVATE_KEY)
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
  applicationId: VONAGE_APPLICATION_ID,
  privateKey: readFileSync("./private.key").toString()
});

vonage.messages.send(
  new MessengerText({
    text: `This is a Facebook Messenger text message sent using the Messages API`,
    to: FB_RECIPIENT_ID,
    from: FB_SENDER_ID,
    messenger: "text"
  }),
)
  .then(resp => console.log(resp.messageUUID))
  .catch(err => console.error(err));