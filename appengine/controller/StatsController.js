const { createBucket, uploadFile } = require("../utils/CloudStorageUtil.js");
var fs = require('fs');
const { sendEmail } = require("../utils/SendMailUtil.js");
const BUCKET_NAME = "stats-bucket-team-a";
const BASE_URL_CLOUD_STORAGE = "https://storage.googleapis.com/";
const { v4: uuidv4 } = require('uuid');
const userSQL = require('../../database/models/user')
const datastore = require('../../database/datastore')


class StatsController {

    async getComplexStats(mail) {
        let statsResult = this.calculateComplexStats();
        let file_id = uuidv4();
        let filename = this.makeFileFromStats(statsResult, file_id);
        await this.storeInCloudStorage(filename);
        let file_url = BASE_URL_CLOUD_STORAGE + BUCKET_NAME + "/" + filename;
        this.sendMailWithLink(mail, file_url);
        //this.deleteFileFs(filename);
    }

    async getNumberOfUsers() {
        return await userSQL.getNumberOfUsers();
    }

    async getNumberOfPoi() {
        return await userSQL.getNumberOfPoi(); // get poi from DB
    }


    calculateSimpleStats() {
        let registeredUsers = 14000;
        let poi = 2000;
        let positionUpdatedNb = 6000;
    }

    async calculateComplexStats(){

        // Yesterday
        let date = new Date();
        date.setDate(date.getDate() - 1);

        var contactsWithPOILast24hours = []

        // First get all users POI
        let array_of_pois = await userSQL.getPoiUsers();
        console.log(array_of_pois);
        

        contactsWithPOILast24hours = this.getContactsWithPois(array_of_pois);
        let countContactsWithPOILast24hours = contactsWithPOILast24hours.length;
        let json = {
            count : countContactsWithPOILast24hours,
            mails : contactsWithPOILast24hours
        }
        return json;
    }

    async getContactsWithPois(pois){
        contacts = []
        // Foreach  POI (test poi is user1)
        pois.forEach(async (poi)  => {
            const listU2sha1 = await datastore.getWithFilter("meeting",["u2sha1"], [
                {left :"u1sha1",middle : "=",right : poi},
                {left :"timestamp",middle : ">=",right : date},
            ]);
            console.log(listU2sha1);

            contacts.push.apply(contacts, listU2sha1);
       

        });

        // Foreach  POI (test poi is user2)
        pois.forEach(async (poi)  => {
            const listU1sha1 = await datastore.getWithFilter("meeting", ["u1sha1"],[
                {left :"u2sha1",middle : "=",right : poi},
                {left :"timestamp",middle : ">=",right : date},
            ]);
            contacts.push.apply(contacts, listU1sha1);

        });

        return contacts;
        
    }

    makeFileFromStats(json, id) {
        let content = 'Number of person entered in contact with a POI these last 24 hours : ' + json.count.toString() + "\n";
        json.mails.forEach(mail =>{
            content+=mail+"\n"
        });
        let filename = 'stats-' + id + '.txt';
        fs.writeFile(filename, content, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        return filename;
    }

    deleteFileFs(filename) {
        fs.unlink(filename, () => { });
    }

    /**
     * Create a file in cloud storage from a local file given and return a promise of the file link on cloud storage
     * @param file 
     */
    async storeInCloudStorage(file) {
        await uploadFile(BUCKET_NAME, file);
    }

    sendMailWithLink(mailAdress, link) {
        sendEmail(mailAdress, "Link to statistics", "Stats file available here: " + link + "\n Regards, \n Team A");
    }
}

module.exports = new StatsController();
