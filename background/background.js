importScripts(
    "../helper.js",
    "nova_data.js",
    "bg_send_message.js",
    "bg_friend_requests.js",
    "send_without_popup.js",
    "birthday.js"
);
//****************************** DEFINE VARIABLES *****************************************//
// GET HEIGHT WIDTH OF CHROME WINDOWS
var user_id;
var window_height = 0;
var window_width = 0;
chrome.windows.getAll({ populate: true }, function (list) {
    window_height = list[0].height;
    window_width = list[0].width;
});
let taggedusers = [];

// Oninstall though window.open can be blocked by popup blockers
chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create("wakeup_bg", { periodInMinutes: 1 / 60 });
    // chrome.alarms.create('requestIsReceived', { periodInMinutes: 9 });
    checkMessengerMobileView();
    reloadAllNovalyaTabs();
    reloadAllGroupTabs();
    reloadAllFriendsTabs();
    reloadMessengersTabs();
    getAdminSettings();
    clearAlarm("requestIsReceived");
});

chrome.management.onEnabled.addListener(function (extensionInfo) {
    if (extensionInfo.name == 'Novalya') {
        checkMessengerMobileView();
        reloadAllNovalyaTabs();
        reloadAllGroupTabs();
        reloadAllFriendsTabs();
        reloadMessengersTabs();
        getAdminSettings();
    }

});

chrome.management.onDisabled.addListener(function (extensionInfo) {
    console.log("Extension disabled:", extensionInfo.name);
    if (extensionInfo.name == 'Novalya') {
        checkMessengerMobileView();
        reloadAllNovalyaTabs();
        reloadAllGroupTabs();
        reloadAllFriendsTabs();
        reloadMessengersTabs();
    }
});

getCookies(site_url, "user_id", function (id) {
    user_id = id;
    console.log(user_id, "this is the user id");
});

getCookies(site_url, "authToken", function (token) {
    authToken = token;
    console.log(authToken, "this is the auth token");
});

chrome.runtime.onStartup.addListener(function () {
    checkMessengerMobileView();
    reloadAllNovalyaTabs();
    reloadAllGroupTabs();
    reloadAllFriendsTabs();
    reloadMessengersTabs();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "wakeup_bg") {
        getCookies(site_url, "authToken", function (id) {
            authToken = id;
            console.log("wake up service worker", userId);
        });
    }
});

// Clear a specific alarm by name
function clearAlarm(alarmName) {
    chrome.alarms.clear(alarmName, function (cleared) {
        if (cleared) {
            console.log("Alarm cleared successfully!");
        } else {
            console.log("Failed to clear alarm.");
        }
    });
}

// RUN CODE WHEN RELODE NOVALYA.COM
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (
        typeof changeInfo.status != "undefined" &&
        changeInfo.status == "complete"
    ) {
        if (typeof tab.url != "undefined" && tab.url.indexOf(my_domain) > -1) {
            FriendRequestsNVClass.getRequestSettings();
        }
    }
    return true;
});

//Listen to messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendMessageToMember") {
        let window_data = {
            text_message: message.textMsg,
        };
        chrome.storage.local.get(["messengerMobViewStatus"], function (result) {
            if (
                typeof result.messengerMobViewStatus != "undefined" &&
                result.messengerMobViewStatus != ""
            ) {
                //let mobileViewEnable = false;
                let mobileViewEnable = result.messengerMobViewStatus.enable;
                if (mobileViewEnable) {
                    mfacebook_thread_url = "https://mbasic.facebook.com/messages/compose/?ids=" +
                        message.memberid;
                    SendMessageMembersNVClass.openSmallWindow(
                        mfacebook_thread_url,
                        window_data
                    );
                } else {
                    SendMessageMembersNVClass.openMessengersWindow(
                        message.memberid,
                        message.textMsg
                    );
                }
            } else {
                mfacebook_thread_url =
                    "https://mbasic.facebook.com/messages/compose/?ids=" +
                    message.memberid;
                SendMessageMembersNVClass.openSmallWindow(
                    mfacebook_thread_url,
                    window_data
                );
                checkMessengerMobileView();
            }
        });
        //checkMessage(message.memberid,message.textMsg)
    }
    if (message.action === "Reload_all_novalya_tabs") {
        console.log('Reload_all_novalya_tabs');
        if (message.currentLocationUrl.indexOf('messenger') > -1) {
            reloadAllNovalyaTabs();
        }
    }

    if (message.action === "tagsApiCall") {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + authToken);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(new_base_url + "/user/api/group", requestOptions)
            .then(response => response.json())
            .then(result => sendResponse({ data: result, status: "ok" }))
            .catch(error => console.log('error', error));
        return true;
    }
    //sendResponse({ data: result, status: "ok" })
    if (message.action === "tagsAssiging") {
        const fbUserId = message.fb_user_id;
        getBothAlphaAndNumericId(fbUserId)
            .then(function (fbIDsObject) {
                console.log(fbIDsObject);
                const numericUserFbId = fbIDsObject.numeric_fb_id;
                const alphanumericUserFbId = fbIDsObject.fb_user_id;

                console.log('numericUserFbId - ', numericUserFbId);
                console.log('alphanumericUserFbId -', alphanumericUserFbId);

                let token = authToken;
                if (token != undefined && token != '') {
                    console.log(message);
                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", "Bearer " + token);
                    myHeaders.append("Content-Type", "application/json");
                    var raw = JSON.stringify({
                        "type": "add",
                        "fb_user_id": numericUserFbId,
                        "fb_user_alphanumeric_id": alphanumericUserFbId,
                        "fb_image_id": 'null',
                        "fb_name": message.fbName,
                        "profile_pic": message.profilePic,
                        "is_primary": message.is_primary,
                        "tag_id": message.selected_tags_ids,
                        "stage_id": 1
                    });
                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };
                    fetch("https://novalyabackend.novalya.com/api/ext/tag/get-tagged-user", requestOptions)
                        .then((response) => response.json())
                        .then((result) => {
                            chrome.tabs.sendMessage(sender.tab.id, {
                                type: 'tag_update_done',
                                from: 'background',
                                result: result,
                            });
                            sendResponse({ data: result.msg, status: "ok" });
                        })
                        .catch(error => console.log('error', error));
                }
            })
            .catch(error => {
                console.error('Error getting FB IDs:', error);
                sendResponse({ data: "An error occurred", status: "error" });
            });
        return true;
    }

    if (message.action === "bulkTagging") {
        console.log(message);
        const selectedTagId = message.selected_tags_ids;
        const bulkMembers = message.bulk_members;
        const type = message.type;

        console.log(selectedTagId);

        const bulkMembersInfo = Promise.all(bulkMembers.map(item =>
            getBothAlphaAndNumericId(item.fb_user_id).then(bothIds => ({
                fbName: item.fbName,
                profilePic: item.profilePic,
                fb_user_alphanumeric_id: bothIds.fb_user_id,
                fb_user_id: bothIds.numeric_fb_id,
                fb_image_id: null
            }))
        ));

        bulkMembersInfo.then(info => {
            console.log(info);
            //console.log(JSON.parse(info));
            let token = authToken;
            if (token != undefined && token != '') {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);
                myHeaders.append("Content-Type", "application/json");
                console.log(selectedTagId);
                var raw = JSON.stringify({
                    "type": type,
                    "members": JSON.stringify({ info }),
                    "tag_id": selectedTagId,
                    "stage_id": 1
                });

                console.log(raw);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch("https://novalyabackend.novalya.com/api/ext/tag/get-tagged-user", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            type: 'tag_update_done',
                            from: 'background',
                            result: result,
                        });
                        sendResponse({ data: result.msg, status: "ok" });
                    }).catch(error => console.log('error', error));
            }
        });
    }

    if (message.action === "single_users_tag_get") {
        console.log(authToken);
        let token = authToken;
        if (token != undefined && token != '') {
            console.log(message);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "type": "single_get",
                //   "type": "get",
                "fb_user_id": message.fb_user_id
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(new_base_api_url + "tag/get-tagged-user", requestOptions)
                .then(response => response.text())
                .then(result => sendResponse(result))
                .catch(error => console.log('error', error));
        }
        return true;
    }

    if (message.action === "all_users_tag_get") {
        console.log(user_id);
        let token = authToken;
        if (token != undefined && token != '') {
            console.log(message);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "type": "get"
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://novalyabackend.novalya.com/extension/api/taggeduser-api", requestOptions)
                .then(response => response.json())
                .then(result => { console.log(result); sendResponse(result) })
                .catch(error => console.log('error', error));
        }
        return true;
    }

    if (message.action === "verifyGroupURL") {
        let grouppage_url = message.url.replace("www", "mbasic");
        getGroupName(sendResponse, grouppage_url);
        return true;
    }
    if (message.action == "refreshExt") {
        checkMessengerMobileView();
        return true;
    }

    if (message.action === "addgroupapi") {
        let token = authToken;
        console.log(message);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "name": message.name,
            "url": message.url
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(new_base_api_url + "group/create-group", requestOptions)
            .then((response) => response.json())
            .then((result) => sendResponse({ data: result, status: "ok" }))
            .catch((error) => sendResponse({ data: error, status: "error" }));
        return true;
    }

    if (message.action === "addgroupapinew") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "name": message.name,
            "url": message.url,
            "group_type": message.group_type
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(new_base_api_url + "group/create-group", requestOptions)
            .then((response) => response.json())
            .then((result) => sendResponse({ data: result, status: "ok" }))
            .catch((error) => sendResponse({ data: error, status: "error" }));
        return true;
    }

    if (message.action === "getMessageSections") {
        console.log(authToken);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + authToken);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://novalyabackend.novalya.com/target/setting/api/all", requestOptions)
            .then(response => response.json())
            .then(async res1 => {
                console.log(res1);
                //return false;
                if (res1.status == "error") {
                    console.log(res1.message);
                } else {
                    let response = await getUserPlanLimit();
                    total_no_friend_request = response?.data?.new_packages?.no_friend_request ?? 0;

                    no_friend_request = response?.data?.userlimit?.no_friend_request ?? 0;
                    chrome.storage.local.set({
                        nvFriendReqInputs: res1.data,
                        no_friend_request: no_friend_request,
                        total_no_friend_request: total_no_friend_request
                    }, function () {
                        console.log(res1.data[0].groups.url);
                        chrome.tabs.create({ url: res1.data[0].groups.url, active: true },
                            function (tabs) {
                                groupPageTabId = tabs.id;
                                extension_page_tabid = sender.tab.id;
                                chrome.storage.local.set({ nvAddFriendProcess: "process" },
                                    function () {
                                        chrome.tabs.onUpdated.addListener(groupPageTabListener);
                                        sendResponse({ data: res1 });
                                    }
                                );
                            }
                        );
                    });
                }
            })
            .catch(error => console.log('error', error));
    }

    if (message.action == "fetchMessageFromGroupSegement") {
        var myHeaders = new Headers();
        var formdata = new FormData();
        formdata.append("message_id", message.groupid);
        formdata.append("user_id", userId);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch(base_api_url + "send-message-on-connect.php", requestOptions)
            .then((response) => response.json())
            .then((result) => sendResponse({ text: result.msg, status: "ok" }))
            .catch((error) => sendResponse({ text: "", status: "error" }));
        return true;
    }

    if (message.action == "closeTabs") {
        setTimeout(() => {
            chrome.tabs.remove(sender.tab.id);
        }, 7000);
        sendResponse({ status: true });
        return true;
    }

    if (message.action == "closeTabs2") {
        setTimeout(() => {
            chrome.tabs.remove(sender.tab.id);
        }, 2000);
        sendResponse({ status: true });
        return true;
    }


    if (message.action === "getGenderCountry") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            name: message.name,
        });
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        fetch(
            "https://z7c5j0fjy8.execute-api.us-east-2.amazonaws.com/dev/tiersai",
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => sendResponse({ gender: message.gender, data: result }))
            .catch((error) => console.log("error", error));

        return true; // Tells Chrome to keep the message channel open for async response
    }


    // RECIVED MESSAGE FROM CONTENT SCRIPT AFTER CLICK ON DELECT REQUEST BUTTON
    if (message.action == "deleteRequest") {
        FriendRequestsNVClass.getRequestSettings();
        setTimeout(() => {
            chrome.storage.local.get(["requestSettings"], function (result) {
                console.log(result);
                if (
                    typeof result.requestSettings != "undefined" &&
                    result.requestSettings != ""
                ) {

                    requestSettings1 = result.requestSettings;
                    //  messageArray = requestSettings1.reject_message;
                    //  var randomIndex = Math.floor(Math.random() * messageArray.length);

                    //  // Disable for API
                    // // var messageText = messageArray[randomIndex];
                    //  var messageText = "Hello mr. [first name] [last name]";

                    var reqeuestMessage = [];
                    var reqeuestMessagetextArray = requestSettings1.reject_message.Sections;
                    reqeuestMessagetextArray.forEach(function (item, i) {
                        reqeuestMessage_json = reqeuestMessagetextArray[i];
                        reqeuestMessage_varient_json = reqeuestMessage_json.varient;
                        reqeuestMessage_varient_array = JSON.parse(reqeuestMessage_varient_json);
                        var randomIndex2 = Math.floor(
                            Math.random() * reqeuestMessage_varient_array.length
                        );
                        reqeuestMessage.push(reqeuestMessage_varient_array[randomIndex2]);
                    });
                    reqeuestMessage = reqeuestMessage.join('');
                    console.log(reqeuestMessage);
                    messageText = reqeuestMessage;

                    var member_fullname = message.data.name;
                    var member_names = member_fullname.split(" ");
                    messageText = messageText.replace("[first name]", member_names[0]);
                    messageText = messageText.replace("[last name]", member_names[1]);

                    var window_data = {
                        text_message: messageText,
                    };

                    chrome.storage.local.get(["messengerMobViewStatus"], function (result) {
                        console.log(result);
                        if (
                            typeof result.messengerMobViewStatus != "undefined" &&
                            result.messengerMobViewStatus != ""
                        ) {
                            console.log('if 0');
                            let mobileViewEnable = result.messengerMobViewStatus.enable;
                            console.log(mobileViewEnable);
                            if (mobileViewEnable) {
                                console.log('if 1');
                                mfacebook_thread_url =
                                "https://m.facebook.com/messages/compose/?ids=" + message.data.id;

                                SendMessageMembersNVClass.openSmallWindow(
                                    mfacebook_thread_url,
                                    window_data
                                );
                                sendResponse({ status: "ok" });
                            } else {
                                console.log('else 1');
                                SendMessageMembersNVClass.openMessengersWindow(
                                    message.data.id,
                                    window_data
                                );
                                sendResponse({ status: "ok" });
                            }

                        }else {
                            console.log('else 0');
                            mfacebook_thread_url =
                            "https://m.facebook.com/messages/compose/?ids=" + message.data.id;

                            SendMessageMembersNVClass.openSmallWindow(
                                mfacebook_thread_url,
                                window_data
                            );
                            checkMessengerMobileView();
                            sendResponse({ status: "ok" });
                        }

                    });
                }
            });
            return true;
        }, 6000)
    }

    if (message.action == "openBirthdayEventNew") {
        console.log('openBirthdayEventNew');
        BirthdayNovaClass.getBirthdaySettingsNew(message, sendResponse, sender);
        return true;
    }

    // RECIVED MESSAGE FROM CONTENT SCRIPT AFTER CLICK ON CONFIRM REQUEST BUTTON
    if (message.action == "confirmRequest") {
        FriendRequestsNVClass.getRequestSettings();
        setTimeout(() => {
            chrome.storage.local.get(["requestSettings"], function (result) {
                console.log(result);
                if (
                    typeof result.requestSettings != "undefined" &&
                    result.requestSettings != ""
                ) {
                    requestSettings1 = result.requestSettings;
                    var reqeuestMessage = [];
                    var reqeuestMessagetextArray = requestSettings1.accept_message.Sections;
                    reqeuestMessagetextArray.forEach(function (item, i) {
                        reqeuestMessage_json = reqeuestMessagetextArray[i];
                        reqeuestMessage_varient_json = reqeuestMessage_json.varient;
                        reqeuestMessage_varient_array = JSON.parse(reqeuestMessage_varient_json);
                        var randomIndex2 = Math.floor(
                            Math.random() * reqeuestMessage_varient_array.length
                        );
                        reqeuestMessage.push(reqeuestMessage_varient_array[randomIndex2]);
                    });
                    reqeuestMessage = reqeuestMessage.join('');
                    console.log(reqeuestMessage);
                    messageText = reqeuestMessage;
                    var member_fullname = message.data.name;
                    var member_name = member_fullname.split(" ");
                    messageText = messageText.replaceAll("[first name]", member_name[0]);
                    messageText = messageText.replaceAll("[last name]", member_name[1]);
                    var window_data = {
                        text_message: messageText,
                    };
                    chrome.storage.local.get(["messengerMobViewStatus"], function (result) {
                        console.log(result);
                        if (
                            typeof result.messengerMobViewStatus != "undefined" &&
                            result.messengerMobViewStatus != ""
                        ) {
                            let mobileViewEnable = result.messengerMobViewStatus.enable;
                            //console.log(mobileViewEnable);
                            if (mobileViewEnable) {
                                mfacebook_thread_url =
                                "https://m.facebook.com/messages/compose/?ids=" + message.data.id;
        
                                SendMessageMembersNVClass.openSmallWindow(
                                    mfacebook_thread_url,
                                    window_data
                                );
                                sendResponse({ status: "ok" });
                            } else {
                                SendMessageMembersNVClass.openMessengersWindow(
                                    message.data.id,
                                    window_data.text_message
                                );
                                sendResponse({ status: "ok" });
                            }

                        }else {
                            mfacebook_thread_url =
                                "https://m.facebook.com/messages/compose/?ids=" + message.data.id;
        
                                SendMessageMembersNVClass.openSmallWindow(
                                    mfacebook_thread_url,
                                    window_data
                                );
                            checkMessengerMobileView();
                            sendResponse({ status: "ok" });
                        }
                    });  
                }
            });
            return true;
        }, 6000)
    }

    // CANCEL ALL SENT REQUESTS AFTER CLICK ON FOLLOW
    if (message.action == "cancelSentFriendRequests") {
        var outgoing_requests_url =
            "https://m.facebook.com/friends/center/requests/outgoing";
        chrome.tabs.create({ url: outgoing_requests_url, active: true },
            function (tabs) {
                outgoing_page_tabId = tabs.id;
                chrome.tabs.onUpdated.addListener(function outgoingRequestsTabListener(
                    tabId,
                    changeInfo,
                    tab
                ) {
                    if (
                        changeInfo.status === "complete" &&
                        tabId === outgoing_page_tabId
                    ) {
                        chrome.tabs.sendMessage(outgoing_page_tabId, {
                            subject: "removeRequests",
                        });
                        chrome.tabs.onUpdated.removeListener(outgoingRequestsTabListener);
                    }
                });
                sendResponse({ status: "start" });
            }
        );
    }

    if (message.action == "openChromeExtension") {
        var outgoing_requests_url =
            "chrome://extensions/?id=iemhbpcnoehagepnbflncegkcgpphmpc";
        chrome.tabs.create({ url: outgoing_requests_url, active: true },
            function (tabs) {
                sendResponse({ status: "start" });
            }
        );
        return true;
    }

    if (message.action == "openBirthdayEvent") {
        BirthdayNovaClass.getBirthdaySettings(message, sendResponse, sender);
        return true;
    }

    if (message.action == "sendMessageBirthday") {
        updateBirthdayLimit();
        const window_data = { text_message: message.messagtext };
        getNumericID(message.member_fb_id)
            .then(function (resopnse) {
                chrome.storage.local.get(["messengerMobViewStatus"], function (result) {
                    if (
                        typeof result.messengerMobViewStatus != "undefined" &&
                        result.messengerMobViewStatus != ""
                    ) {
                        let mobileViewEnable = result.messengerMobViewStatus.enable;
                        if (mobileViewEnable) {
                            var mfacebook_thread_url = "https://mbasic.facebook.com/messages/compose/?ids=" + resopnse.userID;
                            SendMessageMembersNVClass.openSmallWindow(
                                mfacebook_thread_url,
                                window_data
                            );
                        } else {
                            SendMessageMembersNVClass.openMessengersWindow(
                                resopnse.userID,
                                message.messagtext
                            );
                        }
                    } else {
                        var mfacebook_thread_url = "https://mbasic.facebook.com/messages/compose/?ids=" + resopnse.userID;
                        SendMessageMembersNVClass.openSmallWindow(
                            mfacebook_thread_url,
                            window_data
                        );
                        checkMessengerMobileView();
                    }
                });
                sendResponse({ status: "start" });
            })
            .catch(function (response) {
                console.log("error to find fb id");
                sendResponse({ status: "error" });
            });
        return true;
    }

    if (message.action == "postFeedBirthday") {
        updateBirthdayLimit();
        const window_data = { text_message: message.messagtext };
        facebook_profile_url = "https://www.facebook.com/" + message.member_fb_id;
        SendMessageMembersNVClass.postTextOnTimeline(
            facebook_profile_url,
            window_data
        );
        sendResponse({ status: "start" });
        return true;
    }

    if (message.action === "addgroupapi") {
        let token = authToken;
        console.log(token);
        if (token != undefined && token != '') {
            console.log(message);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "name": message.name,
                "group_type": "member",
                "url": message.url,
            });

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            fetch(new_base_api_url + "group/create-group", requestOptions)
                .then((response) => response.json())
                .then((result) => sendResponse({ data: result, status: "ok" }))
                .catch((error) => sendResponse({ data: error, status: "error" }));
        }
        return true;
    }

    if (message.action == "reloadExtensionId") {
        //usage:
        getCookies(site_url, "authToken", function (id) {
            authToken = id;
            sendResponse({ authToken: authToken });
        });
        return true;
    }

    if (message.action == "userCRMPermission") {
        console.log(authToken);
        let token = authToken;
        if (token != undefined && token != '') {
            console.log(message);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch(new_base_api_url + "crm/get-crm-status", requestOptions)
                .then(response => response.json())
                .then(result => sendResponse({ data: result.data, status: "ok" }))
                .catch(error => sendResponse({ data: error, status: "error" }));
        }
        return true;
    }

    if (message.action === "getCRMSettings") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);
        var raw = JSON.stringify({
            // "group_id": message.settins.group_id,
            "userIds": message.settins.userIds,
            "message_id": message.settins.message_id,
            "time_interval": message.settins.time_interval
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://novalyabackend.novalya.com/user/api/compaigns", requestOptions)
            .then(response => response.json())
            .then(async (result) => {
                console.log(result);
                let response = await getUserPlanLimit();
                let total_no_crm_message = response?.data?.new_packages?.no_crm_message ?? 0;
                let no_crm_message = response?.data?.userlimit?.no_crm_message ?? 0;

                console.log(total_no_crm_message);
                console.log(no_crm_message);

                sendResponse({ setting: result, total_no_crm_message: total_no_crm_message, no_crm_message: no_crm_message })
            })
            .catch(error => console.log('error', error));
        return true;
    }

    if (message.action == "sendMessageFromCRMOnebyOne") {
        let window_data = {
            text_message: message.textMsg,
        };
        sendMessageFromCRMOnebyOne(window_data, message.thread_id);
        setTimeout(() => {
            sendResponse({ 'status': 'ok' });
        }, 5000)
        return true;
    }

    if (message.action == "getMessagesANDSettings") {
        let userIds = message.userIds;
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(new_base_url + "/user/api/compaigns", requestOptions)
            .then(response => response.json())
            .then((result) => {
                let responseData = result;
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "type": "get"
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                // Get all tagged users and filter by selected userIds for campaign 
                fetch("https://novalyabackend.novalya.com/extension/api/taggeduser-api", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        const filteredArray = result.data.filter(item => userIds.includes(item.id));
                        if (responseData.data.length > 0) {
                            responseData.data[0].taggedUsers = filteredArray;
                        }
                        console.log(responseData);
                        sendResponse({ api_data: responseData });
                    })
                    .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
        return true;
    }

    if (message.action == "get_all_notes") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://novalyabackend.novalya.com/user/api/note", requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
                sendResponse({ api_data: result, user_id: user_id });
            })
            .catch(error => console.log('error', error));
        return true;
    }

    if (message.action == "add_Notes") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);
        var raw = JSON.stringify({
            "description": message.description,
            "fb_user_id": message.fb_user_id,
            "user_id": user_id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://novalyabackend.novalya.com/user/api/note", requestOptions)
            .then(response => response.json())
            .then(result => { console.log(result); sendResponse({ status: "note added", result: result }) })
            .catch(error => console.log('error', error));
        return true;
    }

    if (message.action == "edit_notes") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);
        var raw = JSON.stringify({
            "description": message.description,
            "fb_user_id": message.fb_user_id,
            "user_id": user_id
        });

        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://novalyabackend.novalya.com/user/api/note/${message.note_id}`, requestOptions)
            .then(response => response.json())
            .then(result => { console.log(result); sendResponse({ status: "note updated" }) })
            .catch(error => {
                console.log('error', error);
                sendResponse({ status: "Error" })
            });
        return true;
    }

    if (message.action == "delete_note") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://novalyabackend.novalya.com/user/api/note/${message.note_id}`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
                sendResponse({ status: "note deleted" });
            })
            .catch((error) => {
                console.log('error', error)
                sendResponse({ status: "error" });
            });
        return true;
    }
    if (message.action == "checkProspectUser") {
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);
        var raw = JSON.stringify({
            "fb_user_id": message.memberid,
            "user_id": user_id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://novalyabackend.novalya.com/prospect/setting/api/check", requestOptions)
            .then(response => response.json())
            .then(result => { console.log(result); sendResponse({ result: result }) })
            .catch(error => console.log('error', error));
        return true;

    }
    if (message.action === "createProspectUser") {
        console.log(" create message recieved");
        let token = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);
        var raw = JSON.stringify({
            "fb_user_id": message.memberid,
            "user_id": user_id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://novalyabackend.novalya.com/prospect/setting/api/create", requestOptions)
            .then(response => response.json())
            .then(result => { console.log(result); sendResponse({ result: result }) })
            .catch(error => console.log('error', error));
        return true;
    }
    if (message.action === "getUserName") {
        let usersId = message.ids;
        findUserName(usersId);
    }
    if (message.action === "syncFbname") {
        let groupId = message.groupId;
        getGroupUser(message, sender, sendResponse);
    }
    // --------------------------------COMMENT AI--------------------------------
    if (message.action == "getResponseFromChatGPT" && message.from == "content") {
        console.log("GPT messag recieved");
        var authtoken = authToken;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + authtoken);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: message.request,
            redirect: 'follow'
        };
        var apiBaseUrl = 'https://novalyabackend.novalya.com/commentai/api/commentgenerate';
        fetch(apiBaseUrl, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                console.log('message.formfield', message.formfield);
                chrome.tabs.sendMessage(sender.tab.id, { from: 'background', subject: 'responseBG', result: result }, function () {
                    // bbody console.log();
                });
            })
            .catch(error => console.log('error', error));


        return true;

    }

    //all update no_crm_message, no_friend_request
    if (message.action === "updateLimit") {
        updateLimit(message, sendResponse);
        setTimeout(() => {
            getUserPlanLimit();
        }, 1000);

    }

    if (message.action === "updateGenderStorage") {
        setTimeout(() => {
            getUserPlanLimit();
        }, 1000);
    }

    if (message.action === "updateNoSendConnects") {
        updateNoOfConnects(message, sendResponse);
    }

    //crm automation
    if (message.action === "crmAutomation") {
        const setting = message.setting;
        const bulkMembers = message.bulk_members;
        const type = 'bulkTagging';

        let moveGroupId = setting.moveGroupId;
        let moveStageId = 1;
        if (setting.moveStageId) {
            moveStageId = setting.moveStageId;
        }

        if (setting.selectAction === 'Move To Stage' && bulkMembers.length > 0) {
            moveGroupId = bulkMembers[0].tag_id;
        }

        const bulkMembersInfo = Promise.all(bulkMembers.map(item =>
            getBothAlphaAndNumericId(item.fb_user_id).then(bothIds => ({
                fbName: item.fbName,
                profilePic: item.profilePic,
                fb_user_alphanumeric_id: bothIds.fb_user_id,
                fb_user_id: bothIds.numeric_fb_id,
                fb_image_id: null
            }))
        ));

        bulkMembersInfo.then(info => {
            let token = authToken;
            if (token != undefined && token != '') {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);
                myHeaders.append("Content-Type", "application/json");
                console.log(moveGroupId);
                var raw = JSON.stringify({
                    "type": type,
                    "members": JSON.stringify({ info }),
                    "tag_id": moveGroupId,
                    "stage_id": moveStageId
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch("https://novalyabackend.novalya.com/api/ext/tag/get-tagged-user", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            type: 'tag_update_done',
                            from: 'background',
                            result: result,
                        });
                        sendResponse({ data: result.msg, status: "ok" });
                    }).catch(error => console.log('error', error));
            }
        });
    }

    if (message.action === "crmAutomationOnebyOne") {
        crmAutomationProcessMembers(message,sender,sendResponse);
    }

    if (message.action === "connectAutomation") {
        connectAutomation(message,sender,sendResponse);
    }

});

var currentDate = getCurrentDate();
function getCurrentDate() {
    var d = new Date();
    var month = d.getMonth() + 1,
        day = d.getDate();
    var output =
        (day < 10 ? "0" : "") +
        day +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        d.getFullYear();
    return output;
}

/******* Check m.facebook/message/compose view on specific region for send message **********/

function checkMessengerMobileView() {
    let messengerUrl = "https://mbasic.facebook.com/messages/compose/";
    fetch(messengerUrl)
        .then((response) => response.text())
        .then((data) => {
            var str = data;
            var mySubString = str.substring(
                str.lastIndexOf('id="composer_form"') + 0,
                str.lastIndexOf('id="composer_form"') + 25
            );
            //console.log('messenger '+mySubString);
            if (mySubString.indexOf("composer_form") > -1) {
                mobileViewEnable = true;
            } else {
                mobileViewEnable = false;
            }
            messengerMobViewStatus = {};
            messengerMobViewStatus.enable = mobileViewEnable;
            messengerMobViewStatus.date = currentDate;
            chrome.storage.local.set({
                messengerMobViewStatus: messengerMobViewStatus,
            });
        });
}

// GET USER ID FROM BACKOFFICE WITH GET COOKIES
function getCookies(domain, name, callback) {
    chrome.cookies.get({ url: domain, name: name }, function (cookie) {
        if (callback) {
            if (typeof cookie != undefined && cookie != null) {
                callback(cookie.value);
            }
        }
    });
}

function groupPageTabListener(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tabId === groupPageTabId) {
        extTabId = extension_page_tabid;
        chrome.tabs.sendMessage(groupPageTabId, {
            subject: "addTargetProcess",
            from: "background",
            extTabId: extTabId,
        });
        chrome.tabs.onUpdated.removeListener(groupPageTabId);
    }
}

function getGroupName(sendResponse, grouppage_url) {
    console.log(grouppage_url);
    fetch(grouppage_url, { method: "GET" })
        .then((response) => response.text())
        .then((textResponse) => {
            sendResponse({ groupPageDOM: textResponse });
        });
}

FriendRequestsNVClass.getRequestSettings();
setTimeout(() => {
    getUserPlanLimit();
}, 5000);

// FriendCRMClass.getCRMStatus();

// GET FACEBOOK LOGGED-IN USER 1ID FROM APIS AND SET CUSTOMER ID
function GetFacebookLoginId() {
    return fetch("https://www.facebook.com/help")
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            myUserId = text.match(/"USER_ID":"(.*?)"/)[1];
            chrome.storage.local.set({ nv_facebook_id: myUserId }, function () { });
        });
}

// HEPgfcvbcER TO GET APLHANUMERIC AND NUMERIC ID IF GetBothAphaAndNumericId FUNCTION NOT WORKING. DUE TO BLOCK M.FACEBOOK.COM
async function getNumericID(facebook_id) {
    console.log(facebook_id)
    return new Promise(function (resolve, reject) {
        fetch("https://www.facebook.com/" + facebook_id)
            .then((response) => response.text())
            .then((str) => {
                var mySubString = str.substring(
                    str.lastIndexOf('"props":') + 8,
                    str.lastIndexOf(',"entryPoint"') + 0
                );
                //console.log(mySubString);
                if (CS_isValidJSONString(mySubString)) {
                    decoded_data = JSON.parse(mySubString);
                    viewerID = decoded_data.viewerID;
                    userVanity = decoded_data.userVanity;
                    userID = decoded_data.userID;
                    userInfo = {
                        viewerID: decoded_data.viewerID,
                        userVanity: decoded_data.userVanity,
                        userID: decoded_data.userID,
                    };
                    resolve(userInfo);
                } else {
                    reject(false);
                }
            });
    });
}

function CS_isValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function sendMessageFromCRMOnebyOne(window_data, thread_id) {
    chrome.storage.local.get(["messengerMobViewStatus"], function (result) {
        if (
            typeof result.messengerMobViewStatus != "undefined" &&
            result.messengerMobViewStatus != ""
        ) {
            //let mobileViewEnable = false;
            let mobileViewEnable = result.messengerMobViewStatus.enable;
            if (mobileViewEnable) {
                mfacebook_thread_url =
                    "https://mbasic.facebook.com/messages/compose/?ids=" +
                    thread_id;
                SendMessageMembersNVClass.openSmallWindow(
                    mfacebook_thread_url,
                    window_data
                );
            } else {
                SendMessageMembersNVClass.openMessengersWindow(
                    thread_id,
                    window_data.text_message
                );
            }
        } else {
            mfacebook_thread_url =
                "https://mbasic.facebook.com/messages/compose/?ids=" +
                thread_id;
            SendMessageMembersNVClass.openSmallWindow(
                mfacebook_thread_url,
                window_data
            );
            checkMessengerMobileView();
        }
    });
}

async function findUserName(usersId) {
    try {
        const fetchPromises = usersId.map(async (item) => {
            const response = await getFacebookNameByFbID(item);
            if (response.id != null && response.name != null) {
                const userInfo = { "fb_user_id": response.id, "name": response.name };
                return userInfo;
            }
            return null;
        });

        const results = await Promise.all(fetchPromises);
        const filteredResults = results.filter(result => result !== null);
        if (filteredResults.length > 0) {
            //call api for update data into db
        }
        console.log(filteredResults);
    } catch (error) {
        console.error(error);
    }
}

async function getFacebookNameByFbID(id) {
    try {
        const response = await fetch(`https://www.facebook.com/${id}/about`);
        const domStr = await response.text();
        const subString = domStr.substring(
            domStr.lastIndexOf('"tracePolicy":') + 0,
            domStr.lastIndexOf(',"prefetchable"') + 0
        );
        const metaString = subString.substring(
            subString.lastIndexOf('"meta":') + 7
        );
        if (CS_isValidJSONString(metaString)) {
            const decoded_data = JSON.parse(metaString);
            const name = decoded_data.title;
            const temp = { id, name };
            return temp;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

// get taggedUser name for syncing
function getGroupUser(message, sender, sendResponse) {
    let groupId = message.groupId;
    let url = `https://novalyabackend.novalya.com/user/api/group/${groupId}`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then((data) => {
            let taggedusers = data.taggedUsers;
            getTaggedUserName(taggedusers, groupId, sender, sendResponse);
        })
        .catch(error => console.log('error', error));
    return true;
}

async function getTaggedUserName(taggedusers, groupId, sender, sendResponse) {
    try {
        const fetchPromises = taggedusers.map(async (item) => {
            const response = await getFacebookNameByFbID(item.fb_user_id);
            if (response.id != null && response.name != null) {
                const userInfo = { "id": item.id, "fb_user_id": response.id, "name": response.name };
                return userInfo;
            }
            return null;
        });

        const results = await Promise.all(fetchPromises);
        const filteredResults = results.filter(result => result !== null);
        for (const [i, item] of filteredResults.entries()) {
            await syncGroupTaggedUserInDB(item);
            if (i === filteredResults.length - 1) {
                chrome.tabs.sendMessage(sender.tab.id, { 'action': 'syncingComplete' })
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function getFacebookNameByFbID(id) {
    try {
        const response = await fetch(`https://www.facebook.com/${id}/about`);
        const domStr = await response.text();
        const subString = domStr.substring(
            domStr.lastIndexOf('"tracePolicy":') + 0,
            domStr.lastIndexOf(',"prefetchable"') + 0
        );
        const metaString = subString.substring(
            subString.lastIndexOf('"meta":') + 7
        );
        if (CS_isValidJSONString(metaString)) {
            const decoded_data = JSON.parse(metaString);
            const name = decoded_data.title;
            const temp = { id, name };
            return temp;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function syncGroupTaggedUserInDB(item) {
    let id = item.id;
    let name = item.name;
    let url = `https://novalyabackend.novalya.com/user/api/taggeduser/${id}`;
    let raw = JSON.stringify({
        "fb_name": name
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + authToken);
    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch(error => console.log('error', error));
    return true;
}

async function getUserLimit() {
    // https://novalyabackend.novalya.com/plan/plan-details
    //https://novalyabackend.novalya.com/userlimit/api/check
    try {
        const url = "https://novalyabackend.novalya.com/plan/plan-details";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + authToken);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
        };

        const response = await fetch(url, requestOptions);
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            console.log('Error:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function updateUserLimit(message, sendResponse) {
    try {
        const url = "https://novalyabackend.novalya.com/userlimit/api/update-message";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + authToken);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: message.request
        };
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            const result = await response.json();
            sendResponse(result);
            return result;
        } else {
            console.log('Error:', response.status, response.statusText);
            sendResponse(null);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        sendResponse(null);
        return null;
    }
}

async function updateNoOfConnects(message, sendResponse) {
    try {
        const url = "https://novalyabackend.novalya.com/userlimit/api/update-connect";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + authToken);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: message.request
        };
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            const result = await response.json();
            sendResponse(result);
            return result;
        } else {
            console.log('Error:', response.status, response.statusText);
            sendResponse(null);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        sendResponse(null);
        return null;
    }
}

//Get all user Plan Limits-> crm messages, requests,
async function getUserPlanLimit() {
    try {
        const url = `https://novalyabackend.novalya.com/plan/plan-details`;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + authToken);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        const response = await fetch(url, requestOptions);
        if (response.ok) {
            const result = await response.json();
            chrome.storage.local.set({ userlimitSettings: result.data }, function () { });
            // console.log(result);
            return result;
        } else {
            console.log('Error:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// use to update update limits -> no_crm_group, no_stages_group,no_friend_request,no_crm_message,no_ai_comment,
async function updateLimit(message, sendResponse) {
    try {
        const url = "https://novalyabackend.novalya.com/plan/update-limit";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + authToken);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: message.request
        };
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            const result = await response.json();
            sendResponse(result);
            return result;
        } else {
            console.log('Error:', response.status, response.statusText);
            sendResponse(null);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        sendResponse(null);
        return null;
    }
}

function getAdminSettings() {
    let url = `https://novalyabackend.novalya.com/admin/api/getadminaccountsettings`;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then((result) => {
            if (result.status == 'success') {
                const extension_version = result.data[0].extension_version;
                chrome.storage.local.set({ extension_version: extension_version }, function () { });
            }
        })
        .catch(error => console.log('error', error));
    return true;
}

function updateBirthdayLimit() {
    chrome.storage.local.get(["userlimitSettings"], async function (result) {
        userlimitSettings = result.userlimitSettings;
        console.log(userlimitSettings);
        no_of_birthday_wishes = userlimitSettings?.userlimit?.no_of_birthday_wishes ?? 0;
        console.log('no_of_birthday_wishes - ', no_of_birthday_wishes);
        no_of_birthday_wishes++;
        console.log('no_of_birthday_wishes - ', no_of_birthday_wishes);
        raw = JSON.stringify({
            'no_of_birthday_wishes': no_of_birthday_wishes,
        });

        try {
            const url = "https://novalyabackend.novalya.com/plan/update-limit";
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + authToken);
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const result = await response.json();
                getUserPlanLimit();
            } else {
                console.log('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

async function crmAutomationProcessMembers(message,sender,sendResponse) {
    let info = [];
    const setting = message.setting;
    const members = message.member;
    const type = 'bulkTagging';

    let moveGroupId = setting.moveGroupId;
    let moveStageId = setting.moveStageId || 1;

    if (setting.selectAction === 'Move To Stage' && members.length > 0) {
        moveGroupId = members[0].tag_id;
    }

    try {
        const bothIds = await getBothAlphaAndNumericId(members.fb_user_id);

        const details = {
            fbName: members.fbName,
            profilePic: members.profilePic,
            fb_user_alphanumeric_id: bothIds.fb_user_id,
            fb_user_id: bothIds.numeric_fb_id,
            fb_image_id: null
        };

        info.push(details);
        let token = authToken;
        if (token != undefined && token != '') {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");
            console.log(moveGroupId);
            var raw = JSON.stringify({
                "type": type,
                "members": JSON.stringify({ info }),
                "tag_id": moveGroupId,
                "stage_id": moveStageId
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://novalyabackend.novalya.com/api/ext/tag/get-tagged-user", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: 'tag_update_done',
                        from: 'background',
                        result: result,
                    });
                    sendResponse({ data: result.msg, status: "ok" });
                }).catch(error => console.log('error', error));
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error if necessary
    }
}

async function connectAutomation(message,sender,sendResponse){
    let info = [];
    const setting = message.setting;
    const members = message.member;
    const type = 'bulkTagging';

    let moveGroupId = setting.moveGroupId;
    let moveStageId = setting.moveStageId || 1;
    
    try {
        const bothIds = await getBothAlphaAndNumericId(members.fb_user_id);
        const details = {
            fbName: members.fbName,
            profilePic: members.profilePic,
            fb_user_alphanumeric_id: bothIds.fb_user_id,
            fb_user_id: bothIds.numeric_fb_id,
            fb_image_id: null
        };
        info.push(details);
        let token = authToken;
        if (token != undefined && token != '') {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");
            console.log(moveGroupId);
            var raw = JSON.stringify({
                "type": type,
                "members": JSON.stringify({ info }),
                "tag_id": moveGroupId,
                "stage_id": moveStageId
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://novalyabackend.novalya.com/api/ext/tag/get-tagged-user", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: 'tag_update_done',
                        from: 'background',
                        result: result,
                    });
                    sendResponse({ data: result.msg, status: "ok" });
                }).catch(error => console.log('error', error));
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error if necessary
    }
}