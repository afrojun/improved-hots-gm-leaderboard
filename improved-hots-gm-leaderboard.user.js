// ==UserScript==
// @name        Better HoTS Grand Master Leaderboard
// @description Improvements to the table rendering on the HoTS grand master leaderboard
// @namespace   http://battle.net/heroes
// @include     http://*.battle.net/heroes/*
// @version     1.1
// @grant       none
// ==/UserScript==

var TABLE_CLASS = 'leaderboards-ranking-table';
var COLUMNS = {
  RANK: 0,
  BATTLETAG: 1,
  HIGHEST_RANK: 2,
  RANK_POINTS: 3,
  GAMES: 4,
  WINS: 5,
  WIN_PERCENT: 6
}

function addColumnHeader(index, heading) {
  var tblHeadObj = document.getElementsByClassName(TABLE_CLASS)[0].tHead;
  if (tblHeadObj.rows[0].cells[index].innerHTML != heading) {
    var newTH = tblHeadObj.rows[0].insertCell(index);
    newTH.outerHTML = '<th>' + heading + '</th>';
  }
}

function updateTable() {
  // Update table headings
  addColumnHeader(COLUMNS.WIN_PERCENT, 'WIN %')
  var winsHeader = document.getElementsByClassName(TABLE_CLASS)[0].tHead.rows[0].cells[COLUMNS.WINS];
  winsHeader.innerHTML = 'WIN/LOSS';

  // Update table contents
  var tblBodyObj = document.getElementsByClassName(TABLE_CLASS)[0].tBodies[0];
  for (var i=0; i<tblBodyObj.rows.length; i++) {
    var tblRow = tblBodyObj.rows[i];
    var battleTagCell = tblRow.cells[COLUMNS.BATTLETAG];
    var gamesCell = tblRow.cells[COLUMNS.GAMES];
    var winsCell = tblRow.cells[COLUMNS.WINS];
    var winPercentCell = tblRow.cells[COLUMNS.WIN_PERCENT];

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
    if (tblRow.cells.length <= 10) {
      var newCell = tblRow.insertCell(COLUMNS.WIN_PERCENT);
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
