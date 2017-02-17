var rightPanel = document.getElementById("panel-right");
var leftPanel = document.getElementById("panel-left");
var table = document.getElementById("verb-list");

var verbs;
var infinitifs;
var request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    json = request.responseText;
    verbs = JSON.parse(json);

    infinitifs = [];
    for (var infinitif in verbs) {
      if (infinitif !== undefined) infinitifs.push(infinitif);
    }
    infinitifs.sort();

    reloadTable();
  }
}
var url = "http://lisacintosh.com/iverb-online/verbs.min.json";
request.open("GET", url, true);
request.send();

var originalTableContent;
function reloadTable() {
  var tableContent = "";
  for (var i = 0, len = infinitifs.length; i < len; ++i)
    tableContent += "<tr onclick='selectCell(this)'><td>"+infinitifs[i]+"</td></tr>";

  table.innerHTML = tableContent;
  originalTableContent = tableContent;

  if (selectedCell === undefined) {
    var cell = document.getElementsByTagName("tr");
    selectCell(cell[0]);
  }
}

var selectedCell;
function selectCell(sender) {
  selectedCell && (selectedCell.className -= "selected");

  var infinitif = sender.innerText;
  var verb = verbs[infinitif];
  var content = "<p class='infinitif'>"  +"<br>"+ infinitif +"</p>"
              + "<p class='past'>"       +"<br>"+ verb["p"] +"</p>"
              + "<p class='participle'>" +"<br>"+ verb["pp"]+"</p>"
              + "<p class='definition'>" +"<br>"+ verb["d"] +"</p>";
  if (verb["q"]) {
    var quoteComps = verb["q"].match(/([^\[]+)\[(.+)\]/); // Format: quote[author]
    if (quoteComps.length == 3)
      content += "<p class='quote'>" +"<br>"+ "“"+quoteComps[1]+"” " + "<i>"+quoteComps[2]+"</i>" + "</p>";
  }
  rightPanel.innerHTML = content;

  sender.className = "selected";
  selectedCell = sender;

  rightPanel.className = "presented";
  leftPanel.className = "dismissed";
}

rightPanel.onclick = function() {
  rightPanel.className = "";
  leftPanel.className = "";
};

var delayTimer = null;
function searchFieldDidChange(sender) {
  window.clearTimeout(delayTimer);
  delayTimer = setTimeout(function() {
    var searchString = sender.value.toLowerCase();
    if (searchString.length) {
      var tableContent = "";
      for (var i = 0, len = infinitifs.length; i < len; ++i) {
        if (infinitifs[i].toLowerCase().indexOf(searchString) != -1)
          tableContent += "<tr data-index='"+i+"' onclick='selectCell(this)'><td>"+infinitifs[i]+"</td></tr>";
      }
      table.innerHTML = (tableContent.length) ? tableContent : "<tr><td><span style='color:#aaa'>No Results</span></td></tr>";
    } else
      table.innerHTML = originalTableContent;
  }, 100);
}
