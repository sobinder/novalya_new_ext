/************ADD CSS FOR CONTENT SCRIPT HERE*/
.add-done-border {
  border-radius: 10px;
  margin-top: 10px;
  border-color: #11a711 !important;
  border: 2px solid green !important;
}
.scl-label {
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 6px;
  border-radius: 16px;
  padding-top: 36px;
  padding-top: 2px;
  padding-bottom: 2px;
  color: white;
  background-color: #000;
}

.nov-container-row {
  width: 250px;
  height: 250px;
  background: #6baa6b;
  margin: 15%;
  border-radius: 20px;
  padding: 25px;
  color: #fff;
  font-size: 24px;
}

.nov-processing-model {
  width: 100% !important;
  height: 100% !important;
  background: #e4d9d982 !important;
  position: fixed;
  z-index: 9;
}

/******************************************************overly popup **************/

.main-app {
  overflow-x: hidden;
  position: fixed;
  z-index: 9999;
}

.container-ld {
  background: #ecf0f3;
  border: 0 none;
  border-radius: 50px;
  box-shadow: 10px 14px 25px rgb(255 255 255 / 50%);
  padding: 25px 35px;
  box-sizing: border-box;
  width: 100%;
  max-width: 575px;
  bottom: 5px !important;
  position: absolute !important;
  min-height: 435px;
}
.loading {
  width: 450px;
  border: 2px solid #000;
  padding: 3px;
  margin: 0 auto;
}
.fill {
  display: block;
  min-height: 40px;
  background: #000;
  animation: filler 3s ease-in-out infinite;
}
@keyframes filler {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
.gredient-button {
  font-weight: 700;
  color: white;
  border: 0 none;
  font-size: 22px;
  border-radius: 25px;
  cursor: pointer;
  background: linear-gradient(45deg, #400303, #e82c39);
  font-family: "Nunito", sans-serif;
  text-transform: inherit;
  letter-spacing: 1px;
  padding: 8px 25px;
  margin: 50px auto 0;
  min-width: 130px;
  display: block;
  text-transform: uppercase;
}
.title_lg {
  font-size: 24px;
  text-transform: uppercase;
  color: #000;
  margin: 0 0 15px;
  font-weight: bold;
  text-align: center;
}
.simple-txt {
  font-size: 16px;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}
.fs-spacing {
  margin: 55px 0 30px;
}
.overlay-ld {
  background: rgb(0 0 0 / 50%);
  position: fixed;
  overflow: scroll;
  width: 100% !important;
  height: 100% !important;
}

.bdh-wished {
  border: 2px solid green;
  margin-bottom: 15px;
}

.bdh-ald-wished {
  border: 2px solid red;
  margin-bottom: 15px;
}

.working-scl::after {
  position: absolute;
  content: "✔" !important;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex !important;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: rgb(255, 255, 255);
  width: auto;
  height: auto !important;
  right: 16px !important;
  bottom: 44px !important;
  font-size: 18px !important;
  line-height: 100% !important;
  background: transparent;
  visibility: visible !important;
}
.failed-scl::after {
  position: absolute;
  content: "!" !important ;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex !important;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: rgb(255, 255, 255);
  width: auto;
  height: auto !important;
  right: 17px;
  top: 2px !important;
  font-size: 18px !important;
  line-height: 100% !important;
  background: transparent;
  visibility: visible !important;
}
@-webkit-keyframes spinme {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinme {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.loading_w_scl::after {
  position: absolute;
  content: "" !important;
  width: auto;
  height: auto !important;
  width: 10px;
  height: 10px !important;
  line-height: 100% !important;
  border-radius: 50%;
  right: 0px;

  bottom: 46px;
  right: 16px !important;

  visibility: visible !important;
  background-image: linear-gradient(#0277ff, #0277ff),
    radial-gradient(circle at top left, transparent 30%, #fff 30%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  border: solid 2px transparent;
  -webkit-animation: spinme 3s linear infinite;
  animation: spinme 3s linear infinite;
}
.working-scl:before,
.loading_w_scl:before {
  position: absolute;
  content: "";
  width: 63px;
  height: 20px;
  right: 0px;
  border-radius: 0 10px;
  background-color: rgb(2, 119, 255);
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.failed-scl:before {
  position: absolute;
  content: "";
  width: 63px;
  height: 20px;
  right: 0px;
  border-radius: 0 10px;
  background-color: rgb(255, 0, 0);
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
div[role="listitem"] {
  position: relative;
}

div[role="listitem"]::after {
  position: absolute;
  top: -15px;
  right: 22px !important;
}
.loading_w_scl::after {
  top: 3px !important;
  bottom: unset !important;
}
button#add-group-btn {
  margin-left:100px;
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,83,121,1) 35%, rgba(0,212,255,1) 100%);
  border-radius: 7px;
  border: none;
  padding-left: 50px;
  padding-right: 50px;
  font-size: 15px;
  border-radius: 9;
  color: white;
  margin: 7px;
  padding: 8px;
  cursor: pointer;
  font-weight: bold;
}

button#add-group-btn2 {
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,83,121,1) 35%, rgba(0,212,255,1) 100%);
  border-radius: 7px;
  border: none;
  padding-left: 50px;
  padding-right: 50px;
  font-size: 15px;
  border-radius: 9;
  color: white;
  margin: 7px;
  padding: 8px;
  cursor: pointer;
  font-weight: bold;
}

input.disabled_cls {
    background: gray !important;
    cursor: not-allowed !important;
}





/*  messengers.com css */
.add-button-container {
  border:1px solid #f5f5f5;
  position: absolute;
  margin-top:-65px;
  right: 50px !important;
  width: 90px;
  float: left;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(245, 245, 245);
  border-image: initial;
}
.add-button-container span {
  float: left;
  display:block;
  z-index:9;
  cursor:pointer;
  width: calc(100% - 6px) !important;
  padding-bottom: 5px !important;
  white-space-collapse: collapse;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 3px;
  font-weight: bold;
  text-align: center;
  color: white !important;
  font-size: 14px !important;
  background: rgb(70,130,180);
}  

#overlay-assign-labels {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.75);
  z-index: 9999;
}


#container_assign_labels {
    position: absolute;
    top: 100px;
    margin: auto;
    float: left;
    background: white;
    min-height: 250px;
    width: 100%;
    max-width: 376px;
    left: 50%;
    transform: translateX(-50%);
}

#content-assign-labels {
    left: 50%;
    width: auto;
    height: auto;
    border-radius:20px;
}

.novalya-row {
    width: 100% !important;
    float: left !important;
    background: rgb(255, 255, 255) !important;
}

.modal-heading {
    border-radius: 20px;
}

.label-name {
    width: 70%;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: rgb(125, 110, 110);
    line-height: 1;
    padding: 15px 0px;
    float: left;
}


#content-assign-labels .close-model {
    float: right;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    color: gray;
    padding: 5px;
    margin: 5px 10px;
}

#content-assign-labels .labels-list-container {
    position: relative;
    border: unset;
    float: left;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
}


.labels-list-container ul {
    width: 100%;
    height: auto;
    float: left;
    display: none;
    z-index: 2147483647;
}

.model-labels-list {
    display: block !important;
    height: 300px !important;
}

.novalya-scroll {
    overflow-y: auto;
    overflow-x: hidden;
}
.label-text-name {
    display: block;
    width: 100%;
    float: right;
    cursor: pointer;
    word-break: break-all;
    padding: 12px 5px;
}

.labels-list-container ul li {
    z-index: 2147483647;
    margin-bottom: 10px;
    margin-right: 50px;
    display: flex;
    align-items: center;
    height: auto;
    font-size: 12px !important;
    line-height: 1 !important;
    border-radius: 5px !important;
    padding: 0px 12px !important;
}

.novalya-btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space-collapse: collapse;
    text-wrap: nowrap;
    vertical-align: middle;
    user-select: none;
    font-size: 13px;
    line-height: 1.5;
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-image: initial;
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out 0s, background-color 0.15s ease-in-out 0s, border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
    color: white !important;
    margin-left: 117px;
    margin-top: 10px;
}

.novalya-btn-primary {
    background-size: 150% 100%;
    -moz-transition: background-position 2s;
    transition: background-position 2s;
    background: #fff;
    color: #000 !important;
    font-weight: 600;
    text-transform: uppercase;
}
#container_assign_labels {
    border-radius: 5px;
}
.row.novalya-row {
    border-radius: 0 0 5px 5px;
    background-image: linear-gradient(90deg, #099f69, #0087b5, #195b73 , #000) !important;
}
.label-name {
    text-align: left;
    padding-left: 15px;
    color: #fff;
}
.close-model {
    color: #fff !important;
    opacity: .75;
    transition: .25s;
}

.primary_dropdown>label {
    padding-left: 15px;
    color: #fff;
    padding-right: 5px;
}
select#mySelect {
    padding: 4px 20px;
    transform: translateY(3px);
    font-weight: 500;
    width: 63%;
    margin-left: 5%;
    border: 1px solid #000;
    border-radius: 3px;
    text-transform: uppercase;
    font-weight: 700;
    text-align: center;
}
.primary_dropdown {
  border-radius: 5px 5px 0 0;
    padding-bottom: 35px;
    background-image: linear-gradient(90deg, #099f69, #0087b5, #195b73 , #000) !important;
}
select#mySelect:focus {
    outline: none;
}
.label-text-name {
    font-weight: 600;
    color: #fff;
    text-shadow: 0 0 BLACK;
    text-transform: capitalize;
}
.row.novalya-row.modal-heading {
    background: transparent !important;
}
.row.novalya-row {
    background-image: linear-gradient(90deg, #099f69, #0087b5, #195b73 , #000) !important;
}
.novalya-btn.novalya-btn-primary.tags-assigning-update {
    display: block;
    margin: 0 0 20px;
}
.model-labels-list li {
    border-radius: 5px !important;
    overflow: hidden !important;
    width: 100%;
    box-sizing: border-box;
}
#container_assign_labels {
    position: relative;
}
#container_assign_labels::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    border: 1px solid #9b9b9b;
    border-radius: 5px;
}
.button_box {
    position: relative;
}
.button_box::after {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #cbcbcb;
    bottom: 55px;
    left: 0;
    content: "";
}

.processed-member-to-add .add-button-container {
    position: absolute;
    right: 0 !important;
    border-radius: 6px !important;
    overflow: hidden;
    width: max-content;
   /* margin-top: -40px; */
    /* top: 0px !important; */
}

.processed-member-to-add .add-button-container span {
    display: block;
    min-width: 40px;
    width: max-content !important;
    padding: 2px 10px;
}

.close-model {
  margin: 0 !important;
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
}

.add-button-container.header_button {
  margin-right: 345px;
  margin-top: 10px;
  position: sticky;
  top: 0;
  z-index: 1; 
}

#msg-header{
  padding-top: 5px !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
  border-radius: 8px !important;
  height: 30px !important;
  width: auto !important;
}

 .add-button-container.contact-pop-up-chat-window {
  transform: translate(32px, 22px);
  width: 100px;
  border-radius: 3px !important;
  height: 21px !important;
  overflow: hidden;
  top: 0px !important;
  margin-top:0px !important;
  right: -50px !important;
} 



/* ------------------------ custom toastr---------------------- */


body {
  font-family: Arial, sans-serif;
  /* text-align: center; */
}

.custom-toastr {
  position: fixed;
  top: 20px;
  right: 20px;
 
  color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 1000;
}

.toastr-content {
  display: flex;
  align-items: center;
}

.toastr-message {
  margin-left: 10px;
}

.fa {
  font-size: 20px;
  margin-right: 10px;
}

.success-color{
  background-color: #51a351;
}

.error-color{
  background-color: #bd362f;
}

.info-color{
  background-color: #f89406;
}

#customToastr{
  padding: 10px;
}

button#stop_run {
  margin-right: 15px;
}

* filter css start */
/* Dropdown Button */
.dropbtn {
  background-color: #3498DB;
  color: white;
  padding: 2px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover, .dropbtn:focus {
  background-color: #2980B9;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  display: inline-block;
  margin-left: 93px !important;
  position: absolute;
  margin-bottom: 51px;
  margin-top: 18px;
  padding: 3px;
}

div + .dropBtn {
  position: relative;
}
#submenu {
  background: white;
  margin-left: 70px;
  width: 142px;
  margin-top: -17px;
}
ul#submenu li{
  padding: 7px;
  text-align: center;
  cursor:pointer
  border-radius: 4px;
  margin-top: 5px
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  left: 50px;
  top: 1px;
  background-color: #f1f1f1;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 99999 !important;
  font-size: 12px;
  padding: 0px !important;
  min-width: 70px;
}
.dropdown-content #submenu{
  display: none;
  position: absolute;
}

ul li:hover > ul {
  display: inherit;
}



/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 1px;
  text-decoration: none !important;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {display:block;}

#filter-message p{
  padding: 10px;
  font-size: 12px;
  font-weight: 700;
}
#filter-message div{
  width: fit-content;
  padding: 3px;
  border: 2px solid #db8134;
  margin-left: 10px;
  font-weight:700;
}
.close-filter-button{
  padding: 13px;
    cursor: pointer;
    border: unset !important;;
}



/* Styles for the loader */
/* Styles for the content div */
.sort-by-selected-tag {
  position: relative; /* Ensure the overlay is positioned relative to this div */
}

/* Styles for the overlay */
.overlay {
  position: absolute; /* Position the overlay absolutely within the content div */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.057); /* Semi-transparent black background */
  display: none; /* Initially hidden */
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's above other content */
}

/* Styles for the loader */
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin-left: 50%;
  margin-top: 50%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



.dropdown-content ul#submenu {
    overflow: hidden;
    margin-top: 6px;
    background: #fff;
}

ul#submenu li {
    color: #fff;
    text-transform: capitalize;
    font-weight: 500;
    background: #fff !important;
    border-radius: 4px;
}
button.dropbtn.custom-drop {
    padding: 2px 7px 3px;
    background: #e4e6eb;
    border: navajowhite;
    font-weight: 600;
    border-radius: 3px;
}

ul#myDropdown {
    box-shadow: none !important;
    padding: 0px 5px !important;
    font-weight: 600;
    background: #e4e6eb;
    min-width: 55px;
    margin-top: 2px;
    padding-bottom: 3px !important;
}
button.dropbtn.custom-drop {
    display: flex;
    align-items: center;
    padding: 1px 8px;
    gap: 4px;
    margin-top: -5px;
    border-radius: 20px;
    border: 1px solid #4098fd;
    color: #4098fd;
    background: #fff;
}

button.dropbtn.custom-drop img {
    mix-blend-mode: darken;
}

ul#myDropdown {
    position: relative;
    left: 0;
    min-width: 220px;
    background: #fff;
    box-shadow: 0 0 10px rgb(0 0 0 / 25%) !important;
    padding: 0 !important;
    border-radius: 4px 4px 0 0;
}
li.filter_heading {
    border-radius: 4px 4px 0 0;
    background: steelblue;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #fff;
}
li.filter_heading svg {
    width: 20px;
    fill: #fff;
}

li.filter_text {
    padding: 8px 12px;
    height: auto;
}

a#sort-by-group:hover {
    background: #fff !important;
}

ul#submenu {
    margin-left: -12px !important;
    min-width: 220px;
    border-radius: 0 0 4px 4px !important;
    padding: 5px 10px 10px;
    box-shadow: 0 10px 10px rgb(0 0 0 / 25%);
    box-sizing: border-box;
    margin-top: 3px !important;
}

button.dropbtn.custom-drop svg {
    width: 20px;
}

a#sort-by-group {
    color: #646464;
}

/* filter css end */