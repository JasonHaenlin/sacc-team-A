const { createBucket, uploadFile } = require("../utils/CloudStorageUtil.js");
var fs = require('fs');
const { sendEmail } = require("../utils/SendMailUtil.js");
const BUCKET_NAME = "stats-bucket-team-a";
const BASE_URL_CLOUD_STORAGE = "https://storage.googleapis.com/";
const { v4: uuidv4 } = require('uuid');
const userSQL = require('../../database/models/user');
const datastore = require('../../database/datastore');
const format = require('date-format');
const { stats, heatmapPubSub } = require("../../middlewares/pub-sub/index.js");
const { logTheError } = require("../../middlewares/config/logger.js");

class StatsController {

    constructor() {
        this.meetingsForHeatmap = [];

        stats.subscribeMessage((message) => {
            this.getPoiForLastDay(process.env.EMAIL_SENDER); // TODO change mail address
            message.ack();
        }, (error) => {
            logTheError(error)
        });

        heatmapPubSub.subscribeMessage((message) => {
            this.generateHeatmap(process.env.EMAIL_SENDER); // TODO change mail address
            message.ack();
        }, (error) => {
            logTheError(error);
        });
    }

    generateHeatmap(mail) {
        return new Promise(async (resolve) => {
            const meetings = await datastore.get('meeting');
            this.meetingsForHeatmap = meetings.map(meeting => {
                return [meeting.latitude, meeting.longitude];
            });
            // this.sendMailWithLink(mail, "https://sacc-team-a.ew.r.appspot.com/heatmap");
            resolve();
        });
    }

    getMeetingsForHeatmap() {
        return this.meetingsForHeatmap;
    }

    async getPoiForLastDay(mail) {
        let statsResult = await this.getContactPoiLast24Hours();
        //let statsResult = {count:10,mails:[]};
        let file_id = uuidv4();

        let filename = await this.makeFileFromStats(statsResult, file_id);
        await this.storeInCloudStorage(filename);
        let file_url = BASE_URL_CLOUD_STORAGE + BUCKET_NAME + "/" + filename.substr(5);
        // this.sendMailWithLink(mail, file_url);
    }

    async getNumberOfUsers() {
        return await userSQL.getNumberOfUsers();
    }

    async getNumberOfPoi() {
        return await userSQL.getNumberOfPoi(); // get poi from DB
    }

    async getContactPoiLast24Hours() {
        let contactsWithPOILast24hours = []

        // First get all users POI
        let array_of_pois = await userSQL.getPoiUsers();

        contactsWithPOILast24hours = await this.getContactsWithPois(array_of_pois);
        contactsWithPOILast24hours = contactsWithPOILast24hours.map(entry => entry.u1sha1);
        //let mails = await userSQL.getMailUserSha1;
        let countContactsWithPOILast24hours = contactsWithPOILast24hours.length;
        let json = {
            contacts: contactsWithPOILast24hours
        }
        return json;
    }

    async getContactsWithPois(pois) {
        // Yesterday
        let date = new Date();
        date.setDate(date.getDate() - 1);
        // date = format.asString('yyyy-MM-dd hh:mm:ss', date);
        var contacts = [];


        // Foreach  POI (test poi is user1 and user2)
        for (const poi of pois) {
            let listU1sha1 = await datastore.getWithFilters("meeting", ["u1sha1"], [
                { left: "u2sha1", middle: "=", right: poi.sha1 },
                { left: "timestamp", middle: ">=", right: date }],
            );
            let listU2sha1 = await datastore.getWithFilters("meeting", ["u2sha1"], [
                { left: "u1sha1", middle: "=", right: poi.sha1 },
                { left: "timestamp", middle: ">=", right: date }],
            );

            listU1sha1.push.apply(listU1sha1, listU2sha1);
            if (listU1sha1.length > 0) {
                let json = { poi: poi.sha1, contacts: listU1sha1 }
                contacts.push(json);
            }
            //contacts.push.apply(contacts, listU1sha1);
        }

        return contacts;

    }

    async makeFileFromStats(json, id) {
        let count = 0;
        let content = '';

        json.contacts.forEach(line => {
            content += "- " + line.poi + " : " + "\n"
            line.contacts.forEach(contact => {
                content += "        - " + contact + " : " + "\n";
                count++;
            });
        });
        content = 'Total number of person entered in contact with a POI these last 24 hours : ' + count.toString() + "\n";

        let filename = '/tmp/' + 'stats-' + id + '.txt';
        fs.writeFile(filename, content, function (err) {
            if (err) throw err;
        });
        return filename;
    }

    /**
     * Create a file in cloud storage from a local file given and return a promise of the file link on cloud storage
     * @param file
     */
    async storeInCloudStorage(file) {
        await uploadFile(BUCKET_NAME, file);
    }

    sendMailWithLink(mailAdress, link) {
        sendEmail(mailAdress, "Link to statistics/heatmap", "Your file is available here: \n" + link + "\n\n Regards, \n Team A");
    }
}

module.exports = new StatsController();
