<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

With this tool, you can track how you're doing against the overall average each week in Fantasy Premier League.

Just enter your Team ID in the field below, click 'Generate' and you're on your way!

To find your team ID, click on the points tab and look for the number in the URL: <strong>https://fantasy.premierleague.com/a/team/YOUR_TEAM_ID/event/1</strong> .That’s the number you want!

Check out our < a href = "https://www.game-change.co.uk/fpl-tools/" > other useful FPL Tools here</a >.
< div style = "margin-top: 10px; text-align: center;" > <input id="playerId" style="corder: 1px solid grey; margin-bottom: 5px;" type="text" placeholder="Your Team ID here" />
  <button id="getLeagueData" style="background-color: darkred; color: white; cursor: pointer; border: 0px; margin: 0 auto; height: 38px;">Generate</button>
  <div>
    <div id="player_chart_div"></div>
    <div id="comparisonResults" style="height: 100px;"></div>
    <script>
      var url='https://ffwhatif.herokuapp.com/proxy.php';$('#getLeagueData').on('click',function(){var leagueId=$('#leagueId').val()
google.charts.load('current',{packages: ['corechart']});google.charts.setOnLoadCallback(drawPlayerChart);function drawPlayerChart(){var playerChart=new google.visualization.DataTable();var leagueLength=0;var options={animation: {duration: 1000,startup:!0,},hAxis:{title: 'Gameweeks',},vAxis:{title: 'Score',gridlines:!0,},series:{1: {curveType: 'function'},states:{hover: {enabled: !0,lineWidth:5}},},'width':'100%','height':800,lineWidth:1,legend:{textStyle: {fontSize: 12},cursor:'pointer',},'curveType':'function','pointSize':7,'crosshair':{trigger: 'none'}};var gw1=['Week 1'];var gw2=['Week 2'];var gw3=['3'];var gw4=['4'];var gw5=['5'];var gw6=['6'];var gw7=['7'];var gw8=['8'];var gw9=['9'];var gw10=['10'];var gw11=['11'];var gw12=['12'];var gw13=['13'];var gw14=['14'];var gw15=['15'];var gw16=['16'];var gw17=['17'];var gw18=['18'];var gw19=['19'];var gw20=['20'];var gw21=['21'];var gw22=['22'];var gw23=['23'];var gw24=['24'];var gw25=['25'];var gw26=['26'];var gw27=['27'];var gw28=['28'];var gw29=['29'];var gw30=['30'];var gw31=['31'];var gw32=['32'];var gw33=['33'];var gw34=['34'];var gw35=['35'];var gw36=['36'];var gw37=['37'];var gw38=['38'];var averageScores=[];var playersName;var totalPlayerPoints;$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/bootstrap-static/'},success:function(data){playerChart.addColumn('string', 'X'); var averages=data.events;averages.forEach(function(average){averageScores.push(average.average_entry_score)})}}).done(function(){$(this).unbind("ajaxStop"); var val=$('#playerId').val();$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/'},success:function(data){playersName = data.player_first_name + ' ' + data.player_last_name; totalPlayerPoints=data.summary_overall_points}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/1/picks/'},success:function(data){console.log(data); points=data.entry_history.points;gw1.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/2/picks/'},success:function(data){points = data.entry_history.points; gw2.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/3/picks/'},success:function(data){points = data.entry_history.points; gw3.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/4/picks/'},success:function(data){points = data.entry_history.points; gw4.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/5/picks/'},success:function(data){points = data.entry_history.points; gw5.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/6/picks/'},success:function(data){points = data.entry_history.points; gw6.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/7/picks/'},success:function(data){points = data.entry_history.points; gw7.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/8/picks/'},success:function(data){points = data.entry_history.points; gw8.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/9/picks/'},success:function(data){points = data.entry_history.points; gw9.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/10/picks/'},success:function(data){points = data.entry_history.points; gw10.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/11/picks/'},success:function(data){points = data.entry_history.points; gw11.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/12/picks/'},success:function(data){points = data.entry_history.points; gw12.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/13/picks/'},success:function(data){points = data.entry_history.points; gw13.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/14/picks/'},success:function(data){points = data.entry_history.points; gw14.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/15/picks/'},success:function(data){points = data.entry_history.points; gw15.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/16/picks/'},success:function(data){points = data.entry_history.points; gw16.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/17/picks/'},success:function(data){points = data.entry_history.points; gw17.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/18/picks/'},success:function(data){points = data.entry_history.points; gw18.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/19/picks/'},success:function(data){points = data.entry_history.points; gw19.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/20/picks/'},success:function(data){points = data.entry_history.points; gw20.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/21/picks/'},success:function(data){points = data.entry_history.points; gw21.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/22/picks/'},success:function(data){points = data.entry_history.points; gw22.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/23/picks/'},success:function(data){points = data.entry_history.points; gw23.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/24/picks/'},success:function(data){points = data.entry_history.points; gw24.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/25/picks/'},success:function(data){points = data.entry_history.points; gw25.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/26/picks/'},success:function(data){points = data.entry_history.points; gw26.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/27/picks/'},success:function(data){points = data.entry_history.points; gw27.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/28/picks/'},success:function(data){points = data.entry_history.points; gw28.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/29/picks/'},success:function(data){points = data.entry_history.points; gw29.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/30/picks/'},success:function(data){points = data.entry_history.points; gw30.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/31/picks/'},success:function(data){points = data.entry_history.points; gw31.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/32/picks/'},success:function(data){points = data.entry_history.points; gw32.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/33/picks/'},success:function(data){points = data.entry_history.points; gw33.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/34/picks/'},success:function(data){points = data.entry_history.points; gw34.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/35/picks/'},success:function(data){points = data.entry_history.points; gw35.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/36/picks/'},success:function(data){points = data.entry_history.points; gw36.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/37/picks/'},success:function(data){points = data.entry_history.points; gw37.push(points)}})
$.ajax({url: url,data:{csurl: 'https://fantasy.premierleague.com/api/entry/'+val+'/event/38/picks/'},success:function(data){points = data.entry_history.points; gw38.push(points)}})})
$(document).ajaxStop(function(){$(this).unbind("ajaxStop"); console.log(averageScores);useThese=[];allWeeks=[gw1,gw2,gw3,gw4,gw5,gw6,gw7,gw8,gw9,gw10,gw11,gw12,gw13,gw14,gw15,gw16,gw17,gw18,gw19,gw20,gw21,gw22,gw23,gw24,gw25,gw26,gw27,gw28,gw29,gw30,gw31,gw32,gw33,gw34,gw35,gw36,gw37,gw38];for(i=0;i<allWeeks.length; i++){allWeeks[i].push(averageScores[i])}
      for(i=0;i<allWeeks.length; i++){if(allWeeks[i].length>2){useThese.push(allWeeks[i])}}
var averageTotalScore=averageScores.reduce(add,0);function add(a,b){return a+b}
var difference=totalPlayerPoints-averageTotalScore;playerChart.addColumn('number',playersName);playerChart.addColumn('number','Average Score');playerChart.addRows(useThese);var chart=new google.visualization.LineChart(document.getElementById('player_chart_div'));chart.draw(playerChart,options);google.visualization.events.addListener(chart,'select',function(){});if(difference>0){$('#comparisonResults').append("Your total score: <strong>" + totalPlayerPoints + "</strong><br/>The average score: <strong>" + averageTotalScore + "</strong><br/>You're up by <strong>" + difference + "</strong>. Good job!")}else{$('#comparisonResults').append("Your total score: <strong>" + totalPlayerPoints + "</strong><br/>The average score: <strong>" + averageTotalScore + "</strong><br/>You're down by <strong>" + difference + "</strong>. Try harder!")}})}})</script>

    <script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&amp;storeId=gamechangecou-20&amp;adInstanceId=a1e5cca3-59b0-47f2-acbb-38bbf2108209"></script>

  </div>
</div >