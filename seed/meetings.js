const datastore = require('../database/datastore')
const faker = require('faker')

for(let i=0; i<500; i++) {
    datastore.save("meeting",
    {
        "u1sha1": faker.random.uuid().slice(0, 9),
        "u2sha1": faker.random.uuid().slice(0, 9),
        "latitude": 43.707193+(faker.random.number(30)-15)/1000,
        "longitude": 7.263814+(faker.random.number(30)-15)/1000,
        "timestamp": faker.date.recent()
    })
}