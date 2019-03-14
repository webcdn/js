// if ( window.history.replaceState ) {
// 	var path = window.location.href.replace(/(\?$|\?*\&*(?:success|error)\=[^&#\s]*|\&$)/gim, '');
// 	window.history.replaceState( null, null, path);
// }

function nonce(){
	return Math.random().toString(36).substring(2);
}

function setCookie(cname, cvalue, exdays = 1) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
}

function getCookie(cname) {
	var name = cname + '=';
	var ca = decodeURIComponent(document.cookie).split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

function _GET(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function siteLocalStorage(key, value){
	// set the values
	if( typeof value != 'undefined' ){
		if( value === null ){
			localStorage.removeItem(key);
		}
		else if( typeof key === 'object' && key !== null ){
			Array.prototype.forEach.call(key, function(v, k){
				localStorage.setItem(k, v);
			});
		}
		else if( typeof key == 'string' ){
			localStorage.setItem(key, value);
		}
	}

	// get the values
	if( Array.isArray(key) ){
		var output = {};

		Array.prototype.forEach.call(key, function(v, k){
			output[k] = localStorage.getItem(v);
		});

		return output;
	}
	else {
		return localStorage.getItem(key);
	}
}


function urlLocation(href) {
	var match = href.match(/^([^\:]+)\:\/?\/?(([^\:\/\?\#]*)(?:\:([0-9]+))?)([\/]{0,1}[^\?\#]*)(\?[^\#]*|)(\#.*|)$/mi);
	return match && {
		href     : href,
		protocol : match[1],
		host     : match[2],
		hostname : match[3],
		port     : match[4],
		pathname : match[5],
		search   : match[6],
		hash     : match[7]
	}
}


function slugify(text, sep = '_'){
	var trim = new RegExp('^[\s' + sep + ']+|[\s' + sep + ']$', 'gim');
	text = text.replace(/[^a-zA-Z0-9]+/gu, sep);
	text = text.replace(trim, '');
	return text.toLowerCase();
}


function copy(str){
	var flag = false;
	try {
		var save = function(e) {
			e.clipboardData.setData('text/plain', str);
			e.preventDefault();
		}
		document.addEventListener('copy', save);
		document.execCommand('copy');
		document.removeEventListener('copy', save);
		flag = true;
	}
	catch(e) {
		console.warn('Sorry, Unable to Copy');
	}
	return flag;
}


function formatFileSize(bytes, round = 2) {
	if(bytes < 0) return 'Too Large';
	var units, power, size;
	units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
	bytes = Math.max(0, bytes);
	power = Math.floor( (bytes ? Math.log(bytes) : 0) / Math.log(1024) );
	power = Math.min(power, (units.length - 1));
	bytes /= Math.pow(1024, power);
	return Number(bytes.toFixed(round)) + ' ' + units[power];
}

function timedate(time){
	var date = new Date(parseInt(time) * 1000);
	return date.toString().replace(/(\s*)GMT(.*)/, '');
}

function time_ago(time) {
	time = Date.now() - (parseInt(time) * 1000);
	var periods = {
		'decade': 60 * 60 * 24 * 30 * 12 * 10,
		'year'  : 60 * 60 * 24 * 30 * 12,
		'month' : 60 * 60 * 24 * 30,
		'week'  : 60 * 60 * 24 * 7,
		'day'   : 60 * 60 * 24,
		'hr'    : 60 * 60,
		'min'   : 60,
		'sec'   : 1,
	};

	for(var unit in periods){
		var seconds = periods[unit] * 1000;
		if (time < seconds) {
			continue;
		}

		number = Math.floor(time / seconds);
		plural = (number > 1) ? 's ago' : ' ago';
		return number + ' ' + unit + plural;
	}
}


function autosize(elm){
	elm = typeof elm == 'string' ? document.querySelector(elm) : this;
	elm.style.cssText = 'height:auto; padding:0;';
	// for box-sizing other than "content-box" use:
	// el.style.cssText = '-moz-box-sizing:content-box';
	elm.style.cssText = 'height:' + elm.scrollHeight + 'px; overflow: hidden;';
}


function imgLazyLoad(){
	Array.prototype.forEach.call(document.querySelectorAll('img[data-src]'), function(el, i){
		el.setAttribute('src', el.getAttribute('data-src'));
		el.onload = function(){
			el.removeAttribute('data-src');
		};
	});
}


function get_html(html, data = {}){
	for (var key in data) {
		if( data.hasOwnProperty(key) ){
			var regex = new RegExp('{{' + key + '}}', 'g');
			html = html.replace(regex, data[key]);
		}
	}

	return html;
}


var ajax = {};
ajax.xhr = function () {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
	var _xhr, _ver = ["MSXML2.XmlHttp.6.0","MSXML2.XmlHttp.5.0","MSXML2.XmlHttp.4.0","MSXML2.XmlHttp.3.0","MSXML2.XmlHttp.2.0","Microsoft.XmlHttp"];
	for (var i in _ver) {
		try {
			_xhr = new ActiveXObject(_ver[i]);
			break;
		} catch(err) {}
	}
	return _xhr;
};

ajax.send = function (url, method, data, callback, async) {
	var xhr = ajax.xhr();
	xhr.open(method, url, typeof async == 'boolean' ? async : true);
	xhr.onreadystatechange = function(){
		xhr.readyState == 4 && callback(xhr.responseText);
	};
	method == 'POST' && xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send(data);
};




var animationEnd = (function(el){
	var animations = {
		animation       : 'animationend',
		OAnimation      : 'oAnimationEnd',
		MozAnimation    : 'mozAnimationEnd',
		WebkitAnimation : 'webkitAnimationEnd',
	}

	for (var i in animations){
		if(el.style[i] !== undefined ){
			return animations[i];
		}
	}
}(document.createElement('div')));

var transitionEnd = (function(el){
	var transitions = {
		transition       : 'transitionend',
		OTransition      : 'oTransitionEnd',
		MozTransition    : 'mozTransitionEnd',
		WebkitTransition : 'webkitTransitionEnd',
	}

	for (var i in transitions){
		if(el.style[i] !== undefined ){
			return transitions[i];
		}
	}
}(document.createElement('div')));



///////////////////////////////////////////////////////////
/// this functions needs modification as per the design ///
///////////////////////////////////////////////////////////


function toast(message, color = '', time = 5000) {
	var toasts = document.querySelectorAll('.toast');
	for(var i = 0; i < toasts.length; i++){
		toasts[i].dismiss();
	}

	var toast = document.createElement('div');
	toast.className = 'toast';
	typeof time != 'number' && toast.classList.add(time);
	time == 'wait' && document.querySelector('body').classList.add('toast_on');
	toast.dismiss = function() {
		this.style.bottom = '-10rem';
		this.style.opacity = 0;
		document.querySelector('body').classList.remove('toast_on');
	};

	var text = document.createTextNode(message);
	toast.appendChild(text);

	document.body.appendChild(toast);
	getComputedStyle(toast).bottom;
	getComputedStyle(toast).opacity;
	toast.style.backgroundColor = color;
	toast.style.bottom = document.body.scrollWidth > 576 ? '2rem' : '3.6rem';
	toast.style.opacity = 1;

	if(typeof time == 'number'){
		setTimeout(function() {
			toast.dismiss();
		}, time);
	}

	toast.addEventListener('transitionend', function(event, elapsed) {
		if( event.propertyName === 'opacity' && this.style.opacity == 0 ){
			this.parentElement.removeChild(this);
		}
	}.bind(toast));
}


function nav_menu(action = ''){
	if( action == 'add' ) {
		document.querySelector('header nav').classList.add('active');
		document.querySelector('svg.menu').classList.add('active');
	}
	else if( action == 'remove' ) {
		document.querySelector('header nav').classList.remove('active');
		document.querySelector('svg.menu').classList.remove('active');
	}
	else {
		document.querySelector('header nav').classList.toggle('active');
		document.querySelector('svg.menu').classList.toggle('active');
	}
}
