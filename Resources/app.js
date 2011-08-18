(function() {
	var devmode = {};
	$__iphonejava_devmode = devmode;

	var win = Ti.UI.createWindow({
		backgroundColor : 'black',
		layout : 'vertical'
	});
	devmode.win = win;

	var jsFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "__devmode_bootstrap.js");

	win.add(Ti.UI.createLabel({
		top : 24,
		color : 'white',
		text : 'iPhoneJava DevMode Loader',
		textAlign : 'center',
		height : 28,
		font : {
			fontSize : 20
		},
		left : 12,
		right : 12
	}));

	win.add(Ti.UI.createLabel({
		top : 32,
		color : 'white',
		text : 'Bootstrap URI:',
		textAlign : 'center',
		height : 28,
		left : 12,
		right : 12
	}));

	var urlInput = Ti.UI.createTextField({
		left : 12,
		right : 12,
		height : 40,
		backgroundColor : 'white',
		borderRadius : 6,
		paddingLeft : 6,
		paddingRight : 6,
		value : Ti.App.Properties.getString('__devmode.bootstrap.url', 'http://127.0.0.1:8080/devmode.js')
	});
	win.add(urlInput);

	var connectButton = Ti.UI.createButton({
		title : 'Connect!',
		height : 40,
		left : 100,
		right : 100,
		top : 32
	});

	connectButton.addEventListener('click', function(e) {
		var targetUrl = urlInput.value;
		devmode.url = targetUrl;
		if(!/^https?:\/\/.+/i.test(targetUrl)) {
			alert("Invalid URL: " + targetUrl);
			return;
		}

		Ti.API.info("Bootstraping from URL " + targetUrl);
		Ti.App.Properties.setString('__devmode.bootstrap.url', targetUrl);
		var request = Titanium.Network.createHTTPClient();
		request.onload = function() {
			var ok = false;

			if(request.status >= 200 && request.status < 300) {
				jsFile.write(request.responseData);
				ok = true;
			}

			if(request.status == 304) {
				logger.info("Not modified: " + url);
				ok = true;
			}

			if(ok) {
				Ti.API.info("Passing control to app, " + jsFile.nativePath);
				Ti.include(jsFile.nativePath);
			} else {
				Ti.API.error("Failed! [" + targetUrl + "] status=" + request.status);
				alert("Request failed! status=" + request.status);
			}
		};
		request.onerror = function() {
			alert("Request failed!");
		}
		request.open('GET', targetUrl);
		request.send();
	});
	win.add(connectButton);

	win.add(Ti.UI.createLabel({
		top : 50,
		bottom : 32,
		color : 'white',
		text : 'Copyright (c) 2011 Uri Shaked',
		textAlign : 'left',
		font : {
			fontSize : 12
		},
		height : 28,
		left : 12,
		right : 12
	}));

	win.open();

	var x;
	// These are there so Titanium will compile in all the modules...
	x = Titanium.API;
	x = Titanium.Accelerometer;
	x = Titanium.Analytics;
	x = Titanium.Android;
	x = Titanium.App;
	x = Titanium.Blob;
	x = Titanium.BlobStream;
	x = Titanium.Buffer;
	x = Titanium.BufferStream;
	x = Titanium.Codec;
	x = Titanium.Contacts;
	x = Titanium.Database;
	x = Titanium.Facebook;
	x = Titanium.Filesystem;
	x = Titanium.Geolocation;
	x = Titanium.Gesture;
	x = Titanium.IOStream;
	x = Titanium.Locale;
	x = Titanium.Map;
	x = Titanium.Media;
	x = Titanium.Network;
	x = Titanium.Platform;
	x = Titanium.Stream;
	x = Titanium.UI;
	x = Titanium.Utils;
	x = Titanium.XML;
	x = Titanium.Yahoo;
	x = null;
})();
