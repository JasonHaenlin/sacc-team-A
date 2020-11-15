// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
const { logTheInfo } = require('../config/logger');

const { PROJECT_ID } = process.env;

const pubSubClient = new PubSub({ PROJECT_ID });

module.exports = class BasePubSub {

    constructor (topicName, subscriptionName) {
        this.projectId = PROJECT_ID;
        this.topicName = topicName;
        this.subscriptionName = subscriptionName;
    }

    async publishMessage(data) {
        const dataBuffer = Buffer.from(JSON.stringify(data));

        const messageId = await pubSubClient.topic(this.topicName).publish(dataBuffer);
        logTheInfo(`Message ${messageId} published.`);
    }

    async subscribeMessage(onMessage, onError) {
        // Creates a subscription on that new topic
        const subscription = await pubSubClient.subscription(this.subscriptionName);

        // Receive callbacks for new messages on the subscription
        subscription.on('message', onMessage);

        // Receive callbacks for errors on the subscription
        subscription.on('error', onError);
    }

}
