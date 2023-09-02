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
setInterval(()=>{
let group_url_value = window.location.href ;
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
},[1000])
    },

    startAddingFriend: function (settings, extTabId) {
      $this.addProgressModel(extTabId);

      processing_status = "running";
      totalGroupMembers = $("h2:contains(Members):eq(0)").text();
      totalGroupMembers = totalGroupMembers.replace(/[^\d]/g, "");

      const intervalValue = settings.interval;
      if (intervalValue == "30-60") {
        randomDelay = (Math.floor(Math.random() * 30) + 30) * 1000;
      } else if (intervalValue == "1-3") {
        randomDelay = (Math.floor(Math.random() * 60) + 180) * 1000;
      } else if (intervalValue == "3-5") {
        randomDelay = (Math.floor(Math.random() * 180) + 300) * 1000;
      } else if (intervalValue == "5-10") {
        randomDelay = (Math.floor(Math.random() * 300) + 600) * 1000;
      } else {
        randomDelay = 45000;
      }

      const numberOfReqValue = settings.norequest;
      if (numberOfReqValue != "custom") {
        limit_req = numberOfReqValue;
      } else {
        limit_req = settings.custom; // unlimited
      }
      console.log(settings);
      const keywordTypeValue = settings.keyword.toLowerCase();
      const negative_keyword = settings.negative_keyword.toLowerCase();
      const message_id = settings.message;
      const gender = settings.gender;
      const countryvalue = settings.country;
      groupId = settings.message;
      $(".total1").text(limit_req);
      search_index_value = settings.search_index;
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
          message_id,
          search_index_value
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
      message_id
    ) {
      /****************FIND AND ADDING FRINED***************************/
      if (stoprequest == false) {
        loop2 = loop1;
        $("#loop1").text(loop2 + 1);
        selector_for_validclass =
          'div[data-visualcompletion="ignore-dynamic"][role="listitem"]:not(.sca-member-proccessed):eq(0)';
        //console.log('Length of main selector', $(selector_for_validclass).length);
        if ($(selector_for_validclass).length > 0 && loop1 < limit_req) {
          
          btnText = $(selector_for_validclass).find(
            'div[aria-label="Add Friend"]:contains("Add Friend")'
          );
          
          if (btnText.length == 0) {
            btnText = $(selector_for_validclass).find(
              'div[aria-label="Add friend"]:contains("Add Friend")'
            );
          }

          //console.log('btnText.length', btnText.length);

          if (btnText.length == 1) {
            // positive keywords
            validKeyword = true;
            if (keywordTypeValue != "") {
              var description = $(selector_for_validclass)
                .find(".x1pg5gke.xvq8zen")
                .text()
                .toLowerCase();

              var arrayKeyword = keywordTypeValue.split(",");

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
              var description = $(selector_for_validclass)
                .find(".x1pg5gke.xvq8zen")
                .text()
                .toLowerCase();

              var arraynegative_keyword = negative_keyword.split(",");

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

            selector_for_validclass2 =
              'div[data-visualcompletion="ignore-dynamic"][role="listitem"]:not(.sca-member-proccessed, .working-scl):eq(0)';

            //console.log('selector class 2 length', $(selector_for_validclass2).length);
            let groupHref2 = $(selector_for_validclass2)
              .find('a[href*="/groups/"]')
              .attr("href");
              console.log('groupHref2', groupHref2);
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
                if (countryvalue != "") {
                  countryvalue2 = countryvalue.split(",");
                  if (countryvalue2.length > 0) {
                    if (typeof response.data.body != "undefined") {
                      matched = countryvalue2.filter(
                        (item) => item == response.data.body.countryName
                      );
                      if (matched.length == 0) {
                        countryList = false;
                      }
                    } else {
                      countryList = false;
                    }
                  }
                }

                // SEARCH INDEX VALUE
                //validIndex = true;
                currentIndex = $(selector_for_validclass2).attr("scl-index");

                //cint = Number(currentIndex);
                var cint =
                  typeof currentIndex == "undefined" ? 0 : Number(currentIndex);
                console.log(cint, search_index_value);
                if (cint < search_index_value) {
                  console.log("false");
                  validIndex = false;
                } else {
                  console.log("true");
                  validIndex = true;
                }

                //console.log(validIndex);
                if (
                  validKeyword &&
                  !invalidKeyword &&
                  countryList &&
                  validGender &&
                  validIndex
                ) {
                  $(selector_for_validclass).addClass("add-done-border");
                  $(selector_for_validclass).addClass("loading_w_scl");
                  $(selector_for_validclass).attr("member_id", memberid2);

                  let groupHref = $(selector_for_validclass2)
                    .find('a[href*="/groups/"]')
                    .attr("href");
                  let member_name = $(selector_for_validclass2)
                    .find('a[href*="/groups/"]')
                    .text();
                  let memberurl = groupHref.split("user/");
                  //let memberid = memberurl[1].replace('/', '');
                  var memberid = $(selector_for_validclass2).attr("member_id");

                  let member_names = member_name.split(" ");
                  $(selector_for_validclass).addClass("sca-member-proccessed");

                  var authtoken = "";
                  chrome.runtime.sendMessage(
                    {
                      action: "fetchMessageFromGroupSegement",
                      groupid: message_id,
                      authtoken: authtoken,
                    },
                    (response) => {
                      segementMessagetextArray = response.text;
                      var randomIndex = Math.floor(
                        Math.random() * segementMessagetextArray.length
                      );
                      segementMessage = segementMessagetextArray[randomIndex];
                    }
                  );

                  setTimeout(() => {
                    //console.log(segementMessage);
                    btnText.click();                    
                    setTimeout(() => {
                      // --------------------------------------
                      $this.closeWarningPopup();                      
                      setTimeout(() => {
                        if (!warningStatus) {
                          console.log("in the condition");
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

                              loop1++;
                              $this.checkValidUsers(
                                randomDelay,
                                limit_req,
                                keywordTypeValue,
                                negative_keyword,
                                countryvalue,
                                totalGroupMembers,
                                gender,
                                message_id,
                                search_index_value
                              );
                            }
                          );
                        } else {
                          console.log("reached iin else condition");
                          loop1++;
                          // $(selector_for_validclass).addClass(
                          //   "sca-member-proccessed"
                          // );
                          // if ($(selector_for_validclass)[0] != undefined) {
                          //   window.scrollTo(
                          //     0,
                          //     window.pageYOffset +
                          //       $(
                          //         selector_for_validclass
                          //       )[0].getBoundingClientRect().top -
                          //       350
                          //   );
                          // }
                          $(".loading_w_scl").addClass("failed-scl");
                          setTimeout(() => {
                            $(".failed-scl").removeClass("loading_w_scl");
                          }, 500);
                          setTimeout(() => {
                            $this.checkValidUsers(
                              randomDelay,
                              limit_req,
                              keywordTypeValue,
                              negative_keyword,
                              countryvalue,
                              totalGroupMembers,
                              gender,
                              message_id,
                              search_index_value
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
                      message_id,
                      search_index_value
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
                message_id,
                search_index_value
              );
            }, 4000);
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
                message_id,
                search_index_value
              );
            }, 4000);
          } else {
            console.log("stooped");
            $("#loop1").text(loop1);
            $("#stop_run").text("STOPPED");
            $(".loading").remove();
            $("h3.title_lg").text("Limit Exceed");
          }
        }
      }
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
  };
  AddTargetFriendNV.initilaize();
})(jQuery);
