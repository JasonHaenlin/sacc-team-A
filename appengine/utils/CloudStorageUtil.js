const {Storage} = require('@google-cloud/storage');


    


exports.createBucket = async () =>{
        this.storage = new Storage();
    this.bucketName = 'stats-bucket-team-a';
    //
    // Creates the new bucket
    this.storage.createBucket(this.bucketName).then(()=>{
        console.log(`Bucket ${this.bucketName} created.`);
    }).catch(console.error);
    
}

exports.uploadFile = async (bucketName,filename) =>{
    this.storage = new Storage();
    const bucket = this.storage.bucket(bucketName);
    // Uploads a local file to the bucket
    return await bucket.upload(filename, function(err, file, apiResponse) {
    });
}

