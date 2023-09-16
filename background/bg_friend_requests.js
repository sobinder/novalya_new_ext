class FriendRequestsNV {     
    constructor() {     
        this.init();
    }  
  	init() {

    }    

    getRequestSettings() {
        GetFacebookLoginId();
        getCookies(new_site_url, "authToken", function(id) {
           authToken = id;
            console.log(authToken); 
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+authToken);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({});

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };

            fetch(new_base_url+"request/message/api/all", requestOptions)
              .then(response => response.json())
              .then(result => {
                    if(result.status == 200) {
                        chrome.storage.local.set({ requestSettings: result.data}, function() {   });
                    }
                })
              .catch(error => console.log('error', error));
            });
        return true;
    }
}
FriendRequestsNVClass = new FriendRequestsNV();