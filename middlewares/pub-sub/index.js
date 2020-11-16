const BasePubSub = require("./basePubSub");

module.exports = {
    stats: new BasePubSub('stats', 'stats-subscription'),
    heatmapPubSub: new BasePubSub('heatmap', 'heatmap-subscription'),
}
