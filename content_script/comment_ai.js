/*
 * 
 * CommentAI Javascript
 * 
 * @since 2.0.0
 * 
 */
let CommentAI;
(function($) {
    let $this;
    let button = $('<button>', {
        id: 'comment_Ai',
        text: 'Comment with NovaAI',
        style: "  height: 40px; width: 100%; margin-top: 15px; margin-bottom: 15px;"

    });
    CommentAI = {
        settings: {},
        initilaize: function() {
            $this = CommentAI;
            $(document).ready(function() {                
                $this.onInitMethods();
            });
        },
        onInitMethods: function() { 

        }, 
        addAIButton: function() {
            let current_url = window.location.href;  
            //console.log(current_url);
            if(current_url === "https://www.facebook.com/" || current_url === "https://www.facebook.com") {
                if ($('#comment_Ai').length == 0) {
                    $('div[aria-label="Create a post"]').parent().parent().parent().append(button);
                }
            }else if(window.location.href.indexOf('groups') > -1){
                console.log("in the groups");
                
                    if ($('#comment_Ai').length == 0) {
                     
                        $('.x1yztbdb').find('[aria-label="Profile"]').parent().parent().parent().parent().parent().parent().append(button);
                        // $('#comment_Ai').css("width", "250px");
                    }
            }else if(window.location.href.indexOf('profile.php?') > -1){
                if ($('#comment_Ai').length == 0) {

                    $('.x1yztbdb').find('[aria-label="Filters"]').parent().parent().parent().parent().parent().parent().parent().prepend(button);
                    // $('#comment_Ai').css("width", "250px");
                }
            }
            else{
                console.log("in the groups");
                    if ($('#comment_Ai').length == 0) {
                        $('.x1yztbdb').find('[role="tablist"]').parent().parent().parent().prepend(button);
                        // $('#comment_Ai').css("width", "250px");
                    } 
            }  
        } 
    };
    CommentAI.initilaize();
})(jQuery);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    checkPopupActive();
});

$(document).on("click", "#comment_Ai", function () {
    const notesModal = createNotesModal();
    $('body').append($(notesModal));
    $('.popup-backdrop').show();
    checkPopupActive();
});

$(document).on('click', 'i.close_Ai_popup', function () {
    $(".popup-backdrop").remove();
});

$(document).on('click','.popup-backdrop',function (event) {
    console.log("backdrop clicked");
    if (!$(event.target).closest('.ai-popup').length) {
        // If the click is not within the ai-popup, close it
        $(".popup-backdrop").remove();
    }
});

// Prevent propagation of click events from .ai-popup to .popup-backdrop
$(document).on('click','.ai-popup',function (event) {
    event.stopPropagation();
});



$(document).on('click', '#custom_comment', function () {
    $('input[name="custom_comments"][type="text"]').focus();
    $('input[name="custom_comments"][type="text"]').css('display','block');
});

$(document).on('click', '#custom_time', function () {
    $('input[name="custom_times"][type="text"]').focus();
    $('input[name="custom_times"][type="text"]').css('display','block');
});

$(document).on('change','input[name="times"]', function() {
    // Perform your operation here
    console.log("Selected value:", $(this).val());
    if($(this).val() == 'custom'){
        $('input[name="custom_times"][type="text"]').focus();
        $('input[name="custom_times"][type="text"]').css('display','block');
    }else{
        $('input[name="custom_times"][type="text"]').css('display','none'); 
    }
});

$(document).on('change','input[name="comments"]', function() {
    // Perform your operation here
    console.log("Selected value:", $(this).val());
    if($(this).val() == 'custom'){
        $('input[name="custom_comments"][type="text"]').focus();
        $('input[name="custom_comments"][type="text"]').css('display','block');
    }else{
        $('input[name="custom_comments"][type="text"]').css('display','none'); 
    }
});


let index_post = 1; 

// FUNCTIONLATIES START AFTER CLICK ON LAUNCH AI BUTTON
$(document).on("click", ".popup_play", async function (e) {
    let index = 0;
    let clickedBtn = $(this);
    let commentSent = 0;    

    let limit = getValue('comments');
    let time_interval = getValue('times');

    if (limit > 50 || time_interval < 30) {
        $('.warning').show();
        let inputName = (limit > 50) ? 'custom_comments' : 'custom_times';
        $(`input[name="${inputName}"][type="text"]`).focus();
        return false;
    }

    let writing_style_popup = validateAndFocus('.writing_style_popup', 'writing_style_popup');
    let tone_popup = validateAndFocus('.tone_popup', 'tone_popup');

    if (!writing_style_popup || !tone_popup) {
        return false;
    }

    let opinion_popup = validateAndFocus('.opinion_popup', 'opinion_popup');
    let size_popup = validateAndFocus('.size_popup', 'size_popup');
    let language_popup = validateAndFocus('.language_popup', 'language_popup');
    let emojis_popup = validateAndFocus('.emojis_popup', 'emojis_popup');

    if (!opinion_popup || !size_popup || !language_popup || !emojis_popup) {
        return false;
    }

    $('.loader').show();
    $('.popup_play').hide();

    let temp = {
        opinion: opinion_popup[0],
        size: size_popup[0],
        writing: writing_style_popup,
        tone: tone_popup,
        language: language_popup[0],
        emoji: emojis_popup[0]
    };
    //console.log(temp);
    chrome.storage.sync.set({ responsedata: temp });
    await delay(1000);
    $('.loader').hide();
    $('.popup-backdrop').remove();
    showCustomToastr('info', 'Comment AI feature started', 3000);
    scrollwindowAi(index_post++);
    await delay(3000); 
    showCustomToastr('info', 'Novalya’s Magic is in progress 0 of ' + limit, 1000, true, true, true);
    startAiAutomation(time_interval,temp, limit, commentSent);
    
}) 

$(document).on("click", ".play", function (e) {
    clickedBtn = $(this);

    var linkedin_post_description = $(this).closest('.feed-shared-update-v2__comments-container').parent().parent().find('.feed-shared-update-v2__description-wrapper').text().trim();
    $(this).addClass('current-class-ld');

    let post_conatainer_selector = ".x78zum5.x1n2onr6.xh8yej3";
    $(post_conatainer_selector).removeClass("que-current-container");
    $(this).parent().parent().parent().parent().find(".que-processed-class").closest(post_conatainer_selector).addClass("que-current-container que-red-border");

    selector_post_description = $(".que-current-container").find(
        'div[data-ad-comet-preview="message"][data-ad-preview="message"]'
    );
    console.log(selector_post_description.text());
    if (selector_post_description.text() == "") {
        selector_post_description = $(".que-current-container").find("blockquote");
    }
    if (selector_post_description.length > 0) {
        facebook_post_description = selector_post_description.text();
        console.log(facebook_post_description.length);
        if (facebook_post_description.length > 25) {
            let writing_style_popup = validateAndFocus('.writing_style_popup', 'writing_style_popup');
            console.log(writing_style_popup);
            let tone_popup = validateAndFocus('.tone_popup', 'tone_popup');
        
            if (!writing_style_popup || !tone_popup) {
                return false;
            }
        
            let opinion_popup = validateAndFocus('.opinion_popup', 'opinion_popup');
            let size_popup = validateAndFocus('.size_popup', 'size_popup');
            let language_popup = validateAndFocus('.language_popup', 'language_popup');
            let emojis_popup = validateAndFocus('.emojis_popup', 'emojis_popup');
        
            if (!opinion_popup || !size_popup || !language_popup || !emojis_popup) {
                return false;
            }
        
            $('.loader').show();
            let temp = {
                opinion: opinion_popup[0],
                size: size_popup[0],
                writing: writing_style_popup,
                tone: tone_popup,
                language: language_popup[0],
                emoji: emojis_popup[0]
            };
            console.log(temp);

            chrome.storage.sync.set({ responsedata: temp });
            if (window.location.href.includes("facebook.com")) {
                FacebookDOM.addChatGPTforFacebook(clickedBtn, temp, facebook_post_description);
            }
        } else {
            $('.loader').hide();
            $('.agree_div').show();
            $('.response').show();
            commentLengthStatus = true;
            showCustomToastr('info', 'The input Text is too less', 4000, false, false, false);
        }
    } else {
        $('.loader').hide();
        $('.agree_div').show();
        $('.response').show();
        commentLengthStatus = true;
        showCustomToastr('info', 'There is no text for input in this post', 4000, false, false, false);
    }
})

$(document).on("click", ".reload", function (e) {
    $('.loader').show();
   
    let writing_style_popup = validateAndFocus('.writing_style_popup', 'writing_style_popup');
    console.log(writing_style_popup);
    let tone_popup = validateAndFocus('.tone_popup', 'tone_popup');

    if (!writing_style_popup || !tone_popup) {
        return false;
    }

    let opinion_popup = validateAndFocus('.opinion_popup', 'opinion_popup');
    let size_popup = validateAndFocus('.size_popup', 'size_popup');
    let language_popup = validateAndFocus('.language_popup', 'language_popup');
    let emojis_popup = validateAndFocus('.emojis_popup', 'emojis_popup');

    if (!opinion_popup || !size_popup || !language_popup || !emojis_popup) {
        return false;
    }


    var linkedin_post_description = $(this).closest('.feed-shared-update-v2__comments-container').parent().parent().find('.feed-shared-update-v2__description-wrapper').text().trim();
    $(this).addClass('current-class-ld');



    let post_conatainer_selector = ".x78zum5.x1n2onr6.xh8yej3";

    $(post_conatainer_selector).removeClass("que-current-container");

    $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".que-processed-class")
        .closest(post_conatainer_selector)
        .addClass("que-current-container que-red-border");

    selector_post_description = $(".que-current-container").find(
        'div[data-ad-comet-preview="message"][data-ad-preview="message"]'
    );
    console.log(selector_post_description);

    if (selector_post_description.text() == "") {
        selector_post_description = $(".que-current-container").find("blockquote");
    }
    if (selector_post_description.length > 0) {
        var facebook_post_description = selector_post_description.text();
        //console.log(post_description);
    } else {
        $('.response').show();
        showCustomToastr('info', 'There is no text for input in this post', 4000, false, false, false);
    }
    let temp = {
        opinion: opinion_popup[0],
        size: size_popup[0],
        writing: writing_style_popup,
        tone: tone_popup,
        language: language_popup[0],
        emoji: emojis_popup[0]
    };

        console.log("new temp", temp)
        chrome.storage.sync.set({ "responsedata": temp });
        //  $("body").scrollTop(0);
        // $(this).parents('#quentintou').closest('.que-processed-class').scrollTop(100);

        //$("#quentintou").animate({"scrollTop": $("#quentintou").scrollTop() + 100});
        if (window.location.href.indexOf('facebook.com') > -1) {
            FacebookDOM.addChatGPTforFacebook($(this), temp, facebook_post_description);
        }
    })


$(document).on('change', '.opinion_popup', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    value = selectedValue;
    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
         console.log('result',  result);            
        // console.log('!= "undefined"',  result[0]);            
        if(typeof result.responsedata != "undefined" && result.responsedata != '' ) {            
        } else {
            responsedata = {};                     
        }
        responsedata.opinion = value;
        chrome.storage.sync.set({ "responsedata": responsedata }); 
        
    })
});

$(document).on('change', '.writing_style_popup', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;
    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.writing = value;
        console.log(responsedata);
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

$(document).on('change', '.tone_popup', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;

    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.tone = value;
        console.log(responsedata);
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

$(document).on('change', '.size_popup', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;

    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.size = value;
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

$(document).on('change', '.language_popup', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;

    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.language = value;
        console.log(responsedata);
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

$(document).on('change', '.emojis_popup', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;

    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.emoji = value;
        console.log(responsedata);
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

//storageupdate($(this));


// -------------------------------------COMMENT AI CODE STARTS------------------------
appendHTML = `
<div id="quentintou">
    <div class="loader" style="display:none"></div>
    <div class="settings-box">
    <h6>Select Your AI Comment Settings</h6>

    <div class="options-box">
      <div class="input-box">
        <select class="opinion_popup" data-type="opinion_popup">
          <option value="">opinion</option>
          <option value="Positive">Positive</option>
          <option value="Engaging">Engaging</option>
          <option value="Constructive Criticism">Constructive Criticism</option>
          <option value="Neutral">Neutral</option>
        </select>
      </div>
      <div class="input-box">
        <select
          class="writing_style_popup"
          data-type="writing_style_popup"
        >
          <option value="">Writing</option>
          <option value="Conversational">Conversational</option>
          <option value="Informative">Informative</option>
          <option value="Descriptive">Descriptive</option>
          <option value="Creative">Creative</option>
          <option value="Friendly">Friendly</option>
          <option value="Professional">Professional</option>
        </select>
      </div>
      <div class="input-box">
        <select class="tone_popup" data-type="tone_popup">
          <option value="">Tone</option>
          <option value="Encouraging">Encouraging</option>
          <option value="Respectful">Respectful</option>
          <option value="Enthusiastic">Enthusiastic</option>
          <option value="Humorous">Humorous</option>
          <option value="Objective">Objective</option>
        </select>
      </div>
      <div class="input-box">
        <select class="size_popup" data-type="tone_popup">
          <option value="">Size</option>
          <option value="Long">Long</option>
          <option value="Medium">Medium</option>
          <option value="Short">Short</option>
        </select>
      </div>
      <div class="input-box">
        <select class="language_popup" data-type="language_popup">
          <option value="">Language</option>
          <option value="Auto detect">Auto detect</option>
          <option value="English">English</option>
          <option value="French">French</option>
        </select>
      </div>
      <div class="input-box">
        <select class="emojis_popup" data-type="emojis_popup">
          <option value="">Emojis</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  </div>
  <span class="btn-purple btn-launch play"> LAUNCH AI </span>
  <span style="display:none" class="btn-purple btn-launch reload"> REGENERATE </span>
</div>
</div>`;

function createNotesModal() {
    return `
    <main class="popup-backdrop">
    <div class="ai-popup">
      <div class="ai-popup-head">
        <h3>
          Customize Your Automated AI Comments <br />
          <a href="https://app.novalya.com/comment-ai">How does it work?</a>
        </h3>
        <i class="close_Ai_popup">✕</i>
      </div>
      <div class="sb-grid">
        <div class="selection-box">
          <div class="default-values">
            <h6>Select the number of comments</h6>
            <div class="selection-grid">
              <div class="selection-card">
                <input
                  type="radio"
                  value="3"
                  name="comments"
                  id="comment1"
                  checked
                />
                <label for="comment1">3</label>
              </div>
              <div class="selection-card">
                <input type="radio" value="5" name="comments" id="comment2" />
                <label for="comment2">5</label>
              </div>
              <div class="selection-card">
                <input
                  type="radio"
                  value="10"
                  name="comments"
                  id="comment3"
                />
                <label for="comment3">10</label>
              </div>
              <div class="selection-card">
                <input
                  type="radio"
                  value="15"
                  name="comments"
                  id="comment4"
                />
                <label for="comment4">15</label>
              </div>
              <div class="selection-card">
                <input
                  type="radio"
                  value="20"
                  name="comments"
                  id="comment5"
                />
                <label for="comment5">20</label>
              </div>
              <div class="selection-card">
                <input
                  type="radio"
                  value="custom"
                  name="comments"
                  id="custom_comment"
                />
                <label for="custom_comment">Custom</label>
              </div>
            </div>
          </div>
          <div class="custom-amount">
            <!-- <div class="or">
              OR
              <div></div>
            </div> -->
            <div class="input-box">
              <span class="warning" style="display: none"
                >Custom can’t be higher than ‘50’</span
              >

              <input
                id="custom_comment_input"
                name="custom_comments"
                type="text"
                style="display: none"
                placeholder="Custom Number of Comments"
              />
            </div>
          </div>
        </div>
        <div class="selection-box">
          <div class="default-values">
            <h6>Select the number of seconds</h6>
            <div class="selection-grid">
              <div class="selection-card">
                <input
                  type="radio"
                  value="30"
                  name="times"
                  id="time1"
                  checked
                />
                <label for="time1">30</label>
              </div>
              <div class="selection-card">
                <input type="radio" value="45" name="times" id="time2" />
                <label for="time2">45</label>
              </div>
              <div class="selection-card">
                <input type="radio" value="60" name="times" id="time3" />
                <label for="time3">60</label>
              </div>
              <div class="selection-card">
                <input type="radio" value="90" name="times" id="time4" />
                <label for="time4">90</label>
              </div>
              <div class="selection-card">
                <input type="radio" value="120" name="times" id="time5" />
                <label for="time5">120</label>
              </div>
              <div class="selection-card sc-custom">
                <input
                  type="radio"
                  value="custom"
                  name="times"
                  id="custom_time"
                />
                <label for="custom_time">Custom</label>
              </div>
            </div>
          </div>
          <div class="custom-amount">
            <!-- <div class="or">
              OR
              <div></div>
            </div> -->
            <div class="input-box">
              <span class="warning" style="display: none"
                >Custom can’t be lower than ‘30’ seconds</span
              >
              <input
              style="display: none"
                type="text"
                name="custom_times"
                placeholder="Custom Number of Seconds"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="settings-box">
        <h6>Select your settings</h6>

        <div class="options-box">
          <div class="input-box">
            <select class="opinion_popup" data-type="opinion_popup">
              <option value="">opinion</option>
              <option value="Positive">Positive</option>
              <option value="Engaging">Engaging</option>
              <option value="Constructive Criticism">Constructive Criticism</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
          <div class="input-box">
            <select
              class="writing_style_popup"
              data-type="writing_style_popup"
            >
              <option value="">Writing</option>
              <option value="Conversational">Conversational</option>
              <option value="Informative">Informative</option>
              <option value="Descriptive">Descriptive</option>
              <option value="Creative">Creative</option>
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div class="input-box">
            <select class="tone_popup" data-type="tone_popup">
              <option value="">Tone</option>
              <option value="Encouraging">Encouraging</option>
              <option value="Respectful">Respectful</option>
              <option value="Enthusiastic">Enthusiastic</option>
              <option value="Humorous">Humorous</option>
              <option value="Objective">Objective</option>
            </select>
          </div>
          <div class="input-box">
            <select class="size_popup" data-type="tone_popup">
              <option value="">Size</option>
              <option value="Long">Long</option>
              <option value="Medium">Medium</option>
              <option value="Short">Short</option>
            </select>
          </div>
          <div class="input-box">
            <select class="language_popup" data-type="language_popup">
              <option value="">Language</option>
              <option value="Auto detect">Auto detect</option>
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>
          <div class="input-box">
            <select class="emojis_popup" data-type="emojis_popup">
              <option value="">Emojis</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>
      <div class="loader" style="display: none"></div>
      <span class="btn-purple btn-launch popup_play"> LAUNCH AI </span>
     
    </div>
  </main>`;
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function storageupdate(something) {
//     //console.log("something", something)
// }

function getValue(name) {
    let value = $(`input[name="${name}"]:checked`).val();
    return (value === 'custom') ? $(`input[name="custom_${name}"][type="text"]`).val() : value;
}

function validateAndFocus(selector, variableName) {
    let value = $(selector).val();
    if (value === "") {
        $(selector).focus();
        return false;
    }
    return [value];
}




setInterval(() => {
    checkPopupActive();
    // AiThemeChange();
}, 1000);


function AiThemeChange(){
  if ($('._9dls.__fb-dark-mode').length > 0) {
    // Perform operation when __fb-dark-mode is present
    console.log('Dark mode is active!');
   $('.settings-box').css("background-color","white")
} else {
    // Perform operation when __fb-dark-mode is not present
    console.log('Dark mode is not active!');
    $('.settings-box').css("background-color","black");
}
}

// To start the CommntAi automation process  
async function startAiAutomation(time_interval, temp, limit, commentSent) {
    console.log(commentSent,limit);
   
    if (commentSent < limit) {
        //console.log("Comment AI Automation start");
        let delay_ci = time_interval * 1000;     
        await processFeed(time_interval, temp, limit, commentSent);
    } else {
      $("#toastrMessage").text(`“Goal Achieved. Congratulations!”`);
        // showCustomToastr('success', 'Process completed..', 30000, true);
    }
}


// To get the dom of the POSTS for comment AI autimation
async function processFeed(time_interval, temp, limit, commentSent) {   
    const SELECTOR_POST_FEED_LI = $(`div[role="main"] div[aria-labelledby][aria-describedby]:not(.cai-post-proccessed):eq(0)`);
    if($(SELECTOR_POST_FEED_LI).length > 0) { 
        showCustomToastr('info', 'Preparing a post to send a comment.', 10000);
        await delay(1000);  
        if(SELECTOR_POST_FEED_LI.find('div[data-ad-comet-preview="message"][data-ad-preview="message"]').length > 0 || SELECTOR_POST_FEED_LI.find("blockquote").length > 0 || SELECTOR_POST_FEED_LI.find(".x1pi30zi.xexx8yu").length > 0 ) {
            let post_description_scenario1 = SELECTOR_POST_FEED_LI.find('div[data-ad-comet-preview="message"][data-ad-preview="message"]').text();
            let post_description_scenario2 = SELECTOR_POST_FEED_LI.find("blockquote.x11i5rnm.xieb3on.x1d52u69").text();
            let post_description_scenario3 = SELECTOR_POST_FEED_LI.find(".x1pi30zi.xexx8yu").text();
                 console.log("reached here");
                 console.log(post_description_scenario1);
                 console.log(post_description_scenario2);
                 console.log(post_description_scenario3);
            if (post_description_scenario1.length > 25 || post_description_scenario2.length > 25 || post_description_scenario3.length > 25) {                
                //await processPost(SELECTOR_POST_FEED_LI, time_interval, temp, limit, commentSent);
                await processButtons(SELECTOR_POST_FEED_LI, time_interval, temp, limit, commentSent);
            } else {
                showCustomToastr('info', 'The input Text is too less', 10000, false, false, false);
                scrollwindowAi(index_post++);
                SELECTOR_POST_FEED_LI.css("border", "1px solid red"); 
                SELECTOR_POST_FEED_LI.addClass("cai-post-proccessed"); 
                await delay(10000);                     
                startAiAutomation(time_interval, temp, limit, commentSent);
            }
        } else {                      
            scrollwindowAi(index_post++);
            SELECTOR_POST_FEED_LI.css("border", "1px solid red"); 
            SELECTOR_POST_FEED_LI.addClass("cai-post-proccessed"); 
            showCustomToastr('info', 'There is no text for input in this post', 10000, false, false, false);
            await delay(10000);                     
            startAiAutomation(time_interval, temp, limit, commentSent);
        }                     
    } else {
        showCustomToastr('info', 'This is not a valid post; searching for the next one.', 10000, false, false, false);
        scrollwindowAi(index_post++);
        await delay(10000);  
        startAiAutomation(time_interval, temp, limit, commentSent);
    }
}

// To start the processinng of buutons like play button for comment Ai automation
async function processButtons(selector_for_validclass, time_interval, temp, limit, commentSent) {
    await delay(10000);
    const play_button = selector_for_validclass.find("span.play");
    const commentInputbox = selector_for_validclass.find('div[aria-label][contenteditable="true"]');
    if (play_button.length > 0) {
        await processPlayButton(play_button, selector_for_validclass, time_interval, temp, limit, commentSent);
    } else {
        await processCommentButton(selector_for_validclass, time_interval, temp, limit, commentSent);
    }
}


async function processPlayButton(play_button, selector_for_validclass, time_interval, temp, limit, commentSent) {
    play_button.click();
    await delay(10000);
    let countint = 1;
    var popupint =  setInterval(async() => {
        var sendComment = selector_for_validclass.find('div[aria-label="Comment"]:not([aria-disabled])');
        if(sendComment.length > 0){
            clearInterval(popupint);
            // i was here last time
            selector_for_validclass.css("border", "1px solid green"); 
            selector_for_validclass.addClass("cai-post-proccessed"); 
            sendComment.click();   // SEND COMMENT BUTTON CLICKED
            commentSent++;
            $("#toastrMessage").text(`Novalya’s Magic is in progress ${commentSent} of ${limit} `);
            delay_next = time_interval * 1000; 
            showCustomToastr('success', 'The AI comment was sent successfully. '+commentSent, 5000, true);
            scrollwindowAi(index_post++);
            await delay(delay_next);
            startAiAutomation(time_interval, temp, limit, commentSent);
        }  else {
            //FacebookDOM.addReactionPannelFB();
            countint++;
            if(countint > 35) {
                clearInterval(popupint);
                selector_for_validclass.css("border", "1px solid red"); 
                selector_for_validclass.addClass("cai-post-proccessed"); 
                showCustomToastr('error', 'Waited for 35 seconds, but did not find the send comment button.', 5000, true);
                scrollwindowAi(index_post++);
                await delay(5000);
                startAiAutomation(time_interval, temp, limit, commentSent);
            }
        }
    }, 1000)
}


async function processCommentButton(selector_for_validclass, time_interval, temp, limit, commentSent) {
    var comment_button = selector_for_validclass.find('div[aria-label="Leave a comment"]');
    if (comment_button.length > 0) {
        await processCommentButtonClick(comment_button, selector_for_validclass, time_interval, temp, limit, commentSent);
    } else {
        selector_for_validclass.css("border", "1px solid red"); 
        selector_for_validclass.addClass("cai-post-proccessed");
        showCustomToastr('error', 'The comment button for displaying AI panel was not found.', 10000, true);
        scrollwindowAi(index_post++);
        await delay(10000);       
        await startAiAutomation(time_interval, temp, limit, commentSent);
    }
}


async function processCommentButtonClick(comment_button, selector_for_validclass, time_interval, temp, limit, commentSent) {
    
    comment_button.click();
    await delay(10000);
    const play_button2 = selector_for_validclass.find("span.play");
    if (play_button2.length > 0) {  
        await processPlayButton(play_button2, selector_for_validclass, time_interval, temp, limit, commentSent);
    } else {        
        // showCustomToastr('error', "The 'send comment' button was not found.", 10000, true);
        await processPlayButton3(time_interval, temp, limit, commentSent, selector_for_validclass);
    }
}

async function processPlayButton3(time_interval, temp, limit, commentSent, selector_for_validclass) {
    // console.log(commentAiPannel.length);
    //FIND COMMENT AI PLAY BUTTON IN SET INTERVAL
    pPB = 0;
    let clearInterval_findplybtn = setInterval( async function() {
        var play_button3 = $('div.x1al4vs7').find("span.play");
        if (play_button3.length > 0) {
            play_button3.click();
            clearInterval(clearInterval_findplybtn);
            await delay(10000);
           var pPB1 = 0;
            var popupint =  setInterval(async() => {
                // SENT COMMENT BUTTON FIND
                var sendComment2 = $('div.x1al4vs7').find('div[aria-label="Comment"]:not([aria-disabled])');
                if(sendComment2.length > 0){
                  clearInterval(popupint);
                    sendComment2.click();
                      
                    commentSent++; 
                    $("#toastrMessage").text(`Novalya’s Magic is in progress ${commentSent} of ${limit} `);
                    selector_for_validclass.css("border", "1px solid green"); 
                    selector_for_validclass.addClass("cai-post-proccessed"); 
                    showCustomToastr('success', 'The AI comment was sent successfully. '+commentSent, 3000, true); 
                    var closeButton = $('div[aria-label="Close"]');
                    await delay(3000);
                    closeButton.click();
                    console.log("COMMENT POPUP CLOSE BUTTON");      
                    await delay(3000);
                    scrollwindowAi(index_post++);
                    await delay(1000);
                    let next_comment_delay = time_interval * 1000;
                    // await delay(next_comment_delay);
                    startAiAutomation(time_interval, temp, limit, commentSent);       
                }else{
                  pPB1++;
                  if(pPB1 > 35){
                    clearInterval(popupint);
                    selector_for_validclass.css("border", "1px solid red"); 
                    selector_for_validclass.addClass("cai-post-proccessed"); 
                    var closeButton = $('div[aria-label="Close"]');
                    await delay(3000);
                    closeButton.click();
                    showCustomToastr('error', 'Waited for 35 seconds, but did not find the send comment button.', 5000, true);
                    scrollwindowAi(index_post++);
                    await delay(5000);
                    startAiAutomation(time_interval, temp, limit, commentSent);
                  }
                } 
               
                // selector_for_validclass.addClass("cai-post-proccessed");
                // // COMMENT POPUP CLOSE BUTTON
                // var closeButton = $('div[aria-label="Close"]');
                // await delay(3000);
                // closeButton.click();
                // console.log("COMMENT POPUP CLOSE BUTTON");
                // showCustomToastr('success', "The popup for sending a comment closes automatically.", 3000, true);  
                // await delay(3000);
                // scrollwindowAi(index_post++);
                // await delay(1000);
                // let next_comment_delay = time_interval * 1000;
                // startAiAutomation(time_interval, temp, limit, commentSent);
            }, 1000);           
        } else {
            pPB++;
            //showCustomToastr('info', 'searching for play button'+pPB, 3000, true); 
        }
    }, 3000)

}   

async function scrollwindowAi(index_post) {

//async function scrollwindowAi(selector_for_validclass) {
    // let scrollAiDynamic = 0; // Set the appropriate value for scrollAiDynamic
    // let scrollAiStatic = 5; // Set the appropriate value for scrollAiStatic
    // if (currentScrollStep < numScrollSteps) {
    //     // Calculate the next scroll position
    //     let nextScrollPosition = currentScrollStep * scrollStep;

    //     // Animate the scroll to the next position
    //     $("html, body").animate({ scrollTop: nextScrollPosition }, scrollAiDynamic + scrollAiStatic);
    //     $("html, body").animate({ scrollTop: nextScrollPosition }, scrollAiDynamic + scrollAiStatic);

    //     // Increment the current scroll step
    //     currentScrollStep++;
    // }
    //$("html, body").animate({ scrollTop: commentSent * 1400 }, 500);


    // For modern browsers
    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
    //console.log("Scroll height from the top: " + scrollHeight + " pixels");

   // showCustomToastr('success', "Scroll height from the top: " + scrollHeight + " pixels", 10000, true);
    $("html, body").animate({ scrollTop: (scrollHeight + 500 )}, 2800);

    //window.scrollTo(0,window.pageYOffset +$(selector_for_validclass)[0].getBoundingClientRect().top -500);
}


function checkPopupActive(){
    //console.log("checkPopupActive called");
    chrome.storage.sync.get(["responsedata"], function (result) {
        //console.log(result);
        //   // Set the selected options for comments
        //   $("input[name=comments]").filter("[value='" + result.responsedata.comments + "']").prop("checked", true);

        //   // Set the selected options for seconds
        //   $("input[name=times]").filter("[value='" + result.responsedata.times + "']").prop("checked", true);
  
          // Set the selected option for opinion
          $(".opinion_popup").val(result.responsedata.opinion);
  
          // Set the selected option for writing style
          $(".writing_style_popup").val(result.responsedata.writing);
  
          // Set the selected option for tone
          $(".tone_popup").val(result.responsedata.tone);
  
          // Set the selected option for size
          $(".size_popup").val(result.responsedata.size);
  
          // Set the selected option for language
          $(".language_popup").val(result.responsedata.language);
  
          // Set the selected option for emojis
          $(".emojis_popup").val(result.responsedata.emoji);
    });
}