const BaseTask = require("./baseTask");

module.exports = {
    addUser: new BaseTask('POST', '/api/user/task'),
    addMeeting: new BaseTask('POST', '/api/meeting/task')
}
