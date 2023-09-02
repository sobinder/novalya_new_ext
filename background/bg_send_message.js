class SendMessageMembersNV {
  constructor() {
    this.init();
  }

  init() {}

  // OPEN A SEND MESSAGE WINDOW MOBILE VERSION(M.FACEBOOK.COM)
  openSmallWindow(window_url, pass_data) {
    //local variable
    var windowSetting = {
      url: window_url,
      focused: false,
      type: "popup",
      top: Math.floor((window_height / 4) * 3),
      left: Math.floor((window_width / 4) * 3),
      height: Math.floor(window_height / 4),
      width: Math.floor(window_width / 4),
    };
    chrome.windows.create(windowSetting, function (tabs) {
      var mFacebookTabId = tabs.tabs[0].id;
      chrome.tabs.onUpdated.addListener(function mFacebookTabListener(
        tabId,
        changeInfo,
        tab
      ) {
        if (changeInfo.status === "complete" && tabId === mFacebookTabId) {
          chrome.tabs.sendMessage(mFacebookTabId, {
            subject: "sendMessageFromWindow",
            messageText: pass_data.text_message,
          });
          chrome.tabs.onUpdated.removeListener(mFacebookTabListener);
        }
      });
    });
  }

  // OPEN A SEND MESSAGE WINDOW MOBILE VERSION(M.FACEBOOK.COM)
  postTextOnTimeline(window_url, pass_data) {
    chrome.tabs.create({ url: window_url, active: true }, function (tabs) {
      var memberTabId = tabs.id;
      chrome.tabs.onUpdated.addListener(function facebookTabListener(
        tabId,
        changeInfo,
        tab
      ) {
        if (changeInfo.status === "complete" && tabId === memberTabId) {
          chrome.tabs.sendMessage(memberTabId, {
            subject: "postBirthday",
            messageText: pass_data.text_message,
          });
          chrome.tabs.onUpdated.removeListener(facebookTabListener);
        }
      });
    });
  }

  openMessengersWindow(threadId, text_message) {
    if (threadId != "") {
      var url = "https://www.messenger.com/t/" + threadId;
      var windowSetting = {
          url: url,
          focused: true,
          type: "normal",
          height: window_height,
          width: Math.floor(window_width - 40)
      };

      chrome.windows.create(windowSetting, function (tabs) {
          var messengerTabId = tabs.tabs[0].id;
          var member_profile_id = threadId;
          var body_message = text_message;
          chrome.tabs.onUpdated.addListener(function messengersTabListener(tabId, changeInfo, tab) {
              if (changeInfo.status === "complete" && tabId === messengerTabId) {
                  setTimeout(() => {
                      chrome.tabs.sendMessage(messengerTabId, { from: 'background', subject: 'shootMessages', threadId: member_profile_id, textMessage: body_message});
                  }, 2000);
                  chrome.tabs.onUpdated.removeListener(messengersTabListener);
              }
          });
      });
      // chrome.tabs.create({ url: url, active: true, pinned: true}, function (tabs) {
      //     var messengerTabId = tabs.tabs[0].id;
      //     var member_profile_id = threadId;
      //     var body_message = text_message;
      //     chrome.tabs.onUpdated.addListener(function messengersTabListener(tabId, changeInfo, tab) {
      //         if (changeInfo.status === "complete" && tabId === messengerTabId) {
      //             setTimeout(() => {
      //                 chrome.tabs.sendMessage(messengerTabId, { from: 'background', subject: 'shootMessages', threadId: member_profile_id, textMessage: body_message});
      //             }, 2000);
      //             chrome.tabs.onUpdated.removeListener(messengersTabListener);
      //         }
      //     });
      // });

      // chrome.tabs.query({ pinned: false }, function (tabs) {
      //   if (tabs.length > 0) {
      //     // Pinned tab exists, update the URL
      //     var messengerTabId = tabs[0].id;
      //     var member_profile_id = threadId;
      //     var body_message = text_message;
      //     chrome.tabs.update(messengerTabId, { url: url }, function () {
      //       // Tab updated, send message after a delay
      //       setTimeout(() => {
      //         chrome.tabs.sendMessage(messengerTabId, {
      //           from: "background",
      //           subject: "shootMessages",
      //           threadId: member_profile_id,
      //           textMessage: body_message,
      //         });
      //       }, 2000);
      //     });
      //   } else {
      //     // Pinned tab doesn't exist, create a new one
      //     chrome.tabs.create(
      //       { url: url, active: true, pinned: true },
      //       function (tabs) {
      //         var messengerTabId = tabs.id;
      //         var member_profile_id = threadId;
      //         var body_message = text_message;
      //         chrome.tabs.onUpdated.addListener(function messengersTabListener(
      //           tabId,
      //           changeInfo,
      //           tab
      //         ) {
      //           if (
      //             changeInfo.status === "complete" &&
      //             tabId === messengerTabId
      //           ) {
      //             setTimeout(() => {
      //               chrome.tabs.sendMessage(messengerTabId, {
      //                 from: "background",
      //                 subject: "shootMessages",
      //                 threadId: member_profile_id,
      //                 textMessage: body_message,
      //               });
      //             }, 2000);
      //             chrome.tabs.onUpdated.removeListener(messengersTabListener);
      //           }
      //         });
      //       }
      //     );
      //   }
      // });
    }
  }
}
SendMessageMembersNVClass = new SendMessageMembersNV();
