/*
 *
 * AddTargetFriendNV Javascript
 *
 * @since 5.0.0
 *
 */
var warningStatus = false;
let AddTargetFriendNV;
(function ($) {
  let $this;
  let groupId;
  let total_message_limit = 300000; // read by api or by storage of specific user settings.
  let connectAction;
  let memberInfo = {};
  AddTargetFriendNV = {
    settings: {},
    initilaize: function () {
      $this = AddTargetFriendNV;
      $(document).ready(function () {
        $this.onInitMethods();
      });
    },
    onInitMethods: function () {
      var button = $('<button>', {
        id: 'add-group-btn',
        text: ' + Add this group to Novalya'
      });

      var button2 = $('<button>', {
        id: 'add-group-btn2',
        text: ' + Add this group to Novalya'
      });
      setInterval(() => {
        let group_url_value = window.location.href;
        if (
          group_url_value.indexOf("/groups/") > -1 &&
          group_url_value.indexOf("/members") != -1
        ) {
          // $('.x1yztbdb span:first').append(button);
          $('.x1yztbdb span:contains("Members with things in common"):first').append(button2);
        };

        if (
          group_url_value.indexOf("/groups/") > -1 &&
          group_url_value.indexOf("/members") != -1
        ) {
          $('.x78zum5 .xdt5ytf .x1iyjqo2 .x1sy10c2 .x1yztbdb span:first').append(button);
        };
      }, [1000])
    },

    startAddingFriend: function (settings, no_friend_request, extTabId, total_no_friend_request) {
      no_friend_request = no_friend_request;
      total_no_friend_request = total_no_friend_request;

      console.log(settings, no_friend_request);
      console.log(settings, total_no_friend_request);

      
      connectAction = settings[0].action;
      connectAction = JSON.parse(connectAction)

      processing_status = "running";
      totalGroupMembers = $("h2:contains(Members):eq(0)").text();
      totalGroupMembers = totalGroupMembers.replace(/[^\d]/g, "");

      const intervalValue = settings[0].interval;
      if (intervalValue == "30-60") {
        randomDelay = Math.floor(Math.random() * 31) * 1000 + 30000;
      } else if (intervalValue == "1-3") {
        randomDelay = Math.floor(Math.random() * 121) * 1000 + 60000;
      } else if (intervalValue == "3-5") {
        randomDelay = Math.floor(Math.random() * 121) * 1000 + 180000;
      } else if (intervalValue == "5-10") {
        randomDelay = Math.floor(Math.random() * 301) * 1000 + 300000;
      } else {
        randomDelay = 60000;
      }
      console.log(randomDelay);

      const numberOfReqValue = settings[0].norequest;
      if (numberOfReqValue != "custom") {
        limit_req = numberOfReqValue;
      } else {
        limit_req = settings[0].custom; // unlimited
      }
      showCustomToastr('info', 'Novalya’s Magic is in progress 0 of ' + limit_req, 1000, true, true, true);
      let keywordTypeValue = '';
      let negative_keyword = '';
      console.log(settings[0].keyword)
      if(settings[0].keywords != null && settings[0].keywords != ""){
        if(settings[0].keywords.positive_keyword != null && settings[0].keywords.positive_keyword != '' ){
          keywordTypeValue = settings[0].keywords.positive_keyword.toLowerCase();
        }
        if(settings[0].keywords.negative_keyword != null && settings[0].keywords.negative_keyword != '' ){
          negative_keyword = settings[0].keywords.negative_keyword.toLowerCase();
        }
      }
       
      // const keywordTypeValue = "glocal,glocify";
      //const message_id = settings[0].message;
      const messageArray = settings[0].messages.Sections;
      const gender = settings[0].gender;
      const countryvalue = settings[0].country;
      groupId = settings[0].message;
      const prospect = settings[0].prospect;
      const selectedInterval = settings[0].selectedinterval;
      const dateValue = settings[0].datevalue;
      console.log(selectedInterval, dateValue);

      $(".total1").text(limit_req);
      search_index_value = settings[0].search_index;
      console.log('search_index_value', search_index_value);
      if (search_index_value != 0 && search_index_value != "") {
        console.log('enable search index');
        setTimeout(() => {
          $this.setIndexingOnMembersRequest(search_index_value);
        }, 5000);
      }

      setTimeout(() => {
        $this.checkValidUsers(
          randomDelay,
          limit_req,        
          keywordTypeValue,
          negative_keyword,
          countryvalue,
          totalGroupMembers,
          gender,
          messageArray,
          prospect,
          selectedInterval,
          dateValue,
          connectAction
        );
      }, 8000);
    },
    checkValidUsers: function (
      randomDelay,
      limit_req,
      keywordTypeValue,
      negative_keyword,
      countryvalue,
      totalGroupMembers,
      gender,
      messageArray,
      prospect,
      selectedInterval,
      dateValue,
      connectAction
    ) {
      selector_for_validclass2 =
        'div[data-visualcompletion="ignore-dynamic"][role="listitem"]:not(.sca-member-proccessed, .working-scl):eq(0)';
      /****************FIND AND ADDING FRINED***************************/
      if (stoprequest == false) {
        loop2 = loop1;
        $("#loop1").text(loop2 + 1);

        selector_for_validclass =
          'div[data-visualcompletion="ignore-dynamic"][role="listitem"]:not(.sca-member-proccessed):eq(0)';
        if (total_no_friend_request > no_friend_request) {
          if ($(selector_for_validclass).length > 0 && loop1 < limit_req) {

            var incrementedLoop = loop2 + 1;
            btnText = $(selector_for_validclass).find(
              'div[aria-label="Add Friend"]:containsI("Add Friend")'
            );

            if (btnText.length == 0) {
              btnText = $(selector_for_validclass).find(
                'div[aria-label="Add friend"]:containsI("Add Friend")'
              );
            }

            let groupHref2 = $(selector_for_validclass2)
              .find('a[href*="/groups/"]')
              .attr("href");
            if (groupHref2.includes("user/")) {
              console.log(groupHref2);
              let memberurl2 = groupHref2.split("user/");
              let memberid2 = memberurl2[1].replace("/", "");
              console.log(memberid2);

              if (prospect == "yes") {

                chrome.runtime.sendMessage({
                  action: "checkProspectUser",
                  memberid: memberid2,
                }, (res) => {
                  console.log(res.result);
                  if (res.result.message == "no record found") {
                    $this.addFriendButtonCheck(
                      randomDelay,
                      limit_req,
                      keywordTypeValue,
                      negative_keyword,
                      countryvalue,
                      totalGroupMembers,
                      gender,
                      messageArray,
                      prospect,
                      selectedInterval,
                      dateValue,
                      btnText,
                      loop2,
                      connectAction
                    );
                  } else if (res.result.message == "Record already found") {
                    console.log("record allready found");
                    if (selectedInterval == "custom") {
                      var currentDate = new Date(dateValue).getTime();
                      var userAddDate = new Date(res.result.data.date_add);
                      var dateInMilliseconds = userAddDate.getTime();
                      console.log(currentDate, dateInMilliseconds);
                    } else {
                      console.log(selectedInterval);
                      var currentDate = new Date().valueOf();
                      var userAddDate = new Date(res.result.data.date_add);
                      console.log(userAddDate);
                      userAddDate.setDate(userAddDate.getDate() + parseInt(selectedInterval, 10));
                      // Get the date in milliseconds since the Unix epoch
                      console.log(userAddDate);
                      var dateInMilliseconds = userAddDate.getTime();
                      console.log(currentDate, dateInMilliseconds);
                    }

                    if (selectedInterval !== "alltime") {
                      console.log("in the selectedInterval not empty");
                      if (currentDate >= dateInMilliseconds) {
                        console.log("in the sending condition");
                        $this.addFriendButtonCheck(
                          randomDelay,
                          limit_req,
                          keywordTypeValue,
                          negative_keyword,
                          countryvalue,
                          totalGroupMembers,
                          gender,
                          messageArray,
                          prospect,
                          selectedInterval,
                          dateValue,
                          btnText,
                          loop2,
                          connectAction
                        );
                      } else {
                        console.log("in the not sendong condition");
                        $(selector_for_validclass).addClass("sca-member-proccessed");
                        if ($(selector_for_validclass)[0] != undefined) {
                          window.scrollTo(
                            0,
                            window.pageYOffset +
                            $(selector_for_validclass)[0].getBoundingClientRect().top -
                            350
                          );
                        }
                        setTimeout(() => {
                          $this.checkValidUsers(
                            randomDelay,
                            limit_req,
                            keywordTypeValue,
                            negative_keyword,
                            countryvalue,
                            totalGroupMembers,
                            gender,
                            messageArray,
                            prospect,
                            selectedInterval,
                            dateValue,
                            connectAction
                          );
                        }, 4000);
                      }
                    } else {
                      console.log("in the selectedInterval is empty");
                      $this.addFriendButtonCheck(
                        randomDelay,
                        limit_req,
                        keywordTypeValue,
                        negative_keyword,
                        countryvalue,
                        totalGroupMembers,
                        gender,
                        messageArray,
                        prospect,
                        selectedInterval,
                        dateValue,
                        btnText,
                        loop2,
                        connectAction
                      );
                    }
                  }
                });
              } else if (prospect == "no") {
                console.log("Don’t invite same users");
                chrome.runtime.sendMessage({
                  action: "checkProspectUser",
                  memberid: memberid2,
                }, (res) => {
                  console.log(res.result);
                  if (res.result.message == "no record found") {
                    $this.addFriendButtonCheck(
                      randomDelay,
                      limit_req,
                      keywordTypeValue,
                      negative_keyword,
                      countryvalue,
                      totalGroupMembers,
                      gender,
                      messageArray,
                      prospect,
                      selectedInterval,
                      dateValue,
                      btnText,
                      loop2,
                      connectAction
                    );
                  } else {
                    $(selector_for_validclass).addClass("sca-member-proccessed");
                    if ($(selector_for_validclass)[0] != undefined) {
                      window.scrollTo(
                        0,
                        window.pageYOffset +
                        $(selector_for_validclass)[0].getBoundingClientRect().top -
                        350
                      );
                    }
                    setTimeout(() => {
                      $this.checkValidUsers(
                        randomDelay,
                        limit_req,
                        keywordTypeValue,
                        negative_keyword,
                        countryvalue,
                        totalGroupMembers,
                        gender,
                        messageArray,
                        prospect,
                        selectedInterval,
                        dateValue,
                        connectAction
                      );
                    }, 4000);
                  }
                });
              }
            } else {
              if (loop1 < limit_req) {
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                setTimeout(() => {
                  $this.checkValidUsers(
                    randomDelay,
                    limit_req,
                    keywordTypeValue,
                    negative_keyword,
                    countryvalue,
                    totalGroupMembers,
                    gender,
                    messageArray,
                    prospect,
                    selectedInterval,
                    dateValue,
                    connectAction
                  );
                }, 4000);
              }
            }

          } else {
            if (loop1 < limit_req) {
              $("html, body").animate({ scrollTop: $(document).height() }, 1000);
              setTimeout(() => {
                $this.checkValidUsers(
                  randomDelay,
                  limit_req,
                  keywordTypeValue,
                  negative_keyword,
                  countryvalue,
                  totalGroupMembers,
                  gender,
                  messageArray,
                  prospect,
                  selectedInterval,
                  dateValue,
                  connectAction
                );
              }, 4000);
            } else {
              console.log("stopped");
              $("#loop1").text(loop1);
              $("#stop_run").text("STOPPED");
              $(".loading").remove();
              $("h3.title_lg").text("Limit Exceed");
              chrome.runtime.sendMessage({ action: "closeTabs", extTabId: extTabId });
            }
          }
        } else {
          $("#customToastr0").css("background-color", "red");
          $("#toastrMessage").text(`Your message request limit is reached. Please consider upgrading your plan. `);
          setTimeout(() => {
            chrome.runtime.sendMessage({ action: "closeTabs", extTabId: extTabId });
          }, 2000);
        }
      }
    },
    addFriendButtonCheck: async function(  
      randomDelay,
      limit_req,
      keywordTypeValue,
      negative_keyword,
      countryvalue,
      totalGroupMembers,
      gender,
      messageArray,
      prospect,
      selectedInterval,
      dateValue , btnText , loop2 , no_of_send_message,connectAction){
      //  console.log("Total limit: " + parseInt(total_message_limit) ,"send message no :" + parseInt(no_of_send_message) );
        // if(parseInt(total_message_limit) > parseInt(no_of_send_message)){
          selector_for_validclass2 =
          'div[data-visualcompletion="ignore-dynamic"][role="listitem"]:not(.sca-member-proccessed, .working-scl):eq(0)';
          let groupHref3 = $(selector_for_validclass2)
          .find('a[href*="/groups/"]')
          .attr("href");
          console.log(groupHref3);
          if(groupHref3.includes("user/")){
            console.log("user/ found");
            if (btnText.length == 1) {
              no_of_send_message++;
              console.log(no_of_send_message);
              $("#toastrMessage").text(`Novalya’s Magic is in progress ${(loop2 + 1)} of ${limit_req} `);
              var incrementedLoop = loop2 + 1;
           
              validKeyword = true;
              if (keywordTypeValue != "") {
                var description = $(selector_for_validclass2)
                  .find(".x1pg5gke.xvq8zen")
                  .text()
                  .toLowerCase();
                console.log(description);
                console.log(keywordTypeValue);
                var arrayKeyword1 =keywordTypeValue.slice(1, -1).replace(/"/g, '');
               var arrayKeyword = arrayKeyword1.split(",");
                  console.log(arrayKeyword);
                if (description != "") {
                  matched = arrayKeyword.filter(
                    (item) => description.indexOf(item) > -1
                  );
                  if (matched.length == 0) {
                    validKeyword = false;
                  }
                } else {
                  validKeyword = false;
                }
              }
  
              // negtive keyword
              invalidKeyword = false;
              if (negative_keyword != "") {
                var description = $(selector_for_validclass2)
                  .find(".x1pg5gke.xvq8zen")
                  .text()
                  .toLowerCase();
                  var arrayNegativeKeyword1 = negative_keyword.slice(1, -1).replace(/"/g, '');
                var arraynegative_keyword = arrayNegativeKeyword1.split(",");
  
                if (description != "") {
                  matched = arraynegative_keyword.filter(
                    (item) => description.indexOf(item) > -1
                  );
                  if (matched.length == 0) {
                    invalidKeyword = false;
                  } else {
                    invalidKeyword = true;
                  }
                } else {
                  invalidKeyword = false;
                }
              }
      
              //console.log('selector class 2 length', $(selector_for_validclass2).length);
              let groupHref2 = $(selector_for_validclass2)
                .find('a[href*="/groups/"]')
                .attr("href");
              
              let memberurl2 = groupHref2.split("user/");
              let memberid2 = memberurl2[1].replace("/", "");
              let member_name2 = $(selector_for_validclass2)
                .find('a[href*="/groups/"]')
                .text()
                .toLowerCase();
      
              chrome.runtime.sendMessage(
                {
                  action: "getGenderCountry",
                  profile_id: memberid2,
                  gender: gender,
                  name: member_name2,
                },
                (response) => {
                  if (
                    response.gender != "both" &&
                    typeof response.data.body != "undefined"
                  ) {
                    validGender = false;
                    console.log(response);
                    if (response.data.body.gender.toLowerCase() == gender) {
                      validGender = true;
                    }
                  } else {
                    validGender = true;
                  }
      
                  countryList = true;
                  if (countryvalue != "" && countryvalue.indexOf(",") > -1) {
                    countryvalue2 = countryvalue.split(",");
                    if (countryvalue2.length > 0) {
                      if (typeof response.data.body != "undefined") {
                        matched = countryvalue2.filter(
                          (item) => item == response.data.body.countryName
                        );
                        if (matched.length == 0) {
                          countryList = true;
                        }
                      } else {
                        countryList = true;
                      }
                    }
                  }
      
                  // SEARCH INDEX VALUE
                  //validIndex = true;
                  currentIndex = $(selector_for_validclass2).attr("scl-index");
      
                  //cint = Number(currentIndex);
                  var cint =
                    typeof currentIndex == "undefined" ? 0 : Number(currentIndex);
                  if (cint < search_index_value) {
                    validIndex = false;
                  } else {
                    validIndex = true;
                  }
                  if (
                    validKeyword &&
                    !invalidKeyword &&
                    countryList &&
                    validGender &&
                    validIndex
                  ) {
                    showCustomToastr('info', 'Sending Friend Request', randomDelay, true);
                    $(selector_for_validclass).addClass("add-done-border");
                    $(selector_for_validclass).addClass("loading_w_scl");
                    $(selector_for_validclass).attr("member_id", memberid2);

                    let image = $(selector_for_validclass).find('svg image').attr('xlink:href');
      
                    let groupHref = $(selector_for_validclass2)
                      .find('a[href*="/groups/"]')
                      .attr("href");
                    let member_name = $(selector_for_validclass2)
                      .find('a[href*="/groups/"]')
                      .text();
                    let memberurl = groupHref.split("user/");
                    //let memberid = memberurl[1].replace('/', '');
                    var memberid = $(selector_for_validclass2).attr("member_id");

                    memberInfo = {};
                    memberInfo.fb_user_id = memberid;
                    memberInfo.fbName = member_name;
                    memberInfo.profilePic = image;

                    let member_names = member_name.split(" ");
                    $(selector_for_validclass).addClass("sca-member-proccessed");
                    var segementMessage = [];
                    segementMessagetextArray = messageArray;
                    //console.log(segementMessagetextArray);
                    segementMessagetextArray.forEach(function (item, i) {
                      segementMessage_json = segementMessagetextArray[i];
                      segementMessage_varient_json = segementMessage_json.varient;
                      segementMessage_varient_array = JSON.parse(segementMessage_varient_json);
                      var randomIndex2 = Math.floor(
                        Math.random() * segementMessage_varient_array.length
                      );
                      segementMessage.push(segementMessage_varient_array[randomIndex2]);
      
                    });
                    //2, 11, 333
                    segementMessage = segementMessage.join('');
                    //console.log(segementMessage);
                    setTimeout(() => {
                      //console.log(segementMessage);
                      showCustomToastr('success', 'Friend Request Sent', 5000, false);
                      btnText.click();
                    //   raw = JSON.stringify({
                    //     'no_of_connect':1,
                    // });
                    //   chrome.runtime.sendMessage({action:"updateNoSendConnects", request: raw});
                      showCustomToastr('success', 'Message Sending Start', 10000, true);
                      setTimeout(() => {
                        // --------------------------------------
                        $this.closeWarningPopup();
                        setTimeout(() => {
                          if (!warningStatus) {
                            segementMessage = segementMessage.replaceAll(
                              "[first name]",
                              member_names[0]
                            );
                            segementMessage = segementMessage.replaceAll(
                              "[last name]",
                              member_names[1]
                            );
      
                            chrome.runtime.sendMessage(
                              {
                                action: "sendMessageToMember",
                                memberid: memberid,
                                groupid: groupId,
                                textMsg: segementMessage,
                              },
                              (response) => {
                                $(".loading_w_scl").addClass("working-scl");
                                setTimeout(() => {
                                  $(".working-scl").removeClass("loading_w_scl");
                                }, 500);
      
                                if (loop2 + 1 == limit_req) {
                                  $("#toastrMessage").text(`“Goal Achieved. Congratulations!”`);
                                }
                                setTimeout(() => {
                                  showCustomToastr('success', 'Message Sent Successfully', 5000, false);
                                }, 2000);
                                chrome.runtime.sendMessage({ action: "createProspectUser", memberid: memberid2, }, (res) => {
                                  console.log(res);
                                });
                                loop1++;
                                no_friend_request++;
                                $this.updateRequestLimit();
                                $this.checkValidUsers(
                                  randomDelay,
                                  limit_req,
                                  keywordTypeValue,
                                  negative_keyword,
                                  countryvalue,
                                  totalGroupMembers,
                                  gender,
                                  messageArray,
                                  prospect,
                                  selectedInterval,
                                  dateValue,
                                  connectAction
                                );
                              }
                            );
                          } else {
                            showCustomToastr('error', 'Message Sending Failled', 3000, false);
                            console.log("reached iin else condition");
                            loop1++;
                            no_friend_request++;
                            $this.updateRequestLimit();
                            $(".loading_w_scl").addClass("failed-scl");
                            setTimeout(() => {
                              $(".failed-scl").removeClass("loading_w_scl");
                            }, 500);
                            chrome.runtime.sendMessage({ action: "createProspectUser", memberid: memberid2, }, (res) => {
                              console.log(res);
                            });
                            setTimeout(() => {
                              $this.checkValidUsers(
                                randomDelay,
                                limit_req,
                                keywordTypeValue,
                                negative_keyword,
                                countryvalue,
                                totalGroupMembers,
                                gender,
                                messageArray,
                                prospect,
                                selectedInterval,
                                dateValue,
                                connectAction
                              );
                            }, 4000);
                            warningStatus = false;
                          }
                        }, 5000);
      
                        //   -----------------------------------
                      }, 3000);
                    }, randomDelay);
                  } else {
                    console.log("reached here");
                    // IF KEYWORD NOT MATCHED LIKE PATNA NOT MACTHED
                    $(selector_for_validclass).addClass("sca-member-proccessed");
                    if ($(selector_for_validclass)[0] != undefined) {
                      window.scrollTo(
                        0,
                        window.pageYOffset +
                        $(selector_for_validclass)[0].getBoundingClientRect()
                          .top -
                        350
                      );
                    }
      
                    setTimeout(() => {
                      $this.checkValidUsers(
                        randomDelay,
                        limit_req,
                        keywordTypeValue,
                        negative_keyword,
                        countryvalue,
                        totalGroupMembers,
                        gender,
                        messageArray,
                        prospect,
                        selectedInterval,
                        dateValue,
                        connectAction
                      );
                    }, 4000);
                  }
                }
              );
            } else {
              $(selector_for_validclass).addClass("sca-member-proccessed");
              if ($(selector_for_validclass)[0] != undefined) {
                window.scrollTo(
                  0,
                  window.pageYOffset +
                  $(selector_for_validclass)[0].getBoundingClientRect().top -
                  350
                );
              }
              setTimeout(() => {
                $this.checkValidUsers(
                  randomDelay,
                  limit_req,
                  keywordTypeValue,
                  negative_keyword,
                  countryvalue,
                  totalGroupMembers,
                  gender,
                  messageArray,
                  prospect,
                  selectedInterval,
                  dateValue,
                  connectAction
                );
              }, 4000);
            }
          }else{
            $(selector_for_validclass).addClass("sca-member-proccessed");
            if ($(selector_for_validclass)[0] != undefined) {
              window.scrollTo(
                0,
                window.pageYOffset +
                $(selector_for_validclass)[0].getBoundingClientRect().top -
                350
              );
            }
            setTimeout(() => {
              $this.checkValidUsers(
                randomDelay,
                limit_req,
                keywordTypeValue,
                negative_keyword,
                countryvalue,
                totalGroupMembers,
                gender,
                messageArray,
                prospect,
                selectedInterval,
                dateValue,
                connectAction
              );
            }, 4000);
          }

        // }else{
        //   $("#customToastr0").css("background-color", "red");
        //   $("#toastrMessage").text(`Your message limit is reached. Please consider upgrading your plan. `);
        //   setTimeout(() => {
        //     chrome.runtime.sendMessage({ action: "closeTabs", extTabId: extTabId });
        //   }, 2000);
        // }
    },
    setIndexingOnMembersRequest: function (value) {
      var member_list_label =
        'div[aria-label="Group content"][role="main"] div[data-visualcompletion="ignore-dynamic"][role="listitem"]';
      var SCL_loadedMembers = 0;
      if ($(member_list_label).length > 0) {
        $member_ls_selector = member_list_label;
        SCL_loadedMembers = $(
          'div[data-visualcompletion="ignore-dynamic"][role="listitem"]'
        ).length;
        j = $(
          'div[data-visualcompletion="ignore-dynamic"][role="listitem"].sca-member-proccessed'
        ).length;
      }
      console.log('member_list_label', $(member_list_label).length);
      setInterval(() => {
        let parent_selector = 'div[aria-label="Group content"][role="main"]';
        if ($(parent_selector).length > 0) {
          if (SCL_loadedMembers > 0) {
            if ($($member_ls_selector).length > 0) {
              $($member_ls_selector).each(function (index) {
                show_label_Popup = false;
                var lastcount = $(this)
                  .prev()
                  .find("span.xk50ysn.xzsf02u .scl-label")
                  .text();
                // console.log('lastcount', lastcount);
                if (lastcount != "") {
                  //currentIndex = j + index ;
                  var count = parseInt(lastcount) + 1;
                  //console.log(lastcount);
                  //return false;
                } else {
                  currentIndex = j + index;
                  var count = parseInt(currentIndex) + 1;
                }
                // console.log(value, count, $(this));
                if (!$(this).hasClass("scl-label-processed")) {
                  $(this).addClass("scl-label-processed");
                  $(this).attr("scl-index", count);
                  //console.log(value, count);
                  $(this).find("span.xk50ysn.xzsf02u").addClass("test-aft-gm");
                  $(this)
                    .find('span.xk50ysn.xzsf02u:not(".scl-label-processed")')
                    .append(
                      '<span class="scl-label" index-scl="' +
                      count +
                      '">' +
                      count +
                      "</span>"
                    );
                  //console.log('DOM not found');
                }
              });
            }
          }
        }
      }, 500);
    },
    addProgressModel: function (extTabId) {
      let html_processing_model = `<section class="main-app">
                <div class="overlay-ld">
                    <div class="container-ld">
                        <h3 class="title_lg">CAMPAIGN IS PROCESSING</h3>
                        <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                        <h3 class="title_lg">NEXT REQUEST IS SENDING...</h3>
                        <div class="loading">
                            <span class="fill"></span>
                        </div>
                        <p class="simple-txt"><span id="loop1">0</span> REQUESTS IS ON <span class="total1"> 30 </span></p>
                        <button class="btn__lg gredient-button scl-process-btn" data-tabid="${extTabId}" type="button" id="stop_run">stop sending</button>
                    </div>
                </div>
            </section>`;
      $("body:not('.process-model-added')").prepend(html_processing_model);
      $("body").addClass("process-model-added");
    },
    stopAddFriendProcess: function (stopAddFriendProcess) {
      if (timeOutIdsArray.length > 0) {
        timeOutIdsArray.forEach(function (item) {
          console.log(item);
          clearInterval(item);
        });
        timeOutIdsArray = [];
      }
      chrome.storage.local.set({
        nvAddFriendProcess: "",
        nvFriendReqInputs: "",
      });
      chrome.runtime.sendMessage(
        { action: "closeTabs", extTabId: extTabId },
        (res2) => {
          // body
        }
      );
    },
    closeWarningPopup: function () {
      //console.log('closeWarningPopup');
      setInterval(() => {
        $this.closeWarningPopup2("People you may know");
        $this.closeWarningPopup2("Use This Feature Right Now");
        $this.closeWarningPopup2("Does this person know you?");
        $this.closeWarningPopup2(
          "Sorry, we can't process this request right now"
        );
        $this.closeWarningPopup2("Can't Send Request");
        $this.closeWarningPopup2("Your Request Couldn't be Processed");
      }, 500);
    },
    closeWarningPopup2: function (text) {
      selector = 'h2 span.xuxw1ft:containsI("' + text + '")';
      if ($(selector).length > 0) {
        $(selector)
          .parent()
          .parent()
          .next()
          .find('div[aria-label="Close"]')
          .mclick();

        warningStatus = true;
      }
    },
    updateRequestLimit: function () {
     
      raw = JSON.stringify({
        'no_friend_request': no_friend_request,
      });
      chrome.runtime.sendMessage({ action: "updateLimit", request: raw });
      setTimeout(()=>{
        console.log(connectAction);
        console.log(memberInfo);
        chrome.runtime.sendMessage({ action: "connectAutomation", setting: connectAction,member:memberInfo });
      },2000);
      
    }

  };
  AddTargetFriendNV.initilaize();
})(jQuery);