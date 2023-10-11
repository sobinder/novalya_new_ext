console.log('here');
let Unfollow;
(function ($) {
    let $this;
    let btn = `<button id="data-unfollow">Data</button>`
    Unfollow = {
        settings: {},
        initilaize: function () {
            $this = Unfollow;
            $(document).ready(function () {
                $this.onInitMethods();
            });


        },
        onInitMethods: function () {
            // Run & check appebd btn every 2 seconds
            //const getFriendId = setInterval($this.appendUnfollowButton, 2000);

            $(document).on('click','#data-unfollow',function(){
                $('div[role="tablist"] a span:contains("All friends")').click();
            });
        },
        appendUnfollowButton: function() {
            const friendsLink = $('h2 span a:contains("Friends")');
            console.log(friendsLink);
            if (friendsLink.length > 0) {
                console.log('in');
                if ($('#data-unfollow').length === 0) {
                    $('h2').parent().parent().append(btn);
                }
            }
        }
    }

    Unfollow.initilaize();
})(jQuery);