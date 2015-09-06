// Get the selenium web driver.
var webdriver = require('selenium-webdriver');

// Get the browsers used for testing.
var firefox = require('selenium-webdriver/firefox');
var chrome = require('selenium-webdriver/chrome');

// Get the path to the chrome driver.
var path = require('chromedriver').path;

// Set the chrome default service to the chrome driver executable.
chrome.setDefaultService(new chrome.ServiceBuilder(path).build());

// Build the driver using chrome.
var driver = new webdriver.Builder()
	.withCapabilities(webdriver.Capabilities.chrome())
	.build();

var By = webdriver.By;
var until = webdriver.until;

driver.get('localhost:9090');

driver.executeScript(function () {
	return window.performance.timing;
}).then(function (perfData) {
	var pageLoadTime = (perfData.loadEventEnd - perfData.navigationStart) / 1000;
	var connectTime = perfData.responseEnd - perfData.requestStart;
	console.log('Page load time:', pageLoadTime, 'seconds');
	console.log('Connect time:', connectTime, 'seconds');
});
//driver.findElement(By.name('q')).sendKeys('webdriver');
//driver.findElement(By.name('btnG')).click();
//driver.wait(until.titleIs('webdriver - Google Search'), 1000);
//driver.quit();
