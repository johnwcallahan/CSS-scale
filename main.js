//Shorthand function
function el(id) {
	return document.getElementById(id);
}

//Shorthand function
String.prototype.in = function(arr) {
	return arr.indexOf(this.toString()) >= 0;
};

//Dynamically create regex from given props
function createRegex(props) {
	if (props.length === 0)
		return "";

	var re = "";

	if ("margin".in(props) || "padding".in(props))
		re += "((";

	if ("margin".in(props))
		re += "margin";

	if ("margin".in(props) && "padding".in(props))
		re += "|";

	if ("padding".in(props))
		re += "padding";

	if ("margin".in(props) || "padding".in(props))
		re += ")-(top|right|bottom|left):\\s?(\\d+)(px|em))|";

	re += "([^-])(";

	for (var i = 0; i < props.length; i++) {
		if (i > 0)
			re += "|" + props[i];
		else
			re += props[i];
	}

	re += "):(\\s?((-?\\d+)(px|em)|auto|0))+";

	return new RegExp(re, "g");
}

function scaleCSS() {
	var css = el("input").value;

	//If nothing is in the input box, return error message
	if (!css) {
		el("output").value = "Enter some CSS to scale";
		return;
	}

	//Get properties from checkboxes that are checked
	var props = [];

	var properties = document.getElementsByClassName("property");
	for (var i = 0; i < properties.length; i++) {

		//Split "position" into "top", "right", "bottom", and "left"
		if (properties[i].id === "position" && properties[i].checked) {
			props.push("top");
			props.push("right");
			props.push("bottom");
			props.push("left");
		} else if (properties[i].checked)
			props.push(properties[i].id);
	}

	//Get regex
	var regex = createRegex(props);
	if (!regex) {
		el("output").value = "Select a CSS property to scale";
		return;
	}

	var factor = el("factor").value;
	factor = 100 / factor;

	var matches = css.match(regex);

	//If there aren't any matches, return error message.
	if (!matches) {
		el("output").value = "Couldn't find anything to scale";
		return;
	}

	//Iterate through matches, take out the values and divide them by factor
	var tmp, newNumber, newValue, unitRegex, unitMatch,
		newValues = [],
		output = css;

	for (var i = 0; i < matches.length; i++) {
		tmp = matches[i];
		unitRegex = /([^\d])(-?\d+)(px|em)/g;
		unitMatch = unitRegex.exec(tmp);
		while (unitMatch !== null) {
			newNumber = unitMatch[2] / factor;
			newNumber = Math.round(newNumber * 100) / 100; //round to 2 decimal places
			newValue = unitMatch[1] + newNumber.toString() + unitMatch[3];
			tmp = tmp.replace(unitMatch[0], newValue);
			unitMatch = unitRegex.exec(tmp);
		}
		newValues.push(tmp);
	}


	//Replace old values with new ones
	for (var i = 0; i < matches.length; i++) {
		// console.log("REPLACING " + matches[i] + " WITH " + newValues[i]);
		output = output.replace(matches[i], newValues[i]);
	}

	el("output").value = output;
}