const BaseTask = require("./baseTask");

module.exports = {
    addUserTask: new BaseTask('POST', '/user/task'),
}
