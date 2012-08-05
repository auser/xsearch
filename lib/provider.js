
function Provider() {

}

/*
 * search
 * searching the history 
 */
Provider.prototype.search = function(q, channelId, callback) {
  console.log("Searching "+q+" on "+this.providerName);
}

/*
 * Subscribe
 * using search terms (firehose)
 */

/*
 * Unsubscribe
 */

/*
 * 
 */

module.exports = Provider;
