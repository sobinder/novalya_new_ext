let Unfollow;
let totalFriends = 100;
(function ($) {
    let $this;
    let btn = `<button id="data-unfollow">Nova Data</button>`;
    let friendsList = [];
    let height = 2000;
    let counter = 0;
    
    Unfollow = {
        settings: {},
        initilaize: function () {
            $this = Unfollow;
            $(document).ready(function () {
                $this.onInitMethods();
            });

            chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                if (message.action === 'getGenderAndPlace') {
                    let friendDetails = message.friend;
                    (async () => {
                        const gender = await $this.extractGender();
                        const lived = await $this.extractLived();
                        const status = await $this.extractStatus();
                        if (friendDetails) {
                            friendDetails.gender = gender;
                            friendDetails.lived = lived;
                            friendDetails.status= status;
                            chrome.runtime.sendMessage({'action':'saveFriendData',friendDetails:friendDetails});


                        } else {
                            console.error("Invalid friendDetails object.");
                            chrome.runtime.sendMessage({'action':'saveFriendData',friendDetails:friendDetails});
                        }
                    })();
                }
                if(message.action === 'nextFetchFriend'){
                    setTimeout(()=>{
                        $this.getFriendList();
                    },45000);
                } 
            });   
        },
        onInitMethods: function () {
            // Run & check appebd btn every 2 seconds
            const getFriendId = setInterval($this.appendNovaDataButton, 2000);

            $(document).on('click','#data-unfollow',function(){
                $('div[role="tablist"] a:contains("All friends")').click();
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                var totalFriendsElement = $('h1:eq(2)').parent().parent().parent().parent().next().find(' span a').text();
                totalFriends = totalFriendsElement.match(/\d+/);
                if (totalFriends) {
                    totalFriends = totalFriends[0];
                } else {
                    totalFriends = 0;
                }
                if(totalFriends  > 0){
                    $this.novaDataProgressModel()
                }
                console.log("Total Friends:", totalFriends);
                $this.getFriendList();
            });
        },
        // Append Nova Data  button
        appendNovaDataButton: function() {
            if(window.location.href.indexOf('/friends') > 0 || window.location.href.indexOf('/friends_all') > 0 ){
                const friendsLink = $('h2 span a:contains("Friends")');
                if (friendsLink.length > 0) {
                    if ($('#data-unfollow').length === 0) {
                        $('h2').parent().parent().parent().append(btn);
                    }
                }
            }
        },
        // Get Friend List
        getFriendList: async function () {
            console.log('getFriendList');
                const friendListSelector = $('div.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x1olyfxc img[referrerpolicy="origin-when-cross-origin"]:not(.friend-processed)').parent().parent().parent();
                console.log(friendListSelector.length);
                if (friendListSelector.length > 0) {
                    if(totalFriends > counter){
                        let data = {};
                        const friend = friendListSelector[0];
                        $(friend).find('a img').addClass('friend-processed'); 
                        const name =  $(friend).find('a span:eq(1)').text().trim();
                        const image =  $(friend).find('a img').attr('src');
                        const profile =  $(friend).find('a').attr('href');
                        const id = await $this.extractId(profile);
                        
                        data.fbId = id;
                        data.name = name;
                        data.image = image;
                        data.profile = profile;
                        console.log(data);
                        chrome.runtime.sendMessage({ action: "fetchedFriendData", data: data});
                        counter++;
                        $('#processed_member').text(counter);
                    }else{
                        console.log('End of loop reached.');
                        $("#stop_crm").text("Close popup");
                        $(".loading").remove();
                        $("h3.title_lg").text("Completed");
                    }
                }else{ 
                    $this.scrollWindow();  
                }
        },
        // Scroll screen t0 append friend on dom
        scrollWindow:function(){
            $("html, body").animate({ scrollTop: $(document).height() }, height);
            height = height + 1000;
            setTimeout(()=>{
                console.log('setTimeout getFriendList')
                $this.getFriendList();
            },45000);
        },
        // Extract Id from url
        extractId:function(url){
            const profile = new URL(url);
            let id = '';
            if (profile.search === '') {
                id = profile.pathname.replace(/\//g, '');
            } else if (profile.search.includes('?id=')) {
                id = profile.search.split('?id=')[1];
            }
            return id;
        },
        // Define async functions for extracting gender details
        extractGender:function(){
            return new Promise((resolve) => {
                const genderElement = $(document).find('span[dir="auto"]:contains(Gender)').parent().prev('div');
                let gender = '';
                if(genderElement){
                    gender = genderElement.text().trim();
                }
                resolve(gender);
            });
        },
        // Define async functions for extracting lived details
        extractLived :function(){           
            return new Promise((resolve) => {
                const elements = document.querySelectorAll('a span[dir="auto"]');
                let overviewElement;
            
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes("Overview")) {
                        overviewElement = elements[i];
                        break;
                    }
                }
            
                if (overviewElement) {
                    console.log(overviewElement);
                    overviewElement.click();
                    const livedId = setInterval(() => {
                        if ($(document).find('span[dir="auto"]:contains(Lives in) a').length > 0) {
                            clearInterval(livedId);
                            const lived = $(document).find('span[dir="auto"]:contains(Lives in) a').text().trim();
                            console.log(lived);
                            resolve(lived);
                        }
                        setTimeout(()=>{
                            clearInterval(livedId);
                            resolve('');
                        },3000);
                    }, 2000);
                } else {
                    resolve('');
                }
            });
        },
        //Get user status activated or deactivated
        extractStatus:function(){
            return new Promise((resolve) => {
                setTimeout(()=>{
                    const notAvailable = $('span[dir="auto"]:contains("This content isn\'t available right now")');
                
                    if(notAvailable.length == 0){
                        resolve('activate');
                    }else{
                        resolve('deactivate');
                    }
                },1000); 
            });
        },
        novaDataProgressModel: function () {
            let html_processing_model = `<section class="main-app">
                                <div class="overlay-ld">
                                    <div class="container-ld">
                                        <h3 class="title_lg">CAMPAIGN IS PROCESSING</h3>
                                        <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                                        <h3 class="title_lg">NEXT REQUEST IS SENDING...</h3>
                                        <div class="loading">
                                            <span class="fill"></span>
                                        </div>
                                        <p class="simple-txt"><span id="processed_member">0</span> REQUESTS IS ON <span class="total_members"> ${totalFriends}</span></p>
                                        <button class="btn__lg gredient-button scl-process-btn" type="button" id="stop_crm">stop sending</button>
                                    </div>
                                </div>
                            </section>`;
            $("body:not('.process-model-added')").prepend(html_processing_model);
            $("body").addClass("process-model-added");
        },

    }
    Unfollow.initilaize();
})(jQuery);