

$(document).ready(function () {
    var width = 100,
        perfData = window.performance.timing,
        EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
        time = ((EstimatedTime / 1000) % 50) * 100;
    // Percentage Increment Animation
    var PercentageID = $(".percentage"),
        start = 0,
        end = 100,
        durataion = time;
    animateValue(PercentageID, start, end, durataion);

    function animateValue(id, start, end, duration) {

        var range = end - start,
            current = start,
            increment = end > start ? 1 : -1,
            stepTime = Math.abs(Math.floor(duration / range)),
            obj = $(id);


        var timer = setInterval(function () {
            current += increment;
            $(obj).text(current);
            //   obj.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    };



    setTimeout(function () {
        $('.preloader').fadeOut();

        $('.cd-transition-layer').addClass('closing').delay(1000).queue(function () {
            $(this).removeClass("visible closing opening").dequeue();
        });

    }, 0.1);

});

$(window).on('load',function () {


    function smokeeffect() {
        transitionLayer = $('.cd-transition-layer'),
            transitionBackground = transitionLayer.children(),
            modalWindow = $('.full-menu');

        var frameProportion = 1.78, //png frame aspect ratio
            frames = 25, //number of png frames
            resize = false;

        //set transitionBackground dimentions
        setLayerDimensions();
        $(window).on('resize', function () {
            if (!resize) {
                resize = true;
                (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 300) : window.requestAnimationFrame(setLayerDimensions);
            }
        });

        //open modal window
        $('#main-login-butt').on('click', function (event) {
            event.preventDefault();
            console.log('123')
            transitionLayer.addClass('visible opening');
            var delay = ($('.no-cssanimations').length > 0) ? 0 : 600;
            setTimeout(function () {
                modalWindow.addClass('visible');
            }, delay);
        });

        //close modal window
        modalWindow.on('click', '.modal-close', function (event) {
            event.preventDefault();
            transitionLayer.addClass('closing');
            modalWindow.removeClass('visible');
            transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                transitionLayer.removeClass('closing opening visible');
                transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
            });
        });

        function setLayerDimensions() {
            var windowWidth = $(window).width(),
                windowHeight = $(window).height(),
                layerHeight, layerWidth;

            if (windowWidth / windowHeight > frameProportion) {
                layerWidth = windowWidth;
                layerHeight = layerWidth / frameProportion;
            } else {
                layerHeight = windowHeight * 1.2;
                layerWidth = layerHeight * frameProportion;
            }

            transitionBackground.css({
                'width': layerWidth * frames + 'px',
                'height': layerHeight + 'px',
            });

            resize = false;
        }

    }
    smokeeffect()



});

//Main Cover Photo Sliding

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

//Social Media Login/Sign Up On Click

$(`#facebook`).onclick('click', function(){

})

$(`#gmail`).onclick('click', function(){

})