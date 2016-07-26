// ==UserScript==
// @name        Better HoTS Grand Master Leaderboard
// @description Improvements to the table rendering on the HoTS grand master leaderboard
// @namespace   http://battle.net/heroes
// @include     http://*.battle.net/heroes/*
// @version     1.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.min.js
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

function getHeader(index) {
  return document.getElementsByClassName(TABLE_CLASS)[0].tHead.rows[0].cells[index];
}

function addColumnHeader(index, heading) {
  var tblHeadObj = document.getElementsByClassName(TABLE_CLASS)[0].tHead;
  if (tblHeadObj.rows[0].cells[index].innerHTML != heading) {
    var newTH = tblHeadObj.rows[0].insertCell(index);
    newTH.outerHTML = '<th>' + heading + '</th>';
  }
}

function updateHeaders() {
  // Update table headings
  addColumnHeader(COLUMNS.WIN_PERCENT, 'WIN %');
  getHeader(COLUMNS.WINS).innerHTML = 'WIN/LOSS';
}

function updateTable() {
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

function enableTablesorter() {
  var table = document.getElementsByClassName(TABLE_CLASS)[0];
  var tablesorterClass = document.createAttribute("class");
  tablesorterClass.value = TABLE_CLASS + " tablesorter";
  table.attributes.setNamedItem(tablesorterClass);
  $("."+TABLE_CLASS).tablesorter();
}

window.onload = function() {
  updateHeaders();
  updateTable();
  enableTablesorter();
}

document.getElementById('leaderboard-rankings-loader').onclick = function() {
  setTimeout(updateTable, 2500);
}
