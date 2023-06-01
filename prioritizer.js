var ItemListObject = Class.create();
var ItemObject = Class.create();
var printable;

Object.extend(ItemListObject.prototype = {

	// ------------------------------------------------------------------------------------------------------------------------
	// Initialization and other plumbing.
	// ------------------------------------------------------------------------------------------------------------------------

	initialize: function() {

		// Set up base values.
		this.paramList = arguments;
		this.applyParameters();

		// Insert DOM representation of self into document.
 		var target = $("entryContainer");
 		var newList = document.createElement("ul");
 		newList.setAttribute("id", "ul_" + this.id);
 		target.appendChild(newList);

		// Create initial (empty) set of list elements.
		this.items = new Array();

	},

	applyParameters: function() {

		var argObject = this.paramList[0];
		for (var i in argObject) {
			if (! (argObject[i] instanceof Function) ) {
				var thisSetter = "set_" + i;
				if (this[thisSetter]) {
					eval(this[thisSetter](argObject[i]));
				} else {
					this[i] = argObject[i];
				}
			}
		}
		delete this.paramList;
		return;

	},

		_each: function(iterator) {

		for (var key in this) {
			var value = this[key];
			if (value) { continue; }
			var pair = [key, value];
			pair.key = key;
			pair.value = value;
			iterator(pair);
		}
	},


	// ------------------------------------------------------------------------------------------------------------------------
	// General purpose methods.
	// ------------------------------------------------------------------------------------------------------------------------

	displayAs: function(context) {

		// Context is static or input
		this.displayContext = context;
		this.removeBlankItems();

		if (context == "form") {

			var target = $("entryContainer");
			target.innerHTML = "";
			var ul = document.createElement("ul");
			ul.setAttribute("id", "ul_" + this.id);
			target.appendChild(ul);

			if (this.items.length === 0) {
				for (var i = 0; i < this.slots; i++) {
					this.addItem();
				}
			}

			for (var i = 0; i < this.items.length; i++) {
				this.items[i].createDomNodes();
				ul.appendChild(this.items[i].input_li);
			}

			this.addItem();

		}

		if (context == "priorities") {

			var target = $("resultsContainer");
			target.innerHTML = "";
			var ol = document.createElement("ol");
			ol.setAttribute("id", "ol_"+this.id);
			target.appendChild(ol);
			for (var i = 0; i < this.items.length; i++) {
				this.items[i].createDomNodes();
				ol.appendChild(this.items[i].output_li);
			}

		}


	},

	// ------------------------------------------------------------------------------------------------------------------------
	// Task entry phase.
	// ------------------------------------------------------------------------------------------------------------------------

	addItem: function() {

		var newItem = new ItemObject({ "id" : this.items.length, "name" : "", "weight" : 0, "parentList" : this });
		this.items[this.items.length] = newItem;
		var target = $("ul_"+this.id);
		newItem.createDomNodes();
		target.appendChild(newItem.input_li);
		Event.observe(newItem.input, "blur", this.onBlur.bindAsEventListener());
		Event.observe(newItem.input, "focus", this.onFocus.bindAsEventListener());

	},

	checkCount: function() {

		if (this.items.findAll(function(i) { return i.name !== ""; }).length > 1) {
			activateNext();
		} else {
			deactivateNext();
		}


	},

	onBlur: function(e) {
		var listItemInputElem = Event.element(e);
 		var listItemID = "item_" + listItemInputElem.parentNode.id.split("_")[3];
		var thisItem = itemList.items.find(function(i) { return i.id == listItemID; });
		if (thisItem) {
			thisItem.updateName(Event.element(e).value);
		}
		itemList.checkCount();
	},

	onFocus: function(e) {

 		var listItemInputElem = Event.element(e);
 		if (!(listItemInputElem) || !(listItemInputElem.parentNode)) { return; }
 		var listItemID = "item_" + listItemInputElem.parentNode.id.split("_")[3];
 		var thisItem = itemList.items.find(function(i) { return i.id == listItemID; });
 		if (itemList.items.indexOf(thisItem) >= (itemList.items.length - 1)) {
 			itemList.addItem();
 			itemList.checkCount();
 		}

	},

	update: function() {

		for (var i = 0; i < this.items.length - 1; i++) {

			var elemID = "item_" + i;
			var listItemID = "input_item_" + i;
			itemToUpdate = this.items.find(function(i) { return i.id == elemID; } );
	 		index = this.items.indexOf(itemToUpdate);
	 		this.items[index].name = $(listItemID).value;

		}

	},

	removeBlankItems: function() {

 		blanks = this.items.findAll(function(i) { return ((i.name === "") || !(i.name) || (i.name === "")); });
 		blanks.each(function(i) { i.parentList.removeItem(i); });

	},

	removeItem: function(thisItem) {

		var itemElem = $(thisItem.id);

		if (itemElem) {

			// Disable observers!
			Event.stopObserving(thisItem.input, "blur",  this.onBlur.bindAsEventListener());

			// Remove from DOM.
			itemElem.parentNode.removeChild(itemElem);

		}
		this.items = this.items.reject(function(n) { return n == thisItem; });

	},

	validateTasks: function() {

		this.errors = "";
		var names = this.items.collect(function(i) { return i.name; });
		names = names.without("");
		if (names.length != names.uniq().length) {
			this.errors += "You can't have two identical tasks. ";
		}

		if (names.length < 2) {
			this.errors += "You need to enter more than one item.";
		}

		if (this.errors !== "") { alert(this.errors); return false; } else { return true; }

	},

	// ------------------------------------------------------------------------------------------------------------------------
	// Prioritization phase.
	// ------------------------------------------------------------------------------------------------------------------------

	catchComparison: function(e) {

		var thisSelection = Event.element(e);
		var selectionID = "item_" + thisSelection.id.split("_")[3];
		itemList.items.find(function(i) { return i.id == selectionID; }).weight++;
		if (itemList.pairsIndex != itemList.pairsCount) { itemList.showComparison(); } else { showResultsContainer(); }

	},

	drawPairs: function() {

		this.pairsCount = 0;
		this.pairsIndex = 0;
		var target = $("prioritizationContainer");
		target.innerHTML = "";

		for (var i = 0; i < this.items.length; i++) {

			this.items[i].weight = 0;

			for (var j = i+1; j < this.items.length; j++) {

				var pair = document.createElement("div");
				pair.id = "pair_" + this.pairsCount;
				pair.style.display = "none";

				var firstElem = document.createElement("div");
				firstElem.id = "pair_" + this.pairsCount + "_" + this.items[i].id;
				setClass(firstElem, "comparison_item_1 faux_link");
				firstElem.innerHTML = this.items[i].name;

				var orDiv = document.createElement("div");
				orDiv.innerHTML = " or ";
				setClass(orDiv, "comparison_or");

				var secondElem = document.createElement("div");
				secondElem.id = "pair_" + this.pairsCount + "_" + this.items[j].id;
				setClass(secondElem, "comparison_item_2 faux_link");
				secondElem.innerHTML = this.items[j].name;

				var questionDiv = document.createElement("div");
				questionDiv.innerHTML = "?";
				setClass(questionDiv, "comparison_or");

				pair.appendChild(firstElem);
				pair.appendChild(orDiv);
				pair.appendChild(secondElem);
				target.appendChild(pair);
				pair.appendChild(questionDiv);
				this.pairsCount++;

			}

		}

		this.showComparison();

	},

	do_highlight_first: function(e) {

		var thisSelection = Event.element(e);
		var thisClass = thisSelection.className + " comparison_item_1_hover";
		setClass(thisSelection, thisClass);

	},

	do_highlight_second: function(e) {

		var thisSelection = Event.element(e);
		var thisClass = thisSelection.className + " comparison_item_2_hover";
		setClass(thisSelection, thisClass);

	},

	undo_highlight_first: function(e) {

		var thisSelection = Event.element(e);
		var thisClass = thisSelection.className.replace("comparison_item_1_hover","");
		setClass(thisSelection, thisClass);

	},

	undo_highlight_second: function(e) {

		var thisSelection = Event.element(e);
		var thisClass = thisSelection.className.replace("comparison_item_2_hover","");
		setClass(thisSelection, thisClass);

	},

	showComparison: function() {

		if ($(	"pair_" + (this.pairsIndex - 1))) { $("pair_" + (this.pairsIndex - 1)).style.display = "none"; }
		$("pair_" + this.pairsIndex).style.display = "block";
		Event.observe($("pair_" + this.pairsIndex).childNodes[0], "click", this.catchComparison.bindAsEventListener());
		Event.observe($("pair_" + this.pairsIndex).childNodes[2], "click", this.catchComparison.bindAsEventListener());
		Event.observe($("pair_" + this.pairsIndex).childNodes[0], "mouseover", this.do_highlight_first.bindAsEventListener());
		Event.observe($("pair_" + this.pairsIndex).childNodes[2], "mouseover", this.do_highlight_second.bindAsEventListener());
		Event.observe($("pair_" + this.pairsIndex).childNodes[0], "mouseout", this.undo_highlight_first.bindAsEventListener());
		Event.observe($("pair_" + this.pairsIndex).childNodes[2], "mouseout", this.undo_highlight_second.bindAsEventListener());
		this.pairsIndex++;

	},

	// ------------------------------------------------------------------------------------------------------------------------
	// Reporting phase.
	// ------------------------------------------------------------------------------------------------------------------------

	sortByWeight: function() {

		this.items = this.items.sortBy(function(i) { return i.weight; }).reverse();

	}

});

Object.extend(ItemObject.prototype = {

	initialize: function() {

		this.paramList = arguments;
		this.applyParameters();

	},

	applyParameters: function() {

		var argObject = this.paramList[0];
		for (var i in argObject) {
			if (! (argObject[i] instanceof Function) ) {
				var thisSetter = "set_" + i;
				if (this[thisSetter]) {
					eval(this[thisSetter](argObject[i]));
				} else {
					this[i] = argObject[i];
				}
			}
		}
		delete this.paramList;
		return;

	},

	createDomNodes: function() {

		if (!($("input_li_"+this.id))) {

			this.input_li = document.createElement("li");
			this.input_li.setAttribute("id", "input_li_"+this.id);

		}

		if (!($("output_li_"+this.id))) {

			this.output_li = document.createElement("li");
			this.output_li.setAttribute("id", "output_li_"+this.id);

		}

		if (!($("static_"+this.id))) {

			this.div = document.createElement("div");
			this.div.setAttribute("id", "static_" + this.id);
			setClass(this.div, "prioritizedItem");
			this.div.innerHTML = this.name;
			this.output_li.appendChild(this.div);

		}

		if (!($("input_"+this.id))) {

			try {

				// First try the IE way; if this fails then use the standard way
				this.input = document.createElement('<input type="text" name="input_'+this.id+'" id="input_'+this.id+'" value="'+this.name+'">');

			} catch (e) {

				// We're not running on IE
				this.input = document.createElement("input");
				this.input.setAttribute("type", "text");
				this.input.setAttribute("name", "input_" + this.id);
				this.input.setAttribute("id", "input_" + this.id);
				this.input.setAttribute("value", this.name);

			}

			this.input_li.appendChild(this.input);

		}

	},

	updateName: function() {
		var elem = $(this.input.id);
		if (elem) {
			if (elem.value) {
				this.name = elem.value;
			} else {
				this.parentList.removeItem(this);
			}
		}

	},

	set_id: function(value) {

		this.id = "item_" + value;

	},

	set_name: function(value) {

		if (value) {
			this.name = value;
		} else {
			this.name = "";
		}

	},

	set_weight: function(value) {

		if (value) {
			this.weight = value;
		} else {
			this.weight = 0;
		}

	}

});

function initializePrioritizer() {

	itemList = new ItemListObject({ "id" : "itemList", "domTarget" : "entryContainer", "slots" : 4 });
	mode = "";
	showEntryContainer();

}

function showEntryContainer() {

	mode = "entry";
	itemList.displayAs("form");
	itemList.checkCount();
	$("entry").style.display = "block";
	$("prioritization").style.display = "none";
	$("results").style.display = "none";

}

function showPrioritizationContainer() {

	mode = "prioritization";
	itemList.drawPairs();
	deactivateNext();
	$("entry").style.display = "none";
	$("prioritization").style.display = "block";
	$("results").style.display = "none";

}

function showResultsContainer() {

	mode = "results";
	itemList.sortByWeight();
	itemList.displayAs("priorities");
	deactivateNext();
	$("entry").style.display = "none";
	$("prioritization").style.display = "none";
	$("results").style.display = "block";

}

function showPrintableResultsContainer() {

	printable = window.open("https://www.idea-sandbox.com/wp-content/themes/Avada-Child-Theme/assets/printable.htm","printableWindow","menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");

}

function nextStep() {

	if (mode == "entry") {
		if (itemList.validateTasks()) {
			itemList.update();
			itemList.removeBlankItems();
			showPrioritizationContainer();
		}
	}

}

function activateNext() {
	Event.observe($("next_button"), "click", nextStep);
	$("next_button").style.display = "block";
}

function deactivateNext() {

	Event.stopObserving($("next_button"), "click", nextStep);
	$("next_button").style.display = "none";
}

function setClass(elem, className) {

	// Workaround for stupid stupid stupid IE bug with setting class on a generated DOM node.
	// Solution from http://www.alistapart.com/

	if (elem.getAttributeNode("class")) {
		for (var i = 0; i < elem.attributes.length; i++) {
			var attrName = elem.attributes[i].name.toUpperCase();
			if (attrName == 'CLASS') { elem.attributes[i].value = className; }
		}
	} else {
		elem.setAttribute("class", className);
	}

}

document.observe('dom:loaded', function() {

	initializePrioritizer();

});
