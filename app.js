// import module
import express from "express"
import bodyParser from "body-parser"
import { Vonage } from "@vonage/server-sdk"
import { MessengerText } from "@vonage/messages"
import { ChatGPTAPI } from "chatgpt"

const VONAGE_API_KEY = "3d878450";
const VONAGE_API_SECRET = "vZ3ExNyKc8HvuGMv";
const VONAGE_APPLICATION_ID = "3324c6d4-6d50-4c9a-9fe2-d48ed55754f6";
const FB_SENDER_ID = "116730661525324";
const OPENAI_API_KEY = "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";

// init chatgpt
const api = new ChatGPTAPI({
  apiKey: OPENAI_API_KEY
})
// init vonage
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
  applicationId: VONAGE_APPLICATION_ID,
  privateKey: "./private.key"
});
// init express
const app = express();
const PORT = 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhooks/callback', (req, res) => {
  console.log("callback:: ",req.body);
  res.json(200);
});

app.post('/webhooks/inbound-message', async (req, res) => {
  try {
    const messenger_from = req.body.from
    const receive_text = req.body.text
    console.log("Receive message:: ", receive_text, "from:: ", messenger_from);
  
    const chat_gpt_opts = {}
    const chat_response = await api.sendMessage(receive_text, chat_gpt_opts)
    // for (const text_msg of chat_response.text.match(/.{1,200}/g)) {
    for (const text_msg of chat_response.text.split("\n\n")) {
      await sendMessage(messenger_from, text_msg)
    }
    res.json(200);
  } catch (err) {
    console.log(err)
    res.json(400);
  }
});

app.listen(PORT, async () => {
    console.log(`Starting server at port: ${PORT}`)
});

// vonage message send text back
async function sendMessage(to, text) {
    try {
      const resp = await vonage.messages.send(
        new MessengerText({
          text: text,
          to: `${to}`,
          from: `${FB_SENDER_ID}`
        }),
      )
      console.log(resp.messageUUID)
    } catch (err) {
      console.error(err)
    }
}

// localtunnel
// https://youuniquesubdomain.loca.lt/webhooks/callback
// https://youuniquesubdomain.loca.lt/webhooks/inbound-message
import localtunnel from 'localtunnel';
(async () => {
  const tunnel = await localtunnel({ 
    subdomain: "youuniquesubdomain",
    port: PORT 
  });
  console.log(`App available at: ${tunnel.url}`)
})();


// The readme gives instructions for this; if you're using node < 18, you need to install a fetch polyfill. If you're using node >= 18, fetch is installed by default