/**
 * source : https://github.com/postmanlabs/newman/blob/develop/examples/parallel-collection-runs.js
 * PARAMAN ! Alias of Mr.HUET
 */

const path = require('path')
const async = require('async')
const newman = require('newman')

const PARALLEL_RUN_COUNT = 5

const parametersForTestRun = {
    collection: path.join(__dirname, 'sacc-team-a.postman_collection.json'),
    environment: path.join(__dirname, 'prod.postman_environment.json'),
    iterationCount: 1,
    folder: 'scenario',
    reporters: 'cli'
};

const parallelCollectionRun = (done) => {
    newman.run(parametersForTestRun, done);
};

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
}

async.parallel(
    commands,

    (err, results) => {
        err && console.error(err);

        results.forEach((result) => {
            const failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    }
);
