// ==UserScript==
// @name        Better HoTS Grand Master Leaderboard
// @description Improvements to the table rendering on the HoTS grand master leaderboard
// @namespace   http://battle.net/heroes
// @include     http://*.battle.net/heroes/*
// @version     1
// @grant       none
// ==/UserScript==

var TABLE_CLASS = 'leaderboards-ranking-table';

function addColumnHeader(index, heading) {
  var tblHeadObj = document.getElementsByClassName(TABLE_CLASS)[0].tHead;
  if (tblHeadObj.rows[0].cells[index].innerHTML != heading) {
    var newTH = tblHeadObj.rows[0].insertCell(index);
    newTH.outerHTML = '<th>' + heading + '</th>';
  }
}

function updateTable() {
  // Update table headings
  addColumnHeader(5, 'WIN %')
  var winsHeader = document.getElementsByClassName(TABLE_CLASS)[0].tHead.rows[0].cells[4];
  winsHeader.innerHTML = 'WIN/LOSS';

  // Update table contents
  var tblBodyObj = document.getElementsByClassName(TABLE_CLASS)[0].tBodies[0];
  for (var i=0; i<tblBodyObj.rows.length; i++) {
    var tblRow = tblBodyObj.rows[i];
    var battleTagCell = tblRow.cells[2];
    var gamesCell = tblRow.cells[3];
    var winsCell = tblRow.cells[4];
    var winPercentCell = tblRow.cells[5];

    // Add a link to HotsLogs
    if (battleTagCell.children.length == 0) {
      var link = document.createElement("a");
      link.setAttribute("href", "http://www.hotslogs.com/PlayerSearch?Name=" + battleTagCell.innerHTML)
      var linkText = document.createTextNode(battleTagCell.innerHTML);
      link.appendChild(linkText);

      battleTagCell.innerHTML = '';
      battleTagCell.appendChild(link);
    }

    // Add a new win percent column
    if (!winPercentCell.innerHTML.includes('%')) {
      var newCell = tblRow.insertCell(5);
      newCell.innerHTML = ((parseInt(winsCell.innerHTML)/parseInt(gamesCell.innerHTML))*100).toFixed(0) + '%';
    }

    // Convert 'wins' to 'win/loss'
    if (!winsCell.innerHTML.includes('/')) {
      var wins = parseInt(winsCell.innerHTML);
      var losses = parseInt(gamesCell.innerHTML) - wins;
      winsCell.innerHTML = wins + '/' + losses;
    }
  }
}

window.onload = function() {
  updateTable();
}

document.getElementById('leaderboard-rankings-loader').onclick = function() {
  setTimeout(updateTable, 2500);
}
