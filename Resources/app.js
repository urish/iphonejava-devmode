(function() {
	var win = Ti.UI.createWindow({
		backgroundColor : 'black',
		layout : 'vertical'
	});

	var jsFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "__devmode_bootstrap.js");

	var urlInput = Ti.UI.createTextField({
		top : 50,
		left : 12,
		right : 12,
		value : Ti.App.Properties.getString('__devmode.bootstrap.url', 'http://127.0.0.1:8080/devmode.js')
	});

	var connectButton = Ti.UI.createButton({
		title : 'Connect!',
		top : 20
	});

	connectButton.addEventListener('click', function() {
		var targetUrl = urlInput.value;
		if(!/^https?:\/\/.+/i.match(targetUrl)) {
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
			} else {
				Ti.API.error("Failed! [" + targetUrl + "] status=" + request.status);
				alert("Request failed! status=" + request.status);
			}

			if(ok) {
				Ti.API("Passing control to app, " + jsFile.nativePath);
				include(jsFile.nativePath);
			}
		};
		request.onerror = function() {
			alert("Request failed!");
		}
		request.open('GET', targetUrl);
		request.send();
	});
})();
