// Add native 'click' and 'change' events to be triggered using jQuery
let loop1 = 0;
var loopValue = 0;
var segementMessage = "";
let timeOutIdsArray = [];
let clearMessageInt = [];

// FOR CHECK PROCESSING MESSENGER LIST OF SELECTOR
var processing = false;
let stoprequest = false;

jQuery.fn.extend({
    mclick: function () {
        var click_event = document.createEvent("MouseEvents");
        click_event.initMouseEvent(
            "click",
            true,
            true,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
        return $(this).each(function () {
            $(this)[0].dispatchEvent(click_event);
        });
    },
});

// scrap all friend requests
$.extend($.expr[":"], {
    containsI: function (elem, i, match, array) {
        return (
            (elem.textContent || elem.innerText || "")
                .toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0
        );
    },
});
jQuery(document).on('keyup', function (evt) {
    if (evt.keyCode == 27) {
        $('.hide-by-escape').hide();
    }
});


document.addEventListener("click", function (event) {
    var modal = document.getElementById("overlay-assign-labels");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.subject === "addTargetProcess") {
        //console.log('result', message);
        chrome.storage.local.get(
            ["nvFriendReqInputs", "nvAddFriendProcess"],
            function (result) {
                console.log(result);
                if (
                    typeof result.nvFriendReqInputs != "undefined" &&
                    result.nvFriendReqInputs != ""
                ) {
                    add_friend_settings = result.nvFriendReqInputs;
                    if (
                        typeof result.nvAddFriendProcess != "undefined" &&
                        result.nvAddFriendProcess != "" &&
                        result.nvAddFriendProcess == "process"
                    ) {
                        console.log(add_friend_settings);
                        extTabId = message.extTabId;
                        AddTargetFriendNV.startAddingFriend(add_friend_settings, extTabId);
                        sendResponse({ status: "ok" });
                    }
                }
            }
        );
        return true;
    }

    if (message.subject === "removeRequests") {
        let loop = 0;
        setInterval(() => {
            let selector1 =
                'div[data-sigil="undoable-action"]:not(".cancel-request")';
            if ($(selector1).length > 0) {
                $(selector1)
                    .first()
                    .find('button[type="submit"][value="Cancel"]')
                    .mclick();
                $(selector1).first().addClass("cancel-request");
                loop++;
            } else {
                $("html, body").animate({ scrollTop: $(document).height() }, 2800);
            }
        }, 4000);
    }

    
    if (message.subject === "postBirthday") {
        setTimeout(() => {
            $('.xt7dq6l[role="button"]').click();
        }, 3000);

        var birthdayMessage = message.messageText;
        setTimeout(() => {
            var selector =
                'div[role="presentation"] div[data-lexical-editor="true"][tabindex="0"] p';
            $(
                'div[role="presentation"] div[data-lexical-editor="true"][tabindex="0"] p'
            ).text(birthdayMessage);
            navigator.clipboard.writeText(birthdayMessage).then(() => {
                console.log(" Text Copied!!!!");
                document.execCommand("paste", null, null);
            });

            var evt = new Event("input", {
                bubbles: true,
            });
            var input = document.querySelector(
                'div[role="presentation"] div[data-lexical-editor="true"][tabindex="0"] p'
            );
            input.innerHTML = birthdayMessage;
            input.dispatchEvent(evt);
            $(selector).after(
                '<span data-text="true">' + birthdayMessage + "</span>"
            );
        }, 5000);
        setTimeout(() => {
            if ($('div[aria-label="Post"][role="button"]').length > 0) {
                $('div[aria-label="Post"][role="button"]').mclick();
            }
        }, 7000);
        setTimeout(() => {
            chrome.runtime.sendMessage({
                action: "closeTabs",
            });
        }, 2000);
    }

    if (message.subject === "scrapTodayBirthday") {
        let extBirthdayTabID = message.birthday_tabId;
        let class_today_heading = 'today_birthday_heading';
        let class_today_div = 'today_birthday_div';
        appendHTMLOnBirthday(extBirthdayTabID);
        let cleartimeout1 = setInterval(() => {
            $(".xyamay9").find('h2:contains("Today")').addClass(class_today_heading);
            selector_birthday_fb = $("." + class_today_heading).parents(".xyamay9").addClass(class_today_div);
            var birtday_response = message.responsedata;
            var delay = birtday_response.data.time_interval * 60000;
            var birthday_wish_type = birtday_response.data.type;
            let proccessed_id = [];
            var secondChild = $("." + class_today_div).children().eq(1).addClass("bdh-wished");

            $(".total1").text(secondChild.children().length);

            if (secondChild.length > 0) {
                clearInterval(cleartimeout1);
                secondChild.children().each(function (index, item) {
                    if (typeof $(this).find("a").attr("href") != "undefined") {
                        setTimeout(() => {
                            var member_url = $(this)
                                .find("a")
                                .attr("href")
                                .split("facebook.com/");
                            $("#loop1").text(index + 1);
                            loopValue = parseInt($("#loop1").text(), 10);
                            member_url_splitid = member_url[1];
                            if (member_url_splitid.indexOf("profile.php") > -1) {
                                facebook_member_id = member_url_splitid.split("?id=")[1];
                            } else {
                                facebook_member_id = member_url_splitid;
                            }
                            var birthdayMessagetextArray = birtday_response.data.message.Sections;
                        var randomIndex = Math.floor(
                            Math.random() * birthdayMessagetextArray.length
                        );

                        birthdayMessage1 = birthdayMessagetextArray[randomIndex];
                        birthdayMessage2 = birthdayMessage1.varient;
                        birthdayMessage3 = JSON.parse(birthdayMessage2);

                        birthdayMessage = birthdayMessage3.join(' ');
                        console.log(birthdayMessage); 
                            var member_fullname = $(this).find("h2 span").text();
                            var member_names = member_fullname.split(" ");
                            birthdayMessage = birthdayMessage.replaceAll(
                                "[first name]",
                                member_names[0]
                            );
                            birthdayMessage = birthdayMessage.replaceAll(
                                "[last name]",
                                member_names[1]
                            );
                            if (birthday_wish_type == "message") {
                                chrome.runtime.sendMessage({
                                    action: "sendMessageBirthday",
                                    member_fb_id: facebook_member_id,
                                    messagtext: birthdayMessage,
                                },
                                    function (res15) {
                                        // body
                                    }
                                );
                            } else {
                                chrome.runtime.sendMessage({
                                    action: "postFeedBirthday",
                                    member_fb_id: facebook_member_id,
                                    messagtext: birthdayMessage,
                                },
                                    function (res15) {
                                        // body
                                    }
                                );
                            }
                            if (loopValue + 1 > secondChild.children().length) {
                                console.log("stooped");
                                $("#loop1").text(loopValue);
                                $("#stop_run").text("STOPPED");
                                $(".loading").remove();
                                $("h3.title_lg").text("Completed");
                            }
                        }, delay * index);
                        //}, 10000*index)
                    }
                });
            } else {
                setTimeout(() => {
                    chrome.runtime.sendMessage({ action: "closeTabs" }, function (res1) {
                        // body
                    });
                }, 500);
            }
        }, 8000);
        return true;
    }
    else if (message.subject === "scrapYesterdayBirthday") {
        console.log("in the yesterday");
        let extBirthdayTabID = message.birthday_tabId;
        appendHTMLOnBirthday(extBirthdayTabID);
        let cleartimeout2 = setInterval(() => {
            $(".xyamay9")
                .find('h2:contains("Recent")')
                .addClass("yesterday_birthday_heading");
            selector_birthday_fb = $(".yesterday_birthday_heading")
                .parents(".xyamay9")
                .addClass("yesterday_birthday_div");
            //selector_birthday = $('article').find('h4:containsI("Today")').parent().addClass('today_birthday_div');

            var birtday_response = message.responsedata;
            var delay = birtday_response.data.time_interval * 60000;
            var birthday_wish_type = birtday_response.data.type;
            let proccessed_id = [];
            var secondChild = $(".yesterday_birthday_div")
                .children()
                .eq(1)
                .addClass("bdh-wished");

            let yesbirthloopval = 0;
            let facebook_member_ids = [];

            if (secondChild.length > 0) {
                clearInterval(cleartimeout2);
                secondChild.children().each(function (index, item) {

                    var scrapedDate = $(this).find(".x78zum5 .x1qughib span")
                        .eq(1)
                        .text();
                    var yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    var yesterdayMonth = yesterday.toLocaleString("default", { month: "long" });
                    var yesterdayDate = yesterday.getDate();

                    // Get the month and date of the scraped date
                    var scrapedDateMonth = new Date(scrapedDate).toLocaleString("default", { month: "long" });
                    var scrapedDateDate = new Date(scrapedDate).getDate();
                    if (typeof $(this).find("a").attr("href") != "undefined" && yesterdayMonth === scrapedDateMonth && yesterdayDate === scrapedDateDate) {
                        //setTimeout(() => {
                        var member_url = $(this)
                            .find("a")
                            .attr("href")
                            .split("facebook.com/");
                        yesbirthloopval = yesbirthloopval + 1;
                        member_url_splitid = member_url[1];
                        if (member_url_splitid.indexOf("profile.php") > -1) {
                            facebook_member_id = member_url_splitid.split("?id=")[1];
                        } else {
                            facebook_member_id = member_url_splitid;
                        }
                        var member_fullname = $(this).find("h2 span").text();
                        facebook_member_ids.push({ 'id': facebook_member_id, 'name': member_fullname });
                    } else {
                        yesbirthloopval = yesbirthloopval + 1;

                    }
                });
                $(".total1").text(facebook_member_ids.length);
                facebook_member_ids.forEach((item, index) => {
                    setTimeout(() => {
                        loopValue = parseInt($("#loop1").text(), 10);
                        $("#loop1").text(loopValue + 1);
                        loopValue = parseInt($("#loop1").text(), 10);
                        var birthdayMessagetextArray = birtday_response.data.message.Sections;
                        var randomIndex = Math.floor(
                            Math.random() * birthdayMessagetextArray.length
                        );

                        birthdayMessage1 = birthdayMessagetextArray[randomIndex];
                        birthdayMessage2 = birthdayMessage1.varient;
                        birthdayMessage3 = JSON.parse(birthdayMessage2);

                        birthdayMessage = birthdayMessage3.join(' ');
                        console.log(birthdayMessage); 
                        var member_fullname = item.name;
                        var member_names = member_fullname.split(" ");
                        birthdayMessage = birthdayMessage.replaceAll(
                            "[first name]",
                            member_names[0]
                        );
                        birthdayMessage = birthdayMessage.replaceAll(
                            "[last name]",
                            member_names[1]
                        );
                        if (birthday_wish_type == "message") {
                            chrome.runtime.sendMessage({
                                action: "sendMessageBirthday",
                                member_fb_id: item.id,
                                messagtext: birthdayMessage,
                            },
                                function (res15) {
                                    // body
                                }
                            );
                        } else {
                            chrome.runtime.sendMessage({
                                action: "postFeedBirthday",
                                member_fb_id: item.id,
                                messagtext: birthdayMessage,
                            },
                                function (res15) {
                                    // body
                                }
                            );
                        }
                        if (index === facebook_member_ids.length - 1) {
                            console.log("stooped");
                            $("#loop1").text(loopValue);
                            $("#stop_run").text("STOPPED");
                            $(".loading").remove();
                            $("h3.title_lg").text("Completed");
                        }
                    }, delay * index);
                    // }, 10000*index)
                })

            }
            else {
                setTimeout(() => {
                    chrome.runtime.sendMessage({ action: "closeTabs" }, function (res1) {
                        // body
                    });
                }, 500);
            }
        }, 8000);
        return true;
    }
    else if (message.subject === "scrap2dayagoBirthday") {
        console.log("in the 2 days ago");
        let extBirthdayTabID = message.birthday_tabId;
        appendHTMLOnBirthday(extBirthdayTabID);
        let cleartimeout3 = setInterval(() => {
            $(".xyamay9")
                .find('h2:contains("Recent")')
                .addClass("yesterday_birthday_heading");
            selector_birthday_fb = $(".yesterday_birthday_heading")
                .parents(".xyamay9")
                .addClass("yesterday_birthday_div");
            //selector_birthday = $('article').find('h4:containsI("Today")').parent().addClass('today_birthday_div');

            var birtday_response = message.responsedata;
            var delay = birtday_response.data.time_interval * 60000;
            var birthday_wish_type = birtday_response.data.type;
            let proccessed_id = [];
            var secondChild = $(".yesterday_birthday_div")
                .children()
                .eq(1)
                .addClass("bdh-wished");

            let yesbirthloopval = 0;
            let facebook_member_ids = [];

            if (secondChild.length > 0) {
                clearInterval(cleartimeout3);
                secondChild.children().each(function (index, item) {

                    var scrapedDate = $(this).find(".x78zum5 .x1qughib span")
                        .eq(1)
                        .text();
                    var twodaysago = new Date();
                    twodaysago.setDate(twodaysago.getDate() - 2);
                    var twodaysagoMonth = twodaysago.toLocaleString("default", { month: "long" });
                    var twodaysagoDate = twodaysago.getDate();

                    // Get the month and date of the scraped date
                    var scrapedDateMonth = new Date(scrapedDate).toLocaleString("default", { month: "long" });
                    var scrapedDateDate = new Date(scrapedDate).getDate();
                    if (typeof $(this).find("a").attr("href") != "undefined" && twodaysagoMonth === scrapedDateMonth && twodaysagoDate === scrapedDateDate) {
                        //setTimeout(() => {
                        var member_url = $(this)
                            .find("a")
                            .attr("href")
                            .split("facebook.com/");
                        yesbirthloopval = yesbirthloopval + 1;
                        member_url_splitid = member_url[1];
                        if (member_url_splitid.indexOf("profile.php") > -1) {
                            facebook_member_id = member_url_splitid.split("?id=")[1];
                        } else {
                            facebook_member_id = member_url_splitid;
                        }
                        var member_fullname = $(this).find("h2 span").text();
                        facebook_member_ids.push({ 'id': facebook_member_id, 'name': member_fullname });
                    } else {
                        yesbirthloopval = yesbirthloopval + 1;

                    }
                });
                $(".total1").text(facebook_member_ids.length);
                facebook_member_ids.forEach((item, index) => {
                    setTimeout(() => {
                        loopValue = parseInt($("#loop1").text(), 10);
                        $("#loop1").text(loopValue + 1);
                        loopValue = parseInt($("#loop1").text(), 10);
                        var birthdayMessagetextArray = birtday_response.data.message.Sections;
                        var randomIndex = Math.floor(
                            Math.random() * birthdayMessagetextArray.length
                        );

                        birthdayMessage1 = birthdayMessagetextArray[randomIndex];
                        birthdayMessage2 = birthdayMessage1.varient;
                        birthdayMessage3 = JSON.parse(birthdayMessage2);

                        birthdayMessage = birthdayMessage3.join(' ');
                        console.log(birthdayMessage); 
                        var member_fullname = item.name;
                        var member_names = member_fullname.split(" ");
                        birthdayMessage = birthdayMessage.replaceAll(
                            "[first name]",
                            member_names[0]
                        );
                        birthdayMessage = birthdayMessage.replaceAll(
                            "[last name]",
                            member_names[1]
                        );
                        //console.log(birthdayMessage);
                        if (birthday_wish_type == "message") {
                            chrome.runtime.sendMessage({
                                action: "sendMessageBirthday",
                                member_fb_id: item.id,
                                messagtext: birthdayMessage,
                            },
                                function (res15) {
                                    // body
                                }
                            );
                        } else {
                            chrome.runtime.sendMessage({
                                action: "postFeedBirthday",
                                member_fb_id: item.id,
                                messagtext: birthdayMessage,
                            },
                                function (res15) {
                                    // body
                                }
                            );
                        }
                        if (index === facebook_member_ids.length - 1) {
                            console.log("stooped");
                            $("#loop1").text(loopValue);
                            $("#stop_run").text("STOPPED");
                            $(".loading").remove();
                            $("h3.title_lg").text("Completed");
                        }
                    }, delay * index);
                    // }, 10000*index)
                })

            }
            else {
                setTimeout(() => {
                    chrome.runtime.sendMessage({ action: "closeTabs" }, function (res1) {
                        // body
                    });
                }, 500);
            }
        }, 8000);
        return true;
    } 
    else if (message.subject === "openTheBirthdays") {
        console.log("open the event message recieved");

        setTimeout(() => {
            if ($('span:contains(Birthdays)').length > 0) {
                $('span:contains(Birthdays)').mclick();
            } else {
                console.log('not found');
            }
            sendResponse({ status: "ok" });

            //chrome.runtime.sendMessage({ action: "birthdaybuttonClicked" })
        }, 1000);
        return true;
    }

    //RECIVED MESSAGE FROM BACKGROUND
    if (message.subject === "sendMessageFromWindow") {
        //if ($('.mToken').length > 0 && $('.mToken').text().length > 0) {
        console.log(message.messageText);
        $("textarea").html(message.messageText);
        if (sendMessageEnable) {
            if ($('button[name="Send"]').length > 0) {
                $('button[name="Send"]').mclick();
            } else if ($('input[name="Send"]').length > 0) {
                $('input[name="Send"]').mclick();
            }
            setTimeout(() => {
                chrome.runtime.sendMessage({ action: "closeTabs" }, function (res1) {
                    // body
                });
            }, 500);
        }
    }

    if (message.subject == "shootMessages") {
        sendMessageFromMessengers(message.threadId, message.textMessage);
        return true;
    }

    if(message.type == "tag_update_done" && message.from == "background"){
        let response = message.result;
        console.log(message);
        if(response != undefined && response != ''){
            var parsedData = response;
            // var message = response.message;
           toastr["success"]('Tag update successfully');
        } else {
            toastr["success"]('not found tag update done');
        }
       
        AddLabelCRM.taggeduserapi();
        selector_members_list = AddLabelCRM.messengersMembersListSelector();
        AddLabelCRM.messengersCom();
        $('.hide-by-escape').hide();
        var currentLocationUrl = window.location.origin;
        chrome.runtime.sendMessage({ action: "Reload_all_novalya_tabs", currentLocationUrl: currentLocationUrl });
    }
});

if (window.location.href.indexOf(my_domain) > -1) {
    chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {        
        authToken = res16.authToken;
        var clearTimeInt = setInterval( () => {
            if($('.Mui-checked').length == 0) {
                console.log('Extension Not Installed'); 
                $('#switch-extension').parent().mclick();
            } else {
                console.log('Extension Installed', authToken);
            }
        }, 1000)
    });

    var latest_uploaded_version = $("#latest_version_nvl").attr("value");
    const extensionVersion = chrome.runtime.getManifest().version;
    if (latest_uploaded_version <= extensionVersion) {
        $("#latest_version_nvl").css("display", "none");
    }
}

$(document).ready(function () {
    // setTimeout(() => {
    //     userId = $("#extension_user_id").val();
    //     chrome.runtime.sendMessage({ action: "sendId", user_id: userId },
    //         function (res1) {
    //             // body
    //         }
    //     );
    // }, 2000);

    $(document).on("click", "#stop_run", function () {
        //$('#stop_run').remove();
        $(".title_lg").text("Send Message Feature Stopped");
        $(".loading").remove();
        extTabId = $(this).attr("data-tabid");
        AddTargetFriendNV.stopAddFriendProcess(extTabId);
        stoprequest = true;
    });

    $(document).on("click", "#refresh_ext", function () {
        chrome.runtime.sendMessage({ action: "refreshExt" },
            (res2) => {
                // body
            }
        );
    });

    $(document).on("click", "#stop_birthday_run", function () {
        //$('#stop_run').remove();
        $(".title_lg").text("Send Birthday Wishes Feature Stopped");
        $(".simple-txt.fs-spacing").text("window close with in few seconds");
        $(".loading").remove();
        //extBirthdayTabId = $(this).attr("data-tabid");
        // setTimeout( () => {
        //     window.close();
        // }, 20000)
        chrome.runtime.sendMessage({ action: "closeTabs" },
            (res22) => {
                //window.close();
            }
        );
    });

    $(document).on("click", "#update_ext", function () {
        chrome.runtime.sendMessage({ action: "openChromeExtension" }, (res6) => {
            // body
        });
    });

    // $(document).on("click", "#extension_submit", function () {
    //     $("#extension_submit").prop("disabled", true);
    //     $("#extension_submit").addClass("disabled_cls");
    //     setTimeout(function () {
    //         chrome.runtime.sendMessage({ action: "getMessageSections" }, (res6) => {
    //             setTimeout(() => {
    //                 $("#extension_submit").prop("disabled", false);
    //                 $("#extension_submit").removeClass("disabled_cls");
    //             }, 5000)
    //         });
    //     }, 5000);
    // });

    $(document).on("click", "#start-novayla-connect", function () {
        $("#start-novayla-connect").prop("disabled", true);
        $("#start-novayla-connect").addClass("disabled_cls");
        setTimeout(function () {
            chrome.runtime.sendMessage({ action: "getMessageSections" }, (res6) => {
                setTimeout(() => {
                    $("#start-novayla-connect").prop("disabled", false);
                    $("#start-novayla-connect").removeClass("disabled_cls");
                }, 5000)
            });
        }, 5000);
    });


    $(document).on("click", "#crm_submit", function () {
        $("#crm_submit").prop("disabled", true);
        $("#crm_submit").addClass("disabled_cls");
        // toastr["error"]('We are working on send message feature!');
        setTimeout(() => {
            chrome.runtime.sendMessage({ action: "getCRMMessageSections" }, (res17) => {
                var total_memberss = res17.api_data.tagged_user.length;
                let html_processing_model = `<section class="main-app">
                        <div class="overlay-ld">
                            <div class="container-ld">
                                <h3 class="title_lg">CAMPAIGN IS PROCESSING</h3>
                                <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                                <h3 class="title_lg">NEXT REQUEST IS SENDING...</h3>
                                <div class="loading">
                                    <span class="fill"></span>
                                </div>
                                <p class="simple-txt"><span id="processed_member">0</span> REQUESTS IS ON <span class="total_members"> ${total_memberss}</span></p>
                                <button class="btn__lg gredient-button scl-process-btn" type="button" id="stop_crm">stop sending</button>
                            </div>
                        </div>
                    </section>`;
                $("body:not('.process-model-added')").prepend(html_processing_model);
                $("body").addClass("process-model-added");
                setTimeout(() => {
                    $("#crm_submit").prop("disabled", false);
                    $("#crm_submit").removeClass("disabled_cls");
                }, 5000);

                var selected_group_members = res17.api_data.tagged_user;
                const intervalValue = res17.api_data.interval;
                if (intervalValue == "30-60") {
                    randomDelay = (Math.floor(Math.random() * 30) + 30) * 1000;
                } else if (intervalValue == "1-3") {
                    randomDelay = (Math.floor(Math.random() * 60) + 180) * 1000;
                } else if (intervalValue == "3-5") {
                    randomDelay = (Math.floor(Math.random() * 180) + 300) * 1000;
                } else if (intervalValue == "5-10") {
                    randomDelay = (Math.floor(Math.random() * 300) + 600) * 1000;
                } else {
                    randomDelay = 60000;
                }

                // const numberOfReqValue = res17.api_data.norequest;
                // if (numberOfReqValue != "custom") {
                //     limit_req = numberOfReqValue;
                // } else {
                //     limit_req = settings.custom; // unlimited
                // }

                selected_group_members.forEach(function (item, i) {
                    if (i < total_memberss) {
                        setTimeout(() => {
                            var thread_id = item.fb_user_id;
                            console.log(thread_id);   
                            text_messageArray = res17.api_data.message;
                            var randomIndex = Math.floor(Math.random() * text_messageArray.length);
                            text_message = text_messageArray[randomIndex];
                            var thread_id = item.fb_user_id;
                            var member_fullname = item.fb_name;
                            var member_names = member_fullname.split(" ");
                            var messageText = "";
                            messageText = text_message.replaceAll("[first name]", member_names[0]);
                            messageText = messageText.replaceAll("[last name]", member_names[1]); 
                            chrome.runtime.sendMessage({ action: "sendMessageFromCRMOnebyOne", textMsg: messageText, thread_id: thread_id }, (res18) => {
                                $('#processed_member').text(i + 1);
                                if (i === selected_group_members.length - 1) {
                                    console.log('End of loop reached.');
                                    $("#stop_crm").text("Close popup");
                                    $(".loading").remove();
                                    $("h3.title_lg").text("Completed");
                                }
                            })
                        }, i * randomDelay)

                    }
                })
            });
        }, 5000);
    });

    $(document).on("click", "#stop_crm", function () {
        window.location.reload();

    });


    // CLICK DELETE BUTTON ON FRIEND REQUEST PAGE
    chrome.storage.local.get(["requestSettings"], function (result) {
        if (
            typeof result.requestSettings != "undefined" &&
            result.requestSettings != ""
        ) {
            requestSettings1 = result.requestSettings;
            if (requestSettings1.reject_status == 1) {
                $(document).on(
                    "click",
                    'div[aria-label="Delete"][role="button"]',
                    function () {
                        requestedMemberURL = $(this)
                            .parent()
                            .parent()
                            .find('a[href*="/friends/requests/"]')
                            .attr("href");
                        requestedMemberFullName = $(this)
                            .parent()
                            .parent()
                            .find('a[href*="/friends/requests/"]')
                            .text();
                        const rArray = requestedMemberURL.split("?profile_id");
                        var requestedMemberId = rArray[1].replace("=", "");
                        requestedMember = {
                            id: requestedMemberId,
                            name: requestedMemberFullName,
                        };
                        chrome.runtime.sendMessage({ action: "deleteRequest", data: requestedMember },
                            (res7) => {
                                //alert('yes');
                                // body
                            }
                        );
                    }
                );
            }

            // IF ENABLE FROM BACKOFFICE THEN CLICK ON CONFIRM BUTTON
            if (requestSettings1.accept_status == 1) {
                $(document).on(
                    "click",
                    'div[aria-label="Confirm"][role="button"]',
                    function () {
                        requestedMemberURL = $(this)
                            .parent()
                            .parent()
                            .find('a[href*="/friends/requests/"]')
                            .attr("href");
                        requestedMemberFullName = $(this)
                            .parent()
                            .parent()
                            .find('a[href*="/friends/requests/"]')
                            .text();
                        const rArray = requestedMemberURL.split("?profile_id");
                        var requestedMemberId = rArray[1].replace("=", "");
                        requestedMember = {
                            id: requestedMemberId,
                            name: requestedMemberFullName,
                        };
                        console.log(requestedMember);
                        chrome.runtime.sendMessage({ action: "confirmRequest", data: requestedMember },
                            (res8) => {
                                // body
                            }
                        );
                    }
                );
            }
        }
    });

    $(document).on("click", "#verifyurl", function () {
        let group_url_value = $("#group_url_value").val();
        chrome.runtime.sendMessage({ action: "verifyGroupURL", url: group_url_value },
            (res10) => {
                let response = res10.groupPageDOM;
                //let title = $(response).find(`._36rd`).text();
                let title = $(response).filter("title").text();
                $("#verifyurl").text("verified");
                $("#group_name").text("Group Name:- " + title);
            }
        );
    });

    $(document).on("click", "#add-group-btn", function () {        
        let group_url_value = window.location.href;
        if (group_url_value.includes("/things_in_common")) {
            group_url_value = group_url_value.replace("/things_in_common", "");
        } else if (group_url_value.includes("members/")) {
            group_url_value = group_url_value.replace("members/", "members");
        }
        chrome.runtime.sendMessage({ action: "verifyGroupURL", url: group_url_value }, (res8) => {
            let response = res8.groupPageDOM;
            let title = $(response).filter("title").text();
            chrome.runtime.sendMessage({ action: "addgroupapinew", url: group_url_value, name: title, group_type: "member" }, (res9) => {
                if (res9.data.msg == 'group already saved') {
                    toastr["error"](res9.data.msg);
                } else if (res9.data.msg == 'group saved') {
                    toastr["success"]('group saved successfully');
                }
            });
        })
    });

    $(document).on("click", "#add-group-btn2", function () {
        console.log("clicked");
        let group_url_value = window.location.href;

        if (group_url_value.includes("things_in_common")) {
            group_url_value = group_url_value.replace("things_in_common", "");
            group_url_value = group_url_value + "things_in_common";
        } else {
            if (group_url_value.includes("members/")) {
                group_url_value = group_url_value + "things_in_common";
            } else {
                group_url_value = group_url_value + "/things_in_common";
            }

        }
        chrome.runtime.sendMessage({ action: "verifyGroupURL", url: group_url_value },
            (res8) => {
                let response = res8.groupPageDOM;
                let title = $(response).filter("title").text();
                console.log(title);
                chrome.runtime.sendMessage({ action: "addgroupapinew", url: group_url_value, name: title, group_type: "things in common" },
                    (res9) => {
                        if (res9.data.msg == 'group already saved') {
                            toastr["error"](res9.data.msg);
                        } else if (res9.data.msg == 'group saved') {
                            toastr["success"]('group saved successfully');
                        }
                    });

            })

    });

    $(document).on("click", "#verfiyurlfbgroup", function () {
        $(this).text("Processing");

        var token = localStorage.getItem('token');
        console.log(token);
        let group_url_value = $('input[name="url"]').val();
        console.log(group_url_value);
        if (group_url_value == "") {
            alert(
                "Facebook group url cannot be blank, checked you are login with facebook"
            );
        } else {
            chrome.runtime.sendMessage({ action: "verifyGroupURL", url: group_url_value },
                (res8) => {
                    console.log(res8);
                    let response = res8.groupPageDOM;
                    console.log(response);
                    let title = $(response).filter("title").text();
                    console.log(title);
                    $("#group_name").text("Group Name:- " + title + "( VERIFIED )");
                    $("#verfiyurlfbgroup").text("Saving..");
                    chrome.runtime.sendMessage({ action: "addgroupapi", url: group_url_value, name: title,token:token },
                        (res9) => {
                            console.log(res9);
                            if (res9.status == "ok") {
                                $("#group_name").text(
                                    "Group Name:- " + title + "( " + res9.data.msg + " )"
                                );
                                $("#group_name").css("color", "green");
                                $("#verfiyurlfbgroup").text("Saved");
                                toastr["success"]('Group added successfully');
                                // setTimeout(() => {
                                //     window.location.reload();
                                //     //window.location.href = window.location.origin+'/connect-group';
                                // }, 2000);
                            } else {
                                $("#group_name").text("Error to saved group");
                                $("#group_name").css("color", "red");
                                $("#verfiyurlfbgroup").text("Error");
                                 toastr["error"]('Error to saved group');
                            }
                        }
                    );
                }
            );
        }
    });

    // CLICK ON UNFOLLOW AND SENT MESSAGE TO BACKGROUND FOR CANCEL SENT FRIEND REQUESTS
    $(document).on("click", "#delete_requests", function () {
        chrome.runtime.sendMessage({ action: "cancelSentFriendRequests" },
            (res11) => {
                let response = res11.start;
                console.log("cancel request sending..");
            }
        );
    });

    // BIRTHDAY SECTION STARTS
    // $(document).on("click", ".birthday_msg_send", function (event) {
    //     let day_type = $('input[name="birthday_type"]:checked').val();
    //     console.log(day_type);
    //     $(".birthday_msg_send").prop("disabled", true);
    //     $(".birthday_msg_send").addClass("disabled_cls");
    //     setTimeout(() => {
    //         chrome.runtime.sendMessage({ action: "openBirthdayEvent", type: "message", day_type: day_type },
    //             (res14) => {

    //                 console.log(res14);
    //                 setTimeout(() => {
    //                     $(".birthday_msg_send").prop("disabled", false);
    //                     $(".birthday_msg_send").removeClass("disabled_cls");
    //                 }, 5000)
    //             }
    //         );
    //     }, 2000);
    // });

    // // BIRTHDAY FEED SECTIONS
    // $(document).on("click", ".birthday_feed_send", function (event) {
    //     let day_type = $('input[name="birthday_type"]:checked').val();
    //     console.log(day_type);
    //     $(".birthday_feed_send").prop("disabled", true);
    //     $(".birthday_feed_send").addClass("disabled_cls");
    //     setTimeout(() => {
    //         chrome.runtime.sendMessage({ action: "openBirthdayEvent", type: "feed", day_type: day_type },
    //             (res14) => {
    //                 console.log(res14);
    //                 setTimeout(() => {
    //                     $(".birthday_feed_send").prop("disabled", false);
    //                     $(".birthday_feed_send").removeClass("disabled_cls");
    //                 }, 5000)
    //             }
    //         );
    //     }, 2000);
    // });
});


$(document).on("click", ".send_birthday_message", function (event) {
    
    setTimeout(() => {
        chrome.runtime.sendMessage({ action: "openBirthdayEventNew" });
        console.log("button clicked");
    }, 4000);

});

$(document).on("click", ".MuiButtonBase-root:contains('SEND BIRTHDAY MESSAGES')", function() {
    // Perform your actions here
    alert("Button with text 'SEND BIRTHDAY MESSAGES' was clicked!");
  });



  $(document).on("click", "#add-group-btn", function () {        
    let group_url_value = window.location.href;
    if (group_url_value.includes("/things_in_common")) {
        group_url_value = group_url_value.replace("/things_in_common", "");
    } else if (group_url_value.includes("members/")) {
        group_url_value = group_url_value.replace("members/", "members");
    }
    chrome.runtime.sendMessage({ action: "verifyGroupURL", url: group_url_value }, (res8) => {
        let response = res8.groupPageDOM;
        let title = $(response).filter("title").text();
        chrome.runtime.sendMessage({ action: "addgroupapinew", url: group_url_value, name: title, group_type: "member" }, (res9) => {
            if (res9.data.msg == 'group already saved') {
                toastr["error"](res9.data.msg);
            } else if (res9.data.msg == 'group saved') {
                toastr["success"]('group saved successfully');
            }
        });
    })
});
  

function sendMessageFromMessengers(thread_id, templateMessage) {
    let msgBox = 'div[aria-label="Message"]';
    var findMsgBox = setInterval(() => {
        if ($(msgBox).length > 0) {
            clearInterval(findMsgBox);
            clickOnElements(msgBox);
            navigator.clipboard.writeText(templateMessage).then(() => {
                document.execCommand("paste", null, null);
            });
            var findSendButton = setInterval(() => {
                if (
                    $('div[aria-label="Press Enter to send"').length > 0 ||
                    $('div[aria-label="Press enter to send"').length > 0
                ) {
                    clearInterval(findSendButton);
                    $('div[aria-label="Press enter to send"').mclick();
                    $('div[aria-label="Press Enter to send"').mclick();
                    setTimeout(() => {
                        console.log("add close code here -1 ");
                        chrome.runtime.sendMessage({ action: "closeTabs2" });
                    }, 200);
                }
            }, 100);
        }
    }, 100);
}

// CLICK ON MESSENGER TEXT AREA BOX. (FOR SEND MESSAGES)
async function clickOnElements(element) {
    console.log(element);
    let MouseEvent = document.createEvent("MouseEvents");
    MouseEvent.initEvent("mouseover", true, true);
    const over = document.querySelector(element).dispatchEvent(MouseEvent);
    //await sleep(50);
    MouseEvent.initEvent("mousedown", true, true);
    const down = document.querySelector(element).dispatchEvent(MouseEvent);
    MouseEvent.initEvent("mouseup", true, true);
    const up = document.querySelector(element).dispatchEvent(MouseEvent);
    MouseEvent.initEvent("click", true, true);
    const click = document.querySelector(element).dispatchEvent(MouseEvent);
    console.log(over, down, up, click);

    if (over) {
        return new Promise((resolve) => {
            resolve();
        });
    } else {
        return await clickOnElements(element);
    }
}

function appendHTMLOnBirthday(extTabIdOnBirthday) {
    console.log("appendHTMLOnBirthday is called");
    let html_processing_model = `<section class="main-app">
        <div class="overlay-ld">
            <div class="container-ld">
                <h3 class="title_lg">BIRTHDAY IS PROCESSING</h3>
                <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                <h3 class="title_lg">NEXT WISHES IS SENDING...</h3>
                <div class="loading">
                    <span class="fill"></span>
                </div>
                <p class="simple-txt"><span id="loop1">0</span> WISHES SENT OF <span class="total1"></span></p>
                <button class="btn__lg gredient-button scl-process-btn" data-tabid="${extTabIdOnBirthday}" type="button" id="stop_birthday_run">CLOSE WINDOW</button>
            </div>
        </div>
    </section>`;
    $("body:not('.process-model-added')").prepend(html_processing_model);
    $("body").addClass("process-model-added");
}