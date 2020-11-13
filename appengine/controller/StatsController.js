const { createBucket, uploadFile } = require("../utils/CloudStorageUtil.js");
var fs = require('fs');
const { sendEmail } = require("../utils/SendMailUtil.js");
const BUCKET_NAME = "stats-bucket-team-a";
const BASE_URL_CLOUD_STORAGE = "https://storage.googleapis.com/";
const { v4: uuidv4 } = require('uuid');
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

    calculateComplexStats() {
        let contactWithAPoiLast24hours = 2916;
        return contactWithAPoiLast24hours;
    }

    makeFileFromStats(nb, id) {
        let content = 'Number of person entered in contact with a POI these last 24 hours : ' + nb.toString() + "\n";
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
