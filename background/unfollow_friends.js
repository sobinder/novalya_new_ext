let friendDetails;
let friendListTabId;
let friendListArray = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchedFriendData') {
        friendListTabId = sender.tab.id;
        let friendDetails = message.data;
        let profileUrl = friendDetails.profile;

        let url =`${profileUrl}/about_contact_and_basic_info`;
        if(profileUrl.indexOf('profile.php')> 0){
            url = profileUrl+'&sk=about_contact_and_basic_info';
        }

        var windowSetting = {
            url: url,
            focused: false,
            type: "popup",
            top: Math.floor((window_height / 4) * 3),
            left: Math.floor((window_width / 4) * 3),
            height: Math.floor(window_height / 4),
            width: Math.floor(window_width / 4),
        };

        chrome.windows.create(windowSetting, function (tabs) {
            let fbTabId = tabs.tabs[0].id;
            chrome.tabs.onUpdated.addListener(function facebookTabListener(tabId, changeInfo, tab) {
                if (tabId === fbTabId && changeInfo.status === "complete") {
                    console.log(tabId);
                    console.log(fbTabId);
                    console.log(changeInfo.status);
                    console.log('send message');
                    chrome.tabs.sendMessage(fbTabId, {
                        action: "getGenderAndPlace",
                        from: "background",
                        friend: friendDetails
                    });
                    chrome.tabs.onUpdated.removeListener(facebookTabListener);
                }
            });
        })
    }
    if(message.action === 'saveFriendData'){
        let friendDetails = message.friendDetails;
        chrome.tabs.remove(sender.tab.id);
        friendListArray.push(friendDetails);
        console.log(friendListArray);

        // chrome.tabs.sendMessage(friendListTabId, {
        //     action: 'nextFetchFriend',
        //     from: 'background'
        // });
        let token = authToken;
        if(token != undefined && token != ''){
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+token);
            myHeaders.append("Content-Type", "application/json");
            let status = 0;
            if(friendDetails.status === 'activate'){
                status = 1;
            }
            
            var raw = JSON.stringify({
                "type":'',
                "fbId":friendDetails.fbId,
                "user_name": friendDetails.name,
                "gender":friendDetails.gender,
                "profile":friendDetails.profile,
                "status":status,
                "image":friendDetails.image,
                "lived":friendDetails.lived
            });

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            fetch("https://novalyabackend.novalya.com/novadata/api/user-add", requestOptions)
            .then((response) => response.json())
            .then((result) => { 
                console.log(result);
                chrome.tabs.sendMessage(friendListTabId, {
                    action: 'nextFetchFriend',
                    from: 'background'
                });
               
            })
            .catch((error) => {
                console.error('error', error); 
                chrome.tabs.sendMessage(friendListTabId, {
                    action: 'closeFriendPopup',
                    from: 'background'
                })
            });               
        } 
    }
});