const { CloudTasksClient } = require('@google-cloud/tasks');
const { logTheTransaction } = require('../config/logger');

const { QUEUE_ID, PROJECT_ID, QUEUE_LOCATION } = process.env;

module.exports = class BaseTask {
    constructor(httpMethod, relativeUri) {
        this.client = new CloudTasksClient();
        this.parent = this.client.queuePath(PROJECT_ID, QUEUE_LOCATION, QUEUE_ID);
        this.task = {
            appEngineHttpRequest: {
                httpMethod: httpMethod,
                relativeUri: relativeUri,
            },
        };
    }

    async createTask(payload) {
        if (payload) {
            task.appEngineHttpRequest.body = Buffer.from(payload).toString('base64');
        }
        logTheTransaction(`Sending task: ${this.httpMethod} ${this.relativeUri}`, payload);
        const parent = this.parent;
        const task = this.task;
        const request = { parent, task };
        const [response] = await client.createTask(request);
        logTheTransaction(`Created task ${response.name}`);
    }

}
