/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: info@pupunzi.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: jquery.mb.slider
 * version: 1.0
 * © 2001 - 2009 Matteo Bicocchi (pupunzi), Open Lab
 *
 */

/*Browser detection patch*/
var nAgt=navigator.userAgent; if(!jQuery.browser){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.safari=!1;jQuery.browser.chrome=!1;jQuery.browser.msie=!1;jQuery.browser.ua=nAgt;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var nameOffset,verOffset,ix;if(-1!=(verOffset=nAgt.indexOf("Opera")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion= nAgt.substring(verOffset+6),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8));else if(-1!=(verOffset=nAgt.indexOf("OPR")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+4);else if(-1!=(verOffset=nAgt.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=nAgt.substring(verOffset+5);else if(-1!=nAgt.indexOf("Trident")){jQuery.browser.msie= !0;jQuery.browser.name="Microsoft Internet Explorer";var start=nAgt.indexOf("rv:")+3,end=start+4;jQuery.browser.fullVersion=nAgt.substring(start,end)}else-1!=(verOffset=nAgt.indexOf("Chrome"))?(jQuery.browser.webkit=!0,jQuery.browser.chrome=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1!=(verOffset=nAgt.indexOf("Safari"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7), -1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("AppleWebkit"))?(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("Firefox"))?(jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=nAgt.substring(verOffset+ 8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(jQuery.browser.name=nAgt.substring(nameOffset,verOffset),jQuery.browser.fullVersion=nAgt.substring(verOffset+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName));-1!=(ix=jQuery.browser.fullVersion.indexOf(";"))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix));-1!=(ix=jQuery.browser.fullVersion.indexOf(" "))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, ix));jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}jQuery.browser.android=/Android/i.test(nAgt);jQuery.browser.blackberry=/BlackBerry|BB|PlayBook/i.test(nAgt);jQuery.browser.ios=/iPhone|iPad|iPod|webOS/i.test(nAgt);jQuery.browser.operaMobile=/Opera Mini/i.test(nAgt); jQuery.browser.windowsMobile=/IEMobile|Windows Phone/i.test(nAgt);jQuery.browser.kindle=/Kindle|Silk/i.test(nAgt);jQuery.browser.mobile=jQuery.browser.android||jQuery.browser.blackberry||jQuery.browser.ios||jQuery.browser.windowsMobile||jQuery.browser.operaMobile||jQuery.browser.kindle;

(function ($) {

	$.mbSlider = {
		name   : "mb.slider",
		author : "Matteo Bicocchi",
		version: "1.6.0",

		defaults: {
			minVal     : 0,
			maxVal     : 100,
			grid       : 5,
			showVal    : true,
			formatValue: function (val) {return parseFloat(val)},
			onSlideLoad: function (o) {},
			onStart    : function (o) {},
			onSlide    : function (o) {},
			onStop     : function (o) {}
		},

		buildSlider: function (options) {
			return this.each(function () {
				var slider = this;
				var $slider = $(slider);

				$slider.addClass("mb_slider");

				this.options = {};
				this.metadata = $slider.data("property") && typeof $slider.data("property") == "string" ? eval('(' + $slider.data("property") + ')') : $slider.data("property");

				$.extend(this.options, $.mbSlider.defaults, options, this.metadata);

				if (slider.options.grid == 0)
					slider.options.grid = 1;


				if (this.options.startAt < 0 && this.options.startAt < slider.options.minVal)
					slider.options.minVal = parseFloat(this.options.startAt);

				slider.actualPos = this.options.startAt;


				slider.sliderStart = $("<div class='mb_sliderStart'/>");
				slider.sliderEnd = $("<div class='mb_sliderEnd'/>");
				slider.sliderValue = $("<div class='mb_sliderValue'/>").css({color: this.options.rangeColor});
				slider.sliderZeroLabel = $("<div class='mb_sliderZeroLabel'>0</div>").css({position: "absolute", top: -18});
				slider.sliderValueLabel = $("<div class='mb_sliderValueLabel'/>").css({position: "absolute", color: this.options.rangeColor, top: -18});

				slider.sliderBar = $("<div class='mb_sliderBar'/>").css({position: "relative", display: "block"});
				slider.sliderRange = $("<div class='mb_sliderRange'/>").css({background: this.options.rangeColor});
				slider.sliderZero = $("<div class='mb_sliderZero'/>").css({background: this.options.negativeColor});
				slider.sliderHandler = $("<div class='mb_sliderHandler'/>");

				$(slider).append(slider.sliderBar);
				slider.sliderBar.append(slider.sliderValueLabel);

				if (slider.options.showVal) $(slider).append(slider.sliderEnd);
				if (slider.options.showVal) $(slider).prepend(slider.sliderStart);
				slider.sliderBar.append(slider.sliderRange);
				slider.sliderBar.append(slider.sliderRange);
				if (slider.options.minVal < 0) {
					slider.sliderBar.append(slider.sliderZero);
					slider.sliderBar.append(slider.sliderZeroLabel);
				}
				slider.sliderBar.append(slider.sliderHandler);

				slider.rangeVal = slider.options.maxVal - slider.options.minVal;

				slider.zero = slider.options.minVal < 0 ? (slider.sliderBar.outerWidth() * Math.abs(slider.options.minVal)) / slider.rangeVal : 0;

				slider.sliderZero.css({left: 0, width: slider.zero});
				slider.sliderZeroLabel.css({left: slider.zero - 5});
				//FUCKING IE FIX!!
				if ($.browser.msie && (parseFloat($.browser.version) == 7)) {
					$(slider).find("div").css({float: "left"});
					slider.sliderValueLabel.css({top: 0, marginTop: -10, marginLeft: 55, zIndex: 10});
					slider.sliderZeroLabel.css({top: 0, marginTop: -10, marginLeft: 55, zIndex: 0});
					$(slider).append(slider.sliderValueLabel);
					if (slider.options.minVal < 0) $(slider).append(slider.sliderZeroLabel);

				} else $(slider).find("div").css({display: "inline-block", clear: "left"});

				if ($.browser.msie) {
					$(slider).attr("unselectable", "on");
					$(slider).find("div").attr("unselectable", "on");
				}

				slider.sliderStart.html(slider.options.formatValue(slider.options.minVal));
				var sliderVal = parseFloat(this.options.startAt) >= slider.options.minVal ? parseFloat(this.options.startAt) : slider.options.minVal;
				slider.sliderValue.html(sliderVal);

				slider.sliderValueLabel.html(slider.options.formatValue(sliderVal));

				slider.sliderEnd.html(slider.options.formatValue(slider.options.maxVal));

				if (this.options.startAt < slider.options.minVal || !this.options.startAt)
					this.options.startAt =  slider.options.minVal;

				var startPos = this.options.startAt == slider.options.minVal ? 0 : Math.round(((this.options.startAt - slider.options.minVal) * slider.sliderBar.outerWidth()) / slider.rangeVal);
				startPos = startPos >= 0 ? startPos : slider.zero + parseFloat(this.options.startAt);
				startPos = slider.options.grid * Math.round(startPos / slider.options.grid);

				slider.sliderHandler.css({left: startPos - (startPos > slider.sliderHandler.outerWidth() / 2 ? slider.sliderHandler.outerWidth() : 0)});
				slider.sliderValueLabel.css({left: startPos - (startPos > slider.sliderHandler.outerWidth() / 2 ? slider.sliderHandler.outerWidth() : 0)});

				if (this.options.startAt > 0) {
					slider.sliderRange.css({left: 0, width: startPos -slider.sliderHandler.outerWidth() / 2});
					slider.sliderZero.css({width: slider.zero});
				} else {
					slider.sliderRange.css({left: 0, width: slider.zero});
					slider.sliderZero.css({width: startPos});
				}

				slider.evalPosGrid = parseFloat(slider.actualPos);

				slider.sliderBar.on("mousedown.mb_slider", function (e) {

					var mousePos = e.clientX - slider.sliderBar.offset().left;

					var grid = (slider.options.grid * slider.sliderBar.outerWidth()) / slider.rangeVal;

					var posInGrid = grid * Math.round(mousePos / grid);

					if (mousePos > slider.sliderBar.outerWidth() || mousePos < 0)
						return;

					var evalPos = Math.round(((slider.options.maxVal - slider.options.minVal) * posInGrid) / (slider.sliderBar.outerWidth() - (slider.sliderHandler.outerWidth() / 2)));
					evalPos = slider.options.minVal < 0 || slider.options.minVal > 0 ? evalPos + slider.options.minVal : evalPos;

					slider.evalPosGrid = slider.options.grid * Math.round(evalPos / slider.options.grid);

					slider.sliderHandler.css({left: posInGrid > slider.sliderHandler.outerWidth() ? posInGrid - (slider.sliderHandler.outerWidth() / 2) : 0});
					slider.sliderValueLabel.css({left: posInGrid > slider.sliderHandler.outerWidth() ? posInGrid - (slider.sliderHandler.outerWidth() / 2) : 0});

					if (slider.evalPosGrid > 0) {

						slider.sliderRange.css({width: posInGrid - slider.sliderHandler.outerWidth() / 2 });
						slider.sliderZero.css({width: slider.zero });

					} else {

						slider.sliderRange.css({width: slider.zero});
						slider.sliderZero.css({width: posInGrid});

					}

					slider.evalPosGrid = evalPos > slider.options.maxVal ? slider.options.maxVal : evalPos < slider.options.minVal ? slider.options.minVal : slider.evalPosGrid;
					slider.sliderValue.html(slider.evalPosGrid);

					if (slider.options.onStart)
						slider.options.onStart(slider);

					slider.sliderValueLabel.html(slider.options.formatValue($(slider).mbgetVal()));

					if (slider.options.onSlide)
						slider.options.onSlide(slider);

					$(document).on("mousemove.mb_slider", function (e) {

						e.preventDefault();

						mousePos = e.clientX - slider.sliderBar.offset().left;

						var grid = (slider.options.grid * slider.sliderBar.outerWidth()) / slider.rangeVal;

						var posInGrid = grid * Math.round(mousePos / grid);

						var evalPos = Math.round(((slider.options.maxVal - slider.options.minVal) * posInGrid) / (slider.sliderBar.outerWidth() - (slider.sliderHandler.outerWidth() / 2)) + parseFloat(slider.options.minVal));

						slider.evalPosGrid = slider.options.grid * Math.round(evalPos / slider.options.grid);

						var sliderValue = "";

						if (slider.evalPosGrid >= slider.options.maxVal) {

							slider.sliderHandler.css({left: (slider.sliderBar.outerWidth() - slider.sliderHandler.outerWidth())});
							slider.sliderRange.css({width: (slider.sliderBar.outerWidth() - (slider.sliderHandler.outerWidth() / 2))});
							slider.sliderZero.css({width: slider.zero});

							sliderValue = slider.options.maxVal;

						} else if (slider.evalPosGrid <= slider.options.minVal || mousePos <= slider.sliderHandler.outerWidth() / 2) {

							slider.sliderHandler.css({left: 0});
							slider.sliderValueLabel.css({left: 0});

							if (slider.options.minVal >= 0)
								slider.sliderRange.css({width: 0});

							if (slider.evalPosGrid >= 0) {

								slider.sliderRange.css({width: 0});

							} else {

								slider.sliderZero.css({width: 0});

							}

							sliderValue = posInGrid > 0 ? slider.evalPosGrid : slider.options.minVal;

						} else {

							slider.sliderHandler.css({left: posInGrid - (slider.sliderHandler.outerWidth() / 2)});
							slider.sliderValueLabel.css({left: posInGrid - (slider.sliderHandler.outerWidth() / 2)});

							if (slider.evalPosGrid > 0) {

								slider.sliderRange.css({width: posInGrid - (slider.sliderHandler.outerWidth() / 2) + (slider.sliderHandler.outerWidth() / 2)});
								slider.sliderZero.css({width: slider.zero});

							} else {

								slider.sliderRange.css({width: slider.zero});
								slider.sliderZero.css({width: posInGrid});

							}

							sliderValue = slider.evalPosGrid;

						}

						slider.sliderValue.html(sliderValue);
						slider.sliderValueLabel.html(slider.options.formatValue($(slider).mbgetVal()));

						if (slider.options.onSlide)
							slider.options.onSlide(slider);

					});

					$(document).on("mouseup.mb_slider", function () {
						$(document).off("mousemove.mb_slider").off("mouseup.mb_slider");
						if (slider.options.onStop)
							slider.options.onStop(slider);
					});

				});
				if (slider.options.onSlideLoad) slider.options.onSlideLoad(slider);
			});
		},

		setVal: function (val) {
			var slider = $(this).get(0);
			if (val > slider.options.maxVal) val = slider.options.maxVal;
			if (val < slider.options.minVal) val = slider.options.minVal;
			var startPos = val == slider.options.minVal ? 0 : Math.round(((val - slider.options.minVal) * slider.sliderBar.outerWidth()) / slider.rangeVal);
			startPos = startPos >= 0 ? startPos : slider.zero + val;
			var grid = (slider.options.grid * slider.sliderBar.outerWidth()) / slider.rangeVal;
			var posInGrid = grid * Math.round(startPos / grid);

			slider.evalPosGrid = slider.options.grid * Math.round(val / slider.options.grid);

			slider.sliderHandler.css({left: posInGrid - (slider.sliderHandler.outerWidth() / 2)});
			slider.sliderValueLabel.css({left: posInGrid - (slider.sliderHandler.outerWidth() / 2)});

			if (slider.evalPosGrid > 0) {

				slider.sliderRange.css({left: 0, width: posInGrid});
				slider.sliderZero.css({width: slider.zero});

			} else {

				slider.sliderRange.css({left: 0, width: slider.zero});
				slider.sliderZero.css({width: posInGrid + (slider.sliderHandler.outerWidth() / 2)});

			}

			slider.sliderValue.html(val >= slider.options.minVal ? slider.evalPosGrid : slider.options.minVal);
			slider.sliderValueLabel.html(slider.options.formatValue(val >= slider.options.minVal ? slider.evalPosGrid : slider.options.minVal));

		},

    getVal: function(){

	    var slider = $(this).get(0);
	    var val = slider.evalPosGrid;
	    if (val && val > slider.options.maxVal) val = slider.options.maxVal;
	    if (val && val < slider.options.minVal) val = slider.options.minVal;
	    val = !val ? 0 : val;
	    return val;

    }
  };

  $.fn.mbSlider = $.mbSlider.buildSlider;
  $.fn.mbsetVal = $.mbSlider.setVal;
  $.fn.mbgetVal = $.mbSlider.getVal;

})(jQuery);
