// get the nav bar element by the id
        var the_nav = document.getElementById('navbar');
        //   function to change the color of the navbar when its on the top, and when its not on the top
        function checkOnScroll() {
            // check if the scroll is at the top, if it is then set the navbar background to white
            if (window.scrollY === 0) {
                the_nav.setAttribute('style', 'background-color:white !important');
                // if not at the top, set the navbar background to green
            } else {
                the_nav.setAttribute('style', 'background-color:#0C2340 !important');
            }
            console.log(window.scrollY); // log out the Y coordinates of the location of the window scroll
        }
        // will listen to the window for a scroll. Everytime we scroll the page, it will call the checkOnScroll() function
        window.addEventListener("scroll",checkOnScroll);
