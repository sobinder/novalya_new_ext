/*
 * 
 * AddNewFriend Javascript
 * 
 * @since 5.0.0
 * 
 */
let AddNewFriend;
(function($) {
    let $this;
    AddNewFriend = {
        settings: {},
        initilaize: function() {
            $this = AddNewFriend;
            $(document).ready(function() {                
                $this.onInitMethods();
            });
        },
        onInitMethods: function() {
        },
        readFriendRequests: function() {
            console.log('sendMessageFromRequestWindow');
            var newRequestids = [];
            console.log(newRequestids);
            $('body').find('#friends_center_main ._5vbx[data-store]').each(function (index) {
                if ($(this).find('button[value="Confirm"]').length > 0) {
                    fullName = $(this).find('a:eq(1)').text();
                    var tempData = {};
                    tempData.fullName = fullName;
                    var requestProfileId = '';
                    requestProfileUrl = 'https://facebook.com' + $(this).find('a:eq(1)').attr('href');
                    profileUrlTemp = new URL(requestProfileUrl);
                    if (requestProfileUrl.indexOf('.php') > -1) {
                        requestProfileId = profileUrlTemp.searchParams.get('id');
                    } else {
                        requestProfileId = profileUrlTemp.pathname.replace('/', '');
                    }
                    tempData.requestProfileId = requestProfileId;
                    newRequestids.push(tempData);
                }
            });
            console.log(newRequestids);
            if (newRequestids.length > 0) {
                chrome.runtime.sendMessage({ 'action': 'insertRecivedRequest', 'newRequestids': newRequestids, 'type': 'recived' }, function(resp4) {
                    //console.log(resp4);
                });
                setTimeout(() => {
                    chrome.runtime.sendMessage({ 'action': "closeTabs"}, function(res1) {
                        // body
                    });
                }, 300000);
            } else {
                console.log('close no request found..ib BG');
                setTimeout(() => {
                    chrome.runtime.sendMessage({ 'action': "closeTabs"}, function(res1) {
                        // body
                    });
                }, 500);
            }
        }        
    };
    AddNewFriend.initilaize();
})(jQuery);