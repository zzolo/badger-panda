/**
 * @file
 * Vote handler
 */

var voter = {};

// Scope jquery
(function($) {
    voter = {
        // Submit vote to system
        'submitVote': function(socket, vote) {
            var thisVoter = this;
            var message = {
                'action': 'save-vote',
                'vote': vote,
                'ip': thisVoter.getIP(),
                'when': new Date()
            }
            socket.send(message);
            thisVoter.updateCounts(socket);
        },
        
        // Get IP and store locally if found
        'getIP': function() {
            if (typeof this.ip == 'undefined') {
                this.ip = $('#ip').html();
            }
            return this.ip
        },
        
        // Get count
        'updateCounts': function(socket) {
            socket.send({ 'action': 'get-counts' });
        },
        
        // Handle incoming messages
        'handleMessage': function(message) {
            if (typeof message.badgers != 'undefined') {
                this.badgerCount = message.badgers;
                this.pandaCount = message.pandas;
                $('.badger-count').html(message.badgers);
                $('.panda-count').html(message.pandas);
            }
        }
    };
})(jQuery);