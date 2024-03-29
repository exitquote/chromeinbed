var changeListener = function() {
	document.body.addEventListener('DOMNodeInserted', function(event) {
        findNewBeds(event.target);
    });
}

var findNewBeds = function(node) {
	try {
    	var newBed = node.getElementsByClassName("messageBody");
    } catch(TypeError) {}
    if (newBed) putInBed(newBed);
}

var initialChange = function() {
	changeListener();
	var nodes = document.getElementsByClassName("messageBody");
	putInBed(nodes);
}

var parseText = function(last, replaceVal, text) {
	if (last === " ") {
		// deal with trailing whitespace
		replaceVal = 2;
		last = text.substring((text.length-2), (text.length));
	}
	if (last === "." && text.substring((text.length-3), (text.length)) === '...') {
		replaceVal = 3;
		last = "...";
	}
	if (last === ")" || last === "(") {
		if (text.substring((text.length-2), (text.length-1)) === ":") {
			// probably an emoticon
			replaceVal = 2;
			last = text.substring((text.length-2), (text.length-1));
		}
	}
}

var putInBed = function(nodes) {
	
	for (var i=0;i<nodes.length;i++) {
		if(nodes[i].nodeType === 1 && nodes[i].hasOwnProperty('tagName')) {
			var replaceVal = 1;
			var span = nodes[i];
			var text = span.textContent;
			var last = text.substring((text.length-1), (text.length));
			if (text.substring((text.length-8), (text.length)) === "See More") {
				text = span.firstChild.textContent;
				last = text.substring((text.length-9), (text.length-8));
				replaceVal = 9;
				parseText(last, replaceVal, text);
				span.firstChild.textContent = span.firstChild.textContent.substring(0, (text.length-replaceVal));
				span.firstChild.textContent = span.firstChild.textContent+" in bed"+last;
			}
			else if (last.match(/[\.,!;: \?\"\'()]/)) {
				parseText(last, replaceVal, text);
				span.textContent = span.textContent.substring(0, (text.length-replaceVal));
				span.textContent = span.textContent+" in bed"+last;
			}
			else {
				span.textContent += " in bed.";
			}
		}
	}
	//TODO: handle posts that end with a url
	//TODO: handle some other punctuation combos, emoticons, etc.
	//TODO: handle timeline and page posts as well as news feed
}

initialChange();
