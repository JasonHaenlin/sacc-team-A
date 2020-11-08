import CloudStorageUtil from "../utils/CloudStorageUtil";
import SendMailUtil from "../utils/SendMailUtil";

var fs = require('fs');
const MAIL_FROM = 'SACC.TEAMA@cloudcomputing.fr'

class StatsController{
   
    async getComplexStats(){
        const mail = 'alexis1953@live.fr';
        let statsResult = this.calculateComplexStats();
        let file = this.makeFileFromStats(statsResult,mail);
        let link = await this.storeInCloudStorage(file);
        this.sendMailWithLink(mail,link);

    }

    calculateSimpleStats(){
        let registeredUsers = 14000;
        let poi = 2000;
        let positionUpdatedNb = 6000;
    }

    calculateComplexStats() : number{
       let contactWithAPoiLast24hours = 2916;
       return contactWithAPoiLast24hours;
    }

    makeFileFromStats(nb :number,mail:string) : string{
        let content = 'Number of person entered in contact with a POI these last 24 hours : '+nb;
        let filename = 'stat-'+mail.split('@')[0]+'.txt';
        fs.writeFile(filename, content, function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
        return filename;
    }

    /**
     * Create a file in cloud storage from a local file given and return a promise of the file link on cloud storage
     * @param file 
     */
    storeInCloudStorage(file : string) : Promise<string>{
        let cloudStorage = new CloudStorageUtil();
        return cloudStorage.uploadFile(file).then((value : string) =>{
            return value;
        });
    }

    sendMailWithLink(mailAdress : string,link : string){
        SendMailUtil.sendMail(MAIL_FROM,mailAdress,'Stats link',link);
    }
}

export default new StatsController;