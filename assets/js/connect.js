// ________ Script 
$(document).ready(function () {
	chrome.runtime.sendMessage({ action:"getMessageSections" }, (res1)=> {
		console.log(res1);
	    // body        
	})  
});