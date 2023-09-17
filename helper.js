// CONSTANTS 
let userId = 0;
let sendMessageEnable = true;

let my_domain = "app.novalya.com";
let site_url = "https://app.novalya.com/";
let new_site_url = "https://app.novalya.com/";
let base_api_url = "https://app.novalya.com/system/";
let new_base_api_url = "https://novalyabackend.novalya.com/api/ext/";
let new_base_url = "https://novalyabackend.novalya.com";

// CALL APIS FOR ALL (CONTENT, POPUP, BACKGROUND)
async function callAPIs(request_method, api_name, formdata) {
    console.log(userId);
    let url = base_api_url + api_name + '.php';
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    if(request_method == "GET") {
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    } else {
        var raw = JSON.stringify(formdata);    
        var requestOptions = {
          method: request_method,
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
    }
    return new Promise(function (resolve, reject) {
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(error => reject(error));
    });
  }


// HELPER TO RELOAD ALL GROUP TABS
function reloadAllGroupTabs() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
            if (window.type == "normal") {
                window.tabs.forEach(function (tab) {
                    if (tab.url && (tab.url.indexOf('/groups/') != -1 && tab.url.indexOf('facebook.com') != -1) ) {
                        chrome.tabs.reload(tab.id);
                    }
                });
            }
        });
    });
}



// HELPER TO GET APLHANUMERIC AND NUMERIC ID IF GetBothAphaAndNumericId FUNCTION NOT WORKING. DUE TO BLOCK M.FACEBOOK.COM
async function getNumericID(facebook_id) {
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


// HELPER TO RELOAD ALL GROUP TABS
function reloadAllFriendsTabs() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
            if (window.type == "normal") {
                window.tabs.forEach(function (tab) {
                    if (tab.url && (tab.url.indexOf('/friends') != -1 && tab.url.indexOf('facebook.com') != -1)) {
                        chrome.tabs.reload(tab.id);
                    }
                });
            }
        });
    });
}

// HELPER TO RELOAD ALL Messengers TABS
function reloadMessengersTabs() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
            if (window.type == "normal") {
                window.tabs.forEach(function (tab) {
                    if (tab.url && (tab.url.indexOf('messenger.com') != -1 && tab.url.indexOf('/t/') != -1)) {
                        chrome.tabs.reload(tab.id);
                    }
                    if(tab.url && (tab.url.indexOf('facebook') != -1)){
                        chrome.tabs.reload(tab.id);
                    }
                });
            }
        });
    });
}

// HELPER TO RELOAD ALL NOVLAYA TABS 
function reloadAllNovalyaTabs() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
            if (window.type == "normal") {
                window.tabs.forEach(function (tab) {
                    if (tab.url && (tab.url.indexOf('app.novalya.com') != -1 && tab.url.indexOf(my_domain) != -1)) {
                        chrome.tabs.reload(tab.id);
                    }
                });
            }
        });
    });
}

//Get Both Alpha and numeric id
async function getBothAlphaAndNumericId(numericFBid) {
    return await new Promise(function (resolve, reject) {
        fetch("https://www.facebook.com/" + numericFBid).then(function (response) {
            tempFBIDs = {};
            if(response.url.indexOf("profile.php") > -1) {
                tempFBIDs.fb_user_id = numericFBid;
                tempFBIDs.numeric_fb_id = numericFBid;
            } else {
                if(response.url.indexOf("https://www.facebook.com/") == 0) {
                    tempFBIDs.fb_user_id = removeQueryStringFromFbID(response.url.replace("https://www.facebook.com/", ""));
                } else if(response.url.indexOf("https://web.facebook.com/") == 0) {
                    tempFBIDs.fb_user_id = removeQueryStringFromFbID(response.url.replace("https://web.facebook.com/", ""));
                }
                tempFBIDs.numeric_fb_id = numericFBid;
            }
            console.log("tempFBIDs 1: ", tempFBIDs);
            resolve(tempFBIDs);
        });
    });
    
}

async function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function removeQueryStringFromFbID(id) {
    if(id.indexOf("?")>-1) {
        return id.split("?")[0]
    } else {
        return id;
    }
}