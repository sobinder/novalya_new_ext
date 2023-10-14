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
    let listItems = [];
    let cheight = 600;
    let loader = `<div id="overlay" class="overlay">
                                    <div class="loader">
                                        <img src="${chrome.runtime.getURL('assets/images/loading-forever.gif')}" alt="Scroll Contacts" width="50" height="50">
                                    </div>
                                </div>`;
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

            $(document).on('click', 'ul.model-labels-list input[type="checkbox"]', function() {      
                $('ul.model-labels-list input[type="checkbox"]').not(this).prop('checked', false);      
            });

            selector_members_list = $this.messengersMembersListSelector();
            setTimeout(function () {
                processing = false;
                chrome.runtime.sendMessage({ action: "userCRMPermission" }, (res18) => {

                    if (res18.data.crm_status == 'On') {
                        // ADD LABEL IN MESSENGERS.COM
                        //console.log(res18.data);
                        $this.messengersCom();
                        $this.messageComHeader();
                        $this.facebookChats();
                        $this.currentProfile();
                    }
                });
            }, 1500);

            chrome.runtime.sendMessage({ action: "tagsApiCall" }, (res50) => {
               // console.log(res50);
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
                        setTimeout(()=>{ 
                            const selectedTag = $('.selected-tag').attr('tag-id');
                            if(selectedTag!= '' && selectedTag != undefined){
                                const rowToScroll = document.querySelector('div[aria-label="Chats"][role="grid"] div[role="row"].processed-member-to-add');
                                if(rowToScroll){
                                    $('#overlay').show();
                                  
                                   $('.x1n2onr6').animate(
                                        { scrollTop: $('.x1n2onr6').scrollTop() + cheight },
                                        1000
                                    );
                                    setTimeout(()=>{
                                        $('.x1n2onr6').animate({ scrollTop: 0 }, 1000);
                                        $('#overlay').hide();
                                    },1500);  
                                }
                            }
                        },1000);
                        
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

            $(document).on('click','.message_div_icon', async function(){
                alert('here');
                event.preventDefault();
                event.stopPropagation();
                let templateArray = [];
                templateArray = ["hi","hello","Good Morning","Namaste"];
               
                let tagId = '';
            })

            //Open notes popup
            $(document).on('click', '.notes_div_icon', async function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log("notes clicked");
                try {
                    const cliked_Fb_Id = await $this.getClikedFbId();
                    const notesModal = $this.createNotesModal(cliked_Fb_Id);
                    $('body').append($(notesModal));
                    const res = await $this.getNotesData(cliked_Fb_Id);
                    const filteredArray = res.api_data.filter(item => item.user_id == res.user_id && item.fb_user_id == cliked_Fb_Id);
                    $this.updateNotesContainer(filteredArray);
                    $('#notes-modal').css('display', 'block');
                } catch (error) {
                    console.error(error);
                }
            });

            // Edit the notes
            $(document).on('click', '.edit-icon', function () {
                // Get the parent row of the clicked edit icon
                var noteItem = $(this).closest('.row');

                // Find the '.editable_notes' span and '.editable_input' input field within the same row
                var editableNotes = noteItem.find('.editable_notes');
                var getSpanVal = editableNotes.text();
                var editableInput = noteItem.find('.editable_input');

                // Set the input field's value to the current text of editable_notes
                editableInput.val(getSpanVal);

                // Hide the span and show the input field
                editableNotes.hide();
                editableInput.show().focus();

                // Hide the clicked edit icon and show the save icon within the same row
                noteItem.find('.edit-icon').hide();
                noteItem.find('.save-icon').show();
            });

            //It is used to delete the note (deletion)
            $(document).on('click', '.delete-icon', function () {
                // Find the closest '.notes_container row' and remove it
                var note_id = $(this).closest(".row").find('.editable_input').attr("note_id");
                chrome.runtime.sendMessage({ action: "delete_note", note_id: note_id }, (res) => {
                    console.log(res);
                    if (res.status == "note deleted") {
                        toastr["success"]('Note Deleted successfully');
                        $(this).closest('.notes_container.row').remove();
                    } else {
                        toastr["error"]('Error in Deleting Notes');
                    }
                });

            });

            // To save the updated data of notes (update)
            $(document).on('click', '.save-icon', function () {
                var pathname = window.location.href.toString();
                var cliked_Fb_Id = '';
                if (pathname.indexOf('profile.php') > -1) {
                    cliked_Fb_Id = (new URL(document.location)).searchParams.get('id');

                } else if (window.location.pathname.indexOf('/friends') == -1) {
                    cliked_Fb_Id = window.location.pathname.split('/')[2];
                }
                var noteItem = $(this).closest('.row');
                var editableNotes = noteItem.find('.editable_notes');
                var editableInput = noteItem.find('.editable_input');

                var updated_note = editableInput.val();
                var note_id = editableInput.attr("note_id");
                if (updated_note == "") {
                    toastr["error"]('Please enter some Text');
                    return false;
                }
                chrome.runtime.sendMessage({ action: "edit_notes", fb_user_id: cliked_Fb_Id, description: updated_note, note_id: note_id }, (res) => {
                    console.log(res);
                    if (res.status == "note updated") {
                        toastr["success"]('Note Updated successfully');

                        chrome.runtime.sendMessage({ action: "get_all_notes" }, (res) => {
                            var all_data_array = res.api_data;
                            filteredArray = all_data_array.filter(item =>item.id == note_id);
                            console.log(filteredArray[0].updatedAt);
                            var date_time =  new Date(filteredArray[0].updatedAt);
                            var date =  `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()} `;
                            var time = `${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`;
                            var newdate = $(this).closest('.row').find('.date_time').text(`${date} ${time}` )
                            editableNotes.text(editableInput.val());

                        });
                    } else {
                        toastr["error"]('Some Error in Updating notes');
                    }
                })


                editableInput.hide();
                editableNotes.show();
                $(".edit-icon").show();
                $(".save-icon").hide();
            });

            $(document).on('click', '.close', function () {
                $('#notes-modal').css('display', 'none');
                $(".notes_container").remove();
            });

            //add notes
            $(document).on('click', '#add-button', function () {
                const notes = $('#notes-textarea').val();
                var pathname = window.location.href.toString();
                var cliked_Fb_Id = '';
                if (pathname.indexOf('profile.php') > -1) {
                    cliked_Fb_Id = (new URL(document.location)).searchParams.get('id');

                } else if (window.location.pathname.indexOf('/friends') == -1) {
                    if (window.location.pathname.indexOf('/t/') > 0) {
                        cliked_Fb_Id = window.location.pathname.split('/t/')[1];
                    } else {
                        cliked_Fb_Id = window.location.pathname.split('/')[2];
                    }


                    if(cliked_Fb_Id === undefined){
                        var alphaFbId = window.location.pathname.split('/')[1].toString();
                        console.log(alphaFbId);
                        getNumericID(alphaFbId)
                        .then(function(response) {
                           console.log(response.userID);
                           cliked_Fb_Id = response.userID;
                           if (notes == "") {
                            toastr["error"]('Please Enter Some Text');
                            return false;
                        }
                        chrome.runtime.sendMessage({ action: "add_Notes", description: notes, fb_user_id: cliked_Fb_Id }, (res) => {
                            console.log(res.result.updatedAt);
                            var date_time =  new Date(res.result.updatedAt);
                            var date =  `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()} `;
                            var time = `${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`;
        
                            if (res.status == 'note added') {
                                toastr["success"]('Note added successfully ');
                                var new_notes_container = `<div class="notes_container row">
                                <div class="note-item note_id=${res.result.id} row" >
                                    <span class="editable_notes">${notes}</span>
                                    <input class="editable_input" note_id=${res.result.id} type="text" style="display:none;">
                                    
                                </div>
                                <div class="date_time_div">
                                   <span class="date_time">${date} ${time}</span>
                                </div>  
                                <div class="icons_div">
                                    <span class="edit-icon">&#9998;</span> <!-- Edit icon -->
                                    <span class="save-icon" style="display:none;">&#128190;</span> <!-- Save icon -->
                                    <span class="delete-icon red-trash">🗑️</span> <!-- Delete icon -->
                                </div>                       
                                                        
                                <!-- Repeat this structure for other notes -->
                            </div>`;
                                // Append the new note-item and icons_div to the notes_container_div
                                $('.notes_container_div').prepend(new_notes_container);
                            } else {
                                toastr["error"]('Some Error in adding notes');
                            }
                        });

                        })
                        .catch(function(response) {
                            console.log("error to find fb id");
                        });
                 return false;
                    }




                }
                if (notes == "") {
                    toastr["error"]('Please Enter Some Text');
                    return false;
                }
                chrome.runtime.sendMessage({ action: "add_Notes", description: notes, fb_user_id: cliked_Fb_Id }, (res) => {
                    console.log(res.result.updatedAt);
                    var date_time =  new Date(res.result.updatedAt);
                    var date =  `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()} `;
                    var time = `${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`;

                    if (res.status == 'note added') {
                        toastr["success"]('Note added successfully ');
                        var new_notes_container = `<div class="notes_container row">
                        <div class="note-item note_id=${res.result.id} row" >
                            <span class="editable_notes">${notes}</span>
                            <input class="editable_input" note_id=${res.result.id} type="text" style="display:none;">
                            
                        </div>
                        <div class="date_time_div">
                           <span class="date_time">${date} ${time}</span>
                        </div>  
                        <div class="icons_div">
                            <span class="edit-icon">&#9998;</span> <!-- Edit icon -->
                            <span class="save-icon" style="display:none;">&#128190;</span> <!-- Save icon -->
                            <span class="delete-icon red-trash">🗑️</span> <!-- Delete icon -->
                        </div>                       
                                                
                        <!-- Repeat this structure for other notes -->
                    </div>`;
                        // Append the new note-item and icons_div to the notes_container_div
                        $('.notes_container_div').prepend(new_notes_container);
                    } else {
                        toastr["error"]('Some Error in adding notes');
                    }
                });
                // Clear the textarea and close the modal
                $('#notes-textarea').val('');

            });

            $(document).on('click', '.add-button-container', async function (event) {
                event.preventDefault();
                event.stopPropagation();
                var fbName = '';
                var profilePic = '';
                var fb_user_id = '';
                fbName = await $this.findName.call(this);
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
                if(fb_user_id == undefined){
                    fb_user_id =  await $this.getClikedFbId();
                }
                chrome.runtime.sendMessage({ action: "single_users_tag_get", fb_user_id: fb_user_id }, (response) => {
                    if (response != undefined && response != '') {
                        var tag_data_individual = JSON.parse(response);
                        //var tag_data_individual = response;
                        tag_data_individual = tag_data_individual.data;
                        tag_data_individual = tag_data_individual[tag_data_individual.length - 1];
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
                                    // console.log(arrayOfIds);
                                    // console.log(checkboxValue);
                                    // Check if the checkbox value exists in the valuesArray
                                    if (arrayOfIds != undefined && arrayOfIds.includes(checkboxValue)) {
                                        $(this).prop('checked', true); // Check the checkbox
                                    }
                                });
                            }
                        }, 1000);
                    }
                    $('#mySelect option').each(function () {
                        // console.log('primary ',primary);
                        // console.log($(this).val());
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

            //Messenger filter function 
            if (window.location.href.indexOf('messenger.com') > -1 || window.location.href.indexOf('facebook.com/messages/') > -1) {
                var appendSortBtn = setInterval(() => {
                    const h1Element = $('h1:containsI("chats")');
                    if (h1Element.length > 0 && tags_fetch_data.length > 0) {
                        clearInterval(appendSortBtn);
                        let url = chrome.runtime.getURL("assets/image/filter.png");
                        let ddownhtml = `<div class="dropdown custom-filter">
                                            <button class="dropbtn custom-drop"><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z" fill="currentColor"/><path d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z" fill="currentColor"/><path d="M5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H5Z" fill="currentColor"/></svg> Menu</button>
                                            <ul id="myDropdown" class="dropdown-content">
                                                <li class="filter_heading"><svg enable-background="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M29.815,6.168C29.484,5.448,28.783,5,27.986,5H4.014c-0.797,0-1.498,0.448-1.83,1.168  c-0.329,0.714-0.215,1.53,0.297,2.128c0,0,0.001,0.001,0.001,0.001L12,19.371V28c0,0.369,0.203,0.708,0.528,0.882  C12.676,28.961,12.838,29,13,29c0.194,0,0.387-0.057,0.555-0.168l6-4C19.833,24.646,20,24.334,20,24v-4.629l9.519-11.074  C30.031,7.698,30.145,6.882,29.815,6.168z" id="XMLID_276_"/></svg>  Filter </li>
                                                <li class="filter_text">
                                                <a id="sort-by-group">By group</a>
                                                    <ul id="submenu" class="custom-scroll">`

                        for (i = 0; i < tags_fetch_data.length; i++) {
                            var style = '';
                            style = `style = "background:` + tags_fetch_data[i].custom_color + ` !important"`;

                            ddownhtml += ` <li ` + style + `color-code= '` + tags_fetch_data[i].custom_color + `' class='label-text-color sortByTag' for="myCheckbox${i}"  tag-id='` + tags_fetch_data[i].id + `'`;
                            ddownhtml += `>${tags_fetch_data[i].name}</li>`;
                        }
                        ddownhtml += `</ul>
                                            </li>
                                            <li class="filter_text"><a id="unread">Unread</a></li>
                                            <li class="filter_text"><a id="last_reply">Last Reply</a></li>
                                        </ul>
                                    </div>`;

                        // Create a jQuery element from the HTML
                        const dropdownMenuElement = $(ddownhtml);
                        // Append the dropdown menu after the first <h1> element
                        const parentElement = h1Element.first().parent().parent().parent().parent().parent().parent().parent().parent().parent();
                        parentElement.append(dropdownMenuElement);
                    }
                }, 2000);
            };

            $(document).on("click", '.dropbtn', function () {
                document.getElementById("myDropdown").classList.toggle("show");
                let submenu = document.getElementById("submenu");
                if (submenu) {
                    submenu.style.display = "none";
                }
            });

            $(document).on('click', '#sort-by-group', function () {
                console.log('here');
                $('#submenu').toggle();
            });

            $(document).on('click', '.sortByTag', async function () {
                const id = $(this).attr('tag-id');
                const name = $(this).text().trim();
                if (listItems.length > 0) {
                    await $this.revertFilter();
                }
            
                const spanElement = `
                    <div id="filter-message">
                        <p>Message</p>
                        <div>
                            <span class="close-icon selected-tag" tag-id="${id}">
                                ${name}
                            </span>
                            <span class="close-by-group">X</span>
                        </div>
                    </div>`;
            
                const $filterMessage = $('#filter-message');
                
                if ($filterMessage.length === 0) {
                    // Append the filter message if it doesn't exist
                    $('.custom-filter').parent().append(spanElement);
                } else {
                    // Update the existing filter message
                    const $selectedTag = $('.selected-tag');
                    $selectedTag.attr('tag-id', id);
                    $selectedTag.text(name);
                }
        
                const scrollIntervalId = setInterval(()=>{
                    const rowToScroll = document.querySelector('div[aria-label="Chats"][role="grid"] div[role="row"].processed-member-to-add');
                    if(rowToScroll){
                        $('#overlay').show();
                        const parentContainer = rowToScroll.parentNode.parentNode;
                        const parentContainerClass = parentContainer.classList.value;
                        clearInterval(scrollIntervalId);
                        // let cheight = 600;
                        const maxIterations = 3;
                        let currentIteration = 0;
                        intervalId = setInterval(async() => {
                            $('#overlay').show();
                            currentIteration++;
                           // console.log(currentIteration);
                            $('.' + parentContainerClass).animate(
                                { scrollTop: $('.' + parentContainerClass).scrollTop() + cheight },
                                1000
                            );
                            cheight = cheight + 600;
                            await $this.sortMessengerComMembers(id);
                            if (currentIteration >= maxIterations) {
                              clearInterval(intervalId);
                              $('.' + parentContainerClass).animate({ scrollTop: 0 }, 1000);
                              setTimeout(()=>{
                                $('#overlay').hide();
                              },1000);
                            }
                        }, 2000);
                    }
                },2000);
                $this.closefilterAfterSelect();
            });
            
            $(document).on('click', '.close-by-group', function () {
                $this.revertFilter();
            });

            // Define a variable to store the previous event listener function
            let previousScrollListener;
            let prevScrollPos = 0;
            var scrollId = setInterval(() => {
                const targetDiv = document.querySelector('div.sort-by-selected-tag');
                if (targetDiv) {
                    targetParentDiv = targetDiv.parentNode;
                    // Remove the previous scroll event listener if it exists
                    if (previousScrollListener) {
                        targetParentDiv.removeEventListener('scroll', previousScrollListener);
                    }
                    clearInterval(scrollId);
                    // Define the new scroll event listener function
                    const scrollListener = function (event) {
                        let currentScrollPos = targetParentDiv.scrollTop;
                        if (prevScrollPos < currentScrollPos) {
                            let selectedTag = $('.selected-tag').attr('tag-id');
                            if (selectedTag) {
                                $this.sortMessengerComMembers(selectedTag);
                            }
                            if($('.selected-tag').text().trim() == 'Unread'){
                                $this.sortMemberUnread();
                            }
                            if($('.selected-tag').text().trim() == 'Last Reply'){
                                $this.sortMemberLastReply();
                            }
                        }
                        prevScrollPos = currentScrollPos;
                    };

                    // Add the new scroll event listener
                    targetParentDiv.addEventListener('scroll', scrollListener);
                    // Store the new event listener function as the previous one
                    previousScrollListener = scrollListener;  
                }
            }, 2000);

            // filter for unread
            $(document).on('click', '#unread',async function () {
                $this.handleFilterClick('Unread', $this.sortMemberUnread);
            });

            $(document).on('click','#last_reply',async function(){
                $this.handleFilterClick('Last Reply', $this.sortMemberLastReply);
            });
            
            //end messenger filter
        },
        sendMessageforSingleUsers: function (fb_user_id) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: "single_users_tag_get", fb_user_id: fb_user_id }, (response) => {
                    resolve(response);
                });
            });
        },
        messengersCom: function () {
            selector_parent_of_contacts_list = 'div[aria-label="Chat settings"]';
            clearMessageInt = setInterval(function () {
                chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {
                    var authToken = res16.authToken;
                    if (authToken != 0 && authToken != "") {
                        var selector_search_list = 'div[role="navigation"] div[role="grid"] div[role="row"]';
                       
                        if ($(selector_search_list).length > 0) {
                            selector_members_list = selector_search_list
                        }
                        if ($(selector_members_list).length > 0 && window.location.origin.indexOf('messenger') > -1) {
                            processing = true;
                            var add_label_button = '<div id="add-icon" class="add-button-container"><span class="add-icon" >+</span>';

                              
                            //ADD LABEL BUTTON ON EVERY MEMBERS BEHIND
                            $(selector_members_list).each(function (index) {
                                $(this).addClass('processed-member-to-add');
                                if ($('#overlay').length == 0) {
                                    $('div[aria-label][role="grid"] div[role="row"].processed-member-to-add:eq(0)').parent().parent().parent().addClass('sort-by-selected-tag');
                                    $('div[aria-label="Chats"]').prepend(loader);
                                } 
                                
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

                                if (fb_user != '' && fb_user != undefined) {
                                    if ($(this).find('div.add-button-container').length > 0) {
                                        $(this).find('div.add-button-container').remove();
                                    }
                                    $(this).attr('fb_user_id', fb_user);
                                    $(this).append(add_label_button);
                                }
                                userTagsArray.forEach((item) => {
                                    if (fb_user == item.fb_user_id) {
                                        const filteredTags = item.tags.filter(tag => tag.id == item.primary_tag);
                                        //console.log(filteredTags);
                                        if (filteredTags.length > 0) {
                                            //console.log('in')
                                            $(this).attr('tag-id', filteredTags[0].id)
                                            var style = `background-color: ${filteredTags[0].custom_color} !important;`;

                                            let add_tag_button = `<div class="add-button-container" style="${style}"><span class="add-icon" style="${style}">${filteredTags[0].name}</span>`;
                                            $(this).append(add_tag_button);
                                        }
                                    }
                                })
                            });
                        }
                        if (window.location.origin.indexOf('facebook') > -1) {  
                            processing = true;
                            var add_label_button = '<div id="add-icon" class="add-button-container contact-pop-up-chat-window"><span class="add-icon">+</span>';
                            //$(this).parents(".x164qtfw").prepend(add_label_button);
                            //ADD LABEL BUTTON ON EVERY MEMBERS BEHIND
                            $(selector_parent_of_contacts_list).parents(".x164qtfw>div").each(function (index) {
                                $(this).parents(".x164qtfw").addClass('cts-message-thread-id-1');
                                var fb_user = '';
                                currentWindowUrl = window.location.origin;

                                if (typeof $(this).find('a:eq(0)').attr('href') != 'undefined') {
                                    fb_user = $(this).find('a:eq(0)').attr('href').split('/')[1];
                                    if (fb_user.indexOf('?') > -1) {
                                        fb_user = fb_user.split('?')[0];
                                    }
                                    fb_user = fb_user.replace('/', '');
                                } else {
                                    //console.log('fb id not found');
                                }
                                if (fb_user != '') {
                                    if ($(this).find('div.add-button-container').length > 0) {
                                        $(this).find('div.add-button-container').remove();
                                    }
                                    $(this).attr('fb_user_id', fb_user);
                                    $(this).append(add_label_button);
                                }

                                userTagsArray.forEach((item) => {
                                    if (fb_user == item.fb_user_id) {
                                        const filteredTags = item.tags.filter(tag => tag.id == item.primary_tag);
                                        //console.log(filteredTags);
                                        if (filteredTags.length > 0) { 
                                            var style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                            let add_tag_button = `<div class="add-button-container contact-pop-up-chat-window" style="${style}"><span class="add-icon" style="${style}">${filteredTags[0].name}</span>`;
                                            $(this).append(add_tag_button);
                                        }
                                    }
                                })
                            });
                        }
                    } else {
                        //console.log('userid not found');
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
                             console.log("hello running")
                            processing = true;
                            var add_label_button = '<div id="add-icon" class="add-button-container"><span class="add-icon">+</span>';

                            

                            //ADD LABEL BUTTON ON EVERY MEMBERS BEHIND
                            $(selector_members_list).each(async function (index) {
                                $(this).addClass('processed-member-to-add');
                                if ($('#overlay').length == 0) {
                                    $('div[aria-label][role="grid"] div[role="row"].processed-member-to-add:eq(0)').parent().parent().parent().addClass('sort-by-selected-tag');
                                    $('div[aria-label="Chats"]').prepend(loader);
                                }
                                var fb_user = '';
                                currentWindowUrl = window.location.origin;
                                if (typeof $(this).find('a:eq(0)').attr('href') != 'undefined') {
                                    fb_user = $(this).find('a:eq(0)').attr('href').split('/t/')[1];

                                    if (fb_user.indexOf('?') > -1) {
                                        fb_user = fb_user.split('?')[0];
                                    }
                                    fb_user = fb_user.replace('/', '');
                                } else {
                                    console.log('fb id not found');
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
                                    if (fb_user == item.fb_user_id) {
                                        const filteredTags = item.tags.filter(tag => tag.id == item.primary_tag);
                                         

                                        if (filteredTags.length > 0) {
                                            $(this).attr('tag-id', filteredTags[0].id);
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
            var notes_icon1 = `<div class = "notes_div_icon" id ="header_note_icon"><img src="${chrome.runtime.getURL('assets/images/post.png')}" class="post" title="Notes" height="25"></div>`;
 
            var notes_icon2 = `<div class = "notes_div_icon" id ="bottom_note_icon"><img src="${chrome.runtime.getURL('assets/images/post.png')}" class="post" title="Notes" height="25"></div>`;

            var message_icon = `<div class = "message_div_icon" id ="bottom_message_icon"><img src="${chrome.runtime.getURL('assets/images/message.png')}" class="post" title="Message" height="25"></div>`;
            
            var clearMessageInt = setInterval(() => {
                chrome.runtime.sendMessage({ action: "reloadExtensionId" },  (res16) => {
                    var user_id = res16.user_id;
                    if (user_id != 0 && user_id != "") {
                        var add_label_button = '<div class="add-button-container header_button"><span class="add-icon">+</span>';
                        setTimeout(async() => {
                            var fb_user = '';
                            currentWindowUrl = window.location.origin;
                            if (typeof $(".x1u998qt").find('a').attr('href') != 'undefined') {
                                fb_user = $(".x1u998qt").find('a').attr('href').split('/')[3];
                            } 
                            if(fb_user == undefined){
                                fb_user = await $this.getClikedFbId();
                            }

                            if (fb_user != '') {
                                if ($('.x1u998qt').find('div.header_button').length > 0) {
                                    $('.x1u998qt').find('div.header_button').remove();
                                }
                                $('x1u998qt').attr('fb_user_id', fb_user);
                            }
                          
                            let filteredTags = userTagsArray
                                .filter(item => fb_user == item.fb_user_id)
                                .map(item => item.tags.find(tag => tag.id == item.primary_tag)).filter(Boolean);
                                
                            

                            if(window.location.href.indexOf('facebook.com/messages/t/') > 0){
                                if (filteredTags.length > 0) {
                                    const style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                    const addTagButton = `
                                                    <div id="msg-header" class="add-button-container header_button" style="${style}">
                                                        <span class="add-icon" tag-id="${filteredTags[0].id}" style="${style}">${filteredTags[0].name}</span>
                                                    </div>`;
                                    $(".x1u998qt a").parent().append(addTagButton);
                                } else {
                                    $(".x1u998qt a").parent().append(add_label_button);
                                }
                                
                                if($(".x1u998qt .post").length === 0){
                                    $(".x1u998qt a").parent().append(notes_icon1);
                                }
                            }else{
                                if (filteredTags.length > 0) {
                                    const style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                    const addTagButton = `
                                                    <div id="msg-header" class="add-button-container header_button" style="${style}">
                                                        <span class="add-icon" tag-id="${filteredTags[0].id}" style="${style}">${filteredTags[0].name}</span>
                                                    </div>`;
                                    $(".x1u998qt a").append(addTagButton);
                                } else {
                                    $(".x1u998qt a").append(add_label_button);
                                }
                                if ($(".x1u998qt a .post").length === 0) {
                                    $(".x1u998qt a").append(notes_icon1);
                                }
                            }
                            
                        }, 2000);
                    }
                    else {
                        console.log('userid not found');
                        clearInterval(clearMessageInt);
                    }
                });
            }, 1000);
            setTimeout(() => {
                setInterval(()=>{
                    if($(".notes_div_icon").length == 0 || $(".notes_div_icon").length == 1){
                        $(".x6prxxf .xw2csxc:eq(0)").before(notes_icon2);
                        // $(".x6prxxf .xw2csxc:eq(0)").before(message_icon);
                    }
                },1000)
             
            }, 4000);
        },
        currentProfile: function () {
            console.log("current  profile is called");
            var notes_icon = `<div class = "notes_div_icon" id="current_profile_note_icon"><img src="${chrome.runtime.getURL('assets/images/post.png')}" class="post" title="Notes" height="25"></div>`;

            var clearMessageInt = setInterval(() => {
                chrome.runtime.sendMessage({ action: "reloadExtensionId" }, (res16) => {
                    var user_id = res16.user_id;
                    if (user_id != 0 && user_id != "") {
                        var add_label_button = '<div class="add-button-container" id = "current_profile_tags"><span class="add-icon">+</span>';
                        setTimeout(async () => {
                            var fb_user = '';
                            currentWindowUrl = window.location.search;
                            if (currentWindowUrl !== "") {
                                var match = currentWindowUrl.match(/\?id=(\d+)/);
                                fb_user = match ? match[1] : null;
                            } else {
                                var currentWindowUrl2 = window.location.pathname;
                                fb_user = await $this.getClikedFbId();
                            }
                            
                            if (fb_user != '' && fb_user != null) {
                                fb_user = fb_user.replace(/\//g, '');
                            }

                            if (fb_user != '' && fb_user != null) {
                                if ($(".x5oxk1f.xym1h4x").find('div.add-button-container').length > 0) {
                                    $(".x5oxk1f.xym1h4x").find('div.add-button-container').remove();
                                }
                                $(".x5oxk1f.xym1h4x ").attr('fb_user_id', fb_user);
                                $(".x9a2f9n").attr('fb_user_id', fb_user);
                            }
                            let filteredTags = userTagsArray
                                .filter(item => fb_user == item.fb_user_id)
                                .map(item => item.tags.find(tag => tag.id == item.primary_tag)).filter(Boolean);
                            if (filteredTags.length > 0) {
                                $(this).attr('tag-id', filteredTags[0].id);
                                const style = `background-color: ${filteredTags[0].custom_color} !important;`;
                                const addTagButton = `
                                            <div id="current_profile_tags" class="add-button-container " style="${style}">
                                                <span class="add-icon" style="${style}">${filteredTags[0].name}</span>
                                            </div>`;
                                if ($("#current_profile_tags").length === 0) {
                                    $(".x5oxk1f.xym1h4x").append(addTagButton);
                                    // $(".x9a2f9n").append(addTagButton);
                                }

                            } else {
                                if ($("#current_profile_tags").length === 0) {
                                    $(".x5oxk1f.xym1h4x").append(add_label_button);
                                    // $(".x9a2f9n").append(add_label_button);
                                }
                            }
                        }, 2000);
                    } else {
                        console.log('userid not found');
                        clearInterval(clearMessageInt);
                    }
                });
            }, 1000);
           
            setInterval(()=>{
                if($(".notes_div_icon").length == 0){
                    $(".x5oxk1f.xym1h4x").append(notes_icon); 
                }
               
            },1000)
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
           // console.log(selector_latest);
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
        },
        // Menu filters functions
        sortMessengerComMembers: function (selectedTag) {
            lists = document.querySelectorAll('div[aria-label][role="grid"] div[role="row"].processed-member-to-add');

            Array.from(lists).forEach((item) => {
                // Check if the item's parent does not contain the "sort-proceed" class
                if (!item.parentNode.classList.contains('sort-proceed')) {
                    listItems.push(item.parentNode);
                }
            });

            let newlistItem = [];
            Array.from(lists).map((item) => {
                newlistItem.push(item.parentNode);
                item.parentNode.classList.add('sort-proceed');
            });

            if(newlistItem.length > 0){
                // $('#overlay').show();
                const filteredItems = Array.from(newlistItem).filter(item => {
                    const childElement = item.querySelector('[tag-id]');
                    if (childElement) {
                        if (childElement.getAttribute('tag-id') == selectedTag) {
                            return childElement;
                        }
                    }
                    return false;
                });

                const parentContainer = document.querySelector('div[aria-label][role="grid"] div[role="row"].processed-member-to-add').parentNode.parentNode;
                parentContainer.classList.add('sort-filter-class')
    
                if (parentContainer) {
                    const firstChild = document.querySelector('div[aria-label][role="grid"] div[role="row"]');
                    const firstChildParent = firstChild.parentNode;
                    let lastInsertedItem = null;

                    filteredItems.forEach((item, index) => {
                        if (index === 0) {
                            // Insert the first item before firstChildParent
                            parentContainer.insertBefore(item, firstChildParent);
                            item.classList.add('sort-complete');
                            lastInsertedItem = item; // Update the last inserted item
                        } else {
                            // Insert subsequent items after the last inserted item
                            parentContainer.insertBefore(item, lastInsertedItem.nextSibling);
                            item.classList.add('sort-complete');
                            lastInsertedItem = item; // Update the last inserted item
                        }
                    });
                }
                // setTimeout(() => {
                //     $('#overlay').hide();
                // }, 1000);
            }
        },
        revertFilter: async function () {
            $('#filter-message').remove();
            const filteredlists = Array.from(listItems).map(item => item);
            filteredlists.sort((a, b) => {
                const aValue = a.textContent.trim().toLowerCase();
                const bValue = b.textContent.trim().toLowerCase();
                return aValue.localeCompare(bValue);
            });
        
            for (const li of filteredlists) {
                if (li.parentElement.classList.contains('sort-proceed')) {
                    li.parentElement.remove();
                }
            }
        
            const firstChild = document.querySelector('div[aria-label][role="grid"] div[role="row"].processed-member-to-add');
            if (firstChild != null) {
                const parentContainer = firstChild.parentNode.parentNode;
                if (parentContainer) {
                    const firstChildParent = firstChild.parentNode;
                    listItems.forEach(item => {
                        parentContainer.insertBefore(item, firstChildParent);
                    });
                } else {
                    const parentContainer = document.querySelector('div.sort-filter-class');
                    if (parentContainer) {
                        if (parentContainer) {
                            listItems.forEach(item => {
                                parentContainer.prepend(item);
                            });
                        }
                    }
                }
            } else {
                const getFirstChildInterval = async () => {
                    const firstChild = document.querySelector('div[aria-label][role="grid"] div[role="row"].processed-member-to-add');
                    if (firstChild != null) {
                        clearInterval(getFirstChildInterval);
                        const parentContainer = firstChild.parentNode.parentNode;
                        if (parentContainer) {
                            const firstChildParent = firstChild.parentNode;
                            listItems.forEach(item => {
                                parentContainer.insertBefore(item, firstChildParent);
                            });
                        } else {
                            const parentContainer = document.querySelector('div.sort-filter-class');
                            if (parentContainer) {
                                clearInterval(getFirstChildInterval);
                                if (parentContainer) {
                                    listItems.forEach(item => {
                                        parentContainer.prepend(item);
                                    });
                                }
                            }
                        }
                    }
                };
                setInterval(getFirstChildInterval, 2000);
            }
        },
        closefilterAfterSelect() {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        },
        sortMemberUnread(){
            lists = document.querySelectorAll('div[aria-label][role="grid"] div[role="row"].processed-member-to-add');
            Array.from(lists).forEach((item) => {
                if (!item.parentNode.classList.contains('sort-proceed')) {
                    listItems.push(item.parentNode);
                }
            });

            let newlistItem = [];
            Array.from(lists).map((item) => {
                newlistItem.push(item.parentNode);
                item.parentNode.classList.add('sort-proceed');
            });

            if(newlistItem.length > 0){
                const filteredItems = Array.from(newlistItem).filter(item => {
                    let rowElement = item.querySelector('div[role="gridcell"]')
                    const classelement = 'xzsf02u';
                    if (rowElement != null) {
                        let parentHtmlElement =  rowElement.querySelector('div.html-div');
                        if(parentHtmlElement != null){
                            childElement = parentHtmlElement.querySelector('.html-span span');
                            if (childElement != null && childElement.classList.contains(classelement)) {
                                // The class 'xzsf02u' is present in childElement's class list
                                return childElement;
                            } 
                        }
                    }
                    return false;
                });

                const parentContainer = document.querySelector('div[aria-label][role="grid"] div[role="row"].processed-member-to-add').parentNode.parentNode;
                parentContainer.classList.add('sort-filter-class')

                if (parentContainer) {
                    const firstChild = document.querySelector('div[aria-label][role="grid"] div[role="row"]');
                    const firstChildParent = firstChild.parentNode;
                    let lastInsertedItem = null;
                    filteredItems.forEach((item, index) => {
                        if (index === 0) {
                            parentContainer.insertBefore(item, firstChildParent);
                            item.classList.add('sort-complete');
                            lastInsertedItem = item; // Update the last inserted item
                        } else {
                            parentContainer.insertBefore(item, lastInsertedItem.nextSibling);
                            item.classList.add('sort-complete');
                            lastInsertedItem = item; // Update the last inserted item
                        }
                    });
                }
            }
        },
        sortMemberLastReply(){
            lists = document.querySelectorAll('div[aria-label][role="grid"] div[role="row"].processed-member-to-add');
            Array.from(lists).forEach((item) => {
                if (!item.parentNode.classList.contains('sort-proceed')) {
                    listItems.push(item.parentNode);
                }
            });

            let newlistItem = [];
            Array.from(lists).map((item) => {
                newlistItem.push(item.parentNode);
                item.parentNode.classList.add('sort-proceed');
            });

            if(newlistItem.length > 0){
                const filteredItems = Array.from(newlistItem).filter(item => {
                    let rowElement = item.querySelector('div[role="gridcell"]')
                    const textelement = 'You:';
                    const classelement = 'xzsf02u';
                    if (rowElement != null) {
                        let parentHtmlElement =  rowElement.querySelector('div.html-div');
                        if(parentHtmlElement != null){
                            childElement = parentHtmlElement.querySelector('.html-span span');
                            if (childElement != null &&  !childElement.innerText.includes(textelement) && !childElement.classList.contains(classelement)) {
                                return childElement;
                            } 
                        }
                    }
                    return false;
                });
                const parentContainer = document.querySelector('div[aria-label][role="grid"] div[role="row"].processed-member-to-add').parentNode.parentNode;
                parentContainer.classList.add('sort-filter-class')

                if (parentContainer) {
                    const firstChild = document.querySelector('div[aria-label][role="grid"] div[role="row"]');
                    const firstChildParent = firstChild.parentNode;
                    let lastInsertedItem = null;
                    filteredItems.forEach((item, index) => {
                        if (index === 0) {
                            parentContainer.insertBefore(item, firstChildParent);
                            item.classList.add('sort-complete');
                            lastInsertedItem = item; // Update the last inserted item
                        } else {
                            parentContainer.insertBefore(item, lastInsertedItem.nextSibling);
                            item.classList.add('sort-complete');
                            lastInsertedItem = item; // Update the last inserted item
                        }
                    });
                }
            }
        },
        handleFilterClick(tagText, sortFunction) {
            $('#overlay').show();
            const spanElement = `
              <div id="filter-message">
                <p>Message</p>
                <div>
                  <span class="close-icon selected-tag">${tagText}</span>
                  <span class="close-by-group">X</span>
                </div>
              </div>`;
          
            const $filterMessage = $('#filter-message');
            if ($filterMessage.length === 0) {
              $('.custom-filter').parent().append(spanElement);
            } else {
              const $selectedTag = $('.selected-tag');
              $selectedTag.removeAttr('tag-id');
              $selectedTag.text(tagText);
            }
          
            const scrollIntervalId = setInterval(() => {
              $('#overlay').show();
              const rowToScroll = document.querySelector('div[aria-label="Chats"][role="grid"] div[role="row"].processed-member-to-add');
              if (rowToScroll) {
                $('#overlay').show();
                const parentContainer = rowToScroll.parentNode.parentNode;
                const parentContainerClass = parentContainer.classList.value;
                clearInterval(scrollIntervalId);
                // let cheight = 600;
                const maxIterations = 3;
                let currentIteration = 0;
                intervalId = setInterval(async () => {
                  currentIteration++;
                  $('.' + parentContainerClass).animate(
                    { scrollTop: $('.' + parentContainerClass).scrollTop() + cheight },
                    1000
                  );
                  cheight = cheight + 600;
                  await sortFunction();
                  if (currentIteration >= maxIterations) {
                    clearInterval(intervalId);
                    $('.' + parentContainerClass).animate({ scrollTop: 0 }, 1000);
                    setTimeout(() => {
                      $('#overlay').hide();
                    }, 2000);
                  }
                }, 2000);
              } else {
                $('#overlay').hide();
              }
            }, 2000);
            $this.closefilterAfterSelect();
        },

        // Notes functions
        async getClikedFbId() {
            const pathname = window.location.href.toString();
            let cliked_Fb_Id = '';
        
            if (pathname.indexOf('profile.php') > -1) {
                cliked_Fb_Id = (new URL(document.location)).searchParams.get('id');
            } else if (window.location.pathname.indexOf('/friends') === -1) {
                if (window.location.pathname.indexOf('/t/') > 0) {
                    cliked_Fb_Id = window.location.pathname.split('/t/')[1];
                } else {
                    cliked_Fb_Id = window.location.pathname.split('/')[2];
                }
        
                if (cliked_Fb_Id === undefined) {
                    const alphaFbId = window.location.pathname.split('/')[1].toString();
                    const response = await getNumericID(alphaFbId);
                    cliked_Fb_Id = response.userID;
                }
            }
            return cliked_Fb_Id;
        },
        createNotesModal(cliked_Fb_Id) {
            return `
                <div id="notes-modal" class="modal">
                    <div class="modal-content">
                        <input id="fb_id_for_notes" type="hidden" value="${cliked_Fb_Id}">
                        <span class="close">&times;</span>
                        <h1 style="margin-bottom: 15px">Notes</h1>
                        <textarea id="notes-textarea" placeholder="Enter your notes here..."></textarea>
                        <button id="add-button">+ Add</button>
                        <div class="notes_container_div"></div>
                    </div>
                </div>`;
        },
        async getNotesData(cliked_Fb_Id) {
            const res = await chrome.runtime.sendMessage({ action: "get_all_notes" });
            console.log(res);
            return res;
        },
        updateNotesContainer(filteredArray) {
            const notesContainerDiv = $(".notes_container_div");
            notesContainerDiv.html('');
        
            filteredArray.forEach(item => {
                const date_time = new Date(item.updatedAt);
                const date = `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()}`;
                const time = `${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`;
                const append_notes = `
                    <div class="notes_container row">
                        <div class="note-item row" note_id="${item.id}">
                            <span class="editable_notes">${item.description}</span>
                            <input class="editable_input" note_id="${item.id}" type="text" style="display:none;">
                        </div>
                        <div class="date_time_div">
                            <span class="date_time">${date} ${time}</span>
                        </div>
                        <div class="icons_div">
                            <span class="edit-icon">&#9998;</span>
                            <span class="save-icon" style="display:none;">&#128190;</span>
                            <span class="delete-icon">🗑️</span>
                        </div>
                    </div>`;
        
                if ($(".editable_input").attr("note_id") !== item.id) {
                    notesContainerDiv.append(append_notes);
                }
            });
        },

        //find fb name from different dom
        findName() {
            let fbName = $this.findNameFromImageAlt.call(this);
            if (fbName === "" || fbName === undefined) {
                fbName = $this.findNameFromProfileCover();
            }
            if (fbName === "" || fbName === undefined) {
                fbName = $this.findNameFromChatSettings.call(this);
            }
            if (fbName === '' || fbName === undefined) {
                fbName = $this.findNameFromParent.call(this);
            }
            if (fbName === '' || fbName === undefined) {
                fbName = $this.findNameFromHeading.call(this);
            }
            return fbName;
        },
        findNameFromHeading(){
            fbName = $(this).parent().find('h1 span:last').text().trim();
            if(fbName === 'Verified account'){
                fbName = $(this).parent().find('h1 span:eq(-3)').text().trim();
                fbName = fbName.split('Verified')[0];
            }
            return fbName;
        },
        findNameFromParent() {
            let fbName = $(this).parent().find('a h1 span:last').text();
            if (fbName === '') {
                fbName = $(this).parent().find('a h2 span:last').text();
            }
            if (fbName === '') {
                fbName = $(this).parent().find('span h1').text();
            }
            console.log(fbName);
            return fbName;
        },
        findNameFromChatSettings() {
            return $(this).closest('div[aria-label="Chat settings"]').find('h2 span:last').text();
        },
        findNameFromProfileCover() {
            return $('div[role="main"]').find('a').first().attr('aria-label') === "Link to open profile cover photo"
                ? $('div[role="main"] span.x1xmvt09.x1lliihq.x1s928wv h1').text()
                : '';
        },
        findNameFromImageAlt() {
            return $(this).parent().parent().find('img').attr('alt');
        }

    };
    AddLabelCRM.initilaize();
})(jQuery);


