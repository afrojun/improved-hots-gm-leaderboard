// ==UserScript==
// @name        Better HoTS Grand Master Leaderboard
// @description Improvements to the table rendering on the HoTS grand master leaderboard
// @namespace   http://battle.net/heroes
// @include     http://*.battle.net/heroes/*
// @version     1
// @grant       none
// ==/UserScript==

function addColumnHeader(tblClass, index, heading) {
  var tblHeadObj = document.getElementsByClassName(tblClass)[0].tHead;
  var newTH = tblHeadObj.rows[0].insertCell(index);
  newTH.outerHTML = '<th>' + heading + '</th>';
}

function addWinPercentColumn()
{
  var tblClass = 'leaderboards-ranking-table';
  addColumnHeader(tblClass, 5, 'WIN %')

  var tblBodyObj = document.getElementsByClassName(tblClass)[0].tBodies[0];
  for (var i=0; i<tblBodyObj.rows.length; i++) {
    var newCell = tblBodyObj.rows[i].insertCell(5);
    var tblRow = tblBodyObj.rows[i];
    newCell.innerHTML = ((parseInt(tblRow.cells[4].innerHTML)/parseInt(tblRow.cells[3].innerHTML))*100).toFixed(0) + '%';
  }
}

function addLinkToHotsLogs()
{
  var tblClass = 'leaderboards-ranking-table';

  var tblBodyObj = document.getElementsByClassName(tblClass)[0].tBodies[0];
  for (var i=0; i<tblBodyObj.rows.length; i++) {
    var battleTagCell = tblBodyObj.rows[i].cells[2];

    var link = document.createElement("a");
    link.setAttribute("href", "http://www.hotslogs.com/PlayerSearch?Name=" + battleTagCell.innerHTML)
    var linkText = document.createTextNode(battleTagCell.innerHTML);
    link.appendChild(linkText);

    battleTagCell.innerHTML = '';
    battleTagCell.appendChild(link);
  }
}

addWinPercentColumn();
addLinkToHotsLogs();
