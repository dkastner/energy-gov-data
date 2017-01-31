/* JavaScript for ext_link_page */

(function ($) {

function extLinkPageModal(url) {
  var title, message, modal, timeoutId;

  // Generate message for external link modal window
  title = Drupal.settings.ext_link_page.messageTitle ? String(Drupal.settings.ext_link_page.messageTitle) : '';
  message = Drupal.settings.ext_link_page.messageBody ? String(Drupal.settings.ext_link_page.messageBody) : '';
  message = message.replace(/\[url\]/gi, url)
    .replace(/\[link\]/gi, '<a href="' + url + '">' + url + '</a>')
    .replace(/\[delay\]/gi, Drupal.settings.ext_link_page.delay)
    .replace(/\[site_name\]/gi, Drupal.settings.ext_link_page.siteName);

  // If directDisable is enabled, then do not automatically redirect.
  directDisable = Drupal.settings.ext_link_page.directDisable ? parseInt(Drupal.settings.ext_link_page.directDisable, 10) : 0;

  // If delay is 0, then redirect immediately (unless directDisable is set).
  delay = Drupal.settings.ext_link_page.delay ? parseInt(Drupal.settings.ext_link_page.delay, 10) : 0;
  if (!directDisable && !delay) {
    window.location.href = url;
    return;
  }

  // Display the message as a jQuery UI modal window
  timeoutId = false;
  modal = $('<div id="extLinkPageModal-content">' + message + '</div>');
  modal.dialog({
    buttons: [
      {
        text: Drupal.t('Cancel'),
        click: function () { $(this).dialog('close'); }
      },
      {
        text: Drupal.t('Continue to this site'),
        click: function () { window.location.href = url; }
      }
    ],
    open: function () {
      if (!directDisable) {
        timeoutId = setTimeout(function () { window.location.href = url; }, delay * 1000);
      }
      $('.ui-widget-overlay').addClass('extLinkPage');
    },
    close: function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      $('.ui-widget-overlay').removeClass('extLinkPage');
    },
    dialogClass: 'extLinkPage',
    draggable: false,
    modal: true,
    resizable: false,
    title: title,
    width: 400
  });
}

function extLinkPageAttach(context) {
  // Find all links that are directed to the external link page.
  $('a[href^="' + Drupal.settings.ext_link_page.pathLinkPage + '"]', context).each(function () {
    var url = false, urlsource, pos1, pos2;
    try {
      urlsource = this.href;
      pos1 = urlsource.indexOf('?url=');
      if (pos1 > 0) {
        pos2 = urlsource.indexOf('&', pos1 + 1);
        url = decodeURIComponent(urlsource.substring(pos1 + 5, (pos2 == -1) ? urlsource.length : pos2));
      }
    }
    // IE7 throws errors often when dealing with irregular links, such as:
    // <a href="node/10"></a> Empty tags.
    // <a href="http://user:pass@example.com">example</a> User:pass syntax.
    catch (error) {
      return;
    }

    if (Drupal.settings.ext_link_page.extLinkClass && !$(this).find('img').length) {
      // Apply the "ext" class to all links not containing images.
      $(this).addClass(Drupal.settings.ext_link_page.extLinkClass);
      if ($(this).css('display') == 'inline') {
        $(this).after('<span class=' + Drupal.settings.ext_link_page.extLinkClass + '></span>');
      }
    }

    // Attach handler for clicks
    if (url) {
      $(this).click(function (e) {
        extLinkPageModal(url);
        e.preventDefault();
      });
    }
  });

  // Work around for Internet Explorer box model problems.
  if (($.support && $.support.boxModel !== undefined && !$.support.boxModel) || ($.browser.msie && parseInt($.browser.version, 10) <= 7)) {
    $('span.ext, span.mailto').css('display', 'inline-block');
  }
}

Drupal.behaviors.ext_link_page = {attach: extLinkPageAttach};

})(jQuery);
;/**/
!function(t){Drupal.behaviors.image_caption={attach:function(i,s){t("img.caption:not(.caption-processed)").each(function(i){var s=t(this).width()?t(this).width():!1,a=t(this).height()?t(this).height():!1,h=t(this).attr("title");if(t(this).attr("align")){var e=t(this).attr("align");t(this).css({"float":e}),t(this).removeAttr("align")}else if(t(this).css("float"))var e=t(this).css("float");else var e="normal";var n=t(this).attr("style")?t(this).attr("style"):"";t(this).removeAttr("width"),t(this).removeAttr("height"),t(this).css("width",""),t(this).css("height",""),t(this).removeAttr("align"),t(this).removeAttr("style"),t(this).wrap('<span class="image-caption-container" style="display:inline-block;'+n+'"></span>'),t(this).parent().addClass("image-caption-container-"+e),s&&(t(this).width(s),t(this).parent().width(s)),a&&t(this).height(a),h&&(t(this).parent().append('<span style="display:block;" class="image-caption">'+h+"</span>"),t(this).addClass("caption-processed"))})}}}(jQuery);;/**/
/**
 * @file: tab_builder.js
 * 
 * take the html markup for tabbed/accordion body
 * content and convert to the desired presentation.
 * 
 * we'll have to rework the markup structure first and then,
 * we can apply the toggle event elements for the user interaction
 * bits.
 */

(function ($){
	
	Drupal.behaviors.wysiwyg_tools_plus_theme_createTabs = {
		attach:function (context) {
			//tabbed elements first
			// for each of the div's apply an id to each
			$('.ready-tabber', context).each(function (index) {

				// a couple of opening set-ups for first run.
				if (index == 0) {
					//create the ul that our headers can be added to for the tabs row plus id's to link to content
					$(this).before('<ul class="ready-tabs"></ul>');
				}
				// add an indexed id to the div
				$(this).attr('id', 'content-' + index);

				//wrap the tab header as an anchor and li
				$(this).children('.ready-tabber-header').wrap('<li class="ready-tab"><a id="tab-' + index + '" href="javascript:void(0);"></a></li>');

				// move the header element to the ul as a li
				$(this).children('li').appendTo('ul.ready-tabs');
			});
			$('.ready-tabs', context).after('<br clear="all" />');
		}
	}
	
	Drupal.behaviors.wysiwyg_tools_plus_theme_createAccordions = {
		attach:function (context) {
			$('.ready-accordion').each(function (index) {
				$(this).attr('id', 'acc-' + index);
				$(this).children('.ready-accordion-header').wrap('<a class="acc-head" id="acc-head-' + index + '" href="javascript:void(0);"></a>');
				$(this).children('a.acc-head').insertBefore(jQuery(this));

        // awful hack: apply .last to the accordion heads which appear to be last
        if ($(this).next().length == 0 || !$(this).next().hasClass("ready-accordion")) {
          $(this).prev().addClass("last");
        }
			});

		}
	}
	
	Drupal.behaviors.wysiwyg_tools_plus_theme_initPage = {
		attach:function (context) {
			$('.ready-accordion', context).hide();
			$('.acc-head', context).children('span').addClass('collapsed');
			// set the click events
			$('.ready-tabs a', context).click(function (event) {
				idClicked = this.id;
				wysiwyg_tools_plus_theme_toggleTabContent(idClicked);
			});

			$('.acc-head', context).click(function (event) {
				idClicked = this.id;
				wysiwyg_tools_plus_theme_toggleAccordionContent(idClicked);

        // attach an active class to active accordion heads
        if ($(this).children('span').hasClass("expanded")) {
          $(this).children('span').removeClass("expanded");
					$(this).children('span').addClass("collapsed");
        } else {
          $(this).children('span').addClass("expanded");
					$(this).children('span').removeClass("collapsed");
        }

			});
			wysiwyg_tools_plus_theme_toggleTabContent('tab-0');
		}
	}	
	
	/**
	 * Toggle the visibility of the tab content and set active link
	 */
	function wysiwyg_tools_plus_theme_toggleTabContent (eventId) {
		eventId = eventId.substring(eventId.length-1, eventId.length);
		$('.ready-tabber').each(function (index) {
			if (this.id == "content-" + eventId) {
				// set the link as active
				$('.ready-tabs #tab-' + eventId).parent('li').addClass('active');
				// expose active content
				$(this).show();
			}
			else {
				//unset active class from non-event links
				$('.ready-tabs #tab-' + index).parent('li').removeClass('active');
				//hide unactive content
				$(this).hide();
			}
		});
	}
	
	/**
	 * Toggle the visibility of the accordion content
	 */
	function wysiwyg_tools_plus_theme_toggleAccordionContent(eventId) {
		eventId = eventId.substring(eventId.lastIndexOf('-')+1, eventId.length);
		$('#acc-' + eventId).toggle('fast');
	}
	
}(jQuery));
;/**/
(function() {
  //////////////////////////////
  // Global Closure Variables
  //
  // Actual definitions set at window.onload to ensure the settings have loaded in before trying to use them.
  //////////////////////////////
  var settings = '';
  var settingsArray = '';
  var settingArrayLength = '';

  var lazyload = '';

  var aspectRatio = '';

  var sizeArray = '';
  var arraySize = '';

  var styleArray = '';


  //////////////////////////////
  // Add indexOf Polyfill
  //
  // indexOf is new to ECMA-262 standard and as such, if it doesn't exist, we need to polyfill for it.
  // Polyfill from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf#Compatibility
  //////////////////////////////
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
            n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
            return k;
        }
      }
      return -1;
    }
  }


  //////////////////////////////
  // Add getComputedStyle Polyfill
  //
  // indexOf is new to ECMA-262 standard and as such, if it doesn't exist, we need to polyfill for it.
  // Polyfill from http://snipplr.com/view/13523/
  //////////////////////////////
  if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
      this.el = el;
      this.getPropertyValue = function(prop) {
        var re = /(\-([a-z]){1})/g;
        if (prop == 'float') prop = 'styleFloat';
        if (re.test(prop)) {
          prop = prop.replace(re, function () {
            return arguments[2].toUpperCase();
          });
        }
        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
      }
      return this;
    }
  }

  //////////////////////////////
  // On Load, rock it out!
  //////////////////////////////
  window.onload = function() {
    settings = Drupal.settings.borealis_ri.sizes;
    settingsArray = sortObject(settings);
    settingArrayLength = settingsArray.length;

    lazyload = Drupal.settings.borealis_ri.lazyload;

    aspectRatio = Drupal.settings.borealis_ri.aspect_ratio;


    styleArray = Drupal.settings.borealis_ri.styleArray;

    var sizeArraySort = new Array();
    var styleArraySort = new Array();
    for (i = 0; i < settingArrayLength; i++) {
      sizeArraySort.push(settingsArray[i].value);
      styleArraySort.push(settingsArray[i].key);
    }

    sizeArray = sizeArraySort;
    styleArray = styleArraySort;

    arraySize = sizeArray.length;

    if (lazyload) {
      borealisImagePlaceholder();
    }
    else {
      borealisImageRespond();
    }


    // When the screen is resized, check again!
    window.onresize = debounce(function(){

      if (lazyload) {
        borealisImagePlaceholder();
      }
      else {
        borealisImageRespond();
      }
    }, 20);

    // When the screen is scrolled, do it again!
    window.onscroll = window.onresize;
  };


  //////////////////////////////
  // Borealis Image Placeholder
  //
  // Loop over each image, add height and width to get general idea of whether or not an image is in the viewport
  //////////////////////////////
  function borealisImagePlaceholder() {
    var images = document.querySelectorAll('img.borealis');
    var imageLength = images.length;

    for (var i = 0; i < imageLength; i++) {
      var image = images[i];
      var width = blockParentWidth(image);
      var height = width * aspectRatio;

      var imgStyle = image.getAttribute('data-borealis-style') ? true : false


      if (!imgStyle) {
        image.setAttribute('width', width);
        image.setAttribute('height', height);
      }

      if (elementInViewport(image)) {
        borealisFindImage(image);
      }
      
      if (!imgStyle) {
        image.removeAttribute('width');
        image.removeAttribute('height');
      }
      
    }
  }

  //////////////////////////////
  // Borealis Image Resize
  //
  // Resizes image's height/width
  //////////////////////////////

  function borealisImageResize() {
    var images = document.querySelectorAll('img.borealis');
    var imageLength = images.length;

    for (var i = 0; i < imageLength; i++) {
      var image = images[i];
      var imgStyle = image.getAttribute('data-borealis-style') ? true : false

      if (!imgStyle) {
        image.setAttribute('width', image.width);
        image.setAttribute('height', image.height);
      }
    }
  }

  //////////////////////////////
  // Borealis Image Respond
  //
  // Loop over each image, and change their source depending on parent width
  //////////////////////////////
  function borealisImageRespond() {
    var images = document.querySelectorAll('img.borealis');
    var imageLength = images.length;

    for (var i = 0; i < imageLength; i++) {
      var image = images[i];
      borealisFindImage(image);
    } // End Image Loop
  }

  //////////////////////////////
  // Borealis Find Image
  //
  // Reusable chunk of code to find and swap in an image
  //////////////////////////////
  function borealisFindImage(image) {
    var width = blockParentWidth(image);

    if (width > 0) {
      var slfor = arraySize - 1;
      swapped = false;

      if (width <= sizeArray[0]) {
        borealisImageSwap(image, -1, width);
      }
      else if (width >= sizeArray[slfor + 1]) {
        borealisImageSwap(image, slfor, width, true);
      }
      else {
        for (j = slfor; j >= 0; j--) {
          if (width >= sizeArray[j]) {
            borealisImageSwap(image, j, width);
            j = -1;
          }
        }
      } // End Size Loop
    } //End Width > 0 Check
  }

  //////////////////////////////
  // Borealis Image Swap
  //
  // Sets the appropriate image style based off of Device Pixel Ratio
  //////////////////////////////
  function borealisImageSwap(img, index, width, bypass) {
    // Increase index by one to get the next highest size
    index++;

    if (img.getAttribute('data-locked')) {
      return;
    }

    img.setAttribute('data-locked', 1);

    // Set Bypass
    bypass = (typeof bypass === "undefined") ? false : bypass;

    // Get current image style
    var imgStyle = img.getAttribute('data-borealis-style') ? img.getAttribute('data-borealis-style') : styleArray[0];

    // Get Device Pixel Ratio
    var dpr = (window.devicePixelRatio !== undefined) ? window.devicePixelRatio : 1;

    // Create Style variable
    var style = '';

    // Bypass for the index size passed regardless of DPR
    if (bypass) {
      dpr = 1;
    }

    // If we've got a HighDPI device,
    if (dpr > 1.5 && dpr <= 2.5) {
      style = styleArray[index + 1];
    }
    else {
      style = styleArray[index];
    }

    // Only swap the image if the required image is larger
    if (styleArray.indexOf(style) > styleArray.indexOf(imgStyle)) {
      var src = img.getAttribute('data-borealis-' + style);

      var loadImg = new Image();

      loadImg.onload = function() {
        loadImg.onload = null;

        var imgAttributes = img.attributes;
        var imgAttributeLength = imgAttributes.length;

        for (var i = 0; i < imgAttributeLength; i++) {
          if (imgAttributes[i].name != 'height' && imgAttributes[i].name != 'width' && imgAttributes[i].name != 'src' && imgAttributes[i].name != 'data-borealis-style' && imgAttributes[i].name != 'data-locked') {
            loadImg.setAttribute(imgAttributes[i].name, imgAttributes[i].value);
          }
        }

        // Set the current style
        loadImg.setAttribute('data-borealis-style', style);

        // Remove the Placeholder class
        removeClass(loadImg, 'placeholder');

        // Add image to the DOM
        img.parentNode.replaceChild(loadImg, img);

        // Remove the Loading class, add the Loaded class
        removeClass(loadImg.parentNode, 'loading');
        addClass(loadImg.parentNode, 'loaded');

        // Run the whole thing over again
        borealisImagePlaceholder();
      }
      loadImg.src = src;
    }
    else {
      img.removeAttribute('data-locked')
    }
  }

  //////////////////////////////
  // Returns the width of the nearest non-inline parent.
  //////////////////////////////
  function blockParentWidth(element) {
    var parentNode = element.parentNode;
    var parentDisplay = getComputedStyle(parentNode).display;
    
    // The getComputedStyle polyfill is not working for IE8, causing
    // parentDisplay to be undefined.
    // https://drupal.org/node/2011016
    // In this case, simply return the smaller of window width or 1000px.
    if  (typeof(parentDisplay) == 'undefined' || parentDisplay == null) {
      return Math.min(document.documentElement.clientWidth,1000);
    }
    
    if (parentDisplay.indexOf('inline') >= 0 && parentDisplay.indexOf('block') < 0) {
      return blockParentWidth(parentNode);
    }
    else {
      return parseInt(getComputedStyle(parentNode).width);
    }
  }

  //////////////////////////////
  // Sorts an object into an array by value. http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
  //////////////////////////////
  function sortObject(obj) {
    var arr = new Array();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        arr.push({
          'key': attr,
          'value': obj[attr]
        });
      }
    }
    arr.sort(function(a, b) { return a['value'] - b['value'] });
    return arr; // returns array
  }

  //////////////////////////////
  // Checks to see if element is in viewport
  //
  // From http://css-tricks.com/snippets/javascript/lazy-loading-images/
  //////////////////////////////
  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()

    return (
   rect.left   >= 0
    && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }

  //////////////////////////////
  // Debounce
  // Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
  //////////////////////////////
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }

  //////////////////////////////
  // Has Class
  //
  // From http://www.avoid.org/?p=78
  //////////////////////////////
  function hasClass(el, name) {
   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
  }

  //////////////////////////////
  // Remove Class
  //
  // From http://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery
  //////////////////////////////
  function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  }

  //////////////////////////////
  // Add Class
  //
  // From http://www.avoid.org/?p=78
  //////////////////////////////
  function addClass(el, name) {
   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
  }
  
  Drupal.BorealisRefresh = function() {
    borealisImageRespond();
  };
  
})();

;/**/

/**
 * @file media_youtube/js/media_youtube.js
 */

(function ($) {

Drupal.media_youtube = {};
Drupal.behaviors.media_youtube = {
  attach: function (context, settings) {
    // Check the browser to see if it supports html5 video.
    var video = document.createElement('video');
    var html5 = video.canPlayType ? true : false;

    // If it has video, does it support the correct codecs?
    if (html5) {
      html5 = false;
      if (video.canPlayType( 'video/webm; codecs="vp8, vorbis"' ) || video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
        html5 = true;
      }
    }

    // Put a prompt in the video wrappers to let users know they need flash
    if (!FlashDetect.installed && !html5){
      $('.media-youtube-preview-wrapper').each(Drupal.media_youtube.needFlash);
    }

    // Replace all object tags with iframes.
    if (Drupal.settings && Drupal.settings.media_youtube) {
      for (video in Drupal.settings.media_youtube) {
        Drupal.media_youtube.insertEmbed(video);
      }
    }
  }
};

Drupal.media_youtube.needFlash = function () {
  var id = $(this).attr('id');
  var wrapper = $('.media-youtube-preview-wrapper');
  var hw = Drupal.settings.media_youtube[id].height / Drupal.settings.media_youtube[id].width;
  wrapper.html('<div class="js-fallback">' + Drupal.t('You need Flash to watch this video. <a href="@flash">Get Flash</a>', {'@flash':'http://get.adobe.com/flashplayer'}) + '</div>');
  wrapper.height(wrapper.width() * hw);
};

Drupal.media_youtube.insertEmbed = function (embed_id) {
  var videoWrapper = $('#' + embed_id + '.media-youtube-preview-wrapper');
  var settings = Drupal.settings.media_youtube[embed_id];

  // Calculate the ratio of the dimensions of the embed.
  settings.hw = settings.height / settings.width;

  // Replace the object embed with YouTube's iframe. This isn't done by the
  // theme function because YouTube doesn't have a no-JS or no-Flash fallback.
  var video = $('<iframe class="youtube-player" type="text/html" frameborder="0"></iframe>');
  var src = 'https://www.youtube.com/embed/' + settings.video_id;

  // Allow other modules to modify the video settings.
  settings.options = settings.options || {};
  settings.options.wmode = 'opaque';
  $(window).trigger('media_youtube_load', settings);

  // Merge YouTube options (such as autoplay) into the source URL.
  var query = $.param(settings.options);
  if (query) {
    src += '?' + query;
  }

  // Set up the iframe with its contents and add it to the page.
  video
    .attr('id', settings.id)
    .attr('width', settings.width)
    .attr('height', settings.height)
    .attr('src', src);
  videoWrapper.html(video);

  // Bind a resize event to handle fluid layouts.
  $(window).bind('resize', Drupal.media_youtube.resizeEmbeds);

  // For some reason Chrome does not properly size the container around the
  // embed and it will just render the embed at full size unless we set this
  // timeout.
  if (!$('.lightbox-stack').length) {
    setTimeout(Drupal.media_youtube.resizeEmbeds, 1);
  }
};

Drupal.media_youtube.resizeEmbeds = function () {
  $('.media-youtube-preview-wrapper').each(Drupal.media_youtube.resizeEmbed);
};

Drupal.media_youtube.resizeEmbed = function () {
  var context = $(this).parent();
  var video = $(this).children(':first-child');
  var hw = Drupal.settings.media_youtube[$(this).attr('id')].hw;
  // Change the height of the wrapper that was given a fixed height by the
  // YouTube theming function.
  $(this)
    .height(context.width() * hw)
    .width(context.width());

  // Change the attributes on the embed to match the new size.
  video
    .height(context.width() * hw)
    .width(context.width());
};

})(jQuery);
;/**/
//http://www.featureblend.com/license.txt
var FlashDetect=new function(){var self=this;self.installed=false;self.raw="";self.major=-1;self.minor=-1;self.revision=-1;self.revisionStr="";var activeXDetectRules=[{"name":"ShockwaveFlash.ShockwaveFlash.7","version":function(obj){return getActiveXVersion(obj);}},{"name":"ShockwaveFlash.ShockwaveFlash.6","version":function(obj){var version="6,0,21";try{obj.AllowScriptAccess="always";version=getActiveXVersion(obj);}catch(err){}
return version;}},{"name":"ShockwaveFlash.ShockwaveFlash","version":function(obj){return getActiveXVersion(obj);}}];var getActiveXVersion=function(activeXObj){var version=-1;try{version=activeXObj.GetVariable("$version");}catch(err){}
return version;};var getActiveXObject=function(name){var obj=-1;try{obj=new ActiveXObject(name);}catch(err){obj={activeXError:true};}
return obj;};var parseActiveXVersion=function(str){var versionArray=str.split(",");return{"raw":str,"major":parseInt(versionArray[0].split(" ")[1],10),"minor":parseInt(versionArray[1],10),"revision":parseInt(versionArray[2],10),"revisionStr":versionArray[2]};};var parseStandardVersion=function(str){var descParts=str.split(/ +/);var majorMinor=descParts[2].split(/\./);var revisionStr=descParts[3];return{"raw":str,"major":parseInt(majorMinor[0],10),"minor":parseInt(majorMinor[1],10),"revisionStr":revisionStr,"revision":parseRevisionStrToInt(revisionStr)};};var parseRevisionStrToInt=function(str){return parseInt(str.replace(/[a-zA-Z]/g,""),10)||self.revision;};self.majorAtLeast=function(version){return self.major>=version;};self.minorAtLeast=function(version){return self.minor>=version;};self.revisionAtLeast=function(version){return self.revision>=version;};self.versionAtLeast=function(major){var properties=[self.major,self.minor,self.revision];var len=Math.min(properties.length,arguments.length);for(i=0;i<len;i++){if(properties[i]>=arguments[i]){if(i+1<len&&properties[i]==arguments[i]){continue;}else{return true;}}else{return false;}}};self.FlashDetect=function(){if(navigator.plugins&&navigator.plugins.length>0){var type='application/x-shockwave-flash';var mimeTypes=navigator.mimeTypes;if(mimeTypes&&mimeTypes[type]&&mimeTypes[type].enabledPlugin&&mimeTypes[type].enabledPlugin.description){var version=mimeTypes[type].enabledPlugin.description;var versionObj=parseStandardVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revisionStr=versionObj.revisionStr;self.revision=versionObj.revision;self.installed=true;}}else if(navigator.appVersion.indexOf("Mac")==-1&&window.execScript){var version=-1;for(var i=0;i<activeXDetectRules.length&&version==-1;i++){var obj=getActiveXObject(activeXDetectRules[i].name);if(!obj.activeXError){self.installed=true;version=activeXDetectRules[i].version(obj);if(version!=-1){var versionObj=parseActiveXVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revision=versionObj.revision;self.revisionStr=versionObj.revisionStr;}}}}}();};FlashDetect.JS_RELEASE="1.0.4";;/**/
