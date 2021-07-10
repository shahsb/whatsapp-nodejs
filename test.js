1. Start
2. get list of selectable entites
3. select all entites
4. get list of all buttons
5. find delete button
6. click on delete button

// Get list of all selectable enetities
var list = document.querySelectorAll('[aria-label="Select row"]');
list.forEach(e => {
	e.click();
});
//
var btns = document.querySelectorAll('[role="button"]');
var deleteBtn = null;

btns.forEach(e => {
	// console.log(e.innerText);
	if (e.innerText.contains('Delete')) {
		deleteBtn = e;
		console.log("Delete Button Found ....");
	}
});

btns.forEach(e => {
	console.log(e.innerText);
	if (e.innerText.contains('Delete')) {
		deleteBtn = e;
		console.log("Delete Button Found ....");
	}
});


-----------------------------------------------------------------------------------------------------------------------------------------------
// Change delete Photo to photo fo ha page (Capital P n small p)
// change getAllLinks allLinks to match page expression
var ignoreList = ['2479391545470601'];

function getAllLinks() {
	var allLinks = document.querySelectorAll('a[href*="/HinduAdhiveshan/photos/"]');
	var filteredLinks = [];
	
	allLinks.forEach(link => {
		if (!link.attributes.hasOwnProperty('aria-label')) {
			filteredLinks.push(link);
		}
	});
	
	if (ignoreList.length == 0) {
		filteredLinks[0].click();
		return;
	}
	
	for(var i = 0; i < ignoreList.length; i++) {
		for(var j = 0; j < filteredLinks.length; j++) {
			if (filteredLinks[j].attributes['href'].nodeValue.contains(ignoreList[i])) {
				continue;
			} else {
				filteredLinks[j].click();
				break;
			}
		}
	}
}

function selectImage() {
	// var images = document.querySelectorAll('[alt="May be an image of one or more people and text"]');
	var images = document.querySelectorAll('[alt*="May be a"]');
	if (images.length <= 0) {
		var images = document.querySelectorAll('[alt*="No photo description available"]');
	}
	images[0].click();
}

function selectOptions() {
	var burger = document.querySelectorAll('[aria-label="Actions for this post"]');
	burger[0].click();	
}

function clickDeletePhoto() {
	var deleteBtn = document.evaluate("//span[contains(., 'Delete photo')]", document, null, XPathResult.ANY_TYPE, null );
	var d = deleteBtn.iterateNext();
	d.click()
}

function clickDelete() {
	var btns = document.querySelectorAll('[role="button"]');
	var deleteBtn = null;

	btns.forEach(e => {
		// console.log(e.innerText);
		if (e.innerText.contains('Delete')) {
			deleteBtn = e;
			// console.log("Delete Button Found ....");
		}
	});
	deleteBtn.click();
}

function checkQueryError() {
	var btns = document.querySelectorAll('[role="button"]');
	var okBtn = null;
	
	btns.forEach(e => {
		if (e.innerText.contains('Ok')) {
			okBtn = e;
			console.log("Found Ok Button");
		}
	});
	
	if (okBtn !== null) {
		okBtn.click();
	}
}

const delay = ms => new Promise(res => setTimeout(res, ms));
var count = 0;

async function run() {
	try {
		//selectImage();
		getAllLinks();
		await delay(2000);
		
		selectOptions();
		await delay(3000);
		
		clickDeletePhoto();
		await delay(2000);
		
		clickDelete();
		await delay(5000);
		
		checkQueryError();
		await delay(1000);
		
		count++;
		console.log(count);
	} catch(err) {
		// console.log(err);
	}
}

async function main() {
	for(;;) {
		run();
		await delay(5000);
	}
}

main();