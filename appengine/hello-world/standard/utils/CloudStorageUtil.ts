require('@google-cloud/storage');

export default class CloudStorageUtil{

     storage :Storage;
     bucketName : string;

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

    async uploadFile(filename : String) : Promise<string>{
        return new Promise(async (resolve, reject) => {
            const bucket = this.storage.bucket(this.bucketName);
            let publicUrl : String;
            // Uploads a local file to the bucket
            await bucket.upload(filename, function(err, file, apiResponse) {
                resolve(file.publicUrl());
            });
            
        });
    }
}