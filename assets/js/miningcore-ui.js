// config
var API = 'https://localhost:4000/api/';
var defaultPool = ''; //ID

// current indicator + cache
var currentPool = defaultPool;

function loadPoolList(){
  $.ajax( API + 'pools' )
  .always(function( data ) {//debug,should be done()
    data = JSON.parse( '{"pools":[{"id":"xmr1","coin":{"type":"XMR"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"donationsPercent":0,"poolStats":{"connectedMiners":0,"poolHashRate":0,"sharesPerSecond":0,"validSharesPerMinute":0,"invalidSharesPerMinute":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
  //.done(function( data )) {
    //data = JSON.parse(data);
    var poolList = '';
    $.each(data.pools, function( index, value ) {
      if (currentPool.length == 0 && index == 0) {
        currentPool = value.id;
      }
      if (currentPool == value.id) {
        $( '#currentPool p' ).text(value.coin.type);
      } else {
        poolList += '<ul class="dropdown-menu"><li><a data-id="' + value.id + '>' + value.coin.type + '</a></li></ul>';
      }
    });
    if (poolList.length > 0) {
      $('#poolList').append(poolList);
    }
  });
}

function loadPoolStats(){
  $.ajax( API + 'pools' )
  .always(function( data ) {//debug,should be done()
    data = JSON.parse( '{"pools":[{"id":"xmr1","coin":{"type":"XMR"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"donationsPercent":0,"poolStats":{"connectedMiners":0,"poolHashRate":0,"sharesPerSecond":0,"validSharesPerMinute":0,"invalidSharesPerMinute":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
  //.done(function( data )) {
    //data = JSON.parse(data);
    $.each(data.pools, function( index, value ) {
      if (currentPool == value.id) {
        // poolShares
        // poolBlocks
        $('#poolMiners').text(value.poolStats.connectedMiners);
        $('#poolHashRate').text(value.poolStats.poolHashRate + ' H/s');
        $('#networkHashRate').text(value.networkStats.networkHashRate + ' H/s');
        $('#networkDifficulty').text(value.networkStats.networkDifficulty);
      }
    });
  });
}

function loadChart(){
  $.ajax( API + 'pool/' + currentPool + '/stats/hourly' )
  .always(function( data ) {//debug,should be done()
    data = JSON.parse( '{"stats":[{"poolHashRate":20,"connectedMiners":12,"created":"2017-09-16T10:00:00"},{"poolHashRate":25,"connectedMiners":15,"created":"2017-09-16T11:00:00"},{"poolHashRate":23,"connectedMiners":13,"created":"2017-09-17T10:00:00"}]}');//debug
  //.done(function( data )) {
    //data = JSON.parse(data);

    labels = [];
    connectedMiners = [];
    networkHashRate = [];
    poolHashRate = [];
    maxHashRate = 0;

    $.each(data.stats, function(index,value) {
      labels.push(new Date(value.created).toLocaleTimeString());
      //networkHashRate.push(value.networkHashRate);
      networkHashRate.push(30);
      poolHashRate.push(value.poolHashRate);
      //if (value.networkHashRate > maxHashRate) {
        //maxHashRate = value.poolHashRate;
      //}
      if (value.poolHashRate > maxHashRate) {
        maxHashRate = value.poolHashRate;
      }
      connectedMiners.push(value.connectedMiners);
    });

    var dataSales = {
      //labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
      labels: labels,
      series: [
        networkHashRate,
        poolHashRate
         //[287, 385, 490, 562, 594, 626, 698, 895, 952],
        //[67, 152, 193, 240, 387, 435, 535, 642, 744],
        //[23, 113, 67, 108, 190, 239, 307, 410, 410]
      ]
    };

    var optionsSales = {
      lineSmooth: false,
      low: 0,
      high: maxHashRate * 1.1,
      showArea: true,
      height: "245px",
      axisX: {
        showGrid: false,
      },
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
      showLine: true,
      showPoint: false,
    };

    var responsiveSales = [
      ['screen and (max-width: 640px)', {
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];

    Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);

    var data = {
      labels: labels,
      series: [
        connectedMiners
      ]
    };

    var options = {
        seriesBarDistance: 10,
        axisX: {
            showGrid: false
        },
        height: "245px"
    };

    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];

    Chartist.Line('#chartActivity', data, options, responsiveOptions);
  });

  };

  function loadBlockList() {
      $.ajax( API + 'pool/' + currentPool + '/blocks' )
      .always(function( data ) {//debug,should be done()
        data = JSON.parse( '[{"blockheight":2000197,"status":"pending","transactionConfirmationData":"6e7f68c7891e0f2fdbfd0086d88be3b0d57f1d8f4e1cb78ddc509506e312d94d","reward":17.55888124174,"infoLink":"https://xmrchain.net/block/6e7f68c7891e0f2fdbfd0086d88be3b0d57f1d8f4e1cb78ddc509506e312d94d","created":"2017-09-16T07:41:50.242856"},{"blockheight":2000196,"status":"confirmed","transactionConfirmationData":"bb0b42b4936cfa210da7308938ad6d2d34c5339d45b61c750c1e0be2475ec039","reward":17.558898015821,"infoLink":"https://xmrchain.net/block/bb0b42b4936cfa210da7308938ad6d2d34c5339d45b61c750c1e0be2475ec039","created":"2017-09-16T07:41:39.664172"},{"blockheight":2000195,"status":"orphaned","transactionConfirmationData":"b9b5943b2646ebfd19311da8031c66b164ace54a7f74ff82556213d9b54daaeb","reward":17.558914789917,"infoLink":"https://xmrchain.net/block/b9b5943b2646ebfd19311da8031c66b164ace54a7f74ff82556213d9b54daaeb","created":"2017-09-16T07:41:14.457664"}]');//debug
      //.done(function( data )) {
        //data = JSON.parse(data);
        var blockList = '<thead><th>Height</th><th>Confirmation</th><th>Date &amp; Time</th><th>Status</th></thead><tbody>';
        if (data.length > 0) {
          $.each(data, function( index, value ) {
            blockList += '<tr>';
            blockList += '<td>' + value.blockheight + '</td>';
            blockList += '<td><a href="' + value.infoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0,32) + '...</a></td>';
            blockList += '<td>' + new Date(value.created).toLocaleString() + '</td>';
            blockList += '<td>' + value.status + '</td>';
            blockList += '</tr>'
          });
        } else {
          blockList += '<tr><td colspan="4">None</td></tr>';
        }
        blockList += '</tbody>';
        $('#blockList').html(blockList);
      });
    }

$(document).ready(function(){
  loadPoolList();
});
