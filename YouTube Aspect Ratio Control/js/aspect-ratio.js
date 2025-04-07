// ==UserScript==
// @name	YouTube Aspect Ratio Control
// @description	Adds a menu where you can select different zoom/stretch configurations.
// @include	/^https?://www\.youtube\.com//
// @run-at	document-end
// @grant	none
// @version	1
// ==/UserScript==

(function(){
var $ = jQuery;

var $customCss = $("<style type=\"text/css\" />").html(`
	.ytp-center-controls {
		height: 100%;
		max-height: 100%;
		overflow: hidden;
		float: right;
		outline: none;
	}

	.ytp-arc-button {
		width: auto !important;
		overflow: hidden;
		-webkit-appearance: none;
		appearance: none;
	}

	.html5-video-container, .video-annotations {
		transition-property: transform,top;
		transition-duration: 100ms;
		transition-timing-function: cubic-bezier(1,-0.33,0,1.37);
	}
	
	.ytp-arc-list {
		position: absolute;
		bottom: 4em;
		overflow: hidden;
		background: rgba(28, 28, 28, 0.9);
		border-radius: 2px;
		list-style-type: none;
		display: none;
		-webkit-padding-start: 0em;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
		user-select: none;
		white-space: nowrap;
	}
	
	.ytp-arc-list > li {
		line-height: 1.4;
		padding: 2px 6px;
		cursor: pointer;
	}
	
	.ytp-arc-list > li:hover {
		background: rgba(255, 255, 255, 0.1);
	}
	
	.ytp-arc-list > li.selectat {
		font-weight: bold;
	}
	
	@media (min-height: 980px) and (min-width: 1720px) {
		ytd-watch:not([theater]) .ytp-arc-list {
			column-count: 2;
			right: 1em;
		}
	}
	
	@media (max-width: 1279px) {
		.ytp-arc-list {
			column-count: 2;
		}
	}
	
	@media (min-width: 857px) and (max-height: 634px) {
		ytd-watch:not([theater]) .ytp-arc-list {
			column-count: 2;
		}
	}
	
	@media (max-width: 856px) {
		.ytp-fullscreen .ytp-arc-list {
			column-count: 3;
			right: 1em;
		}
	}
	
	@media (max-width: 856px) {
		ytd-watch:not([theater]) .ytp-arc-list {
			column-count: 2;
			right: 1em;
		}
	}
	
	@media (max-width: 656px) {
		.ytp-arc-list, ytd-watch:not([theater]) .ytp-arc-list {
			column-count: 3;
			right: 1em;
		}
	}
`);

var $arcCss = $("<style type=\"text/css\" />");

$("head").append([$customCss, $arcCss]);

var $centerCtrls = $("<div/>").addClass("ytp-center-controls");

var $buton = $("<div/>").addClass(["ytp-button", "ytp-arc-button"]).val("1");

var $lista = $("<ul/>").addClass("ytp-arc-list");

var $1;

$centerCtrls.append([$buton, $lista]);

function Optiune(label, scale, title) {
	this.label = label;
	this.scale = scale;
	this.title = title;
}

var optiuni = [];

optiuni.push(new Optiune("70% H",".703,1","Stretch 16:9 to 5:4"));
optiuni.push(new Optiune("75% H",".75,1","Stretch 16:9 to 4:3"));
optiuni.push(new Optiune("75% V","1,.75","Stretch 16:9 to 21:9"));
optiuni.push(new Optiune("85% H",".85,1",""));
optiuni.push(new Optiune("85% V","1,.85",""));
optiuni.push(new Optiune("93% H",".937,1","Stretch 4:3 to 5:4"));
optiuni.push(new Optiune("100%","1","Original AR"));
optiuni.push(new Optiune("104%","1.04","Take WSS out of the picture"));
optiuni.push(new Optiune("106% H","1.066,1","Stretch 5:4 to 4:3"));
optiuni.push(new Optiune("111%","1.111","Zoom 16:10 to 16:9"));
optiuni.push(new Optiune("111% V","1,1.111","Stretch 16:9 to 16:10"));
optiuni.push(new Optiune("114%","1.142","Zoom 14:9 to 16:9"));
optiuni.push(new Optiune("116%","1.166","Zoom 4:3 to 14:9"));
optiuni.push(new Optiune("125%","1.25",""));
optiuni.push(new Optiune("125% V","1,1.25",""));
optiuni.push(new Optiune("133%","1.333","Zoom 4:3 to 16:9, 21:9 to 16:9"));
optiuni.push(new Optiune("133% H","1.333,1","Stretch 4:3 to 16:9, 16:9 to 21:9"));
optiuni.push(new Optiune("133% V","1,1.333","Stretch 21:9 to 16:9, 16:9 to 4:3"));
optiuni.push(new Optiune("142%","1.422","Zoom 5:4 to 16:9"));
optiuni.push(new Optiune("142% H","1.422,1","Stretch 5:4 to 16:9"));
optiuni.push(new Optiune("142% V","1,1.422","Stretch 16:9 to 5:4"));

(function(){
	for (var optiune of optiuni) {
		var $optiuneNoua = $("<li/>")
			.attr("title", optiune.title)
			.attr("value", optiune.scale)
			.html(optiune.label);
		$optiuneNoua.click(function() {
			$buton.attr("value", $(this).attr("value"));
			$buton.html($(this).html());
			$buton.change();
			$lista.hide();
		});
		$lista.append($optiuneNoua);
		if (optiune.scale == "1") $1 = $optiuneNoua;
	}
})();

function margine(valoare) {
	var res = valoare.split(",");
	res = res[res.length - 1];
	return -(res-1)*50;
}

$buton.change(function(){
	$arcCss.html(`
	.html5-video-container, .video-annotations {
		transform: scale(${$buton.attr("value")});
		top: ${margine($buton.attr("value"))}%
	}`);
});

var myInterval;

function removeInterval() {
	window.clearInterval(myInterval);
	initARC();
}

function initARC() {
	if (!$(".ytp-chrome-controls > .ytp-right-controls").length) {
		myInterval = window.setInterval(function(){
			if ($(".ytp-chrome-controls > .ytp-right-controls").length) removeInterval();
		}, 1000);
		return;
	}
	if (!$(".ytp-chrome-controls > .ytp-center-controls").length) {
		$(".ytp-chrome-controls").append($centerCtrls);
		$1.click();
	}
}

$(window).on("load", initARC);

window.addEventListener("yt-navigate-start", initARC);

$buton.click(function(e){
	e.preventDefault();
	e.stopPropagation();
	if ($lista.is(":visible")) $lista.hide();
	else {
		if ($(".ytp-settings-menu").is(":visible")) $(".ytp-chrome-controls").click();
		$lista.show();
	}
	return false;
});

$(window).on("click blur", function(){
	$lista.hide();
});

$(".html5-video-player").mouseleave(function(){
	$lista.hide();
});

})();