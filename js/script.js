(function ($) {
  var app = $('.app-body')
  var header = $('.header')
  var banner = document.getElementById('article-banner') || false
  var about = document.getElementById('about-banner') || false
  const catalogList = $('.toc-nav a');
  var top = $('.scroll-top')
  var catalog = $('.catalog-container .toc-main')
  var isOpen = false;

  function getOffsetTop(element) {
    if (!element) {
      return 0;
    }
    let y;
    const doc = element.ownerDocument;
    if (!doc) {
      return {
        top: 0
      };
    }
    const body = doc.body;
    const docElem = doc.documentElement;
    const box = element.getBoundingClientRect();

    y = box.top;

    y -= docElem.clientTop || body.clientTop || 0;

    return y + document.body.scrollTop + document.documentElement.scrollTop;
  }

  function throttle(
    fn,
    delay,
    options = {
      leading: true, // 表示开启第一次执行
      trailing: true //  表示开启停止触发的回调
    }
  ) {
    let timeout;
    let context;
    let args;
    let result;
    let previous = 0;
    if (!options) options = {};

    const later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = fn.apply(context, args);
      if (!timeout) context = args = null;
    };

    const throttled = function () {
      const now = Date.now();
      if (!previous && options.leading === false) previous = now;
      const remaining = delay - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > delay) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = fn.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }


  $(document).ready(function () {
    NProgress.start()
    $('#nprogress .bar').css({
      'background': '#42b983'
    })
    $('#nprogress .spinner').hide()

    var fade = {
      transform: 'translateY(0)',
      opacity: 1
    }
    if (banner) {
      app.css('transition-delay', '0.15s')
      $('#article-banner').children().css(fade)
    }
    if (about) {
      $('.author').children().css(fade)
    }
    app.css(fade)
  })

  window.onload = function () {
    setTimeout(function () {
      NProgress.done()
    }, 200)
  }

  $('.menu').on('click', function () {
    if (!header.hasClass('fixed-header') || isOpen) {
      header.toggleClass('fixed-header')
      isOpen = !isOpen
    }
    $('.menu-mask').toggleClass('open')
  })

  $('#tag-cloud a').on('click', function () {
    var list = $('.tag-list')
    var name = $(this).data('name').replace(/[\ \'\/\+\#]/gi, "\\$&")
    var maoH = list.find('#' + name).offset().top
    $('html,body').animate({
      scrollTop: maoH - header.height()
    }, 500)
  })

  $('#category-cloud a').on('click', function () {
    var list = $('.category-list')
    var name = $(this).data('name').replace(/[\ \'\/\+\#]/gi, "\\$&")
    var maoH = list.find('#' + name).offset().top
    $('html,body').animate({
      scrollTop: maoH - header.height()
    }, 500)
  })

  $('.reward-btn').on('click', function () {
    $('.money-code').fadeToggle()
  })

  $('.arrow-down').on('click', function () {
    $('html, body').animate({
      scrollTop: banner.offsetHeight - header.height()
    }, 500)
  })

  catalogList.on('click', function (e) {
    e.preventDefault()
    var catalogTarget = e.currentTarget
    // var scrollTarget = $(catalogTarget.getAttribute('href'))
    var scrollTarget = $(decodeURIComponent(catalogTarget.getAttribute('href')))
    var top = scrollTarget.offset().top
    if (top > 0) {
      $('html,body').animate({
        scrollTop: top - 65
      }, 500)
    }
  })

  top.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600)
  })

  var titleOffsetTopObj = [];

  function onScroll(isInit) {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var headerH = header.height()
    if (!titleOffsetTopObj.length) {
      for (var index = catalogList.length - 1; index >= 0; index--) {
        const id = decodeURIComponent(catalogList[index].getAttribute('href'));
        var archiveTitle = $(id);

        if (catalogList.length - 1 === index){
          titleOffsetTopObj.unshift({
            id: id,
            element: catalogList[index],
            minTop: Math.ceil(getOffsetTop(archiveTitle[0]) - 75),
            maxTop: Math.ceil(getOffsetTop($('.app-footer')[0]))
          });
        } else if(index === 0){
          titleOffsetTopObj.unshift({
            id: id,
            element: catalogList[index],
            minTop: 0,
            maxTop: titleOffsetTopObj[0].minTop
          });
        } else {
          titleOffsetTopObj.unshift({
            id: id,
            element: catalogList[index],
            minTop: Math.ceil(getOffsetTop(archiveTitle[0]) - 75),
            maxTop: titleOffsetTopObj[0].minTop
          });
        }
      }
    }

    catalogList.removeClass('toc-nav-link-active');
    for(var i=0; i < titleOffsetTopObj.length; i++) {
      var value = titleOffsetTopObj[i];
      if (scrollTop >= value.minTop && scrollTop < value.maxTop) {
        $(value.element).addClass('toc-nav-link-active');
        break;
      }
    }

    if (isInit) {
      titleOffsetTopObj = [];
    }

    if (banner) {
      if (scrollTop > headerH) {
        header.addClass('fixed-header')
      } else if (scrollTop === 0) {
        header.removeClass('fixed-header')
      }
    }
    if (scrollTop > 100) {
      top.addClass('opacity')
    } else {
      top.removeClass('opacity')
    }
    if (scrollTop > 190) {
      catalog.addClass('fixed-toc')
    } else {
      catalog.removeClass('fixed-toc')
    }
  }

  onScroll(true);

  document.addEventListener('scroll', throttle(() => onScroll(), 100, { leading: false }))
})(jQuery)
