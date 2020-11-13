// Imports the Google Cloud Tasks library.
const { CloudTasksClient } = require('@google-cloud/tasks');

const { QUEUE_ID, PROJECT_ID, QUEUE_LOCATION } = process.env;

// Instantiates a client.
const client = new CloudTasksClient();

async function createTask() {
    const project = PROJECT_ID;
    const queue = QUEUE_ID;
    const location = QUEUE_LOCATION;

    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    const task = {
        appEngineHttpRequest: {
            httpMethod: 'POST',
            relativeUri: '/log_payload',
        },
    };

    if (payload) {
        task.appEngineHttpRequest.body = Buffer.from(payload).toString('base64');
    }

    if (inSeconds) {
        // The time when the task is scheduled to be attempted.
        task.scheduleTime = {
            seconds: inSeconds + Date.now() / 1000,
        };
    }

    console.log('Sending task:');
    console.log(task);
    // Send create task request.
    const request = { parent, task };
    const [response] = await client.createTask(request);
    const name = response.name;
    console.log(`Created task ${name}`);
}
createTask();
