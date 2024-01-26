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
        text: ' + Ai Comment',
        style: " height: 50px;"

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
            if(current_url === "https://www.facebook.com/" || current_url === "https://www.facebook.com") {
                if ($('#comment_Ai').length == 0) {
                    $('.x78zum5[role="main"]').append(button);
                }
            }  
        } 
    };
    CommentAI.initilaize();
})(jQuery);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    checkactive();
});

$(document).on("click", "#comment_Ai", function () {
    const notesModal = createNotesModal();
    $('body').append($(notesModal));
    $('.popup-backdrop').show();
});

$(document).on('click', 'i.close_Ai_popup', function () {
    $(".popup-backdrop").remove();
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



$(document).on("click", ".play", function (e) {
    clickedBtn = $(this);
    $('.loader').show();
    $('.agree_div').show();
    $('.opinion_option').hide();
    $('.writing_option').hide();
    $('.size_option').hide();
    $('.tone_option').hide();
    $('.language_option').hide();
    // $('.response').hide();
    var opinion = $(this).parents('#quentintou').find('.response .response_opinion span').text();
    var size = $(this).parents('#quentintou').find('.response .response_size span').text();
    var writing = $(this).parents('#quentintou').find('.response .response_writing span');
    var language = $(this).parents('#quentintou').find('.response .response_language span').text();
    var writing_array = [];
    if ($(writing).length > 0) {
        $(writing).each(function (i) {
            if ($.inArray($(this).text(), writing_array) != -1) {
            } else {
                writing_array.push($(this).text())
            }
        });
    }
    var tone = $(this).parents('#quentintou').find('.response .response_tone span');
    var tone_Array = [];
    if ($(tone).length > 0) {
        $(tone).each(function (i) {
            if ($.inArray($(this).text(), tone_Array) != -1) {
                console.log("hello");
            }
            else {
                tone_Array.push($(this).text())
            }
        });
    }
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
            var temp = {
                opinion: opinion,
                size: size,
                writing: writing_array,
                tone: tone_Array,
                language: language
            };


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
    $('.agree_div').show();
    $('.opinion_option').hide();
    $('.writing_option').hide();
    $('.size_option').hide();
    $('.tone_option').hide();
    $('.response').hide();
    var opinion = $(this).parents('#quentintou').find('.response .response_opinion span').text();
    console.log("hello", opinion)
    var size = $(this).parents('#quentintou').find('.response .response_size span').text();
    var writing = $(this).parents('#quentintou').find('.response .response_writing span');
    var language = $(this).parents('#quentintou').find('.response .response_language span').text();
    var writing_array = [];
    if ($(writing).length > 0) {
        $(writing).each(function (i) {
            if ($.inArray($(this).text(), writing_array) != -1) {
                console.log("hello")
            }
            else {
                writing_array.push($(this).text())
            }
        });
    }
    var tone = $(this).parents('#quentintou').find('.response .response_tone span');
    var tone_Array = [];
    if ($(tone).length > 0) {
        $(tone).each(function (i) {
            if ($.inArray($(this).text(), tone_Array) != -1) {
                console.log("hello");
            }
            else {
                tone_Array.push($(this).text())
            }
        });
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
    chrome.storage.sync.get(["language", "job", "sector", "temperature"], function (result) {
        console.log(result);
        var temp = {}
        // if (typeof result.language != "undefined" && result.language != "") {
        //     temp.language = result.language;
        //     temp.opinion = opinion;
        //     temp.size = size;
        //     temp.writing = writing_array;
        //     temp.tone = tone_Array;
        // }
        if (typeof result.job != "undefined" && result.job != "") {
            temp.job = result.job;
            temp.opinion = opinion;
            temp.size = size;
            temp.writing = writing_array;
            temp.tone = tone_Array;
            temp.laguage = language;

        }
        if (typeof result.sector != "undefined" && result.sector != "") {
            temp.sector = result.sector;
            temp.opinion = opinion;
            temp.size = size;
            temp.writing = writing_array;
            temp.tone = tone_Array;
            temp.language = language;

        }
        if (typeof result.temperature != "undefined" && result.temperature != "") {
            temp.temperature = result.temperature;
            temp.opinion = opinion;
            temp.size = size;
            temp.writing = writing_array;
            temp.tone = tone_Array;
            temp.language = language;

        }
        else {
            temp.size = size;
            temp.opinion = opinion;
            temp.writing = writing_array;
            temp.tone = tone_Array;
            temp.language = language;
        }
        console.log("new temp", temp)
        chrome.storage.sync.set({ "responsedata": temp });
        //  $("body").scrollTop(0);
        // $(this).parents('#quentintou').closest('.que-processed-class').scrollTop(100);

        //$("#quentintou").animate({"scrollTop": $("#quentintou").scrollTop() + 100});
        if (window.location.href.indexOf('facebook.com') > -1) {
            FacebookDOM.addChatGPTforFacebook($(this), temp, facebook_post_description);
        }
    })
});

$(document).ready(function () {
    
    $(document).on("click", ".opinion", function (e) {
        $('.agree_div ul li').removeClass('option_active')
        $('.opinion_option').show();
        $('.writing_option').hide();
        $('.size_option').hide();
        $('.tone_option').hide();
        $('.language_option').hide();
        $('.response').show();
    })
    $(document).on("click", ".writing_style", function (e) {
        $('.opinion_option').hide();
        $('.writing_option').show();
        $('.size_option').hide();
        $('.tone_option').hide();
        $('.language_option').hide();
        $('.response').show();
    })
    $(document).on("click", ".tone", function (e) {
        $('.opinion_option').hide();
        $('.writing_option').hide();
        $('.size_option').hide();
        $('.tone_option').show();
        $('.language_option').hide();
        $('.response').show();
    })

    $(document).on("click", ".size", function (e) {
        $('.opinion_option').hide();
        $('.writing_option').hide();
        $('.size_option').show();
        $('.tone_option').hide();
        $('.language_option').hide();
        $('.response').show();
    })

    $(document).on("click", ".language", function (e) {
        $('.opinion_option').hide();
        $('.writing_option').hide();
        $('.size_option').hide();
        $('.tone_option').hide();
        $('.language_option').show();
        $('.response').show();
    });
    $(document).on("click", ".opinion_option ul li", function (e) {
        let value = "";
        $(".response_opinion").remove();
        if ($(this).hasClass("option_active")) {
            $('.opinion_option ul li').removeClass('option_active')
        } else {
            $('.opinion_option ul li').removeClass('option_active');
            $(this).addClass("option_active");
            value = $(this).text();
            $('<div class="response_opinion"><span>' + value + '</span></div>').insertBefore(".inner1")
        }
        chrome.storage.sync.get(["responsedata"], function (result) {
            let responsedata = result.responsedata;
            responsedata.opinion = value;
            chrome.storage.sync.set({ "responsedata": responsedata });
        })
    });
    function storageupdate(something) {
        console.log("something", something)
    }

    $(document).on("click", ".writing_option ul li", function (e) {
        if ($(this).hasClass('option_active')) {
            $(this).removeClass('option_active');
        } else {
            $(this).addClass('option_active');
        }
        let allActiveOptions = $(this).parent().find("li.option_active");
        $(".response_writing").remove();
        let writeText = [];;
        allActiveOptions.map((index, val,) => {
            let value = $(val).text();
            writeText.push(value);
            $('<div class="response_writing"><span>' + value + '</span></div>').insertBefore(".inner2")
        })
        chrome.storage.sync.get(["responsedata"], function (result) {
            let responsedata = result.responsedata;
            responsedata.writing = writeText;
            chrome.storage.sync.set({ "responsedata": responsedata });
        })
    })

    $(document).on("click", ".tone_option ul li", function (e) {
        if ($(this).hasClass('option_active')) {
            $(this).removeClass('option_active');
        } else {
            $(this).addClass('option_active');
        }
        let allActiveOptions = $(this).parent().find("li.option_active");
        $(".response_tone").remove();
        let toneText = [];;
        allActiveOptions.map((index, val,) => {
            let value = $(val).text();
            toneText.push(value);
            $('<div class="response_tone"><span>' + value + '</span></div>').insertBefore(".inner3")
        })
        console.log('toneText-----------', toneText)
        chrome.storage.sync.get(["responsedata"], function (result) {
            let responsedata = result.responsedata;
            responsedata.tone = toneText;
            chrome.storage.sync.set({ "responsedata": responsedata });
        })
    });


    $(document).on("click", ".size_option ul li", function (e) {
        let value = "";
        $(".response_size").remove();
        if ($(this).hasClass("option_active")) {
            $('.size_option ul li').removeClass('option_active')
        } else {
            $('.size_option ul li').removeClass('option_active');
            $(this).addClass("option_active");
            value = $(this).text();
            $('<div class="response_size"><span>' + value + '</span></div>').insertBefore(".inner4")
        }
        chrome.storage.sync.get(["responsedata"], function (result) {
            let responsedata = result.responsedata;
            responsedata.size = value;
            chrome.storage.sync.set({ "responsedata": responsedata });
        })
    });



    $(document).on("click", ".language_option ul li", function (e) {
        let value = "";
        $(".response_language").remove();
        if ($(this).hasClass("option_active")) {
            $('.language_option ul li').removeClass('option_active');
        } else {
            $('.language_option ul li').removeClass('option_active');
            $(this).addClass("option_active");
            value = $(this).text();
            $('<div class="response_language"><span>' + value + '</span></div>').insertBefore(".inner5");
        }
        chrome.storage.sync.get(["responsedata"], function (result) {
            let responsedata = result.responsedata;
            responsedata.language = value;
            chrome.storage.sync.set({ "responsedata": responsedata });
        });
    });


    $(document).on('click', '.option_active', function () {
        var checktext = $(this).text();
        var classfind = $(this).parent().parent().attr('class');

        if (classfind == 'opinion_option') {
            var check = `.opinion_option ul li:contains(${checktext})`;
            $(check).removeClass('option_active')
            var response1 = `.response_opinion span:contains(${checktext})`;
            $(response1).parent().remove();
        }

        if (classfind == 'writing_option') {
            var check2 = `.writing_option ul li:contains(${checktext})`;
            $(check2).removeClass('option_active')
            var response2 = `.response_writing span:contains(${checktext})`;
            $(response2).parent().remove();
        }
        if (classfind == 'tone_option') {
            var check3 = `.tone_option ul li:contains(${checktext})`;
            $(check3).removeClass('option_active')
            var response3 = `.response_tone span:contains(${checktext})`;
            $(response3).parent().remove();
        }
        if (classfind == 'size_option') {
            var check3 = `.size_option ul li:contains(${checktext})`;
            $(check3).removeClass('option_active')
            var response3 = `.size_tone span:contains(${checktext})`;
            $(response3).parent().remove();
        }
        if (classfind == 'language_option') {
            var check4 = `.language_option ul li:contains(${checktext})`;
            $(check4).removeClass('option_active')
            var response4 = `.response_language span:contains(${checktext})`;
            $(response4).parent().remove();
        }
        storageupdate($(this));
    });

    $(document).on('click', '.response div p', function () {
        var checktext = $(this).parent().children('span').text();
        var classfind = $(this).parent().attr('class');

        if (classfind == 'response_opinion') {
            $('.opinion_option ul li').removeClass('option_active')
            $('.opinion').removeClass('option_active')
        }
        if (classfind == 'response_writing') {
            var check = `.writing_option ul li:contains(${checktext})`;
            $(check).removeClass('option_active')
            var checkparent = $('.response_writing span')
            if (checkparent.length <= 1) {
                $('.writing_style').removeClass('option_active');
            }
        }
        if (classfind == 'response_tone') {
            var check = `.tone_option ul li:contains(${checktext})`;
            $(check).removeClass('option_active')
            var checkparent = $('.response_tone span')
            if (checkparent.length <= 1) {
                $('.tone').removeClass('option_active')
            }
        }
        if (classfind == 'response_size') {
            $('.size_option ul li').removeClass('option_active')
            $('.size').removeClass('option_active')
        }
        if (classfind == 'response_language') {
            $('.language_option ul li').removeClass('option_active')
            $('.language').removeClass('option_active')
        }
        $(this).parent().remove();
    });
    storageupdate($(this));
});


$(document).on('change', '.opinion', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    value = selectedValue;
    $('<div class="response_opinion"><span>' + value + '</span></div>').insertBefore(".inner1")
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

$(document).on('change', '.writing_style', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;
    $('<div class="response_writing"><span>' + value + '</span></div>').insertBefore(".inner2")
    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.writing = value;
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

$(document).on('change', '.tone', function () {
    let value = "";
    var selectedType = $(this).data('type');
    var selectedValue = $(this).val();
    console.log('Type:', selectedType, 'Value:', selectedValue);
    value = selectedValue;

    chrome.storage.sync.get(["responsedata"], function (result) {
        let responsedata = result.responsedata;
        responsedata.tone = value;
        chrome.storage.sync.set({ "responsedata": responsedata });
    })
});

$(document).on('change', '.size', function () {
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

$(document).on('change', '.language', function () {
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

$(document).on("click", ".popup_play", function (e) {
    var index = 0;
    clickedBtn = $(this);
    var limit = $('input[name="comments"]:checked').val();
    if(limit == "custom") {
        limit = $('input[name="custom_comments"][type="text"]').val();
    }
    var time_interval = $('input[name="times"]:checked').val();
    if(time_interval == "custom") {
        time_interval = $('input[name="custom_times"][type="text"]').val();
    }
    console.log(limit);
    console.log(time_interval);

    if(limit > 50) {
        $('.warning').show();
        $('input[name="custom_comments"][type="text"]').focus();
        return false;
    }   

    if(time_interval < 30) {
        $('.warning').show();
        $('input[name="custom_times"][type="text"]').focus();
        return false;
    }

    let opinion_popup = $('.opinion_popup').val();
    if (opinion_popup == ""){
        $('.opinion_popup').focus();
        return false;
    } 
    var writing_style_popup = [];
    var writing_style_popup_val = $('.writing_style_popup').val();
    writing_style_popup.push(writing_style_popup_val);
    if (writing_style_popup == ""){
        $('.writing_style_popup').focus();
        return false;
    }

    var tone_popup = [];
     var tone_popup_val = $('.tone_popup').val();
     tone_popup.push(tone_popup_val);
    if (tone_popup == ""){
        $('.tone_popup').focus();
        return false;
    }

    let size_popup = $('.size_popup').val();
    if (size_popup == ""){
        $('.size_popup').focus();
        return false;
    }

    let language_popup = $('.language_popup').val();
    if (language_popup == ""){
        $('.language_popup').focus();
        return false;
    }

    let emojis_popup = $('.emojis_popup').val();
    if (emojis_popup == ""){
        $('.emojis_popup').focus();
        return false;
    }

    $('.loader').show();
    $('.popup_play').hide();

        var temp = {
            opinion: opinion_popup,
            size: size_popup,
            writing: writing_style_popup,
            tone: tone_popup,
            language: language_popup,
            emojis: emojis_popup
        };

        console.log(temp);
        chrome.storage.sync.set({ responsedata: temp });
        setTimeout(() => {
            startAiAutomation(time_interval,temp, limit, index);
        }, 3000);

    //});
})

setInterval(function () {
    checkactive();
}, 4000);

function checkactive() {
    chrome.storage.sync.get(["responsedata"], function (result) {
        // console.log(result);
        if (typeof result.responsedata != "undefined" && result.responsedata != "") {
            // var opinioncheck = $('.response_opinion').remove();
            $(".response_opinion").remove();
            $(".response_writing").remove();
            $(".response_tone").remove();
            $(".response_size").remove();
            $(".response_language").remove();

            if (typeof result.responsedata.opinion != "undefined" && result.responsedata.opinion != "") {
                var check = `.opinion_option ul li:contains(${result.responsedata.opinion})`;
                if (check.length > 0) {
                    $(check).addClass("option_active")
                    $('<div class="response_opinion"><span>' + result.responsedata.opinion + '</span></div>').insertBefore(".inner1")
                }
            }

            if (typeof result.responsedata.writing != "undefined" && result.responsedata.writing.length != "") {
                $(result.responsedata.writing).each(function (i) {
                    var check2 = `.writing_option ul li:contains(${result.responsedata.writing[i]})`;
                    if (check2.length) {
                        $(check2).addClass("option_active")
                        $('<div class="response_writing"><span>' + result.responsedata.writing[i] + '</span></div>').insertBefore(".inner2")
                    }
                });
            }

            if (typeof result.responsedata.tone != "undefined" && result.responsedata.tone.length != "") {
                $(result.responsedata.tone).each(function (i) {
                    var check3 = `.tone_option ul li:contains(${result.responsedata.tone[i]})`;
                    if (check3.length) {
                        $(check3).addClass("option_active")
                        $('<div class="response_tone"><span>' + result.responsedata.tone[i] + '</span></div>').insertBefore(".inner3")
                    }
                });
            }

            if (typeof result.responsedata.size != "undefined" && result.responsedata.size != "") {
                var check = `.size_option ul li:contains(${result.responsedata.size})`;
                // console.log("getcheck",check)
                if (check.length > 0) {
                    $(check).addClass("option_active")
                    $('<div class="response_size"><span>' + result.responsedata.size + '</span></div>').insertBefore(".inner4")
                }
            }

            if (typeof result.responsedata.language != "undefined" && result.responsedata.language != "") {
                var check = `.language_option ul li:contains(${result.responsedata.language})`;
                // console.log("getcheck",check)
                if (check.length > 0) {
                    $(check).addClass("option_active")
                    $('<div class="response_language"><span>' + result.responsedata.language + '</span></div>').insertBefore(".inner5")
                }
            }
        }
    });
}


// -------------------------------------COMMENT AI CODE STARTS------------------------
appendHTML = ` <div id="quentintou">
       <div class="loader" style="display:none"></div>
<div class="agree_div">
<ul>
<li class="opinion">Opinion</li>
<li class="writing_style">Writing</li>
<li class="tone">Tone</li>
<li class="size">Size</li>
<li class="language">Language</li>
<li class="emojis">Emojis</li>
</ul>
<div  class="like_option" style="display:flex">

    <img  style="display:none" class="reload" src="`+ chrome.runtime.getURL("assets/images/reload.png") + `">
    <span class="play"><img  src="`+ chrome.runtime.getURL("assets/images/play_submit.png") + `"></span>
</div>
</div>
<div class="opinion_option">
<ul>
    <li>Agreed</li>
    <li>Disagreed</li>
    <li>Question</li>
    <li>Congratulations</li>
    <li>Encouragement</li>
    <li>Neutral</li>
    </ul>
</div>
<div class="tone_option">
<ul>
    <li>Funny</li>
    <li>Emotional</li>
    <li>Informative</li>
    <li>Narative</li>
    <li>iRONIC</li>
    <li>Enthusiastic</li>
    <li>Serious</li>
    <li>Respectful</li>
    <li>Professional</li>
</ul>
</div>
<div class="writing_option">
<ul>
    <li>Academic</li>
    <li>Analytical</li>
    <li>Argumentative</li>
    <li>Conversational</li>
    <li>Creative</li>
    <li>Critical</li>
    <li>Descriptive</li>
    <li>Concise and witty</li>
    <li>Personal and direct</li>
    </ul>
</div>
<div class="size_option">
<ul>
    <li>Long</li>
    <li>Medium</li>
    <li>Short</li>
    </ul>
</div>

<div class="language_option">
    <ul>
        <li>Auto detect</li>
        <li>English</li>
        <li>French</li>
    </ul>
</div>
<div class="emojis_option">
    <ul>
        <li>Yes</li>
        <li>No</li>
    </ul>
</div>
<div class="response">
<span class="inner1"></span>
<span class="inner2"></span>
<span class="inner3"></span>
<span class="inner4"></span>
<span class="inner5"></span>
<span class="inner6"></span>
</div>`;

function createNotesModal() {
    return `
    <main class="popup-backdrop">
    <div class="ai-popup">
      <div class="ai-popup-head">
        <h3>
          Customize Your Automated AI Comments <br />
          <a href="#">How does it work?</a>
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
              <option value="Agreed">Agreed</option>
              <option value="Disagreed">Disagreed</option>
              <option value="Question">Question</option>
              <option value="Congratulations">Congratulations</option>
              <option value="Encouragement">Encouragement</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
          <div class="input-box">
            <select
              class="writing_style_popup"
              data-type="writing_style_popup"
            >
              <option value="">Writing</option>
              <option value="Academic">Academic</option>
              <option value="Analytical">Analytical</option>
              <option value="Argumentative">Argumentative</option>
              <option value="Conversational">Conversational</option>
              <option value="Creative">Creative</option>
              <option value="Critical">Critical</option>
              <option value="Descriptive">Descriptive</option>
              <option value="Concise and witty">Concise and witty</option>
              <option value="Personal and direct">Personal and direct</option>
            </select>
          </div>
          <div class="input-box">
            <select class="tone_popup" data-type="tone_popup">
              <option value="">Tone</option>
              <option value="Funny">Funny</option>
              <option value="Emotional">Emotional</option>
              <option value="Informative">Informative</option>
              <option value="Narative">Narative</option>
              <option value="Enthusiastic">Enthusiastic</option>
              <option value="Serious">Serious</option>
              <option value="Respectful">Respectful</option>
              <option value="Professional">Professional</option>
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


// To start the CommntAi automation process  
async function startAiAutomation(time_interval, temp, limit, commentSent) {
    commentSent++;

    
    $('.loader').hide();
    await delay(time_interval * 1000);
    $('.popup-backdrop').remove();
    if (commentSent <= limit) {
        console.log("start Ai Automation is called");
        await processFeed(time_interval, temp, limit, commentSent);
    }
}


// To get the dom of the POSTS for comment AI autimation
async function processFeed(time_interval, temp, limit, commentSent) {
    var feedDiv = $('div[role="feed"]');
    var selector_for_validclass = feedDiv.find('div[data-pagelet]:not(.cai-post-proccessed):eq(0)');
console.log(selector_for_validclass);
    if ($(selector_for_validclass).length > 0) {
        console.log("here");
        $(selector_for_validclass).addClass("cai-post-proccessed");
        await processPost(selector_for_validclass, time_interval, temp, limit, commentSent);
    } else {
        // selector_for_validclass1 = $('.x1yztbdb.x1n2onr6:not(.cai-post-proccessed):eq(0)');
        selector_for_validclass1 = $('.x1unhpq9 .x1yztbdb.x1n2onr6:not(.cai-post-proccessed):eq(0)');
        console.log(selector_for_validclass1);
        if ($(selector_for_validclass1).length > 0) {
            console.log("here");
            $(selector_for_validclass1).addClass("cai-post-proccessed");
            await processPost(selector_for_validclass1, time_interval, temp, limit, commentSent);
        }else{
            $(selector_for_validclass1).addClass("cai-post-proccessed");
        }
      
    }
}

// To Process Text or description of the Post For Comment AI automation
async function processPost(selector_for_validclass, time_interval, temp, limit, commentSent) {
    console.log(selector_for_validclass);
    var selector_post_description = selector_for_validclass.find(
        'div[data-ad-comet-preview="message"][data-ad-preview="message"]'
    );
    if (selector_post_description.text() == "") {
        selector_post_description = selector_for_validclass.find("blockquote");
    }

    var facebook_post_description = selector_post_description.text();
    console.log(selector_post_description.text());

    $('.loader').hide();
    $(selector_for_validclass).css("border", "2px solid green");

    await delay(6000);
    await processButtons(selector_for_validclass, time_interval, temp, limit, commentSent);
    $(selector_for_validclass).addClass("cai-post-proccessed");
}

// To start the processinng of buutons like play button for comment Ai automation
async function processButtons(selector_for_validclass, time_interval, temp, limit, commentSent) {
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
    await delay(7000);
    var popupint =  setInterval(async() => {
        var sendComment = selector_for_validclass.find('div[aria-label="Comment"]:not([aria-disabled])');
        console.log(sendComment);
        if(sendComment.length > 0){
            console.log(sendComment);
            clearInterval(popupint);
            sendComment.click();
            setTimeout(() => {
                
                startAiAutomation(time_interval, temp, limit, commentSent);
            }, 3000);
        }else if(commentLengthStatus){
            clearInterval(popupint);
            setTimeout(() => {
               
                startAiAutomation(time_interval, temp, limit, commentSent);
            }, 3000);
            commentLengthStatus = false;
        }
    })
}


async function processCommentButton(selector_for_validclass, time_interval, temp, limit, commentSent) {
    var comment_button = selector_for_validclass.find('div[aria-label="Leave a comment"]');
    if (comment_button.length > 0) {
        await processCommentButtonClick(comment_button, selector_for_validclass, time_interval, temp, limit, commentSent);
    } else {
        await delay(3000);
       
        await startAiAutomation(time_interval, temp, limit, commentSent);
    }
}


async function processCommentButtonClick(comment_button, selector_for_validclass, time_interval, temp, limit, commentSent) {
    comment_button.click();
    await delay(5000);

    const play_button2 = selector_for_validclass.find("span.play");
    if (play_button2.length > 0) {
        await processPlayButton(play_button2, selector_for_validclass, time_interval, temp, limit, commentSent);
    } else {
        await processPlayButton3(time_interval, temp, limit, commentSent);
    }
}

async function processPlayButton3(time_interval, temp, limit, commentSent) {
    await delay(5000);
    // console.log(commentAiPannel.length);
    var play_button3 = $('div.x1al4vs7').find("span.play");

    if (play_button3.length > 0) {
        play_button3.click();
        await delay(7000);

       var popupint =  setInterval(async() => {
        var sendComment2 = $('div.x1al4vs7').find('div[aria-label="Comment"]:not([aria-disabled])');
        console.log(sendComment2);
            if(sendComment2.length > 0){
                console.log(sendComment2);
                clearInterval(popupint);
                sendComment2.click();
                var closeButton = $('div[aria-label="Close"]');
               setTimeout(() => {
                 closeButton.click();
               }, 3000);
               
                setTimeout(() => {
                    
                    startAiAutomation(time_interval, temp, limit, commentSent);
                }, 6000);
              
            }else if(commentLengthStatus){
                clearInterval(popupint);
                var closeButton = $('div[aria-label="Close"]');
                setTimeout(() => {
                    closeButton.click();
                  }, 3000);
                setTimeout(() => {
                   
                    startAiAutomation(time_interval, temp, limit, commentSent);
                }, 4000);
                commentLengthStatus = false;
            }
        }, 1000);
       
    } else {
        alert('some problem in comment');
    }
}   

async function scrollwindowAi() {
    let scrollAiDynamic = 0; // Set the appropriate value for scrollAiDynamic
    let scrollAiStatic = 5; // Set the appropriate value for scrollAiStatic
    if (currentScrollStep < numScrollSteps) {
        // Calculate the next scroll position
        let nextScrollPosition = currentScrollStep * scrollStep;

        // Animate the scroll to the next position
        $("html, body").animate({ scrollTop: nextScrollPosition }, scrollAiDynamic + scrollAiStatic);

        // Increment the current scroll step
        currentScrollStep++;
    }
}


// ----------------------------------COMMENTAI CODE STOPS--------------------------------