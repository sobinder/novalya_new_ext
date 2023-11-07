let friendDetails;
let friendListTabId;
let friendListArray = [];

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'fetchedFriendData') {

        console.log('fetchedFriendData');
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
                setTimeout(()=>{
                    if (tabId === fbTabId && changeInfo.status === "complete") {
                        console.log(tabId);
                        console.log(fbTabId);
                        console.log(changeInfo.status);
                        console.log('send message');
                        chrome.tabs.sendMessage(tabId, {
                            action: "getGenderAndPlace",
                            from: "background",
                            friend: friendDetails
                        });
                        chrome.tabs.onUpdated.removeListener(facebookTabListener);
                    }
                },1000);
               
            });
        })
    }
    if(message.action === 'saveFriendData'){
        console.log('saveFriendData');
        let friendDetails = message.friendDetails;
        chrome.tabs.remove(sender.tab.id);
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
    if(message.action === 'openUserProfile' && message.from === 'unfollow'){
        let id = await getCurrentUserFbId(); // Get user's Fb id
        if(id){
            const url = `https://www.facebook.com/${id}/friends_all`;
            chrome.tabs.create({ url: url, active: true },
                function(tabs) {
                    friendTabId = tabs.id;
                    extension_page_tabid = sender.tab.id;
                    chrome.storage.local.set({ friendUnfollowProcess: "process" },
                        function() {
                            chrome.tabs.onUpdated.addListener(friendListPageTabListener);
                            //sendResponse({ data: res1 });
                        }
                    );
                }
            );
        }
    }
    if(message.action === 'closeUnfollow' && message.from === 'unfollow'){
        chrome.tabs.remove(sender.tab.id);
    }
    

});


async function getCurrentUserFbId() {
    return new Promise(function (resolve, reject) {
      fetch('https://www.facebook.com/me', { method: 'GET' }).then(function (
        response
      ) {
        if (response.status == 200) {
          let fbID = new URL(response.url).searchParams.get('id');
          if (fbID == null) {
            url = new URL(response.url);
            fbID = url.pathname;
            fbID = fbID.replace('/', '');
            fbID = fbID.replace('/', '');
          }
          resolve(fbID);
        } else {
          reject(false);
        }
      });
    });
}

function friendListPageTabListener(tabId, changeInfo, tab) {
    console.log('extension_page_tabid - ',extension_page_tabid);
    console.log('friendTabId - ',friendTabId);
    if (changeInfo.status === "complete" && tabId === friendTabId) {
        extTabId = extension_page_tabid;
        chrome.tabs.sendMessage(friendTabId, {
            action: "friendUnfollowProcess",
            from: "background",
            extTabId: extTabId,
        });
        chrome.tabs.onUpdated.removeListener(friendListPageTabListener);
    }
}  