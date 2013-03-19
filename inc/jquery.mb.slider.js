/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.slider.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 19/03/13 23.27
 *  *****************************************************************************
 */


/*Browser detection patch*/
(function(){if(!(8>jQuery.fn.jquery.split(".")[1])){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.msie=!1;var a=navigator.userAgent;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var c,b;if(-1!=(b=a.indexOf("Opera"))){if(jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=a.substring(b+6),-1!=(b= a.indexOf("Version")))jQuery.browser.fullVersion=a.substring(b+8)}else if(-1!=(b=a.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=a.substring(b+5);else if(-1!=(b=a.indexOf("Chrome")))jQuery.browser.webkit=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=a.substring(b+7);else if(-1!=(b=a.indexOf("Safari"))){if(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=a.substring(b+7),-1!=(b=a.indexOf("Version")))jQuery.browser.fullVersion= a.substring(b+8)}else if(-1!=(b=a.indexOf("Firefox")))jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=a.substring(b+8);else if((c=a.lastIndexOf(" ")+1)<(b=a.lastIndexOf("/")))jQuery.browser.name=a.substring(c,b),jQuery.browser.fullVersion=a.substring(b+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName);if(-1!=(a=jQuery.browser.fullVersion.indexOf(";")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, a);if(-1!=(a=jQuery.browser.fullVersion.indexOf(" ")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,a);jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}})(jQuery);


var a=0;
(function($){

  $.mbSlider={
    name:"mb.valueSlider",
    author:"Matteo Bicocchi",
    version:"1.0",

    defaults:{
      maxVal:100,
      minVal:0,
      grid:5,
      showVal:true,
      onSlideLoad: function(o){},
      onStart: function(o){},
      onSlide: function(o){},
      onStop: function(o){}
    },

    buildSlider: function(options){
      return this.each(function(){
        this.options = {};
        $.extend (this.options, $.mbSlider.defaults, options);
        var slider=this;

        if ($.metadata){
          $.metadata.setType("class");
          if ($(slider).metadata().range) $(slider).attr("range",$(slider).metadata().range);
          if ($(slider).metadata().rangeColor) $(slider).attr("rangeColor",$(slider).metadata().rangeColor);
          if ($(slider).metadata().negativeColor) $(slider).attr("negativeColor",$(slider).metadata().negativeColor);
          if ($(slider).metadata().startAt || $(slider).metadata().startAt==0) $(slider).attr("startAt",$(slider).metadata().startAt);
          if ($(slider).metadata().minVal || $(slider).metadata().minVal==0) slider.options.minVal=$(slider).metadata().minVal;
          if ($(slider).metadata().maxVal || $(slider).metadata().maxVal==0) slider.options.maxVal=$(slider).metadata().maxVal;
          if ($(slider).metadata().grid || $(slider).metadata().grid==0) slider.options.grid=$(slider).metadata().grid;
        }

        if(slider.options.grid==0)slider.options.grid=1;
        if($(slider).attr("startAt")<0 && $(slider).attr("startAt")<slider.options.minVal) slider.options.minVal = parseFloat($(slider).attr("startAt"));

        slider.sliderStart= $("<div class='mb_sliderStart'/>");
        slider.sliderEnd= $("<div class='mb_sliderEnd'/>");
        slider.sliderValue= $("<div class='mb_sliderValue'/>").css({color:$(slider).attr("rangeColor")});
        slider.sliderZeroLabel= $("<div class='mb_sliderZeroLabel'>0</div>").css({position:"absolute",  top:-18});
        slider.sliderValueLabel= $("<div class='mb_sliderValueLabel'/>").css({position:"absolute",color:$(slider).attr("rangeColor"),top:-18});

        slider.sliderBar= $("<div class='mb_sliderBar'/>").css({position:"relative", display:"block"});
        slider.sliderRange= $("<div class='mb_sliderRange'/>").css({background:$(slider).attr("rangeColor")});
        slider.sliderZero= $("<div class='mb_sliderZero'/>").css({background:$(slider).attr("negativeColor")});
        slider.sliderHandler= $("<div class='mb_sliderHandler'/>");

        $(slider).append(slider.sliderBar);
        slider.sliderBar.append(slider.sliderValueLabel);

        if(slider.options.showVal) $(slider).append(slider.sliderEnd);
        if(slider.options.showVal) $(slider).prepend(slider.sliderStart);
        slider.sliderBar.append(slider.sliderRange);
        slider.sliderBar.append(slider.sliderRange);
        if(slider.options.minVal<0){
          slider.sliderBar.append(slider.sliderZero);
          slider.sliderBar.append(slider.sliderZeroLabel);
        }
        slider.sliderBar.append(slider.sliderHandler);


        slider.rangeVal= slider.options.maxVal-slider.options.minVal;
        slider.zero= slider.options.minVal<0? (slider.sliderBar.outerWidth()*Math.abs(slider.options.minVal))/slider.rangeVal:0;
        slider.sliderZero.css({left:0, width:slider.zero});
        slider.sliderZeroLabel.css({left:slider.zero-5});
        //FUCKING IE FIX!!
        if($.browser.msie && (parseFloat($.browser.version)==7)){
          $(slider).find("div").css({float:"left"});
          slider.sliderValueLabel.css({top:0, marginTop:-10,marginLeft:55, zIndex:10});
          slider.sliderZeroLabel.css({top:0, marginTop:-10,marginLeft:55, zIndex:0});
          $(slider).append(slider.sliderValueLabel);
          if(slider.options.minVal<0) $(slider).append(slider.sliderZeroLabel);

        } else $(slider).find("div").css({display:"inline-block", clear:"left"});

        if ($.browser.msie){
          $(slider).attr("unselectable","on");
          $(slider).find("div").attr("unselectable","on");
        }

        slider.sliderStart.html(slider.options.minVal);
        slider.sliderValue.html(parseFloat($(slider).attr("startAt"))>=slider.options.minVal?$(slider).attr("startAt"):slider.options.minVal);
        slider.sliderValueLabel.html(parseFloat($(slider).attr("startAt"))>=slider.options.minVal?$(slider).attr("startAt"):slider.options.minVal);
        slider.sliderEnd.html(slider.options.maxVal);

        if($(slider).attr("startAt")<slider.options.minVal || !$(slider).attr("startAt")) $(slider).attr("startAt",slider.options.minVal);

        var startPos=$(slider).attr("startAt")==slider.options.minVal?0: Math.round((($(slider).attr("startAt")-slider.options.minVal)* slider.sliderBar.outerWidth())/slider.rangeVal);
        startPos= startPos>=0 ? startPos : slider.zero+$(slider).attr("startAt");
        startPos= slider.options.grid * Math.round(startPos/slider.options.grid);

        slider.sliderHandler.css({left: startPos - (startPos>slider.sliderHandler.outerWidth()/2?slider.sliderHandler.outerWidth()/2:0)});
        slider.sliderValueLabel.css({left: startPos - (startPos>slider.sliderHandler.outerWidth()/2?slider.sliderHandler.outerWidth()/2:0)});

        if($(slider).attr("startAt")>0){
          slider.sliderRange.css({left:0,width:startPos});
          slider.sliderZero.css({width:slider.zero});
        }else {
          slider.sliderRange.css({left:0,width:slider.zero});
          slider.sliderZero.css({width:startPos});
        }
        slider.evalPosGrid= slider.sliderValueLabel.html();

        slider.sliderBar.bind("mousedown", function(e){

          var mousePos= e.clientX-slider.sliderBar.offset().left;
          var grid= (slider.options.grid*slider.sliderBar.outerWidth())/slider.rangeVal;
          var posInGrid= grid * Math.round(mousePos/grid);
          if(mousePos> slider.sliderBar.outerWidth() || mousePos<0 ) return;

          var evalPos= Math.round(((slider.options.maxVal-slider.options.minVal) * posInGrid)/(slider.sliderBar.outerWidth()-(slider.sliderHandler.outerWidth()/2)));
          evalPos=slider.options.minVal <0 || slider.options.minVal >0 ? evalPos+slider.options.minVal : evalPos;
          slider.evalPosGrid= slider.options.grid * Math.round(evalPos/slider.options.grid);

          slider.sliderHandler.css({left:posInGrid>slider.sliderHandler.outerWidth()?posInGrid-(slider.sliderHandler.outerWidth()/2):0});
          slider.sliderValueLabel.css({left:posInGrid>slider.sliderHandler.outerWidth()?posInGrid-(slider.sliderHandler.outerWidth()/2):0});
          if(slider.evalPosGrid>0){
            slider.sliderRange.css({width:posInGrid-(slider.sliderHandler.outerWidth()/2)});
            slider.sliderZero.css({width:slider.zero});
          }else {
            slider.sliderRange.css({width:slider.zero});
            slider.sliderZero.css({width:posInGrid});
          }

          slider.evalPosGrid= evalPos>slider.options.maxVal?slider.options.maxVal:evalPos<slider.options.minVal?slider.options.minVal:slider.evalPosGrid;
          slider.sliderValue.html(slider.evalPosGrid);
          if(slider.options.onStart) slider.options.onStart(slider);
          slider.sliderValueLabel.html($(slider).mbgetVal());
          if(slider.options.onSlide) slider.options.onSlide(slider);

          $(document).bind("mousemove", function(e){

            mousePos= e.clientX-slider.sliderBar.offset().left;
            var grid= (slider.options.grid*slider.sliderBar.outerWidth())/slider.rangeVal;
            var posInGrid= grid * Math.round(mousePos/grid);

            var evalPos= Math.round(((slider.options.maxVal-slider.options.minVal) * posInGrid)/(slider.sliderBar.outerWidth()-(slider.sliderHandler.outerWidth()/2))+parseFloat(slider.options.minVal));
            slider.evalPosGrid= slider.options.grid* Math.round(evalPos/slider.options.grid);

            if(slider.evalPosGrid >= slider.options.maxVal){
              slider.sliderHandler.css({left:(slider.sliderBar.outerWidth()-slider.sliderHandler.outerWidth())});
              slider.sliderValueLabel.css({left:(slider.sliderBar.outerWidth()-slider.sliderHandler.outerWidth()*2)});
              slider.sliderRange.css({width:(slider.sliderBar.outerWidth()-(slider.sliderHandler.outerWidth()/2))});
              slider.sliderZero.css({width:slider.zero});
              slider.sliderValue.html(slider.options.maxVal);
            } else if(slider.evalPosGrid <= slider.options.minVal || mousePos<=slider.sliderHandler.outerWidth()/2){
              slider.sliderHandler.css({left:0});
              slider.sliderValueLabel.css({left:0});
              if (slider.options.minVal>=0) slider.sliderRange.css({width:0});
              if(slider.evalPosGrid>=0){
                slider.sliderRange.css({width:0});
              }else{
                slider.sliderZero.css({width:0});
              }
              slider.sliderValue.html(posInGrid>0?slider.evalPosGrid:slider.options.minVal);
            }else{
              slider.sliderHandler.css({left:posInGrid-(slider.sliderHandler.outerWidth()/2)});
              slider.sliderValueLabel.css({left:posInGrid-(slider.sliderHandler.outerWidth()/2)});
              if(slider.evalPosGrid>0){
                slider.sliderRange.css({width:posInGrid-(slider.sliderHandler.outerWidth()/2)+(slider.sliderHandler.outerWidth()/2)});
                slider.sliderZero.css({width:slider.zero});
              }else {
                slider.sliderRange.css({width:slider.zero});
                slider.sliderZero.css({width:posInGrid});
              }
              slider.sliderValue.html(slider.evalPosGrid);
            }

            slider.sliderValueLabel.html($(slider).mbgetVal());
            if(slider.options.onSlide) slider.options.onSlide(slider);

          });
          $(document).bind("mouseup",function(){
            $(document).unbind("mousemove");
            if(slider.options.onStop) slider.options.onStop(slider);
          });
        });
        if(slider.options.onSlideLoad) slider.options.onSlideLoad(slider);
      });
    },
    setVal: function(val){
      var slider=$(this).get(0);
      if(val>slider.options.maxVal) val=slider.options.maxVal;
      if(val<slider.options.minVal) val=slider.options.minVal;
      var startPos= val==slider.options.minVal?0: Math.round(((val-slider.options.minVal)* slider.sliderBar.outerWidth())/slider.rangeVal);
      startPos= startPos>=0?startPos:slider.zero+val;
      var grid= (slider.options.grid*slider.sliderBar.outerWidth())/slider.rangeVal;
      var posInGrid= grid * Math.round(startPos/grid);
      slider.evalPosGrid= slider.options.grid* Math.round(val/slider.options.grid);

      slider.sliderHandler.css({left: posInGrid-(slider.sliderHandler.outerWidth()/2)});
      slider.sliderValueLabel.css({left: posInGrid-(slider.sliderHandler.outerWidth()/2)});
      if(slider.evalPosGrid>0){
        slider.sliderRange.css({left:0, width: posInGrid});
        slider.sliderZero.css({width:slider.zero});
      }else {
        slider.sliderRange.css({left:0,width:slider.zero});
        slider.sliderZero.css({width:posInGrid+(slider.sliderHandler.outerWidth()/2)});
      }
      slider.sliderValue.html(val>=slider.options.minVal?slider.evalPosGrid:slider.options.minVal);
      slider.sliderValueLabel.html(val>=slider.options.minVal?slider.evalPosGrid:slider.options.minVal);
    },

    getVal: function(){
      var slider=$(this).get(0);
      var val=slider.evalPosGrid;
      if (val && val>slider.options.maxVal) val = slider.options.maxVal;
      if (val && val<slider.options.minVal) val = slider.options.minVal;
      val=!val?0:val;
      return val;
    }
  };

  $.fn.mbSlider = $.mbSlider.buildSlider;
  $.fn.mbsetVal = $.mbSlider.setVal;
  $.fn.mbgetVal = $.mbSlider.getVal;

})(jQuery);
