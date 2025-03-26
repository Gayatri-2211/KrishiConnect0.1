const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function talkToChatbot(text) {
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath('atomic-lens-454415-r2', uuid.v4());


    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: 'hi',  // 'mr' for Marathi, 'en' for English
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0].queryResult.fulfillmentText;
}

app.post('/chatbot', async (req, res) => {
    let userMessage = req.body.message;
    let botReply = await talkToChatbot(userMessage);
    res.json({ reply: botReply });
});

app.listen(5000, () => console.log("Server running on port 5000"));
