class FriendRequestsNV {     
    constructor() {     
        this.init();
    }  
  	init() {}    

    getRequestSettings() {
        GetFacebookLoginId();
       

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vdmFseWEiLCJpYXQiOjE2OTQ3NzkzNzgsImV4cCI6MTY5NDgyMjU3OH0.j4JGyxjF6wwD-sCPQwCJmP5I85bbXNDmrpzJotuZJdw");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "connect.sid=s%3Ar819WiqDOb-FcrbJwDZX4xuzUo2w8hNn.7LPkB1q4V4YjViIUIBGon4smDVn0NZ60P7IDRocdoV8; userToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vdmFseWEiLCJpYXQiOjE2OTQ3NzkzNzgsImV4cCI6MTY5NDgyMjU3OH0.j4JGyxjF6wwD-sCPQwCJmP5I85bbXNDmrpzJotuZJdw");

var raw = JSON.stringify({
  "received_status": "1",
  "reject_status": "0",
  "accept_status": "1",
  "received_group_id": "23",
  "reject_group_id": "554",
  "accept_group_id": "554",
  "type": "add"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://novalyabackend.novalya.com/api/ext/friend/update-request", requestOptions)
  .then(response => response.json())
  .then(result => {
        if(result.status == 200) {
            chrome.storage.local.set({ requestSettings: result.data}, function() {   });
        }
    })
  .catch(error => console.log('error', error));
return true;









        // var myHeaders = new Headers();
        // var formdata = new FormData();
        // formdata.append("user_id", userId);
        // var requestOptions = {
        //   method: 'POST',
        //   headers: myHeaders,
        //   body: formdata,
        //   redirect: 'follow'
        // };
        // fetch(base_api_url+"send-request-message.php", requestOptions)
        // .then(response => response.json())
        // .then(result => {
        //     if(result.status == 200) {
        //         chrome.storage.local.set({ requestSettings: result.data}, function() {   });
        //     }
        // })
        // .catch(error => console.log('error', error));
    }
}
FriendRequestsNVClass = new FriendRequestsNV();