let Unfollow;
let totalFriends = 0;
(function ($) {
    console.log('here');
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
        },
        onInitMethods: function () {
            // Run & check appebd btn every 2 seconds

            $(document).on('click','#async_novadata',async function(){
                chrome.runtime.sendMessage({'action':'openUserProfile','from':'unfollow'})
            });
            $(document).on('click','#stop_unfollow',async function(){
                chrome.runtime.sendMessage({'action':'closeUnfollow','from':'unfollow'})
            });
            

        },

        async groupListIntial(message){
            $this.novaDataProgressModel(message.extTabId);
            $("html, body").animate({ scrollTop: $(document).height() }, 1000); 
            totalFriends = await $this.extractTotalFriends();
            console.log("Total Friends:", totalFriends);
            $('.total_members').text(totalFriends);
            $('#count-show').show();
            $this.getFriendList();
        },
        // Get Friend List
        getFriendList: async function () {
                let friendListSelector = $('div.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x1olyfxc img[referrerpolicy="origin-when-cross-origin"]:not(.friend-processed)').parent().parent().parent();

                // console.log('all li - ',friendListSelector);
                // console.log('li - ',friendListSelector.length);
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
                        $("h2.title_lg").text("Completed");
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
                    if(gender != ''){
                        if(gender.includes('female') > 0){
                            gender = 'Female';
                        }else{
                            gender = 'Male';
                        }
                    }
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
                        resolve(0);
                    }else{
                        resolve(1);
                    }
                },1000); 
            });
        },
        extractTotalFriends: async function() {
            return new Promise((resolve) => {
              var totalFriendsElement = $('h1:eq(1)').parent().parent().parent().parent().next().find('span a').text();
             let getCountInterval = setInterval(()=>{
                if($('h1').length > 0){
                    let hElement = $('h1');
                    if($('h1').length > 1){
                        hElement = $('h1:eq(1)');
                    }else if($('h1').length > 2){
                        hElement = $('h1:eq(2)');
                    }
                    clearInterval(getCountInterval);
                    totalFriendsElement = hElement.parent().parent().parent().parent().next().find('span a').text();
                    var totalFriends = totalFriendsElement.match(/\d+/); // Extract numeric digits
                    console.log('totalFriends - ',totalFriends);
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
              },2000);
            });
        },
        hasConversation:async function(){
            return new Promise((resolve) => {
                convertInterval = setInterval(()=>{
                    if( $('div[aria-label="Message"]').length > 0){
                        clearInterval(convertInterval);
                        $('div[aria-label="Message"]:eq(0)').click();
                        setTimeout(()=>{
                            //console.log($('div[data-release-focus-from="CLICK"][data-scope="messages_table"]').length)
                            if($('div[data-release-focus-from="CLICK"][data-scope="messages_table"]').length > 0){
                                resolve(0);
                            }else{
                                resolve(1);   
                            }
                        },5000);    
                    }
                },1000);
            });
        },
          
        novaDataProgressModel: function (extTabId) {
            let html_processing_model = `<section class="main-app">
                                <div class="overlay-ld">
                                    <div class="container-ld">
                                        <h3 class="title_lg">NOVA DATA IS PROCESSING</h3>
                                        <p class="simple-txt fs-spacing">PLEASE DO NOT CLOSE THIS WINDOW <br> AND KEEP INTERNET CONNECTION ON</p>
                                        <h2 class="title_lg">NEXT FRIEND IS SEARCHING...</h2>
                                        <div class="loading">
                                            <span class="fill"></span>
                                        </div>
                                        <p class="simple-txt" id="count-show"><span id="processed_member">0</span> REQUESTS IS ON <span class="total_members"> ${totalFriends}</span></p>
                                        <button class="btn__lg gredient-button scl-process-btn" type="button" id="stop_unfollow" data-tabid="${extTabId}">stop sending</button>
                                    </div>
                                </div>
                            </section>`;
            $("body:not('.process-model-added')").prepend(html_processing_model);
            $("body").addClass("process-model-added");
        },

    }
    Unfollow.initilaize();
})(jQuery);