class BirthdayNova {     
    constructor() {     
        this.init();
    }  
  	init() {}    

    openBirthdayEventPage(sender, api_response, message) {
        var new_birthday_url = "https://www.facebook.com/events/";
        // ---------------------------change----------------------------
        var birthday_url = "https://www.facebook.com/events/birthdays";
        chrome.tabs.create({ url: "https://www.facebook.com/events", active: true },
            function(tabs) {
                var birthday_page_tabId = tabs.id;
                var extension_birthday_page_tabid = sender.tab.id;
                var birthdaydata = api_response;
                chrome.tabs.onUpdated.addListener(function birthdayTabListener(tabId, changeInfo, tab) {
                    if (changeInfo.status === "complete" && tabId === birthday_page_tabId) {
                        if (tab.url !== birthday_url && !tab.url.includes("birthdays")) {
                            
                            chrome.tabs.sendMessage(birthday_page_tabId, {subject: "openTheBirthdays", birthday_tabId: extension_birthday_page_tabid}, function(resp20) {
                                console.log(resp20);
                                console.log("birthdaybuttonClicked", api_response.data.birthday_type);
                                console.log("message.action", message.action);

                                var subjectType;
                                console.log("birthdaybuttonClicked", api_response.data.birthday_type);
                               
                                if (message.day_type == 'today') {
                                    console.log("in the today");
                                    subjectType = "scrapTodayBirthday";
                                } else if (message.day_type == 'yesterday') {
                                    console.log("in the yesterday");
                                    subjectType = "scrapYesterdayBirthday";
                                } else if (message.day_type == "2dayago") {
                                    console.log("2dayago");
                                    subjectType = "scrap2dayagoBirthday";
                                } else {
                                    subjectType = "none";
                                    console.log("none");
                                    return false
                                } 
                                chrome.tabs.sendMessage(birthday_page_tabId, {
                                    subject: subjectType,
                                    responsedata: birthdaydata,
                                    birthday_tabId: extension_birthday_page_tabid
                                }, function(resp21) {
                                    console.log(resp21);
                                });
                            });                            
                        }


                    }
                });
            }
        );
    }

    getBirthdaySettings(message, sendResponse, sender) {
        
        var apiurl;
        if (message.type == "message") {
            apiurl = "birthday-message-api.php";
        } else {
            apiurl = "birthday-feed-api.php";
        }

        var myHeaders = new Headers();
        var formdata = new FormData();

        formdata.append("user_id", userId);
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };
        console.log('result', base_api_url + apiurl, requestOptions);
        fetch(base_api_url + apiurl, requestOptions)
            .then((response) => response.json())
            .then((api_response) => {
                console.log(api_response);
               // console.log(api_response.data.birthday_type);
                BirthdayNovaClass.openBirthdayEventPage(sender, api_response, message);
                sendResponse({ status: "start" });
            })
            .catch((error) => sendResponse({ status: "error" }));
    }
}
BirthdayNovaClass = new BirthdayNova();



      