const { CloudTasksClient } = require('@google-cloud/tasks');
const { logTheTransaction } = require('../config/logger');

const { QUEUE_ID, PROJECT_ID, QUEUE_LOCATION } = process.env;
const client = new CloudTasksClient();

module.exports = class BaseTask {
    constructor (httpMethod, relativeUri) {
        this.httpMethod = httpMethod;
        this.relativeUri = relativeUri;
    }

    async createTask(payload) {

        const parent = client.queuePath(PROJECT_ID, QUEUE_LOCATION, QUEUE_ID);
        const task = {
            appEngineHttpRequest: {
                httpMethod: this.httpMethod,
                relativeUri: this.relativeUri,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        };

        logTheTransaction(`Sending task: ${this.httpMethod} ${this.relativeUri}`, payload);
        if (payload) {
            task.appEngineHttpRequest.body = Buffer.from(JSON.stringify(payload)).toString('base64');
        }

        const request = { parent, task };
        const [response] = await client.createTask(request);
        logTheTransaction(`Created task:`, `${response.name}`);

    }

}
