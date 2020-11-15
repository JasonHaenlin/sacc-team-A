const BaseTask = require("./baseTask");

module.exports = {
    addUser: new BaseTask('POST', '/api/user/task'),
    updateUserPoi: new BaseTask('PUT', '/api/user/task/poi'),
    addMeeting: new BaseTask('POST', '/api/meeting/task'),
    addAdmin: new BaseTask('POST', '/api/admin/task'),
}
