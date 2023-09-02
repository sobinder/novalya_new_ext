class FriendRequestsNV {     
    constructor() {     
        this.init();
    }  
  	init() {}    

    getRequestSettings() {
        GetFacebookLoginId();
        var myHeaders = new Headers();
        var formdata = new FormData();
        formdata.append("user_id", userId);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };
        fetch(base_api_url+"send-request-message.php", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.status == 200) {
                chrome.storage.local.set({ requestSettings: result.data}, function() {   });
            }
        })
        .catch(error => console.log('error', error));
    }
}
FriendRequestsNVClass = new FriendRequestsNV();