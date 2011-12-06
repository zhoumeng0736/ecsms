/*
	Multifaceted Lightbox
	by Greg Neustaetter - http://www.gregphoto.net
	
	INSPIRED BY (AND CODE TAKEN FROM)
	==================================
	The Lightbox Effect without Lightbox
	PJ Hyett
	http://pjhyett.com/articles/2006/02/09/the-lightbox-effect-without-lightbox
	

	Lightbox JS: Fullsize Image Overlays 
	by Lokesh Dhakar - http://www.huddletogether.com

	For more information on this script, visit:
	http://huddletogether.com/projects/lightbox/

	Licensend under:
	Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
	(basically, do anything you want, just leave my name and link)
	
*/

var Lightbox = {
	lightboxType : null,
	lightboxCurrentContentID : null,
	
	showBoxString : function(content, boxWidth, boxHeight){
		this.setLightboxDimensions(boxWidth, boxHeight);
		this.lightboxType = 'string';
		var contents = $('boxContents');
		contents.innerHTML = content;
		this.showBox();
		return false;
	},


	showBoxImage : function(href) {
		this.lightboxType = 'image';
		var contents = $('boxContents');
		var objImage = document.createElement("img");
		objImage.setAttribute('id','lightboxImage');
		contents.appendChild(objImage);
		imgPreload = new Image();
		imgPreload.onload=function(){
			objImage.src = href;
			Lightbox.showBox();
		}
		imgPreload.src = href;
		return false;
	},

	showBoxByID : function(id, boxWidth, boxHeight) {
		this.lightboxType = 'id';
		this.lightboxCurrentContentID = id;
		this.setLightboxDimensions(boxWidth, boxHeight);
		var element = $(id);
		var contents = $('boxContents');
		contents.appendChild(element);
		Element.show(id);
		this.showBox();
		return false;
	},

	showBoxByAJAX : function(href, boxWidth, boxHeight) {
		this.lightboxType = 'ajax';
		this.setLightboxDimensions(boxWidth, boxHeight);
		var contents = $('boxContents');
		var myAjax = new Ajax.Updater(contents, href, {method: 'get'});
		this.showBox();
		return false;
	},
	
	setLightboxDimensions : function(width, height) {
		var windowSize = this.getPageDimensions();
		if(width) {
			if(width < windowSize[0]) {
				$('box').style.width = width + 'px';
			} else {
				$('box').style.width = (windowSize[0] - 50) + 'px';
			}
		}
		if(height) {
			if(height < windowSize[1]) {
				$('box').style.height = height + 'px';
			} else {
				$('box').style.height = (windowSize[1] - 50) + 'px';
			}
		}
	},


	showBox : function() {
		this.hideSelects("hidden");
		Element.show('overlay');
		this.center('box');
		$('ajax_close_btn_id').focus();
		return false;
	},
	
	
	hideBox : function(){
		var contents = $('boxContents');		
		if(this.lightboxType == 'id') {
			var body = document.getElementsByTagName("body").item(0);
			Element.hide(this.lightboxCurrentContentID);
			body.appendChild($(this.lightboxCurrentContentID));
		}
		contents.innerHTML = '';
		$('box').style.width = null;
		$('box').style.height = null;
		Element.hide('box');
		Element.hide('overlay');
		this.afterHideBox();
		this.hideSelects("visible");
		return false;
	},
	afterHideBox : function(){},
	
	// taken from lightbox js, modified argument return order
	getPageDimensions : function(){
		var xScroll, yScroll;
	
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		if (self.innerHeight) {	// all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	
		
		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
	
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
		arrayPageSize = new Array(windowWidth,windowHeight,pageWidth,pageHeight) 
		return arrayPageSize;
	},
	
	center : function(element){
		try{
			element = document.getElementById(element);
		}catch(e){
			return;
		}
		var windowSize = this.getPageDimensions();
		var window_width  = windowSize[0];
		var window_height = windowSize[1];
		
		$('overlay').style.height = windowSize[3] + 'px';
		
		element.style.position = 'absolute';
		element.style.zIndex   = 99;
	
		var scrollY = 0;
	
		if ( document.documentElement && document.documentElement.scrollTop ){
			scrollY = document.documentElement.scrollTop;
		}else if ( document.body && document.body.scrollTop ){
			scrollY = document.body.scrollTop;
		}else if ( window.pageYOffset ){
			scrollY = window.pageYOffset;
		}else if ( window.scrollY ){
			scrollY = window.scrollY;
		}
	
		var elementDimensions = Element.getDimensions(element);
		var setX = ( window_width  - elementDimensions.width  ) / 2;
		var setY = ( window_height - elementDimensions.height ) / 2 + scrollY;
	
		setX = ( setX < 0 ) ? 0 : setX;
		setY = ( setY < 0 ) ? 0 : setY;
	
		element.style.left = setX + "px";
		element.style.top  = setY + "px";
		Element.show(element);
	},
	
	init : function(closeBtnValue) {				  
		var lightboxtext = '<div id="overlay" style="display:none"></div>';
		lightboxtext += '<div id="box" style="display:none">';
		lightboxtext += '<img id="close" src="/includes/js/mf_lightbox/close.gif" onClick="Lightbox.hideBox()" alt="Close" title="Close this window" />';
		lightboxtext += '<div id="boxContents" style="float:left"></div>';
		lightboxtext += '<div style="clear: left;"><center><input type="button" value="'+closeBtnValue+'" onClick="Lightbox.hideBox()" alt="Close" id="ajax_close_btn_id"/></center></div>';
		lightboxtext += '</div>';
		var body = document.getElementsByTagName("body").item(0);
		new Insertion.Bottom(body, lightboxtext);
	},

	hideSelects: function(visibility) {
		selects = document.getElementsByTagName('select');
		for(i = 0; i < selects.length; i++) {
			selects[i].style.visibility = visibility;
		}
	}


}

	function ajaxSend(ajaxUrl,param){

		var tmpdiv = '<div id="myMsg" style="display:none"></div>';
		var body = document.getElementsByTagName("body").item(0);
		var d=new Date();

		new Insertion.Bottom(body, tmpdiv);
		if (param==null) param=''; else param+="&";
	
		new Ajax.Updater('myMsg',ajaxUrl,{
		method:'get',
		parameters:param+'&SessionTime='+d.getYear()+d.getMonth()+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds(),
		evalScripts:true
		});
	}

	function ajaxSend(ajaxUrl,param,callBackName){
		
		var tmpdiv = '<div id="myMsg" style="display:none"></div>';
		var body = document.getElementsByTagName("body").item(0);
		var d=new Date();
		new Insertion.Bottom(body, tmpdiv);
		if (param==null) param=''; else param+="&";
		new Ajax.Updater('myMsg',ajaxUrl,{
		method:'post',
		parameters:param+'&ajaxCallBackName='+callBackName+'&SessionTime='+d.getYear()+d.getMonth()+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds(),
		evalScripts:true
		});
	}

	/**
		Button ajax Submit,disable Button when sending
	*/
	function ajaxButtonSend(btn,ajaxUrl,param){
		if (btn.length){
			for (i=0;i<btn.length;i++)
				btn[i].disabled=true;
		}else
			btn.disabled=true;
		var tmpdiv = '<div id="myMsg" style="display:none"></div>';
		var body = document.getElementsByTagName("body").item(0);
		var d=new Date();
		new Insertion.Bottom(body, tmpdiv);
		if (param==null) param=''; else param+="&";
		new Ajax.Updater('myMsg',ajaxUrl,{
		method:'post',
		parameters:param+'&SessionTime='+d.getYear()+d.getMonth()+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds(),
		evalScripts:true,
		onComplete:function(){
			if (btn.length){
				for (i=0;i<btn.length;i++)
					btn[i].disabled=false;
			}else
				btn.disabled=false;
		}
		});
	}
	/**
		Button ajax Submit,disable Button when sending
	*/
	function ajaxButtonSend(btn,ajaxUrl,param,callBackName){
		if (btn.length){
			for (i=0;i<btn.length;i++)
				btn[i].disabled=true;
		}else
			btn.disabled=true;
		var tmpdiv = '<div id="myMsg" style="display:none"></div>';
		var body = document.getElementsByTagName("body").item(0);
		var d=new Date();
		new Insertion.Bottom(body, tmpdiv);
		if (param==null) param=''; else param+="&";
		new Ajax.Updater('myMsg',ajaxUrl,{
		method:'post',
		parameters:param+'&ajaxCallBackName='+callBackName+'&SessionTime='+d.getYear()+d.getMonth()+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds(),
		evalScripts:true,
		onComplete:function(){
			if (btn.length){
				for (i=0;i<btn.length;i++)
					btn[i].disabled=false;
			}else
				btn.disabled=false;
		}
		});
	}
	

	function allReadOnly(formId){

		var f1=$(formId).getElementsByTagName('input');
		
		var inputs=$A(f1);
		
		inputs.each(function(input){
			if (input.type!="button"&&input.type!="reset"&&input.type!="submit"){
				input.readOnly=true;
			}
			if ((input.type=="checkbox")||(input.type=="radio")){
				input.disabled=true;
			}
		});
		f1=$(formId).getElementsByTagName('textarea');
		if (inputs!=null){
			inputs=$A(f1);
			inputs.each(function(input){
				input.readOnly=true;
			});
		}
		
	}
	


