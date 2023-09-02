/* send message functionality */
const getDtsg = (action) => {
    var resObj = {
      status: true,
      data: [],
      message: ""
    }
    return new Promise(function (resolve, reject) {
      fetch(
        'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed',
        {
          method: 'GET',
        }
      )
        .then((e) => e.text())
        .then((e) => {
          let dtsg = e.match(/{\\"dtsg\\":{\\"token\\":\\"(.*?)\\"/);
          let fbId = e.match(/\\"USER_ID\\":\\"(.*?)\\"/);
          if (dtsg == null || fbId == null) {
            resObj.staus = false
            resObj.message = "Please log in to Facebook to use LSD"
            if (action == "getDtsg") {
              const payload = {
                action: "sendMessage",
                res: resObj
              }
            }
  
  
            return resolve(resObj)
  
          }
          resObj.message = "Successfully Fetched Fb Ids"
          resObj.data = {
            dtsg: dtsg[1],
            fbId: fbId[1]
          }
         // console.log("resObj", resObj)
          if (action == "getDtsg") {
            const payload = {
              action: "sendMessage",
              res: resObj
            }          
          }
          return resolve(resObj)
        })
        .catch((err) => {
          console.log('error while trying to fetch dtsg and fbId', err);
        });
    });
  }
  
  /* Function to check if already conversation with user is there */
  const checkMessage = async (receiverId, message, alt = false) => {
    console.log("inside check message, if already conversation is there")
    try{
      let a = await fetch("https://mbasic.facebook.com/messages/read/?fbid="+receiverId, {
        method: 'GET',
      });
  
      response = await a.text()
      if(response.includes("<title>New Message</title>")){
        sendMessage(receiverId, message, alt = false);
      }
      else{
        console.log("Already Conversation is there so did not send message.")
      }
    }
    catch(err){
      console.log(err)
    }
   }
  
  /* Function to send message */
  const sendMessage = async (receiverId, message, alt = false) => {
    console.log("inside fetch message sending from backgoung", message)
  
    return new Promise(async (resolve, reject) => {
      try {
        getDtsg().then(async res => {
          let serialize = function (obj) {
            let str = [];
            for (let p in obj)
              if (obj.hasOwnProperty(p)) {
                str.push(
                  encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
                );
              }
            return str.join('&');
          };
  
          let Ids = `ids[${receiverId}]`
          if (alt) {
            var tids = `cid.c.${res.data.fbId}:${receiverId}`
          } else {
            var tids = `cid.c.${receiverId}:${res.data.fbId}`
          }
  
          let data = {
            __user: res.data.fbId,
            fb_dtsg: res.data.dtsg,
            body: message,
            server_timestamps: true,
            send: "Send",
            [Ids]: receiverId,
            tids: tids,
            waterfall_source: "message",
            //server_timestamps :  true
          }
          //console.log(data);
          let a = await fetch("https://mbasic.facebook.com/messages/send/?icm=1&refid=12", {
            method: 'POST',
            //mode : 'no-cors',
            referrerPolicy: "origin-when-cross-origin",
            headers: {
              "Access-Control-Allow-Origin": "*",
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'text/html,application/json'
            },
            body: serialize(data),
          });
  
          response = await a.text();
          console.log(response)

          if (response.includes("You cannot perform that action")) {
            resolve(true)
            sendMessage(receiverId, message, true)
  
          } else {
            if(response.includes("<title>Error</title>")) {
                console.log("<title>Error</title>")
            }
            console.log("succesfully resolved the alterate sending message technique")
            return resolve(true)
          }
        })
      } catch (error) {
        console.log("Send Message Error", error)
        resolve(false);
      }
    });
  }
  
  /* SETTING A POPUP PAGE USING BROWSER ACTION BASED ON CURRENT URL
   * @param {Object} tab Gives the state of the tab
   * @param {Boolean} changeUrl Changed or not
   */
  function popupSet(tab, changeUrl = false) {
    return new Promise((resolve, reject) => {
      try {
        const url = changeUrl ? changeUrl : tab.url;
        if (tab.active && tab.status === "complete") {
          const activePopup = regexURLs.filter((obj) => {
            return obj.regex.test(url) == true;
          });
          if (activePopup.length) {
            console.log("activePopup", activePopup[0].popup, url.indexOf("=friends"))
            if (url.indexOf("=friends") > -1) {
              tab.popup = regexURLs[0].popup
            } else {
              tab.popup = activePopup[0].popup;
            }
  
          } else {
          }
          resolve(tab);
        } else {
          resolve(tab);
        }
      } catch (e) {
        tab.error = e.message;
        reject(tab);
      }
    });
  }
