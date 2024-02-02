/*
 *
 * FacebookDOM Javascript
 *
 * @since 5.0.0
 *
 */
let FacebookDOM;
(function ($) {
  let $this;
  let description;
  let feelingsvalue;
  let clickedBtn;
  var custom_data = {
    baseUrl: 'https://extenionbackend.techrit.tech/',
    sendBulkMessageEnable: true, // true/false = true for enable , false for disable
    addFriend: true,
    addFriendFromComments: true,
  };
  FacebookDOM = {
    settings: {},
    initilaize: function () {
      $this = FacebookDOM;
      $(document).ready(function () {
        $this.onInitMethods();
      });
    },
    onInitMethods: function () {
      if (window.location.href.indexOf('facebook.com') > -1) {
        $(document).on('click', '.like', function () {
          $this.like('like');
        });
        $(document).on('click', '.dislike', function () {
          $this.like('dislike');
        });
        $(document).on('change', '.shorter_onchange', function () {
          $('.loader').show();
          $this.creatershorter($(this));
        });
        $(document).on('change', '.change_language', function () {
          $('.loader').show();
          $this.changelanguage($(this));
        });
        $(document).on('change', '.changewriting', function () {
          $('.loader').show();
          $this.changewriting($(this));
        });
      }
    },
    appendresponse: function () {
      chrome.storage.sync.get(['responsedata'], function (result) {
        //console.log(result.responsedata);
        const $responseOpinion = $('.response_opinion');
        if ($responseOpinion.length > 0) {
          $responseOpinion.remove();
          if (
            typeof result.responsedata.opinion != 'undefined' &&
            result.responsedata.opinion != ''
          ) {
            $('<div class="response_opinion"><span>' + result.responsedata.opinion + '</span></div>').insertBefore('.inner1');
          }
        }

        // Check if there are elements with the class "response_tone"
        const $responseToneElements = $('.response_tone');
        if ($responseToneElements.length > 0) {
          $responseToneElements.remove();
          if (result.responsedata.tone && result.responsedata.tone.length > 0) {
            const $inner2 = $('.inner2');
            $.each(result.responsedata.tone, function (i, tone) {
              $('<div class="response_tone"><span>' + tone + '</span></div>').insertBefore($inner2);
            });
          }
        }

        // Check if there are elements with the class "response_writing"

        const $responseWritingElements = $('.response_writing');
        if ($responseWritingElements.length > 0) {
          $responseWritingElements.remove();
          if (result.responsedata.writing && result.responsedata.writing.length > 0) {
            const $inner3 = $('.inner3');
            $.each(result.responsedata.writing, function (i, text) {
              $('<div class="response_writing"><span>' + text + '</span></div>').insertBefore($inner3);
            });
          }
        }

        // Check if there are elements with the class "response_size"
        const $responseSizeElements = $('.response_size');
        if ($responseSizeElements.length > 0) {
          $responseSizeElements.remove();
          if (result.responsedata.size) {
            const $newResponseSizeElement = $('<div class="response_size"><span>' + result.responsedata.size + '</span></div>');
            $newResponseSizeElement.insertBefore('.inner4');
          }
        }

        const $responseLanguageElements = $('.response_language');
        if ($responseLanguageElements.length > 0) {
          $responseLanguageElements.remove();
          if (result.responsedata.size) {
            const $newResponseLanguageElement = $('<div class="response_language"><span>' + result.responsedata.language + '</span></div>');
            $newResponseLanguageElement.insertBefore('.inner5');
          }
        }

        const $responseEmojisElements = $('.response_Emojis');
        if ($responseEmojisElements.length > 0) {
          $responseEmojisElements.remove();
          if (result.responsedata.emoji) {
            const $newResponseEmojisElement = $('<div class="response_emojis"><span>' + result.responsedata.emoji + '</span></div>');
            $newResponseEmojisElement.insertBefore('.inner6');
          }
        }
      });
    },
    addReactionPannelFB: function () {
      let url = window.location.href;
      $comment_box = $(
        `div[contenteditable="true"][spellcheck][data-lexical-editor="true"]` +
        `[aria-label="Write a comment…"]:not(".que-processed-class"),` +
        `div[contenteditable="true"][spellcheck][data-lexical-editor="true"]` +
        `[aria-label="Write a public comment…"]:not(".que-processed-class"),` +
        `div[contenteditable="true"][spellcheck][data-lexical-editor="true"]` +
        `[aria-label="Write an answer…"]:not(".que-processed-class"),` +
        `div[contenteditable="true"][spellcheck][data-lexical-editor="true"]` +
        `[aria-label="Submit your first comment…"]:not(".que-processed-class")`
    );
      // Find the Comment Box to append ChatGPT HTML 
      if ($comment_box.length > 0) {
        if (url.indexOf('facebook.com') > -1 && url.indexOf('/messages/t/') > -1) {
          $comment_box
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .addClass('ai2-message-page');
          $('#quentintou').remove();
        } else {
          $comment_box
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .addClass('ai2-feed-page');
          $('.que-current-container').find('#quentintou').remove();
          $('.que-current-container').removeClass('que-current-container');
        }
        replyBtn = $comment_box
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .find('li:contains(Reply)');
        $comment_box
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .append(appendHTML);

        if (replyBtn.length > 0) {
          $(replyBtn)
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .find('#quentintou')
            .remove();
        }

        $('.ai2-message-page').find('#quentintou').remove();
        $comment_box.addClass('que-processed-class');
        $this.appendresponse();
      }
    },
    addChatGPTforFacebook: function (elem, feelings, post_description , faceebook_name , user_Gender) {
      clickedBtn = $(elem);
      description = post_description;
      feelingsvalue = feelings;
      chrome.storage.sync.set({ post_description: '' });
      chrome.storage.sync.set({ post_description: post_description });
     
      selector_comment_btn = '.que-current-container div[aria-label="Write a comment"]';
      if ($(selector_comment_btn).length == 0) {
        selector_comment_btn = '.que-current-container div[aria-label="Write a comment…"]';
      }
      if ($(selector_comment_btn).length == 0) {
        selector_comment_btn = '.que-current-container div[aria-label="Write a public comment…"]';
      }
      if ($(selector_comment_btn).length == 0) {
        selector_comment_btn = '.que-current-container div[aria-label="Submit your first comment…"]';
      }
      if ($(selector_comment_btn).length == 0) {
        selector_comment_btn = '.que-current-container div[aria-label="Write an answer…"]';
      }


      chrome.runtime.sendMessage(
        {
          action: "getGenderCountry",
          name: faceebook_name,
        },
        (response) => {
                  console.log(response);
                  if (
                    typeof response.data.body != "undefined"
                  ) {
                  console.log(response.data.body.gender.toLowerCase());
                    if (response.data.body.gender.toLowerCase() != 'na' ) {
                     var gender = response.data.body.gender;
                     console.log(gender);
                     $(selector_comment_btn).click();
     
                     selector_comment_btn.textContent = '';
                     raw = JSON.stringify({
                       text: post_description,
                       temp: feelings,
                       type: 'facebook',
                       post_gender:gender,
                       gender:user_Gender
                     });
                     console.log(raw);
               
                     chrome.runtime.sendMessage(
                       { from: 'content', action: 'getResponseFromChatGPT', request: raw },
                       function (response) {
                         console.log(response);
                         $this.putMessageinTextArea(response.result, elem);
                       }
                     );
                    }else {
                      var gender = "";
                      $(selector_comment_btn).click();
       
                      selector_comment_btn.textContent = '';
                      raw = JSON.stringify({
                        text: post_description,
                        temp: feelings,
                        type: 'facebook',
                        post_gender:gender,
                        gender:user_Gender
                      });
                      console.log(raw);
                
                      chrome.runtime.sendMessage(
                        { from: 'content', action: 'getResponseFromChatGPT', request: raw },
                        function (response) {
                          console.log(response);
                          $this.putMessageinTextArea(response.result, elem);
                        }
                      );
                    }
                  }else{
                    var gender = "";
                    $(selector_comment_btn).click();
     
                    selector_comment_btn.textContent = '';
                    raw = JSON.stringify({
                      text: post_description,
                      temp: feelings,
                      type: 'facebook',
                      post_gender:gender,
                      gender:user_Gender
                    });
                    console.log(raw);
              
                    chrome.runtime.sendMessage(
                      { from: 'content', action: 'getResponseFromChatGPT', request: raw },
                      function (response) {
                        console.log(response);
                        $this.putMessageinTextArea(response.result, elem);
                      }
                    );
                  } 
        })

   
    },
    putMessageinTextArea: function (apiResp, elem) {
      const isFacebookMessagePage = window.location.href.includes('facebook.com') && window.location.href.includes('/messages/t/');
      let selector;
      if (isFacebookMessagePage) {
        selector = '.ai2-message-page div[aria-label][contenteditable="true"]';
      } else {
        selector = '.que-current-container form div[aria-label][contenteditable="true"]';
      }

      // Hide/show various elements

      const $parent = $(clickedBtn).parent();
      console.log($parent);
      $parent.find('.play').hide();
      $parent.find('.reload').show();
      $('.loader').hide();
      $('.agree_div, .response, .like, .dislike').show();

      // Process the API response
      const result = JSON.parse(apiResp).data.replace(/\n\n/g, ' ').replace(/"/g, '');
      // Find and select the appropriate element
      const pElement = document.querySelector(selector + ' p') || document.querySelector('p.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xdpxx8g');

      if (pElement) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(pElement);
        selection.removeAllRanges();
        selection.addRange(range);
      }
        
      if ($(selector + ' p ').length) {
        // Copy the result to the clipboard
        navigator.clipboard.writeText(result).then(async () => {
          await waitForElm(selector);
          const data = $(selector).children('p');
          data.each(function () {
            const elementsWithClass = document.getElementsByClassName($(this).attr('class'));
            $(elementsWithClass).each(function (index) {
              const $element = $(this);
              const lexicalSpans = $element.find("span[data-lexical-text='true']");

              const lineBreaks = $element.find('br');
              if (lexicalSpans.length > 0 && index > 0) {
                $element.css('display', 'none');
              }

              lexicalSpans.each(function (key) {
                if (key > 0) {
                  $(this).css('display', 'none');
                }
              });

              lineBreaks.each(function (key) {
                if (key > 0) {
                  $(this).css('display', 'none');
                }
              });
            });
          });
          document.execCommand('paste');
        });

        // Create and dispatch an 'input' event
        const evt = new Event('input', { bubbles: true });

        if ($(selector + ' p br').length) {
          const input = document.querySelector(selector + 'p');
          $(input).html('');
          input.innerHTML = result;
          input.dispatchEvent(evt);
        }

      }
    },
    like: function (elem) {
      $('.loader').show();
      $('.agree_div, .opinion_option, .writing_option, .size_option, .tone_option, .response').hide();
      $('.like, .dislike, .reload').show();
      $('.play').hide();

      var apiBaseUrl = custom_data.baseUrl + 'api/likedislike';
      chrome.storage.sync.get(['jwt_token'], function (result) {
        if (typeof result.jwt_token != 'undefined' && result.jwt_token != '') {
          var response = $(selector).text();
          var status = elem;
          if (status == 'dislike') {
            $this.addChatGPTforFacebook(description, feelingsvalue);
          }
          var authtoken = result.jwt_token;
          $.ajax({
            type: 'POST',
            url: apiBaseUrl,
            data: { response: response, status: status },
            headers: { Authorization: 'Bearer ' + authtoken },
            dataType: 'json',
          })
            .done(function (response) {
              if (response.status == 200 && response.data == 'like') {
                $('.loader').hide();
                $('.agree_div').show();
                $('.response').show();
                toastr.success(response.msg);
              } else if (response.status == 200 && response.data == 'dislike') {
                $('.loader').hide();
                $('.agree_div').show();
                $('.response').show();
                toastr.error(response.msg);
              } else {
                $('.loader').hide();
                $('.agree_div').show();
                $('.response').show();
                toastr.error(response.msg);
              }
              $('.back-btn-01').trigger('click');
            })
            .fail(function (xhr, status, error) {
              $('.loader').hide();
              $('.agree_div').show();
              $('.response').show();
              toastr.error(error);
            });
        }
      });
    },

    creatershorter: function (elem) {
      var token = $(elem).val();
      chrome.storage.sync.set({ lengthshortner: '' });
      chrome.storage.sync.set({ lengthshortner: token });
      chrome.storage.sync.get(
        ['feelings', 'post_description'],
        function (result) {
          if (
            typeof result.feelings != 'undefined' &&
            result.feelings != '' &&
            typeof result.post_description != 'undefined' &&
            result.post_description != ''
          ) {
            raw = JSON.stringify({
              text: result.post_description,
              emotion: result.feelings,
              token: token,
            });
            chrome.runtime.sendMessage(
              {
                from: 'content',
                action: 'getResponseFromChatGPT',
                request: raw,
              },
              function () {
                //console.log('hi', response);
              }
            );
          }
        }
      );
    },

    changelanguage: function (elem) {
      var token = $(elem).val();
      chrome.storage.sync.set({ lengthshortner: '' });
      chrome.storage.sync.set({ lengthshortner: token });
      chrome.storage.sync.get(
        ['feelings', 'post_description'],
        function (result) {
          if (
            typeof result.feelings != 'undefined' &&
            result.feelings != '' &&
            typeof result.post_description != 'undefined' &&
            result.post_description != ''
          ) {
            raw = JSON.stringify({
              text: result.post_description,
              language: $(elem).val(),
            });
            chrome.runtime.sendMessage(
              {
                from: 'content',
                action: 'getResponseFromChatGPT',
                request: raw,
              },
              function (response) {
                console.log('Received a response:', response);
              }
            );
          }
        }
      );
    },

    changewriting: function (elem) {
      var token = $(elem).val();
      chrome.storage.sync.set({ lengthshortner: '' });
      chrome.storage.sync.set({ lengthshortner: token });
      console.log('hello', token);

      chrome.storage.sync.get(
        ['feelings', 'post_description'],
        function (result) {

          if (
            typeof result.feelings != 'undefined' &&
            result.feelings != '' &&
            typeof result.post_description != 'undefined' &&
            result.post_description != ''
          ) {
            raw = JSON.stringify({
              text: result.post_description,
              changewriting: $(elem).val(),
            });
            chrome.runtime.sendMessage(
              {
                from: 'content',
                action: 'getResponseFromChatGPT',
                request: raw,
              },
              function () {
                //console.log('hi', response);
              }
            );
          }
          // $('.loader').hide();
        }
      );
    },

  };
  FacebookDOM.initilaize();
})(jQuery);
async function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
