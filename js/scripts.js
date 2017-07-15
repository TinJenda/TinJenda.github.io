/**
 * Show/hide menu Handler
 */
var scrollHandler = function () {};

/**
 * Dynamic Enable/disable scroll Listener
 * @type {{enableListener: Function, disableListener: Function}}
 */
var dynamicMenuApp = {
    enableListener: function() {
        $(window).on("scroll", scrollHandler)
    },
    disableListener: function() {
        $(window).off("scroll", scrollHandler)
    }
};

/**
 * recent Works List - hover bg size
 * @type {{setHoverSize: Function}}
 */
var recentWorkHoverSize = {
    setHoverSize: function () {
        $(".recent-work").each(function(){
            var element = $(this)
            element.find('.mega-hover').css({
                'width': element.width(),
                'height': element.height()
            })
        })
    }
};

/**
 * Portfolio fullscreen work size
 * @type {{setHeight: Function, resizeSmallPic: Function}}
 */
var portfolioFullScreenImage = {
    setHeight: function () {
        $("#full-screen-portfolio-image").css({
            height: $(window).height()
        })
    },
    resizeSmallPic: function () {
        var normalPortfolioImageObject = $("#normall-portfolio-image")
        var windowObject = $(window)
        if(windowObject.width() > 767)
        {
            normalPortfolioImageObject.find('img').height(windowObject.height() - $("#full-screen-portfolio-image").find(".lg-headers").height() - 35)
        }
    }
};

(function($) {
    var nav = $('#navigation')
    var lastScrollTop = 0

    scrollHandler = function () {
        var st = $(window).scrollTop()
        dynamicMenuApp.disableListener()
        var isMobileResolution = $(window).width() < 767

        if (st > lastScrollTop)
        {
            if(isMobileResolution)
            {
                nav.hide()
            } else {
                nav.animate({
                        top: "-"+nav.outerHeight(true)
                    }, 100, "linear", function(){
                    dynamicMenuApp.enableListener()
                })
            }
        } else {
            if(isMobileResolution)
            {
                nav.show()
            } else {
                nav.show()
                nav.animate({
                        top: "0"
                    }, 100, "linear", function(){
                    dynamicMenuApp.enableListener()
                })
            }
        }
        lastScrollTop = st
        if(isMobileResolution)
        {
            dynamicMenuApp.enableListener()
        }
    }
    dynamicMenuApp.enableListener()

    /**
     * Main Slippry Slider
     * @type {*}
     */
    var slippry = $("#slippry").slippry({
        pager: false,
        auto: false
    });


    /**
     * Carousel with posts from BLOG The MIT License (MIT)
     */
    $('.blog-posts-carousel').owlCarousel({
        singleItem: true,
        navigation: true,
        navigationText: [null,null],
        transitionStyle: "fade",
        autoHeight: true,
        pagination: false
    })

    /**
     * Members / Recent works Slider with description
     */
    var visibleSlides = 3
    if($(window).width() >= 767 && $(window).width() < 991)
    {
        visibleSlides = 2
    }
    if($(window).width() < 767)
    {
        visibleSlides = 1
    }

    var carousel = $('#team-members-carousel').bxSlider({
        minSlides: visibleSlides,
        maxSlides: visibleSlides,
        moveSlides: 1,
        slideWidth: 247,
        slideMargin: 20,
        nextText: '',
        prevText: '',
        pager: false,
        onSliderLoad: function () {
            setTimeout(function(){changeOurTeamSlide()}, 500)
        },
        onSlideBefore: function () {
            changeOurTeamSlide()
        }
    });
    /**
     * change slide
     */
    function changeOurTeamSlide()
    {
        var centerSlide = carousel.getCurrentSlide()
        var slides = carousel.find('li:not(.bx-clone)')
        centerSlide = slides.eq(centerSlide)
        centerSlide.addClass('active').siblings('li').removeClass('active')
        var infoContainer = $('#member-informations')
        infoContainer.find('.member-name').text(centerSlide.find('.member-name').text())
        infoContainer.find('.member-position').text(centerSlide.find('.member-position').text())
        infoContainer.find('.member-description').text(centerSlide.find('.member-description').text())
    }
    $(document).on("click", ".member-next", function(){
        carousel.goToNextSlide()
    })
    $(document).on("click", ".member-prev", function(){
        carousel.goToPrevSlide()
    })

    /**
     * recent works, HOME
     */
    var recentWorks = $('#recent-works-list');
    $(window).load(function(){
        recentWorks.masonry({
            itemSelector: '.recent-work',
            isAnimated: true,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        })
        recentWorkHoverSize.setHoverSize()
        if(!Modernizr.input.placeholder){
            $('input, textarea').placeholder();
        }
    })

    var formObject = $('#contact-form')
    formObject.validate({
        rules: {
            fullname: {
                required: true
            },
            emailaddress: {
                required: true,
                email: true
            },
            phone: {
                required: true
            },
            describe: {
                required: true
            },
            timeline: {
                required: true
            },
            budget: {
                required: true
            }
        },
        errorPlacement: function(){
            return false;
        }
    });

    var formObject = $('#comment-form')
    formObject.validate({
        rules: {
            fullname: {
                required: true
            },
            emailaddress: {
                required: true,
                email: true
            }
        },
        errorPlacement: function(){
            return false;
        }
    });

    $(document).on("click", "#navigation .home-page-nav a", function(){
        if($(".navbar-toggle").is(':visible')) {
            $("#navigation").find(".navbar-toggle").click()
        }
        $("html, body").animate({ scrollTop: parseInt($('#'+ $(this).data('section')).offset().top )+"px" }, 800)
    })

    /**
     * load more recent works on homepage
     */
    $('#recent-works-more').click(function(){
        $.get('./../ajax/recent-works.html', function(data){
            var elements;
            for(var i = 0; i < $(data).length; i++)
            {
                var element = $($(data)[i])
                elements = elements ? elements.add( element ) : element
            }
            recentWorks.append( elements )
            recentWorks.masonry( 'appended', elements )
            recentWorkHoverSize.setHoverSize()
        })
        $(this).fadeOut('slow')
    })

    $(document).on("click", ".scroll-to-button", function() {
        $("html, body").animate({ scrollTop: parseInt($('#'+ $(this).data('scrolltarget')).offset().top)+"px" }, 800)
    })

    $("#watch-video").on("click", function(){
        slippry.goToNextSlide()
    })
    portfolioFullScreenImage.setHeight()
    portfolioFullScreenImage.resizeSmallPic()
    $(window).resize(function(){
        portfolioFullScreenImage.setHeight()
        portfolioFullScreenImage.resizeSmallPic()
        recentWorkHoverSize.setHoverSize()
        visibleSlides = 3
        if($(window).width() >= 767 && $(window).width() < 991)
        {
            visibleSlides = 2
        }
        if($(window).width() < 767)
        {
            visibleSlides = 1
        }
        carousel.reloadSlider({
            minSlides: visibleSlides,
            maxSlides: visibleSlides,
            moveSlides: 1,
            slideWidth: 247,
            slideMargin: 20,
            nextText: '',
            prevText: '',
            pager: false,
            onSliderLoad: function (currentIndex) {
                setTimeout(function(){changeOurTeamSlide(currentIndex)}, 500)
            },
            onSlideBefore: function ($slideElement, oldIndex, newIndex) {
                changeOurTeamSlide(null, $slideElement, oldIndex, newIndex)
            }
        })
    })

})(jQuery);