require('@google-cloud/storage');

class CloudStorageUtil{

     storage;
     bucketName;

    constructor(){
         // Creates a client
        this.storage = new Storage();
        this.bucketName = 'stats-bucket';
        // Creates a client from a Google service account key.
    // const storage = new Storage({keyFilename: "key.json"});
    }

    async createBucket() {
        // Creates the new bucket
        this.storage.createBucket(this.bucketName).then(()=>{
            console.log(`Bucket ${this.bucketName} created.`);
        }).catch(console.error);
       
    }

    async uploadFile(filename){
        return new Promise(async (resolve, reject) => {
            const bucket = this.storage.bucket(this.bucketName);
            let publicUrl;
            // Uploads a local file to the bucket
            await bucket.upload(filename, function(err, file, apiResponse) {
                resolve(file.publicUrl());
            });
            
        });
    }
}

module.exports = CloudStorageUtil;