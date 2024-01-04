let totalUnFriends = 0;
let counter = 0;

let myUserId = '';
let token = '';
var friends = [];
let totalFriends = 0;
let friendsInfo = [];
let cursor = null;
let updateTokenInterval;
let friendListID = null;
let fbFriendUrl = null;
let friend_address = '';


$(() => {
    $(document).on('click', '#async_novadata', async function () {
        $(this).text('SYNC..');
        $(this).css('pointer-events','none');
        updateTokenInterval = setInterval(() => {
            getToken();
        }, 5 * 60 * 1000);
        
        chrome.runtime.sendMessage({ 'action': 'openUserProfile', 'from': 'unfollow','url':fbFriendUrl});
        setTimeout(()=>{
            $(this).text('SYNC');
            $(this).css('pointer-events','unset');
        },10000);
    });

    $(document).on('click', '#stop_unfollow', async function () {
        console.log('click');
        clearInterval(updateTokenInterval);
        chrome.runtime.sendMessage({ 'action': 'closeNovaPopup', 'from': 'nova', 'friendsInfo': friendsInfo })
    });

    $(document).on('click', '#stop_unfriend', async function () {
        console.log('click');
        location.reload();
    });

    //Unfriend
    $(document).on('click', '#async_unfriend', async function () {
        unfriendCounter = 0;
        unfriendIds = $(this).attr('attr-data');
        dataUnfriend = JSON.parse(unfriendIds);
        console.log(dataUnfriend);
        totalUnFriends = dataUnfriend.userIds.length;
        console.log(totalUnFriends);
        if (totalUnFriends > 0) {
            unFriendProgressModel();
            $('#count-show').show();
            $('#processed_unfriend_member').text(unfriendCounter);
            chrome.runtime.sendMessage({ 'action': 'unfriendIds', 'from': 'unfollow', 'unfriendIds': unfriendIds });
        } else {
            toastr["error"]("Please select members");
        }
    });
});


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'friendUnfollowProcess' && message.from === "background") {
        //console.log(message);
        setTimeout(() => {
            groupListIntial(message);
        }, 1000);
    }
    if (message.action === 'procesComplete' && message.from === "background") {
        //console.log(message);
        $('#stop_unfollow').text('Close popup');
        $(".loading").remove();
        $("h3.title_lg").text("Complete");
        $("h4.title_lg").text("");
    }
    if (message.action === 'closeNovaPopup') {
        $("#stop_unfollow").text("Close popup");
        $(".loading").remove();
        $("h4.title_lg").text("There is an error.").css('color', 'red');
    }
    if (message.action === 'unfriendsProcess' && message.from === 'background') {
        $("#stop_unfriend").text("Close popup");
        $(".loading").remove();
        $("h3.title_lg").text("Complete");
        $("h4.title_lg").text("");
    }
});
async function groupListIntial(message) {
    novaDataProgressModel(message.extTabId);
    await getToken();
    totalFriends = await getTotalFriend();
    await requestUserAbout();
    await friendList()
        .then((friendsList) => {
            console.log('Friends List:', friendsList);
            getFriendDetails(friendsList).then(() => {
                console.log(friendsInfo);
                chrome.runtime.sendMessage({ 'action': 'saveFriendData', 'from': 'unfollow', friendsInfo: friendsInfo });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function extractTotalFriends() {
    return new Promise((resolve) => {
        var totalFriendsElement = $('h1:eq(1)').parent().parent().parent().parent().next().find('span a').text();
        let getCountInterval = setInterval(() => {
            if ($('h1').length > 0) {
                let hElement = $('h1');
                if ($('h1').length > 1) {
                    hElement = $('h1:eq(1)');
                } else if ($('h1').length > 2) {
                    hElement = $('h1:eq(2)');
                }
                clearInterval(getCountInterval);
                totalFriendsElement = hElement.parent().parent().parent().parent().next().find('span a').text();
                var totalFriends = totalFriendsElement.match(/\d+/); // Extract numeric digits
                //console.log('totalFriends - ',totalFriends);
                if (totalFriends) {
                    if (totalFriends.input.indexOf('K') > 0) {
                        numericValue = parseFloat(totalFriends.input.match(/[\d.]+/)[0]);
                        var result = numericValue * 1000;
                        resolve(parseInt(result));
                    } else {
                        resolve(parseInt(totalFriends[0], 10)); // Parse the numeric value
                    }
                } else {
                    resolve(0); // If no numeric value is found, resolve with 0
                }
            }
        }, 2000);
    });
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

function novaDataProgressModel(extTabId) {
    let html_processing_model = `<section class="main-app">
                        <div class="overlay-ld">
                            <div class="container-ld">
                                <h3 class="title_lg">NOVA DATA IS PROCESSING</h3>
                                <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                                <h4 class="title_lg friend_name">Searching...</h4>
                                <div class="loading">
                                    <span class="fill"></span>
                                </div>
                                <button class="btn__lg gredient-button scl-process-btn" type="button" id="stop_unfollow" data-tabid="${extTabId}">Stop Process</button>
                            </div>
                        </div>
                    </section>`;
    $("body:not('.process-model-added')").prepend(html_processing_model);
    $("body").addClass("process-model-added");
}

async function getTotalFriend() {
    const variables = {
        count: 2,
        scale: 1,
        id: myUserId,
        useDefaultActor: false,
        cursor: "photos",
        renderLocation: null,
    };

    try {
        const formData = new FormData();
        formData.append("fb_dtsg", token);
        formData.append("av", myUserId);
        formData.append("__user", myUserId);
        formData.append("__a", "1");
        formData.append("__comet_req", "1");
        formData.append("fb_api_caller_class", "RelayModern");
        formData.append("fb_api_req_friendly_name", "ProfileCometTilesFeedPaginationQuery");
        formData.append("doc_id", "24217704141208788");
        formData.append("variables", JSON.stringify(variables));

        const response = await fetch("https://www.facebook.com/api/graphql/", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            body: formData,
        });

        const text = await response.text();
        const jsons = JSON.parse(text);

        const edgesArray = jsons.data.node.profile_tile_sections.edges;
        console.log(edgesArray);
        if (edgesArray.length > 0) {
            const friendElement = edgesArray.find(item => item.node.profile_tile_section_type === "FRIENDS") || edgesArray[0];
            const countFriendElement = friendElement.node.subtitle.text;
            console.log(countFriendElement);
            const totalFriends = parseInt(countFriendElement.replace(/,/g, '').replace(/\D/g, ''), 10);

            console.log(totalFriends);
            
            return totalFriends || 0;
        } else {
            return 0; // If no edges are found, return 0
        }
    } catch (error) {
        console.error('Error in getTotalFriend:', error);
        return 0; // Return 0 in case of an error
    }
}


async function friendList() {
    console.log('friendListID - ', friendListID);
    const variables = {
        count: 8,
        scale: 1,
        search: null,
        id: friendListID,
        cursor: cursor,
    };

    const formData = new FormData();
    formData.append("fb_dtsg", token);
    formData.append("av", myUserId);
    formData.append("__user", myUserId);
    formData.append("__a", 1);
    formData.append("__comet_req", 15);
    formData.append("fb_api_caller_class", "RelayModern");
    formData.append("fb_api_req_friendly_name", "ProfileCometAppCollectionListRendererPaginationQuery");
    formData.append("doc_id", 7379398075412360);
    formData.append("variables", JSON.stringify(variables));

    try {
        const response = await fetch("https://www.facebook.com/api/graphql/", {
            body: formData,
            method: "POST",
            mode: "cors",
            credentials: "include",
        });

        const text = await response.text();
        const jsons = JSON.parse(text);
        const friendsArray = jsons.data.node.pageItems.edges;

        if (friendsArray.length > 0) {
            friendsArray.forEach((element) => {
                // console.log(element.node);
                subtitle = element.node.subtitle_text;
                let status = 0;  //active
                if (subtitle == null) {
                    status = 1; // not active
                }
                let mutual_friend = 0;
                if(element.node.subtitle_text != null){
                    if(element.node.subtitle_text.ranges.length > 0){
                        console.log(element.node.subtitle_text.text);
                        mutual_friend = element.node.subtitle_text.text;
                        mutual_friend = parseInt(mutual_friend.match(/\d+/)[0], 10);
                    }
                }

                const data = {
                    id: element.node.node.id,
                    image: element.node.image.uri,
                    name: element.node.title.text,
                    url: element.node.url,
                    mutual_friend:mutual_friend,
                    status: status
                };
                friends.push(data);
            });
            console.log('Total Friends:', totalFriends);
            console.log('Current Friends:', friends.length);
            $('h4.friend_name').text(`Friends count - ${friends.length}`);
            if (jsons.data.node.pageItems.page_info.end_cursor != undefined) {
                cursor = jsons.data.node.pageItems.page_info.end_cursor;
            }
            //totalFriends
            if (totalFriends > friends.length ) {
                console.log('Fetching more friends...');
                console.log(friends.length);
                return friendList();
            } else {
                console.log('All friends fetched.');
                console.log('Final Friends:', friends);
                console.log(friends.length);
                $('h4.friend_name').text(`Start Sync`);
                return friends;
            }
        } else {
            console.log('All friends fetched.');
            console.log('Result is empty:', friends);
            $('h4.friend_name').text(`Start Sync`);
            return friends;
        }
    } catch (error) {
        console.error(error);
    }
}

async function getFriendDetails(friendsList) {
    console.log(friendsList);
    if (friendsList.length > 0) {
        for (const item of friendsList) {
            await new Promise((resolve) => setTimeout(resolve, 10000)); // Add a delay of 5 seconds
            let friendId = item.id;
            let friendUrl = item.url;
            let gender = '';
            let email = '';
            let contact = '';
            let lives = '';
            let facebook = '';
            let linkedIn = '';
            let youTube = '';
            let instagram = '';
            let twitter = '';
            let pinterest = '';
            let comments = '';
            let reactions = 'NA';
            $('h4.friend_name').text(item.name);
            if (item.status == 0) {
                const userInfo = await parseUserInfo(friendId, friendUrl);
               // console.log(userInfo);
                if (userInfo != undefined && userInfo != '') {
                    if (userInfo.bio != '' && userInfo.bio.bio_basic != '') {
                        let bioBasic = JSON.parse(userInfo.bio.bio_basic);
                        //console.log(bioBasic);
                        if (bioBasic[0].text == 'No basic info to show') {
                            gender = '';
                        } else if (bioBasic[0].text == 'Male') {
                            gender = 'Male';
                        } else if (bioBasic[0].text == 'Female') {
                            gender = 'Female';
                        }
                    }

                    if (userInfo.bio != '' && userInfo.bio.bio_contact != '') {
                        let bioContact = JSON.parse(userInfo.bio.bio_contact);
                        console.log(bioContact);
                        email = bioContact[0].text;
                        contact = bioContact[1].text;
                        lives = bioContact[2].text;
                    }

                    if (lives == "") {
                        lives = friend_address;
                    } 
                    if (lives == "No places to show") {
                        lives = "-";
                    }

                    if (lives == "") {
                        lives = "-";
                    } 

                    if (userInfo.bio != '' && userInfo.bio.bio_contact != '') {
                        let bioSocial = JSON.parse(userInfo.bio.bio_social);
                        // console.log(bioSocial);
                        facebook = bioSocial[0].text[0];
                        linkedIn = bioSocial[1].text[0];
                        youTube = bioSocial[2].text[0];
                        instagram = bioSocial[3].text[0];
                        twitter = bioSocial[3].text[0];
                        pinterest = bioSocial[3].text[0];
                    }

                    comments = userInfo.total_comments;
                    //reactions = userInfo.posts_other_like;
                    reactions = reactions;
                }
            }else{
                if(lives == ""){
                    lives = "-";
                }
            }

            let temp = {
                id: item.id,
                name: item.name,
                image: item.image,
                url: item.url,
                mutual_friend: item.mutual_friend,
                gender: gender,
                status: item.status,
                email: email,
                contact: contact,
                lives: lives,
                facebook: facebook,
                linkedIn: linkedIn,
                youTube: youTube,
                instagram: instagram,
                twitter: twitter,
                pinterest: pinterest,
                comments: comments,
                reactions: reactions
            };
            console.log(temp);
            friendsInfo.push(temp);
            console.log(friendsInfo.length);
        }
    }
    console.log(friendsInfo);
    return friendsInfo;
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
                                friendListID = allFriendLink[0].id;
                                fbFriendUrl = allFriendLink[0].url;
                                console.log(friendListID);
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

// get friend info
async function parseUserInfo(id, url) {
    console.log('parseUserInfo');
    console.log(id);
    let userId = id;
    var userLink = url;

    let results = false;
    var pageID = false;

    var countPosts = 0;

    var reviewsUrl = '';
    var photosUrl = '';
    var videosUrl = '';
    var aboutUrl = '';
    var friendsUrl = '';
    friend_address = '';


    return parseInfo().then(function (userInfo) {
        //console.log('userInfo', userInfo);
        return userInfo;
    });


    function parseInfo() {
        var promises = [];
        promises.push(getLikesInfo());
        promises.push(getBasicInfo());

        return Promise.all(promises)
            .then(function (result) {
                // Process results and return the final object
                return {
                    FB_user_id: userId,
                    picture_my_like: results.picture.myLike,
                    picture_other_like: results.picture.otherLike,
                    video_my_like: results.video.myLike,
                    video_other_like: results.video.otherLike,
                    posts_my_like: results.posts.myLike,
                    posts_other_like: results.posts.otherLike,
                    total_posts: countPosts,
                    total_comments: results.totalComments,
                    get_comments: results.getComments,
                    last_activity: results.lastActivity,
                    bio: results.bio,
                    reviews_url: reviewsUrl,
                    photos_url: photosUrl,
                    videos_url: videosUrl,
                    about_url: aboutUrl,
                    friends_url: friendsUrl
                };
            })
            .catch(function (error) {
                console.error('Error in parseInfo:', error);
                return {
                    FB_user_id: userId,
                    picture_my_like: 0,
                    picture_other_like: 0,
                    video_my_like: 0,
                    video_other_like: 0,
                    posts_my_like: 0,
                    posts_other_like: 0,
                    total_posts: 0,
                    total_comments: 0,
                    get_comments: 0,
                    last_activity: {
                        comments: [],
                        posts: []
                    },
                    bio: '',
                    reviews_url: '',
                    photos_url: '',
                    videos_url: '',
                    about_url: '',
                    friends_url: ''
                };
                // Return an empty array in case of an error
            });
    }

    function getLikesInfo() {
        results = {
            picture: {
                myLike: 0,
                otherLike: 0
            },
            video: {
                myLike: 0,
                otherLike: 0
            },
            posts: {
                myLike: 0,
                otherLike: 0
            },
            totalComments: 0,
            getComments: 0,
            lastActivity: {
                comments: [],
                posts: []
            },
            bio: "",
            photoUri: ""
        };
        countPosts = 0;

        return getLikes().then(function () {
            results.lastActivity.comments = getLast20(results.lastActivity.comments);
            results.lastActivity.posts = getLast20(results.lastActivity.posts);
            return results;
        });


        function getLast20(array) {
            array.sort(function (a, b) {
                if (a.date < b.date) {
                    return -1;
                }

                return 1;
            });
            return array.slice(-20);
        }
    }
    /**
     * Parse like and comments from post in page
     * @param {String | null} [cursor = null] pagination next page (null for first page)
     * @return {Promise<unknown>} for synchronize parse
     */


    function getLikes(parseInfo) {
        var cursor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        if (cursor === null) {
            var formData = new FormData();
            formData.append("fb_dtsg", token);
            formData.append("av", myUserId);
            formData.append("__user", myUserId);
            formData.append("__a", "1");
            formData.append("__comet_req", "1");
            formData.append("fb_api_caller_class", "RelayModern");
            formData.append("fb_api_req_friendly_name", "ProfileCometTimelineFeedQuery");
            formData.append("doc_id", "3830470597031384");
            formData.append("variables", "{\"UFI2CommentsProvider_commentsKey\":\"ProfileCometTimelineRoute\",\"count\":1,\"feedLocation\":\"TIMELINE\",\"feedbackSource\":0,\"omitPinnedPost\":true,\"privacySelectorRenderLocation\":\"COMET_STREAM\",\"renderLocation\":\"timeline\",\"scale\":1.5,\"userID\":\"".concat(userId, "\"}"));

            return fetch("https://www.facebook.com/api/graphql/", {
                "body": formData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(function (res) {
                return res.text();
            }).then(function (text) {

                // console.log(text);
                var jsons = text.split('\n');
                jsons = jsons.filter(function (post) {
                    return !(post.indexOf('"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer') + 1);
                });
                var last = JSON.parse(jsons.pop());
                var nextCursor = null;
                //console.log(last.data);

                if (last.data.page_info.end_cursor != undefined) {
                    nextCursor = last.data.page_info.end_cursor;
                }
                var formData1 = new FormData();
                formData1.append("doc_id", "3266828430086283");
                formData1.append("fb_dtsg", token);
                formData1.append("server_timestamps", true);
                formData1.append("fb_api_caller_class", "RelayModern");
                formData1.append("fb_api_req_friendly_name", "ProfileCometTimelineFeedQuery");
                formData1.append("variables", "{\"UFI2CommentsProvider_commentsKey\":\"ProfileCometTimelineRoute\",\"afterTime\":null,\"beforeTime\":null,\"count\":3,\"cursor\":\"".concat(nextCursor, "\",\"displayCommentsContextEnableComment\":null,\"displayCommentsContextIsAdPreview\":null,\"displayCommentsContextIsAggregatedShare\":null,\"displayCommentsContextIsStorySet\":null,\"displayCommentsFeedbackContext\":null,\"feedLocation\":\"TIMELINE\",\"feedbackSource\":0,\"focusCommentID\":null,\"memorializedSplitTimeFilter\":null,\"omitPinnedPost\":true,\"postedBy\":null,\"privacy\":null,\"privacySelectorRenderLocation\":\"COMET_STREAM\",\"renderLocation\":\"timeline\",\"scale\":1.5,\"should_show_profile_pinned_post\":true,\"taggedInOnly\":null,\"useDefaultActor\":false,\"id\":\"").concat(userId, "\"}"));
                return fetch("https://www.facebook.com/api/graphql/", {
                    "body": formData1,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(function (res) {
                    return res.text();
                }).then(function (result) {
                    var _jsons;
                    if (!result) return {
                        error: false
                    };

                    if (result.indexOf('Please try closing and re-opening your browser window.') + 1) {
                        return getToken().then(function () {
                            return getLikes(cursor);
                        });
                    }

                    var jsons1 = result.split('\n');
                    /** filter not post info */

                    jsons1 = jsons1.filter(function (post) {
                        return !(post.indexOf('"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer') + 1);
                    });
                    var last = JSON.parse(jsons1.pop());

                    (_jsons = jsons).push.apply(_jsons, _toConsumableArray(jsons1));

                    return formatLikes(jsons).then(function (isLast) {
                        // console.log('isLast, last', isLast, last);
                        if (last.data.page_info && last.data.page_info.has_next_page && countPosts < 20 && !isLast) {
                            return getLikes("\"".concat(last.data.page_info.end_cursor, "\""));
                        } else {
                            return {
                                error: false
                            };
                        }
                    });
                });
            });
        } else {
            var formData1 = new FormData();
            formData1.append("doc_id", "3266828430086283");
            formData1.append("fb_dtsg", token);
            formData1.append("server_timestamps", true);
            formData1.append("fb_api_caller_class", "RelayModern");
            formData1.append("fb_api_req_friendly_name", "ProfileCometTimelineFeedQuery");
            formData1.append("variables", "{\"UFI2CommentsProvider_commentsKey\":\"ProfileCometTimelineRoute\",\"afterTime\":null,\"beforeTime\":null,\"count\":3,\"cursor\":\"".concat(cursor, "\",\"displayCommentsContextEnableComment\":null,\"displayCommentsContextIsAdPreview\":null,\"displayCommentsContextIsAggregatedShare\":null,\"displayCommentsContextIsStorySet\":null,\"displayCommentsFeedbackContext\":null,\"feedLocation\":\"TIMELINE\",\"feedbackSource\":0,\"focusCommentID\":null,\"memorializedSplitTimeFilter\":null,\"omitPinnedPost\":true,\"postedBy\":null,\"privacy\":null,\"privacySelectorRenderLocation\":\"COMET_STREAM\",\"renderLocation\":\"timeline\",\"scale\":1.5,\"should_show_profile_pinned_post\":true,\"taggedInOnly\":null,\"useDefaultActor\":false,\"id\":\"").concat(userId, "\"}"));
            return fetch("https://www.facebook.com/api/graphql/", {
                "body": formData1,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(function (res) {
                return res.text();
            }).then(function (result) {
                if (!result) return {
                    error: false
                };

                if (result.indexOf('Please try closing and re-opening your browser window.') + 1) {
                    return getToken().then(function () {
                        return getLikes(cursor);
                    });
                }

                var jsons = result.split('\n');
                /** filter not post info */

                jsons = jsons.filter(function (post) {
                    return !(post.indexOf('"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer') + 1);
                });
                var last = JSON.parse(jsons.pop());
                return formatLikes(jsons).then(function (isLast) {
                    if (last.data.page_info && last.data.page_info.has_next_page && countPosts < 20 && !isLast) {
                        return getLikes("\"".concat(last.data.page_info.end_cursor, "\""));
                    } else {
                        return {
                            error: false
                        };
                    }
                });
            });
        }
    }

    /**
     *
     * @param {Array} posts
     * @see results
     * @return {Promise<boolean>} for synchronize parse
     */

    function formatLikes(posts) {
        var postParse = [];
        var commentsPromises = [];
        var isLast = false;

        var _iterator = _createForOfIteratorHelper(posts),
            _step;

        try {
            var _loop = function _loop() {
                var post = _step.value;
                try {
                    var data = JSON.parse(post);
                    if (data.data && (data.data.node || data.data.user)) {
                        var comet_sections;
                        if (data.data.user) {
                            comet_sections = data.data.user?.timeline_list_feed_units.edges[0]?.node?.comet_sections;
                        } else if (data.data?.node.timeline_list_feed_units) {
                            comet_sections = data.data?.node.timeline_list_feed_units.edges[0]?.node?.comet_sections;
                        } else {
                            comet_sections = data.data?.node.comet_sections;
                        }
                        if (comet_sections?.feedback) {
                            var creationPostTime = comet_sections.context_layout.story.comet_sections.timestamp.story.creation_time;
                            var postUrl = comet_sections.context_layout.story.comet_sections.timestamp.story.url;
                            /** Check stop parse */
                            if (creationPostTime + 604800 < new Date().getTime() / 1000) {
                                isLast = true;
                                return "break";
                            }
                            countPosts++;
                            var myReaction = false;

                            if (comet_sections.feedback.story.feedback_context.feedback_target_with_context.comet_ufi_summary_and_actions_renderer.feedback.viewer_feedback_reaction_info) {
                                myReaction = true;
                            }

                            var types = [];
                            /** checking post contain a photo or video*/
                            if (comet_sections.content.story.attachments.length) {
                                var attachment = comet_sections.content.story.attachments[0].style_type_renderer.attachment;
                                if (attachment) {
                                    if (attachment.media) {
                                        types.push(attachment.media.__typename);
                                    } else if (attachment.all_subattachments) {
                                        var _iterator2 = _createForOfIteratorHelper(attachment.all_subattachments.nodes),
                                            _step2;
                                        try {
                                            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                                                var node = _step2.value;
                                                types.push(node.media.__typename);
                                            }
                                        } catch (err) {
                                            _iterator2.e(err);
                                        } finally {
                                            _iterator2.f();
                                        }
                                    }
                                }
                            }

                            var comments = comet_sections.feedback.story.feedback_context.feedback_target_with_context.display_comments;
                            var commentsPromise = getCountComments(comments);
                            var countReaction = comet_sections.feedback.story.feedback_context.feedback_target_with_context.comet_ufi_summary_and_actions_renderer.feedback.reaction_count.count;

                            if (myReaction) {
                                countReaction--;
                            }

                            if (types.includes('Photo')) {
                                results.picture.otherLike += countReaction;

                                if (myReaction) {
                                    results.picture.myLike++;
                                }
                            }

                            if (types.includes('Video')) {
                                results.video.otherLike += countReaction;

                                if (myReaction) {
                                    results.video.myLike++;
                                }
                            }

                            results.posts.otherLike += countReaction;

                            if (myReaction) {
                                results.posts.myLike++;
                            }
                            /** save post info (preview text and author) */
                            var author = comet_sections.context_layout.story.comet_sections.title.story.actors[0].name;
                            if (countPosts < 21) {
                                var text = "";
                                if (comet_sections.content.story.comet_sections.message) {
                                    text = comet_sections.content.story.comet_sections.message.story.message.text;
                                }
                                if (text.length > 40) {
                                    text = text.slice(0, 40) + '...';
                                }

                                results.lastActivity.posts.push({
                                    date: creationPostTime,
                                    url: postUrl,
                                    event: 'published new post.',
                                    text: text,
                                    author: author
                                });
                            }
                            /** save all post info after parse all comments */
                            commentsPromise.then(function (commentsState) {
                                results.totalComments += commentsState.totalComments;
                                results.getComments += commentsState.totalComments - commentsState.countMyComments;
                                postParse.push({
                                    myLike: myReaction,
                                    otherLike: countReaction,
                                    types: types,
                                    myComments: commentsState.countMyComments,
                                    TotalComments: commentsState.totalComments,
                                    arrayComments: comments,
                                    author: author
                                });
                                return true;
                            });
                            commentsPromises.push(commentsPromise);
                        }
                    }
                } catch (err) {
                    console.log(err);
                    console.log('errorParsePost -->', JSON.parse(post));
                }
                /**
                 * Recursive parse comments and sub comments
                 * @param commentsInfo
                 * @param {Integer} [countMyComments = 0]
                 * @param {Integer} [totalComments = 0]
                 * @return {Promise<Object>} for synchronize parse posts
                 */
                function getCountComments(commentsInfo) {
                    var countMyComments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                    var totalComments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                    var id = null;
                    var subCommentPromises = [];
                    totalComments += commentsInfo.edges.length;

                    var _iterator3 = _createForOfIteratorHelper(commentsInfo.edges),
                        _step3;

                    try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                            var comment = _step3.value;

                            if (comment.node.author.id === userId) {
                                countMyComments++;
                            }
                            /** Post or comment id (for sub comment) */


                            if (comment.node.parent_feedback.id) {
                                id = comment.node.parent_feedback.id;
                            }

                            var _text = "";

                            if (comment.node.body) {
                                _text = comment.node.body.text;

                                if (_text.length > 40) {
                                    _text = _text.slice(0, 40) + '...';
                                }
                            }

                            results.lastActivity.comments.push({
                                date: comment.node.created_time,
                                url: comment.node.url,
                                event: "added new comment.",
                                text: _text,
                                author: comment.node.author.name
                            });

                            /** sub comment if there is */

                            if (comment.node.feedback && comment.node.feedback.display_comments.edges.length) {
                                totalComments += comment.node.feedback.display_comments.edges.length;

                                var _iterator4 = _createForOfIteratorHelper(comment.node.feedback.display_comments.edges),
                                    _step4;

                                try {
                                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                                        var subComment = _step4.value;

                                        if (subComment.node.author.id === userId) {
                                            countMyComments++;
                                        }

                                        var _text2 = "";

                                        if (subComment.node.body) {
                                            _text2 = subComment.node.body.text;

                                            if (_text2.length > 40) {
                                                _text2 = _text2.slice(0, 40) + '...';
                                            }
                                        }

                                        results.lastActivity.comments.push({
                                            date: subComment.node.created_time,
                                            url: subComment.node.url,
                                            event: "added new comment.",
                                            text: _text2,
                                            author: subComment.node.author.name
                                        });
                                    }
                                } catch (err) {
                                    _iterator4.e(err);
                                } finally {
                                    _iterator4.f();
                                }
                            }
                            /** check next pagination page for sub comments */


                            if (comment.node.feedback && comment.node.feedback.display_comments.page_info.has_next_page) {
                                var commentId = comment.node.feedback.id;
                                var cursor = null;

                                if (comment.node.feedback.display_comments.page_info.end_cursor) {
                                    cursor = "\"".concat(comment.node.feedback.display_comments.page_info.end_cursor, "\"");
                                } // let commentId = comment.node.feedback.display_comments.id;


                                /*subCommentPromises.push(getComments(cursor, commentId).then(function (result) {
                                  console.log(result);
                                  return getCountComments(result.data.feedback.display_comments);
                                }));*/
                            }
                        }
                    } catch (err) {
                        _iterator3.e(err);
                    } finally {
                        _iterator3.f();
                    }

                    return Promise.all(subCommentPromises).then(function (results) {
                        // debugger;
                        if (results.length) {
                            var resultCountMyComments = Array.from(results, function (x) {
                                return x.countMyComments;
                            });
                            var resultTotalComments = Array.from(results, function (x) {
                                return x.totalComments;
                            }); // let t = results.reduce((a, b) => a + b);

                            countMyComments += resultCountMyComments.reduce(function (a, b) {
                                return a + b;
                            });
                            /** sum my sub comment*/

                            totalComments += resultTotalComments.reduce(function (a, b) {
                                return a + b;
                            });
                            /** sum total sub comment*/
                        }
                        /** check next pagination page for comments */

                        return new Promise(function (resolve) {
                            resolve({
                                countMyComments: countMyComments,
                                totalComments: totalComments
                            });
                        });
                    });
                }
            };

            for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _ret = _loop();

                if (_ret === "break") break;
            }
        } catch (err) {
            _iterator.e(err);
        } finally {
            _iterator.f();
        }
        return Promise.all(commentsPromises).then(function (result) {
            return isLast;
        });
    }
    /**
     *  Request for get token
     * @param after {string} token comments page
     * @param id {string} post (for main comment) or comment id (for sub comment)
     * @return {Promise<any>} for synchronize parse posts
     */

    function getComments(after, id) {
        var formData = new FormData();
        formData.append("fb_dtsg", token);
        formData.append("av", myUserId);
        formData.append("__user", myUserId);
        formData.append("__a", "1");
        formData.append("fb_api_caller_class", "RelayModern");
        formData.append("fb_api_req_friendly_name", "CometUFICommentsProviderPaginationQuery");
        formData.append("doc_id", "3384995174931261");
        formData.append("variables", "{\"after\":".concat(after, ",\"before\":null,\"displayCommentsFeedbackContext\":null,\"displayCommentsContextEnableComment\":null,\"displayCommentsContextIsAdPreview\":null,\"displayCommentsContextIsAggregatedShare\":null,\"displayCommentsContextIsStorySet\":null,\"feedLocation\":\"TIMELINE\",\"feedbackID\":\"").concat(id, "\",\"feedbackSource\":0,\"first\":5,\"focusCommentID\":null,\"includeHighlightedComments\":false,\"includeNestedComments\":true,\"isInitialFetch\":false,\"isPaginating\":true,\"last\":null,\"scale\":1,\"topLevelViewOption\":null,\"useDefaultActor\":false,\"viewOption\":null,\"UFI2CommentsProvider_commentsKey\":\"ProfileCometTimelineRoute\",\"id\":\"").concat(userId, "\"}"));
        return fetch("https://www.facebook.com/api/graphql/", {
            "body": formData,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(function (res) {
            return res.json();
        }).then(function (result) {
            return result;
        });
    }

    /**
     * Parse about page and save in global var results
     * @see results
     * @return {Promise<boolean>} for synchronize parse
     */

    function getBasicInfo() {
        return requestUserApout().then(function (text) {
            /** get All tokens */
            var jsons = text.split('\n');
            var first = JSON.parse(jsons[0]);
            var datafound = jsons.filter(function (item) {
                return item.indexOf('"tracking":"202"') > -1
            });

            bio_title = "";
            bio_title_url = "";
            bio_address = "";
            var hrefTitle = "";
            try {
                let dataItemfound = datafound;
                if (datafound.length > 0) {
                    dataItemfound = JSON.parse(datafound);
                }

                if (typeof dataItemfound != 'undefined' && typeof dataItemfound.data != 'undefined' && typeof dataItemfound.data.activeCollections.nodes[0]!= 'undefined' && dataItemfound.data.activeCollections.nodes[0].style_renderer.profile_field_sections.length > 0) {
                    console.log('in');
                    if(dataItemfound.data.activeCollections.nodes[0].style_renderer.profile_field_sections
                        [0].field_section_type == "overview" ){
                        console.log(dataItemfound.data.activeCollections.nodes[0].style_renderer.profile_field_sections[0].profile_fields.nodes[2].title.text);
                        bio_address = dataItemfound.data.activeCollections.nodes[0].style_renderer.profile_field_sections[0].profile_fields.nodes[2].title.text
                
                        const commonPrefixes = ["Lives in", "From"];
                        const suffixRegex = /\s*$/;
                    
                        for (const prefix of commonPrefixes) {
                            const prefixRegex = new RegExp(`^${prefix}\\s*`);
                            bio_address = bio_address.replace(prefixRegex, ''); // Remove common prefixes
                        }
                        bio_address = bio_address.replace(suffixRegex, ''); // Remove trailing whitespaces
                    
                        bio_address = bio_address.trim();
                        friend_address = bio_address.trim();
                        console.log(bio_address);
                    }else{
                        bio_address = "";
                    }
                }
                if (typeof dataItemfound != 'undefined' && typeof dataItemfound.data != 'undefined' && typeof dataItemfound.data.activeCollections.nodes[1] != 'undefined' && dataItemfound.data.activeCollections.nodes[1].style_renderer.profile_field_sections.length > 0) {
                    bio_title = dataItemfound.data.activeCollections.nodes[1].style_renderer.profile_field_sections[0].profile_fields.nodes[0].title.text;

                    if (bio_title == "Add a workplace") {
                        hrefTitle = '';
                    } else {
                        if (dataItemfound.data.activeCollections.nodes[1].style_renderer.profile_field_sections[0].profile_fields.nodes[0].title.ranges[0].entity.url == '') {
                            hrefTitle = 'javascript:void(0)';
                        } else {
                            hrefTitle = dataItemfound.data.activeCollections.nodes[1].style_renderer.profile_field_sections[0].profile_fields.nodes[0].title.ranges[0].entity.url;
                        }
                    }
                    bio_title_url = hrefTitle;
                } else if (typeof second != 'undefined' && typeof second.data.activeCollections.nodes[1] != 'undefined') {

                }
            } catch (err) {
                bio_title = "";
                bio_title_url = "";
                bio_address = "";
            }

            var collectionToken = "";
            var sectionToken = "";
            /** Save pages url and get about page tokens */

            var _iterator5 = _createForOfIteratorHelper(first.data.user.about_app_sections.nodes),
                _step5;

            try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var pageNode = _step5.value;

                    if (pageNode.name.toLowerCase() === "about") {
                        sectionToken = pageNode.id;
                        aboutUrl = pageNode.url;

                        var _iterator11 = _createForOfIteratorHelper(pageNode.all_collections.nodes),
                            _step11;

                        try {
                            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                                var note = _step11.value;

                                if (note.name.toLowerCase() === "contact and basic info") {
                                    collectionToken = note.id;
                                }
                            }
                        } catch (err) {
                            _iterator11.e(err);
                        } finally {
                            _iterator11.f();
                        }
                    } else if (pageNode.name.toLowerCase() === "reviews") {
                        reviewsUrl = pageNode.url;
                    } else if (pageNode.name.toLowerCase() === "photos") {
                        photosUrl = pageNode.url;
                    } else if (pageNode.name.toLowerCase() === "videos") {
                        videosUrl = pageNode.url;
                    } else if (pageNode.name.toLowerCase() === "friends") {
                        friendsUrl = pageNode.url;
                    }
                }
                /** get about page (contact and basic section) info */

            } catch (err) {
                _iterator5.e(err);
            } finally {
                _iterator5.f();
            }
            // console.log('with params');
            return requestUserApout("\"".concat(collectionToken, "\""), "\"".concat(sectionToken, "\"")).then(function (text) {
                var bio = {
                    bio_basic: "",
                    bio_contact: "",
                    bio_social: ""
                };
                var jsons = text.split('\n');

                var _iterator6 = _createForOfIteratorHelper(jsons),
                    _step6;

                try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                        var json = _step6.value;
                        var data = JSON.parse(json);
                        //console.log(data);

                        if (data.data.activeCollections) {
                            var profile_field_sections = data.data.activeCollections.nodes[0].style_renderer.profile_field_sections;

                            var _iterator7 = _createForOfIteratorHelper(profile_field_sections),
                                _step7;

                            try {
                                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                                    var profile_field_section = _step7.value;
                                    var info = [];

                                    var _iterator8 = _createForOfIteratorHelper(profile_field_section.profile_fields.nodes),
                                        _step8;

                                    try {
                                        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                                            var node = _step8.value;

                                            /** scip update info text (for wen adding your own page) */
                                            if (node.field_type !== "upsell" && node.title.text !== "" && node.title.text !== "No contact info to show" && node.title.text !== "No links to show") {
                                                var _node$list_item_group, _node$list_item_group2, _node$list_item_group3;

                                                var fieldType = node.field_type;

                                                if (node !== null && node !== void 0 && (_node$list_item_group = node.list_item_groups[0]) !== null && _node$list_item_group !== void 0 && (_node$list_item_group2 = _node$list_item_group.list_items[0]) !== null && _node$list_item_group2 !== void 0 && (_node$list_item_group3 = _node$list_item_group2.text) !== null && _node$list_item_group3 !== void 0 && _node$list_item_group3.text) {
                                                    fieldType = node.list_item_groups[0].list_items[0].text.text;
                                                }

                                                info.push({
                                                    field_type: fieldType,
                                                    text: node.title.text,
                                                    is_editing: 0
                                                });
                                            }
                                        }
                                    } catch (err) {
                                        _iterator8.e(err);
                                    } finally {
                                        _iterator8.f();
                                    }

                                    var title = profile_field_section.title.text.toLowerCase(); // info = JSON.stringify(info);

                                    if (title === "basic info") {
                                        bio.bio_basic = JSON.stringify(info);
                                    } else if (title === "contact info") {
                                        var defaultBioContact = [{
                                            field_type: "Email",
                                            text: " "
                                        }, {
                                            field_type: "Mobile",
                                            text: " "
                                        }, {
                                            field_type: "Address",
                                            text: bio_address
                                        }, {
                                            field_type: "Title",
                                            text: bio_title
                                        }, {
                                            field_type: "TitleUrl",
                                            text: bio_title_url
                                        }];

                                        var _iterator9 = _createForOfIteratorHelper(info),
                                            _step9;
                                            //console.log(_iterator9);

                                        try {
                                            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                                                var item = _step9.value;
                                                //console.log(item);

                                                if (item.field_type === 'Email') {
                                                    defaultBioContact[0].text = item.text;
                                                }

                                                if (item.field_type === 'Mobile') {
                                                    defaultBioContact[1].text = item.text;
                                                }

                                                if (item.field_type === 'Address' && defaultBioContact[2].text == '') {
                                                    defaultBioContact[2].text = item.text;
                                                }

                                                if (item.field_type === 'Title') {
                                                    defaultBioContact[3].text = item.text;
                                                }

                                                if (item.field_type === 'TitleUrl') {
                                                    defaultBioContact[4].text = item.text;
                                                }


                                            }
                                        } catch (err) {
                                            _iterator9.e(err);
                                        } finally {
                                            _iterator9.f();
                                        }

                                        bio.bio_contact = JSON.stringify(defaultBioContact);
                                    } else if (title === "websites and social links" || title === 'category') {
                                        var defaultBioSocial = [{
                                            "field_type": "Facebook",
                                            "text": [userLink],
                                            is_editing: 0
                                        }, {
                                            "field_type": "LinkedIn",
                                            "text": [],
                                            is_editing: 0
                                        }, {
                                            "field_type": "YouTube",
                                            "text": [],
                                            is_editing: 0
                                        }, {
                                            "field_type": "Instagram",
                                            "text": [],
                                            is_editing: 0
                                        }, {
                                            "field_type": "Twitter",
                                            "text": [],
                                            is_editing: 0
                                        }, {
                                            "field_type": "Pinterest",
                                            "text": [],
                                            is_editing: 0
                                        }];

                                        var defaultBioContact = [{
                                            field_type: "Email",
                                            text: " "
                                        }, {
                                            field_type: "Mobile",
                                            text: " "
                                        }, {
                                            field_type: "Address",
                                            text: " "
                                        }, {
                                            field_type: "Title",
                                            text: " "
                                        }, {
                                            field_type: "TitleUrl",
                                            text: " "
                                        }];

                                        // console.log('Parsed info', info, userLink);

                                        var _iterator10 = _createForOfIteratorHelper(info),
                                            _step10;

                                        try {
                                            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                                                var _item = _step10.value;

                                                if (_item.field_type === 'Facebook' && !defaultBioSocial[0].text.includes(_item.text) && defaultBioSocial[0].text.length === 0) {
                                                    defaultBioSocial[0].text.push(_item.text);
                                                }

                                                if (_item.field_type === 'LinkedIn' && !defaultBioSocial[1].text.includes(_item.text) && defaultBioSocial[1].text.length === 0) {
                                                    if (_item.text.indexOf('linkedin.com') + 1) {
                                                        defaultBioSocial[1].text.push(_item.text);
                                                    } else {
                                                        defaultBioSocial[1].text.push("https://www.linkedin.com/".concat(_item.text));
                                                    }
                                                }

                                                if (_item.field_type === 'YouTube' && !defaultBioSocial[2].text.includes(_item.text) && defaultBioSocial[2].text.length === 0) {
                                                    if (_item.text.indexOf('https://www.youtube.com/') + 1) {
                                                        defaultBioSocial[2].text.push(_item.text);
                                                    } else {
                                                        defaultBioSocial[2].text.push("https://www.youtube.com/".concat(_item.text));
                                                    }
                                                }

                                                if (_item.field_type === 'Instagram' && !defaultBioSocial[3].text.includes(_item.text) && defaultBioSocial[3].text.length === 0) {
                                                    if (_item.text.indexOf('https://www.instagram.com/') + 1) {
                                                        defaultBioSocial[3].text.push(_item.text);
                                                    } else {
                                                        defaultBioSocial[3].text.push("https://www.instagram.com/".concat(_item.text));
                                                    }
                                                }

                                                if (_item.field_type === 'Twitter' && !defaultBioSocial[4].text.includes(_item.text) && defaultBioSocial[4].text.length === 0) {
                                                    if (_item.text.indexOf('twitter.com/') + 1) {
                                                        defaultBioSocial[4].text.push(_item.text);
                                                    } else {
                                                        defaultBioSocial[4].text.push("https://twitter.com/".concat(_item.text));
                                                    }
                                                }

                                                if (_item.field_type === 'Pinterest' && !defaultBioSocial[5].text.includes(_item.text) && defaultBioSocial[5].text.length === 0) {
                                                    defaultBioSocial[5].text.push(_item.text);
                                                }
                                            }
                                        } catch (err) {
                                            _iterator10.e(err);
                                        } finally {
                                            _iterator10.f();
                                        }

                                        // console.log('Default Bio', defaultBioSocial);

                                        for (var i = 0; i < defaultBioSocial.length; i++) {
                                            if (defaultBioSocial[i].text.length === 0) {
                                                defaultBioSocial[i].text.push("");
                                            }
                                        }

                                        bio.bio_social = JSON.stringify(defaultBioSocial);
                                    }
                                }
                            } catch (err) {
                                _iterator7.e(err);
                            } finally {
                                _iterator7.f();
                            }
                        }
                    }
                } catch (err) {
                    _iterator6.e(err);
                } finally {
                    _iterator6.f();
                }

                results.bio = bio;
                return true;
            });
        });
        /**
         * Page page info
         * @param {String || null} [collectionToken = null] Page token, null for get all page tokes
         * @param {String || null}  [sectionToken = null] Section in page token
         * @return {Promise<Text>}
         */

        // get friends details
        function requestUserApout() {


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
            formData.append("variables", "{\"appSectionFeedKey\":\"ProfileCometAppSectionFeed_timeline_nav_app_sections__100041663866376:2327158227\",\"collectionToken\":".concat(collectionToken, ",\"rawSectionToken\":\"100041663866376:2327158227\",\"scale\":1,\"sectionToken\":").concat(sectionToken, ",\"userID\":\"").concat(userId, "\"}"));
            return fetch("https://www.facebook.com/api/graphql/", {
                "body": formData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(function (res) {
                return res.text();
            }).then(function (text) {
                /** check if the facebook token not works */
                if (text.length === 0 || text.indexOf('Please try closing and re-opening your browser window.') + 1) {
                    return updateToken().then(function () {
                        return requestUserApout(collectionToken, sectionToken);
                    });
                }
                return text;
            });
        }

        function requestPageAbout() {
            var formData = new FormData();
            formData.append("fb_dtsg", token);
            formData.append("av", myUserId);
            formData.append("__user", myUserId);
            formData.append("__a", "1");
            formData.append("__comet_req", "1");
            formData.append("fb_api_caller_class", "RelayModern");
            formData.append("fb_api_req_friendly_name", "PagesCometAboutRootQuery");
            formData.append("doc_id", "3654525204666563");
            formData.append("variables", "{\"pageID\":\"".concat(pageID, "\",\"scale\":1}"));
            return fetch("https://www.facebook.com/api/graphql/", {
                "body": formData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(function (res) {
                return res.text();
            }).then(function (text) {
                /** check if the facebook token not works */
                if (text.length === 0 || text.indexOf('Please try closing and re-opening your browser window.') + 1) {
                    return updateToken().then(function () {
                        return requestPageAbout(collectionToken, sectionToken);
                    });
                }
                return JSON.parse(text);
            });
        }
    }


}

// Helping functions
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true,
        didErr = false,
        err; return {
            s: function s() { it = o[Symbol.iterator](); }, n: function n() {
                var step = it.next();
                normalCompletion = step.done; return step;
            }, e: function e(_e2) {
                didErr = true;
                err = _e2;
            }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } }
        };
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
        return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
        return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

//unfriendFriend();
// `<p class="simple-txt" id="count-show"><span id="processed_unfriend_member">0</span> REQUESTS IS ON <span class="total_members"> ${totalUnFriends}</span></p>`
function unFriendProgressModel() {
    let html_processing_model = `<section class="main-app">
                        <div class="overlay-ld">
                            <div class="container-ld">
                                <h3 class="title_lg">UNFRIEND IS PROCESSING</h3>
                                <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                                <div class="loading">
                                    <span class="fill"></span>
                                </div>
                                
                                <button class="btn__lg gredient-button scl-process-btn" type="button" id="stop_unfriend" data-tabid="">Stop Process</button>
                            </div>
                        </div>
                    </section>`;
    $("body:not('.process-model-added')").prepend(html_processing_model);
    $("body").addClass("process-model-added");
}