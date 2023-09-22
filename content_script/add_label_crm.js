/*
* 
* AddLabelCRM Javascript
* 
* @since 1.2.0
* 
*/
let AddLabelCRM;
(function ($) {
    let $this;
    var tags_fetch_data = [];
    var selected_tags_ids = [];
    let selected_primary_ids = [];
    var options2 = '';
    let primary = '';
    let userTagsArray = [];
    selector_members_list = '';
    AddLabelCRM = {
        settings: {},
        initilaize: function () {
            $this = AddLabelCRM;
            $(document).ready(function () {
                $this.onInitMethods();
            });
        },
        onInitMethods: function () {
            $("body").append(`
                    <div class="hide-by-escape" id="overlay-assign-labels">
                        <div id="container_assign_labels">
                            <div id="content-assign-labels" class="novalya-row"></div>
                        </div>
                    </div>`);
            $this.taggeduserapi();
            selector_members_list = $this.messengersMembersListSelector();
            setTimeout(function () {
                processing = false;
                chrome.runtime.sendMessage({ action: "userCRMPermission" }, (res18) => {

                    if (res18.data.crm_status == 'On') {
                        // ADD LABEL IN MESSENGERS.COM
                        console.log(res18.data);
                        $this.messengersCom();
                        $this.messageComHeader();
                        $this.facebookChats();
                        $this.currentProfile();
                    }
                });
            }, 1500);

            chrome.runtime.sendMessage({ action: "tagsApiCall" }, (res50) => {
                console.log(res50);
                tags_fetch_data = res50.data;
                //console.log(res50);
                //console.log(tags_fetch_data);
                options2 = '<option value="">Select Primary</option>';
                if (tags_fetch_data.length > 0) {
                    tags_fetch_data.forEach((tag) => {
                        if (tag.name !== 'Unlabeled') {
                            options2 += `<option value="${tag.id}">${tag.name}</option>`;
                        }
                    });
                }
            });

            $(document).on('click', '.close-model', function () {
                $('#overlay-assign-labels').hide();
                selected_tags_ids = [];
                selected_primary_ids = [];
                // $('#chatsilo_model_two').removeClass('notes-modal')
            });

            $(document).on('click', 'li', function () {
                //console.log("li clicked");
                // Check if the click occurred on the actual <li> element and not on its children

                // Toggle the checkbox inside the <li>
                const checkbox = $(this).find(".multi-label-checkbox");
                checkbox.prop('checked', !checkbox.prop('checked'));

            });


            $(document).on('click', '.multi-label-checkbox', function (event) {
                //console.log("checkbox clicked");
                const checkbox = $(this);
                checkbox.prop('checked', !checkbox.prop('checked'));
            });

            $(document).on('change', '#mySelect', function () {
                var selectedValue = $(this).val();
                // console.log(selectedValue);

                $('.multi-label-checkbox').each(function () {
                    var checkboxValue = $(this).val();
                    //console.log(checkboxValue);

                    // Check the checkbox if its value matches the selected value, otherwise uncheck it
                    if (checkboxValue === selectedValue) {
                        $(this).prop('checked', true);

                    }
                });
            });

            $(document).on('click', '.tags-assigning-update', function () {
                // console.log("click selectbox");
                selected_tags_ids = [];
                selected_tags_ids2 = [];
                $('.multi-label-checkbox:checked').each(function () {
                    // Get the value of the checked checkbox and add it to the array
                    selectedTagId = $(this).parents('li').attr('tag-id');
                    selected_tags_ids.push(selectedTagId);
                    // console.log(selected_tags_ids, selectedTagId);
                });

                var selectedOption = $('#mySelect').val();
                // console.log(selected_tags_ids);
                // console.log(selectedOption.toString());

                if (selected_tags_ids.length > 1 && selectedOption == '') {
                    toastr["error"]("Please select the primary Label");
                } else {
                    if (selected_tags_ids.length == 0) {
                        selectedOption = 0;
                    }
                    else if (selected_tags_ids.length === 1) {
                        //console.log("inside the condition ");
                        // console.log(selected_tags_ids[0]);
                        $('#mySelect').val(selected_tags_ids[0]);

                    }
                    else if (!selected_tags_ids.includes(selectedOption)) {

                        $('#mySelect').val('');
                        toastr["error"]("Please select the primary Lable");
                        return false;
                    }

                    var fbName = $(this).attr("fbname");

                    var profilePic = $(this).attr("profilepic");
                    var fb_user_id = $(this).attr("fb_user_id");

                    $('.multi-label-checkbox:checked').each(function () {
                        // Get the value of the checked checkbox and add it to the array
                        selectedTagId2 = $(this).parents('li').attr('tag-id');
                        selected_tags_ids2.push(selectedTagId2);
                        //console.log(selected_tags_ids2, selectedTagId2);
                    });
                    var selectedOption2 = $('#mySelect').val();
                    const message = {
                        action: "tagsAssiging",
                        fbName: fbName,
                        profilePic: profilePic,
                        fb_user_id: fb_user_id,
                        selected_tags_ids: selected_tags_ids2,
                        is_primary: selectedOption2
                    };

                    chrome.runtime.sendMessage(message, (response) => {
                        // var parsedData = JSON.parse(response.data);
                        // var message = parsedData.msg;
                        // toastr["success"]('User Update Succesfully');
                        // $this.taggeduserapi();
                        // selector_members_list = $this.messengersMembersListSelector();
                        // $this.messengersCom();
                        // $('.hide-by-escape').hide();
                        // var currentLocationUrl = window.location.origin;
                        // chrome.runtime.sendMessage({ action: "Reload_all_novalya_tabs", currentLocationUrl: currentLocationUrl });
                    });


                }

            });

            $(document).on('click', '.add-button-container', async function (event) {
                event.preventDefault();
                event.stopPropagation();
                var fbName = '';
                var profilePic = '';
                var fb_user_id = '';
                fbName = $(this).parent().parent().find('img').attr('alt');
                if (fbName === "" || fbName == undefined) {
                    if ($('div[role="main"]').find('a').first().attr('aria-label') === "Link to open profile cover photo") {
                        fbName = $('div[role="main"] span.x1xmvt09.x1lliihq.x1s928wv h1').text();
                    } else {
                        fbName = $(this).closest('div[aria-label="Chat settings"]').find('h2').find('span:last').text();
                        if (fbName == undefined || fbName == '') {
                            fbName = $(this).closest('div[aria-label="chat settings"]').find('h2').find('span:last').text();
                        }
                        if (fbName == '') {
                            fbName = $(this).parent().find('h1').find('span:last').text();
                        }
                    }
                }

                profilePic = $(this).parent().parent().find('img').attr('src');
                if (profilePic === "" || profilePic == undefined) {
                    profilePic = '';
                }
                fb_user_id = $(this).parent().attr("fb_user_id");
                if (fb_user_id == "" || fb_user_id == undefined) {
                    if ($(".x1u998qt").find('a').attr('href') !== undefined) {
                        fb_user_id = $(".x1u998qt").find('a').attr('href').split('/')[3];
                    } else {
                        var currentWindowUrl = window.location.search;
                        if (currentWindowUrl !== "") {
                            var match = currentWindowUrl.match(/\?id=(\d+)/);
                            fb_user_id = match ? match[1] : null;
                        } else {
                            var currentWindowUrl2 = window.location.pathname;
                            fb_user_id = currentWindowUrl2.replace(/^\/|\/$/g, '');

                        }
                    }
                }
                //console.log(fb_user_id);
                chrome.runtime.sendMessage({ action: "single_users_tag_get", fb_user_id: fb_user_id }, (response) => {
                    if (response != undefined && response != '') {
                        var tag_data_individual = JSON.parse(response);

                        //var tag_data_individual = response;
                        tag_data_individual = tag_data_individual.data;
                        console.log(tag_data_individual);
                        tag_data_individual = tag_data_individual[tag_data_individual.length - 1];
                        console.log(tag_data_individual);
                        if (tag_data_individual != undefined && tag_data_individual != '' && tag_data_individual != null) {
                            primary = tag_data_individual.is_primary;
                            var arrayOfIds = tag_data_individual.tag_id;
                            // var arrayOfIds = tag_data_individual.tags.map(function (obj) {
                            //     console.log(obj)
                            //     return obj;
                            // });
                        }

                        var checkMultiple = setInterval(() => {
                            if ($('.multi-label-checkbox').length > 0) {
                                clearInterval(checkMultiple);
                                $('.multi-label-checkbox').each(function () {
                                    var checkboxValue = $(this).parents('li').attr('tag-id'); // Get the value of the checkbox

                                    // Check if the checkbox value exists in the valuesArray
                                    if (arrayOfIds != undefined && arrayOfIds.includes(checkboxValue)) {
                                        $(this).prop('checked', true); // Check the checkbox
                                    }
                                });
                            }
                        }, 1000);
                    }
                    $('#mySelect option').each(function () {
                        if (primary && $(this).val() == primary) {
                            $(this).attr('selected', 'selected');
                        }
                        else {
                            //console.log($(this).val());
                        }
                    });
                });

                var options = `
                <div class="row novalya-row modal-heading">
                    <div class="label-name">` + fbName + `</div>
                    <div class="close-model">X</div>
                </div>
                <div class = "primary_dropdown">
                <label for="mySelect">Select Primary:</label>                 
                <select id="mySelect"> ${options2}</select>
                </div>
                <div class="row novalya-row"> 
                    <div class="labels-list-container">
                        <ul class="model-labels-list novalya-scroll">`;

                for (i = 0; i < tags_fetch_data.length; i++) {
                    var style = '';
                    style = `style = "background:` + tags_fetch_data[i].custom_color + ` !important"`;
                    options += `
                                <li ` + style + `color-code= '` + tags_fetch_data[i].custom_color + `' class='label-text-color' for="myCheckbox${i}"  tag-id='` + tags_fetch_data[i].id + `'`;
                    options += `><input class = 'multi-label-checkbox' value = ` + tags_fetch_data[i].id + ` type='checkbox' id ="myCheckbox${i}">
                                    <div class='label-text-name'>` + tags_fetch_data[i].name + `</div>  
                                </li>`;
                }
                options += `
                        </ul>
                        <button fbName = "${fbName}" profilePic = "${profilePic}" fb_user_id = "${fb_user_id}"  type="button" class="novalya-btn novalya-btn-primary tags-assigning-update" >Update Tag</button>
                    </div>`;
                $('#content-assign-labels').html(options);
                $('#overlay-assign-labels').show();

            });

            // $(document).on('click','span:contains("Search messages for")',function(){
            //     console.log('Search messages for');
            //     selector_members_list = 'div[role="navigation"] div[role="grid"] div[role="row"]';
            //     //console.log(selector_members_list);
            // });

        },
        sendMessageforSingleUsers: function (fb_user_id) {

            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: "single_users_tag_get", fb_user_id: fb_user_id }, (response) => {
                    resolve(response);
                });
            });

        },
        messengersCom: function () {
            console.log('messengersCom');
            selector_parent_of_contacts_list = 'div[aria-label="Chat settings"]';
            clearMessageInt = setInterval(function () {

                chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {
                    var authToken = res16.authToken;
                    if (authToken != 0 && authToken != "") {
                        var selector_search_list = 'div[role="navigation"] div[role="grid"] div[role="row"]';
                        if ($(selector_search_list).length > 0) {
                            selector_members_list = selector_search_list
                        }
                        // console.log($(selector_members_list));
                        if ($(selector_members_list).length > 0 && window.location.origin.indexOf('messenger') > -1) {
                            //console.log("hello running")
                            processing = true;
                            var add_label_button = '<div class="add-button-container"><span class="add-icon">+</span>';

                            //ADD LABEL BUTTON ON EVERY MEMBERS BEHIND
                            // console.log(selector_members_list);
                            $(selector_members_list).each(function (index) {
                                $(this).addClass('processed-member-to-add');
                                var fb_user = '';
                                currentWindowUrl = window.location.origin;
                                if (typeof $(this).find('a:eq(0)').attr('href') != 'undefined') {
                                    fb_user = $(this).find('a:eq(0)').attr('href').split('/t/')[1];

                                    if (fb_user != undefined && fb_user != '' && fb_user.indexOf('?') > -1) {
                                        fb_user = fb_user.split('?')[0];
                                    }
                                    if (fb_user != '' && fb_user != undefined) {
                                        fb_user = fb_user.replace('/', '');
                                    }
                                } else {
                                    //console.log('fb id not found');
                                }

                                // console.log(fb_user);
                                if (fb_user != '' && fb_user != undefined) {
                                    if ($(this).find('div.add-button-container').length > 0) {
                                        $(this).find('div.add-button-container').remove();

                                    }
                                    $(this).attr('fb_user_id', fb_user);
                                    $(this).append(add_label_button);
                                }
                                //console.log(userTagsArray);
                                userTagsArray.forEach((item) => {
                                    if (fb_user === item.fb_user_id) {

                                        const filteredTags = item.tags.filter(tag => tag.id === item.primary_tag);
                                        if (filteredTags.length > 0) {
                                            var style = `background-color: ${filteredTags[0].custom_color} !important;`;

                                            let add_tag_button = `<div class="add-button-container" style="${style}"><span class="add-icon" style="${style}">${filteredTags[0].name}</span>`;
                                            $(this).append(add_tag_button);
                                        }
                                    }
                                })
                            });
                        }
                        if (window.location.origin.indexOf('facebook') > -1) {

                            // var spanTagCurrentProfile = '<div class="validlogin current-user-profile-parent tags-container chatsilo-tags-container"><span class="bg-muted current-user-profile chatsilo-selected-tag">+</span>';
                            // spanTagCurrentProfile += '</div>';
                            //$('#fbTimelineHeadline ul[data-referrer="timeline_light_nav_top"] li:last').append(spanTagCurrentProfile);

                            processing = true;
                            var add_label_button = '<div class="add-button-container contact-pop-up-chat-window"><span class="add-icon">+</span>';

                            //ADD LABEL BUTTON ON EVERY MEMBERS BEHIND

                            $(selector_parent_of_contacts_list).each(function (index) {
                                console.log("hello running facebook")
                                $(this).addClass('cts-message-thread-id-1');
                                var fb_user = '';
                                currentWindowUrl = window.location.origin;

                                if (typeof $(this).find('a:eq(0)').attr('href') != 'undefined') {
                                    fb_user = $(this).find('a:eq(0)').attr('href').split('/')[1];
                                    // console.log(fb_user);
                                    if (fb_user.indexOf('?') > -1) {
                                        fb_user = fb_user.split('?')[0];
                                    }
                                    // console.log(fb_user);
                                    fb_user = fb_user.replace('/', '');
                                    // console.log(fb_user);
                                } else {
                                    //console.log('fb id not found');
                                }
                                // console.log('fb_user - ',fb_user);
                                if (fb_user != '') {
                                    // console.log(fb_user);
                                    if ($(this).find('div.add-button-container').length > 0) {
                                        $(this).find('div.add-button-container').remove();

                                    }
                                    $(this).attr('fb_user_id', fb_user);
                                    $(this).append(add_label_button);
                                }

                                console.log(userTagsArray);
                                userTagsArray.forEach((item) => {
                                    if (fb_user === item.fb_user_id) {
                                        const filteredTags = item.tags.filter(tag => tag.id === item.primary_tag);
                                        console.log(filteredTags);

                                        if (filteredTags.length > 0) {

                                            var style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                            let add_tag_button = `<div class="add-button-container contact-pop-up-chat-window" style="${style}"><span class="add-icon" style="${style}">${filteredTags[0].name}</span>`;
                                            $(this).append(add_tag_button);
                                        }

                                    }
                                })
                            });
                        }
                        //clearInterval(clearMessageInt);
                    } else {
                        console.log('userid not found');
                        clearInterval(clearMessageInt);
                    }
                });
            }, 1000)
        },
        facebookChats: function () {
            var clearMessageInt = setInterval(function () {
                chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {
                    var user_id = res16.user_id;
                    if (user_id != 0 && user_id != "") {
                        if ($(selector_members_list).length > 0 && window.location.origin.indexOf('facebook') > -1) {
                            // console.log("hello running")
                            processing = true;
                            var add_label_button = '<div class="add-button-container"><span class="add-icon">+</span>';

                            //ADD LABEL BUTTON ON EVERY MEMBERS BEHIND
                            $(selector_members_list).each(function (index) {
                                $(this).addClass('processed-member-to-add');
                                var fb_user = '';
                                currentWindowUrl = window.location.origin;
                                if (typeof $(this).find('a:eq(0)').attr('href') != 'undefined') {
                                    fb_user = $(this).find('a:eq(0)').attr('href').split('/t/')[1];

                                    if (fb_user.indexOf('?') > -1) {
                                        fb_user = fb_user.split('?')[0];
                                    }
                                    fb_user = fb_user.replace('/', '');
                                } else {
                                    //console.log('fb id not found');
                                }

                                // console.log(fb_user);
                                if (fb_user != '') {
                                    if ($(this).find('div.add-button-container').length > 0) {
                                        $(this).find('div.add-button-container').remove();
                                    }
                                    $(this).attr('fb_user_id', fb_user);
                                    $(this).append(add_label_button);
                                }

                                userTagsArray.forEach((item) => {
                                    if (fb_user === item.fb_user_id) {
                                        const filteredTags = item.tags.filter(tag => tag.id === item.primary_tag);
                                        //  console.log(filteredTags);

                                        if (filteredTags.length > 0) {
                                            var style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                            let add_tag_button = `<div class="add-button-container" style="${style}"><span class="add-icon" style="${style}">${filteredTags[0].name}</span>`;
                                            $(this).append(add_tag_button);
                                        }
                                    }
                                })
                            });
                        }

                    }
                    else {
                        console.log('userid not found');
                        clearInterval(clearMessageInt);
                    }

                })
            }, 1000)

        },
        messageComHeader: function () {
            var clearMessageInt = setInterval(() => {
                chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {
                    var user_id = res16.user_id;
                    if (user_id != 0 && user_id != "") {
                        var add_label_button = '<div class="add-button-container header_button"><span class="add-icon">+</span>';
                        setTimeout(() => {
                            var fb_user = '';
                            currentWindowUrl = window.location.origin;
                            if (typeof $(".x1u998qt").find('a').attr('href') != 'undefined') {
                                fb_user = $(".x1u998qt").find('a').attr('href').split('/')[3];
                            } else {
                                //  console.log('fb id not found');
                            }

                            // console.log(fb_user);

                            if (fb_user != '') {
                                if ($('.x1u998qt').find('div.header_button').length > 0) {
                                    $('.x1u998qt').find('div.header_button').remove();
                                }
                                $('x1u998qt').attr('fb_user_id', fb_user);
                            }
                             
                             let filteredTags = userTagsArray
                                .filter(item => fb_user === item.fb_user_id)
                                .map(item => item.tags.find(tag => tag.id === item.primary_tag)).filter(Boolean); 
                            // console.log(filteredTags);
                            if (filteredTags.length > 0) {
                                const style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                const addTagButton = `
                                                <div class="add-button-container header_button" style="${style}">
                                                    <span class="add-icon" style="${style}">${filteredTags[0].name}</span>
                                                </div>`;
                                $(".x1u998qt a").append(addTagButton);
                            } else {
                                $(".x1u998qt a").append(add_label_button);
                            }
                        }, 2000);
                    }
                    else {
                        console.log('userid not found');
                        clearInterval(clearMessageInt);
                    }
                });
            }, 1000);
        },
        currentProfile: function () {
            var clearMessageInt = setInterval(() => {
                chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {
                    var user_id = res16.user_id;
                    if (user_id != 0 && user_id != "") {
                        var add_label_button = '<div class="add-button-container "><span class="add-icon">+</span>';
                        setTimeout(() => {
                            var fb_user = '';
                            currentWindowUrl = window.location.search;
                            if (currentWindowUrl !== "") {
                                var match = currentWindowUrl.match(/\?id=(\d+)/);
                                fb_user = match ? match[1] : null;
                            } else {
                                var currentWindowUrl2 = window.location.pathname;
                                //fb_user = currentWindowUrl2.replace(/^\/|\/$/g, '');
                                fb_user = currentWindowUrl2.replace('/t/', '');
                            }
                            if (fb_user != '' && fb_user != null) {
                                fb_user = fb_user.replace(/\//g, '');
                            }

                            if (fb_user != '' && fb_user != null) {
                                if ($('div[data-pagelet="ProfileTabs"]').find('div.add-button-container').length > 0) {
                                    $('div[data-pagelet="ProfileTabs"]').find('div.add-button-container').remove();
                                }
                                $('div[data-pagelet="ProfileTabs"]').append(add_label_button);
                            }
                            userTagsArray.forEach((item) => {
                                if (fb_user === item.fb_user_id) {
                                    const filteredTags = item.tags.filter(tag => tag.id === item.primary_tag);
                                    if (filteredTags.length > 0) {
                                        var style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                        let add_tag_button = `<div class="add-button-container" style="${style}"><span class="add-icon" style="${style}">${filteredTags[0].name}</span>`;
                                        $('div[data-pagelet="ProfileTabs"]').append(add_tag_button);
                                    }
                                }
                            })
                        }, 2000);
                    } else {
                        console.log('userid not found');
                        clearInterval(clearMessageInt);
                    }
                });
            }, 1000);

        },
        messengersMembersListSelector: function () {

            var selector_latest = 'div[aria-label="Chats"][role="grid"] div[role="row"]';
            var selector_clist1 = 'div[data-testid="mwthreadlist-item"]';
            var selector_clist2 = 'div[aria-label="Chats"][role="grid"] div[role="row"]';
            var selector_clist3 = 'div[aria-label][role="grid"].x78zum5 div[role="row"]';



            if ($(selector_clist1).length > 0) {
                selector_latest = selector_clist1
            }

            if ($(selector_clist2).length > 0) {
                selector_latest = selector_clist2
            }

            if ($(selector_clist3).length > 0) {
                selector_latest = selector_clist3
            }
            console.log(selector_latest);
            return selector_latest;
        },
        taggeduserapi: function () {

            chrome.runtime.sendMessage({ action: "all_users_tag_get" }, (response) => {
                let all_users_tag_get = response.data;
                userTagsArray = [];
                if (all_users_tag_get.length > 0) {
                    for (let i = 0; i < all_users_tag_get.length; i++) {
                        const userData = all_users_tag_get[i];
                        const fbUserId = userData.fb_user_id;
                        const primary_tag = userData.is_primary;
                        const tags = userData.tags;
                        userTagsArray.push({
                            fb_user_id: fbUserId,
                            tags: tags,
                            primary_tag: primary_tag
                        });
                    }
                }
                else {
                    userTagsArray = [];
                }
            });
        }
    };
    AddLabelCRM.initilaize();
})(jQuery);