//I individually developed this file
//There is no open source code or externally developed code in this file

var type = [];
var names = [];
var dates = [];
var complete = [];
var toggled = false;
var index;


initialize();
autoRef();

async function initialize(){

	const response = await fetch("/dataGet");
	const data = await response.json();
	var b;
	for (b = 0; b < data.length; b++){
		var value = "btn" + b.toString();
		var ind = data.findIndex(element => element.btn === value);
		type.push(data[ind].importance);
		names.push(data[ind].name);
		dates.push(data[ind].complDate);
		complete.push(data[ind].complete);
	}

	var a;
	for (a = 0; a < dates.length; a++){
		if(complete[a] == "false"){
			createAndDisplayTask(names[a] + ": " + type[a].toUpperCase(), a.toString());
			if(type[a] == 'low'){
				document.getElementById('btn' + a.toString()).style.backgroundColor = '#a6f51d';
			}
			else if (type[a] == "medium"){
				document.getElementById('btn' + a.toString()).style.backgroundColor = '#f5e31d';
			}
			else{
				document.getElementById('btn' + a.toString()).style.backgroundColor = '#ffb617';
			}
		}
		else{
			console.log("completed");
		}	
	}
}


function getValueFromId(id){
	return document.getElementById(id).value;
}

function createAndDisplayTask(text, idindex){

	var button = document.createElement('button');
	button.innerHTML = text;
	button.id = "btn" + idindex;
	btnId = button.id
	button.setAttribute('onclick','onBtnClick(this.id)');
	var time = document.createElement('p');
	time.style.fontSize = "10px";
	time.id = idindex

	document.getElementById('buttonArea').appendChild(button);
	document.getElementById('buttonArea').appendChild(time);

}

function create() {

	type.push(getValueFromId('importance'));
	names.push(getValueFromId('newItem'));
	dates.push(getValueFromId('date'));
	complete.push("false");
	index = (type.length - 1);

	createAndDisplayTask(names[index] + ": " + type[index].toUpperCase(), index.toString());
	if(type[index] == 'low'){
		document.getElementById('btn' + index.toString()).style.backgroundColor = '#a6f51d';
	}
	else if (type[index] == "medium"){
		document.getElementById('btn' + index.toString()).style.backgroundColor = '#f5e31d';
	}
	else{
		document.getElementById('btn' + index.toString()).style.backgroundColor = '#ffb617';
	}

	sendData("btn" + index.toString());


}

function sendData(btnId){
	btnNum = btnId.substr(3, (btnId.length-1));
	var data = {
		btn: btnId,
		importance: type[parseInt(btnNum)],
		name: names[parseInt(btnNum)],
		complDate: dates[parseInt(btnNum)],
		complete: "false"
	};
	var options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	};
	fetch("/dataTransfer", options);
}

function dateUpdate(){
	var i;
	for (i = 0; i < (complete.length); i++){
		if(complete[i] == "false"){
			var dateUntil = (Date.parse(dates[i]) - Date.now());
			document.getElementById(i.toString()).innerHTML = gettingTime(dateUntil);
		}
		else{
			console.log("dne")
		}
	}
}

function autoRef(){
	var refresh = setInterval(dateUpdate, 1000);
}

function gettingTime(timeValue){
	if(timeValue > 0){
		var initTime = Math.floor(.001 * timeValue);
		var days = Math.floor(initTime / 86400);
		var hours = Math.floor((initTime - (days * 86400))/3600);
		var minutes = Math.floor((initTime - (days * 86400) - (hours * 3600))/60);
		var seconds = Math.floor((initTime - (days * 86400) - (hours * 3600) - (minutes * 60)))
		//split the return because it would shorten the line below
		var returnSt1 = days.toString() + " day(s), " + hours.toString() + " hour(s), "
		var returnSt2 = returnSt1 +  minutes.toString() + " minute(s), and " + seconds.toString() + " second(s)."; 
		return returnSt2;
	}
	else{
		return "Time's up!";
	}

}

function onBtnClick(btnId){
	btnNum = btnId.substr(3, (btnId.length-1));
	complete[btnNum-1] = "true";
	var options2 = {
		method: "POST",
		headers: {
			'Content-Type': 'text/plain'
		},
		body: btnId
	};
	fetch('/update', options2)
	alert("You have completed a task!");
	document.getElementById(btnId).style.display = "none";
	document.getElementById(btnNum).style.display = "none";
}

function toggle(){
	if(toggled == false){
		document.getElementById("create").style.display = "none";
		document.getElementById("createLabel").style.display = "none";
		document.getElementById("createLabel").width = "0%";
		document.getElementById("tasksList").width = "100%";
		document.getElementById("tasksLabel").width = "100%";
		document.getElementById("toggler").innerHTML = "SHOW CREATE TAB";
		toggled = true;
	}
	else{
		document.getElementById("create").style.display = "inline-block";
		document.getElementById("createLabel").style.display = "inline-block";
		document.getElementById("createLabel").width = "50%";
		document.getElementById("tasksList").width = "50%";
		document.getElementById("tasksLabel").width = "50%";
		document.getElementById("toggler").innerHTML = "HIDE CREATE TAB";
		toggled = false;
	}
}


var popup = document.getElementById("mypopup");
var btn = document.getElementById("popupButton");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  popup.style.display = "block";
  var c;
  for(c = 0; c < type.length; c++){
  	if(complete[c] == "false"){
  		var p = document.createElement("input");
  		p.setAttribute("type", "radio");
  		p.setAttribute("id", "idr" + c.toString())
  		var s = document.createElement("label");
  		s.setAttribute("for", "idr" + c.toString())
  		s.innerHTML = names[c];
  		document.getElementById("popupArea").appendChild(p);
  		document.getElementById("popupArea").appendChild(s);
  		var br = document.createElement("br");
  		document.getElementById("popupArea").appendChild(br);
  	}
  }
  document.getElementById("popupArea").appendChild(br);
  var clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear Tasks";
  clearButton.setAttribute("onclick", "clearTasks");
  document.getElementById("popupArea").appendChild(clearButton);
}

span.onclick = function() {
  popup.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
}