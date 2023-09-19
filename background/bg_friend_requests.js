class FriendRequestsNV {     
    constructor() {     
        this.init();
    }  
  	init() {

    }    

    getRequestSettings() {
        GetFacebookLoginId();
        getCookies(site_url, "authToken", function(id) {
           authToken = id;
            console.log(authToken); 
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+authToken);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };

            fetch("https://novalyabackend.novalya.com/request/message/api/all", requestOptions)
              .then(response => response.json())
              .then(result => {
                    console.log(result);
                    if(result.status == 'success') {
                      user_id = result.data.user_id;
                      //console.log(user_id);
                        chrome.storage.local.set({ requestSettings: result.data}, function() {   });
                    }
                })
              .catch(error => console.log('error', error));
            });
        return true;
    }
}
FriendRequestsNVClass = new FriendRequestsNV();