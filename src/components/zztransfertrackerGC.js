<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

Are point hits worth it?

Is it worth making that double transfer? Questions surrounding the value of transfers have plagued the minds of Fantasy Football managers for years.

This tool lets you visualise just how valuable those transfers are relative to your opponents in your mini league. Is the league leader skimpy on transfers or do they take hit after hit to get where they are? Is someone trailing because they take too many hits, or are they too frugal?

Enter your league ID in the box below to generate the graph that might help answer these questions...

To find your league ID, click on the league and look for the number in the URL: <strong>https://fantasy.premierleague.com/a/leagues/standings/YOUR-LEAGUE-ID/classic</strong> . That's the number you want!

Check out our <strong><a href="https://www.game-change.co.uk/fpl-tools/">other FPL Tools right here</a></strong>.

&nbsp;
<div style="margin-top: 10px; text-align: center;"><input id="pointLeagueId" style="border: 1px solid grey; margin-bottom: 5px;" type="text" />
<button id="getPointHits" style="background-color: darkred; color: white; cursor: pointer; border: 0px; margin: 0 auto; height: 38px;">Create Chart</button>
<p id="enterError" style="display: none;">Enter a league ID!</p>
<p id="loadingChart" style="display: none;">Loading chart...</p>

<div>
<div id="points_hit_chart_div"></div>
<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&amp;storeId=gamechangecou-20&amp;adInstanceId=a1e5cca3-59b0-47f2-acbb-38bbf2108209"></script>

<pre><script>

$('#getPointHits').on('click', function() {
    if ($('#pointLeagueId').val() == '') {
        $('#enterError').slideDown();
        return
    }
    $('#loadingChart').slideDown();
    $('#enterError').slideUp();
    var leagueId = $('#pointLeagueId').val()
    google.charts.load('current', {
        packages: ['corechart']
    });
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        var options = {
            title: 'FPl Transfers-to-points ratio',
            vAxes: {
                0: {
                    title: 'Points',
                    logScale: !1
                },
                1: {
                    title: 'Transfers',
                    logScale: !1,
                    maxValue: 50
                }
            },
            hAxis: {
                title: 'Players'
            },
            seriesType: 'bars',
            series: {
                0: {
                    type: 'bar'
                },
                1: {
                    type: 'line',
                    targetAxisIndex: 1,
                    color: 'yellow'
                }
            },
            'width': '100%',
            'height': 800,
            lineWidth: 1,
            legend: {
                textStyle: {
                    fontSize: 12
                },
                cursor: 'pointer',
            },
            'curveType': 'function',
            'pointSize': 7,
            'crosshair': {
                trigger: 'none'
            }
        };
        var playerIds = [];
        var playerRow = [];


    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

        $.ajax({
            url: url+"?csurl=https://fantasy.premierleague.com/api/leagues-classic/" + leagueId + "/standings/",
            success: function(data) {
                var players = data.standings.results;
                players.forEach(function(player) {
                    playerIds.push(player.entry)
                })
            }
        }).done(function() {
            $(this).unbind("ajaxStop");
            var fish = $.each(playerIds, function(i, val) {
                $.ajax({
                    url: url,
                    data: {
                        csurl: 'https://fantasy.premierleague.com/api/entry/' + val + '/'
                    },
                    success: function(data) {
                        var gameweekTotal = data.current_event;
                        var transfers = data.last_deadline_total_transfers;
                        playerRow.push([data.name, data.summary_overall_points, transfers])
                    }
                })
            })
        })
        $(document).ajaxStop(function() {
            $(this).unbind("ajaxStop");

            function Comparator(a, b) {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0
            }
            playerRow = playerRow.sort(Comparator);
            playerRow.unshift(['Player', 'Score', 'Transfers']);
            console.log(playerRow);
            var playerData = new google.visualization.arrayToDataTable(playerRow);
            var chart = new google.visualization.ComboChart(document.getElementById('points_hit_chart_div'));
            chart.draw(playerData, options)
            $('#loadingChart').slideUp();
        })
    }
})
</script></pre>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-1339622383803601"
     data-ad-slot="1810839493"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

</div>
</div>