console.log('unfollow');
let myUserId = '';
let token = '';
let fbFriendUrl = ``;
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'openUserProfile' && message.from === 'unfollow') {
        console.log('openUserProfile');
        await getToken();
        let url = await requestUserAbout(); // get profile friend all link
        if (url) {
            //const url = `https://www.facebook.com/${id}/friends_all`;
            chrome.tabs.create({ url: url, active: true },
                function (tabs) {
                    friendTabId = tabs.id;
                    extension_page_tabid = sender.tab.id;
                    chrome.storage.local.set({ friendUnfollowProcess: "process" },
                        function () {
                            chrome.tabs.onUpdated.addListener(friendListPageTabListener);
                        }
                    );
                }
            );
        }
    }
    if (message.action === 'saveFriendData' && message.from === 'unfollow') {
        console.log(message);
        let friendListTabId = sender.tab.id;
        let friendsInfo = message.friendsInfo;
        saveFriendDetails(friendsInfo,friendListTabId);
        
    }
    if (message.action === 'closeNovaPopup' && message.from === 'nova') {
       
        let friendListTabId = sender.tab.id;
        let friendsInfo = message.friendsInfo;
        saveFriendDetails(friendsInfo,friendListTabId);
        setTimeout(()=>{
            chrome.tabs.remove(sender.tab.id);
            reloadAllNovalyaTabs();
        },3000);
        
    }
    if(message.action === 'unfriendIds'  && message.from === 'unfollow'){
        let unfriendIds =  message.unfriendIds;
        unfriendListTabId = sender.tab.id;
        let token = authToken;
        if(token != undefined && token != ''){
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+token);
            myHeaders.append("Content-Type", "application/json");
 
            let raw = unfriendIds;
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            fetch("https://novalyabackend.novalya.com/novadata/api/get-unfriended", requestOptions)
            .then((response) => response.json())
            .then((result) => { 
                if(result.status === "success"){
                    console.log(result.data);
                    novaUnfriendIds(result.data,unfriendListTabId);
                }else{
                    chrome.tabs.sendMessage(unfriendListTabId, {
                        action: 'closeunfriendPopup',
                        from: 'background'
                    });
                }
            })
            .catch((error) => {
                console.error('error', error); 
                chrome.tabs.sendMessage(unfriendListTabId, {
                    action: 'closeunfriendPopup',
                    from: 'background'
                })
            });               
        } 
    }
});

function saveFriendDetails(friendsInfo,friendListTabId){
    let token = authToken;
    if (token != undefined && token != '') {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(friendsInfo);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://novalyabackend.novalya.com/novadata/api/user-add-new", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            chrome.tabs.sendMessage(friendListTabId, {
                action: 'procesComplete',
                from: 'background',
                message: 'Records Updated or Created',
            });
        })
        .catch((error) => {
            console.error('error', error);
            chrome.tabs.sendMessage(friendListTabId, {
                action: 'closeNova',
                from: 'background'
            })
        });
    }
}

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
    console.log('extension_page_tabid - ', extension_page_tabid);
    console.log('friendTabId - ', friendTabId);
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

async function novaUnfriendIds(unfriendsList,novaTabId){
    console.log(unfriendsList);
    console.log(novaTabId);
    if (unfriendsList.length > 0) {
        for (const item of unfriendsList) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            const novaResponse = await novaUnfriend(item.fbId);
            await saveUnfriendList(item);
            console.log(novaResponse);   
        }
        chrome.tabs.sendMessage(novaTabId, {
            action: 'unfriendsProcess',
            from: 'background',
            message: 'complete'
        });
        console.log('done');
    }
}

async function getToken() {
    return fetch('https://www.facebook.com/help').then(function (response) {
        return response.text();
    }).then(function (text) {
        myUserId = text.match(/"USER_ID":"(.*?)"/)[1];
        const tokenArray = text.match(/"token":"(.*?)"/g);
        const lastElement = tokenArray[tokenArray.length - 1];
        token = lastElement.match(/"token":"(.*?)"/)[1];

        console.log('myUserId - ', myUserId);
        console.log('token - ', token);
        return { myUserId, token };
    });
}

async function novaUnfriend(unfriendId){
    console.log('unfriend');
    console.log(unfriendId);
    await getToken();
    const variables = {
      input: {"source":"bd_profile_button","unfriended_user_id":unfriendId,"actor_id":myUserId,"client_mutation_id":"1"},
      scale: 1,
    };
  
    var formData = new FormData();
    formData.append("fb_dtsg", token);
    formData.append("av", myUserId);
    formData.append("__user", myUserId);
    formData.append("__a", "1");
    formData.append("__comet_req", "15");
    formData.append("fb_api_caller_class", "RelayModern");
    formData.append("fb_api_req_friendly_name", "FriendingCometUnfriendMutation");
    formData.append("doc_id", "8752443744796374");
    formData.append("variables", JSON.stringify(variables));
  
    return fetch("https://www.facebook.com/api/graphql/", {
      "body": formData,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(function (res) {
        console.log(res);
      return res.text();
    }).then(function (text) {
      /** check if the facebook token not works */
      console.log(text);
    });
}

async function saveUnfriendList(item){
    console.log(item);
    let token = authToken;
    if(token != undefined && token != ''){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(item);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://novalyabackend.novalya.com/novadata/api/save-unfriended", requestOptions)
        .then((response) => response.json())
        .then((result) => { 
            console.log(result);  
        })
        .catch((error) => {
            console.error('error', error); 
        });               
    } 
}

async function requestUserAbout() {
    var collectionToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var sectionToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var formData = new FormData();
    formData.append("fb_dtsg", token);
    formData.append("av", myUserId);
    formData.append("__user", myUserId);
    formData.append("__a", "1");
    formData.append("__comet_req", "1");
    formData.append("fb_api_caller_class", "RelayModern");
    formData.append("fb_api_req_friendly_name", "ProfileCometAboutAppSectionQuery");
    formData.append("doc_id", "3415254011925748");
    formData.append("variables", "{\"appSectionFeedKey\":\"ProfileCometAppSectionFeed_timeline_nav_app_sections__100041663866376:2327158227\",\"collectionToken\":".concat(collectionToken, ",\"rawSectionToken\":\"100041663866376:2327158227\",\"scale\":1,\"sectionToken\":").concat(sectionToken, ",\"userID\":\"").concat(myUserId, "\"}"));
    return fetch("https://www.facebook.com/api/graphql/", {
        "body": formData,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(function (res) {
        return res.text();
    }).then(function (text) {
        var jsons = text.split("\n");
        try {
            jsons = JSON.parse(jsons[0]);
            console.log(jsons);

            // Check if the necessary nodes exist before accessing them
            if (jsons.data && jsons.data.user && jsons.data.user.about_app_sections) {
                aboutNode = jsons.data.user.about_app_sections.nodes;

                if (aboutNode && aboutNode.length > 0) {
                    aboutData = aboutNode.filter(function (item) {
                        return item.name == 'Friends';
                    });

                    // Check if 'Friends' node exists before proceeding
                    if (aboutData && aboutData.length > 0 && aboutData[0].all_collections) {
                        let friendLinkNodes = aboutData[0].all_collections.nodes;
                        console.log(friendLinkNodes);

                        // Check if 'All friends' node exists before proceeding
                        if (friendLinkNodes) {
                            let allFriendLink = friendLinkNodes.filter(function (item) {
                                return item.name == 'All friends' || item.url.indexOf('friends_all') > 0;
                            });
                            console.log(allFriendLink);
                            // Check if 'All friends' node exists before accessing its properties
                            if (allFriendLink && allFriendLink.length > 0) {
                                console.log(allFriendLink);
                                console.log(fbFriendUrl);
                               return fbFriendUrl = allFriendLink[0].url;
                                
                            } else {
                                console.error("'All friends' node not found.");
                            }
                        } else {
                            console.error("No friend link nodes found.");
                        }
                    } else {
                        console.error("'Friends' node not found in aboutData.");
                    }
                } else {
                    console.error("No aboutNode found or it's empty.");
                }
            } else {
                console.error("Invalid JSON structure or missing required nodes.");
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
}