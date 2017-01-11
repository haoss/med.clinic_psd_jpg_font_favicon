'use strict';

// Document ready
$(document).ready(function(){

  // SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery__item',
      type: 'image',
      gallery:{
        enabled:true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  $('.open-popup-link').magnificPopup({
    type:'inline',
    showCloseBtn: false,
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
  });

  // Magnific popup one image
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
    	verticalFit: true
    }
  });
  $('.popup__close').on('click', function(){
    $(this).magnificPopup('close')
  });

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
        $.smoothScroll();
    }
  } catch(err) { };

  // Header navigation
  $('.header__menu__button').on('click', function(){
    $(this).parent().toggleClass('is-open');
  });

  // Catalog navigation
  function menuCatalog(){
    var li = $('.catalog__navigation .li--level1');
    li.find('> *').on('click', function(e){
      e.preventDefault();
      li.removeClass('is-active');
      $(this).parent().toggleClass('is-active');
    });
  }
  menuCatalog();

  // Carousel
  $('.documents__carousel').owlCarousel({
    items: 4,
    nav: true,
    dots: false,
    loop: true,
    responsive: {
      0: {
        items: 2
      },
      480: {
        items: 3
      },
      970: {
        items: 4
      }
    }
  });

  $('.doctors__carousel').owlCarousel({
    items: 4,
    margin: 30,
    nav: true,
    dots: false,
    autoWidth: true,
    loop: true
  });

  $('.information__carousel').owlCarousel({
    items: 4,
    margin: 30,
    nav: true,
    dots: false,
    autoWidth: true,
    loop: true,
    responsive: {
      0: {
        items: 1,
        autoWidth: false
      },
      321: {
        autoWidth: true
      }
    }
  });

  $('.method__carousel').owlCarousel({
    items: 4,
    margin: 30,
    nav: true,
    dots: false,
    autoWidth: true,
    loop: true
  });

  $('.carousel').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    dots: true
  });

  $('.main-slider__carousel').owlCarousel({
    items: 1,
    nav: false,
    dots: true,
    loop: true
  });

  // ol list marker
  $('ol.list li').each(function(){
    $(this).prepend('<span class="span">' + ($(this).index() + 1) + '</span>')
  });

  // navigation
  $('.navigation__button').on('click', function(e){
    e.stopPropagation();
    $(this).parents('nav.navigation').toggleClass('is-open');
  });
  $('.navigation__mobile').on('click', function(){
    $(this).parent().removeClass('is-open');
  });
  function navigationMobile() {
    var ul = $('.navigation ul');
    var li = ul.find('li');
    var div = $('.navigation__mobile div');
    var html = $('.navigation ul').find('li.active a').html();

    div.html(html) ;

    $('.navigation ul li a').on('click', function(e){
      e.preventDefault();

      li.removeClass('active');
      $(this).parent().addClass('active');
      $(this).parents('nav.navigation').removeClass('is-open');

      div.html(e.currentTarget.innerHTML);
      // console.log(e.currentTarget.innerHTML);
    });

    // console.log(div.innerHTML = html);
  }
  navigationMobile();

  // Articles list date hover
  $('.article__title').on('hover', function(){
    $(this).parents('.article__row').toggleClass('is-hover');
  });

  // Price row
  $('.prices__row').each(function(){
    var __this = this;

    $(__this).on('click', function(e){
      $(__this).addClass('is-active');
      $(__this).find('.prices__row__body').slideDown();
    });

    $(__this).children('.prices__row__head').on('click', function(e){
      if ($(__this).hasClass('is-active')) {
        e.stopPropagation();
      }
      $(__this).removeClass('is-active');
      $(__this).find('.prices__row__body').slideUp();
    });
  });

  // Main map footer
  function mainMapFooter(){
    var width = $(window).width();
    var mainMapButton = $('.main-map__button');

    if (width > 767 && $('.footer__wrapper').is(':visible')) {
      mainMapButton.on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('.footer').toggleClass('is-map-open');
        $('.main-map').toggleClass('is-map-open');

        if (!$(this).hasClass('is-active')) {
          $(this).html('Развернуть карту<i class="ion-android-arrow-down"></i>')
        } else {
          $(this).html('Свернуть карту<i class="ion-android-arrow-up"></i>')
        }
      });
    } else if (width <= 767 && $('.footer__wrapper').is(':hidden')) {
      mainMapButton.on('click', function(){
        window.location.href = $(this).data('href')
      })
    }
  }
  mainMapFooter();
  $(window).resize(mainMapFooter);

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-callback');
});

// $(window).on('load', function() {
//   $(".loader").delay(400).fadeOut("slow");
// });

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
    e.preventDefault();

    var formData = {};

    var hasFile = false;

    if ($(this).find('[type=file]').length < 1) {
      formData = $(this).serialize();
    }
    else {
      formData = new FormData();
      $(this).find('[name]').each(function(){

        switch($(this).prop('type')) {

          case 'file':
            if ($(this)[0]['files'].length > 0) {
              formData.append($(this).prop('name'), $(this)[0]['files'][0]);
              hasFile = true;
            }
            break;

          case 'radio':
          case 'checkbox':
            if (!$(this).prop('checked')) {
              break;
            }
            formData.append($(this).prop('name'), $(this).val().toString());
            break;

          default:
            formData.append($(this).prop('name'), $(this).val().toString());
            break;
        }
      });
    }

    $.ajax({
      url: $(this).prop('action'),
      data: formData,
      type: 'POST',
      contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
      cache       : false,
      processData : false,
      success: function(response) {
        $(form).removeClass('ajax-waiting');
        $(form).html($(response).find(form).html());

        if (typeof callback === 'function') {
          callback(response);
        }
      }
    });

    $(form).addClass('ajax-waiting');

    return false;
  });
}
