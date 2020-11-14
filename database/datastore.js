const { Datastore } = require('@google-cloud/datastore');
const { logTheInfo } = require('../middlewares/config/logger');

// Creates a client
const datastore = new Datastore();

function save(kind, data) {
    return new Promise(async (resolve, reject) => {
        // The Cloud Datastore key for the new entity
        const key = datastore.key(kind);

        // Prepares the new entity
        const element = {
            key: key,
            data: data
        };

        // Saves the entity
        await datastore.save(element);
        logTheInfo(`Saved: ${JSON.stringify(element.data)}`);
        resolve(element)
    })
}

function get(kind) {
    return new Promise(async (resolve, reject) => {
        const query = datastore.createQuery(kind);
        const [elements] = await datastore.runQuery(query);
        logTheInfo(`Get: ${JSON.stringify(elements)}`);
        const elementList = []
        for (const element of elements) {
            const elementKey = element[datastore.KEY];
            element.id = elementKey.id
            elementList.push(element)
        }
        resolve(elementList)
    })
}

module.exports = { save, get }
