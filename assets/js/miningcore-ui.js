// config
var API = 'https://localhost:4000/api/';
var defaultPool = ''; //ID

// current indicator + cache
var currentPool = defaultPool;

function loadPoolList(){
  $.ajax( API + 'pools' )
  .always(function( data ) {//debug,should be done()
    data = JSON.parse( '{"pools":[{"id":"xmr1","coin":{"type":5},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":1,"payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolStats":{"connectedMiners":0,"poolHashRate":0,"poolFeePercent":0,"donationsPercent":0,"sharesPerSecond":0,"validSharesPerMinute":0,"invalidSharesPerMinute":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
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
    data = JSON.parse( '{"pools":[{"id":"xmr1","coin":{"type":5},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":1,"payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolStats":{"connectedMiners":0,"poolHashRate":0,"poolFeePercent":0,"donationsPercent":0,"sharesPerSecond":0,"validSharesPerMinute":0,"invalidSharesPerMinute":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
  //.done(function( data )) {
    //data = JSON.parse(data);
    $.each(data.pools, function( index, value ) {
      if (currentPool == value.id) {
        // poolShares
        // poolBlocks
        $('#poolMiners').text(value.poolStats.connectedMiners);
        $('#poolHashRate').text(value.poolStats.poolHashRate);
        $('#networkHashRate').text(value.networkStats.networkHashRate);
        $('#networkDifficulty').text(value.networkStats.networkDifficulty);
      }
    });
  });
}

function loadChart(){
  $.ajax( API + 'pool/' + currentPool + '/stats/hourly' )
  .always(function( data ) {//debug,should be done()
    data = JSON.parse( '{"stats":[{"poolHashRate":20,"created":"2017-09-16T10:00:00"},{"poolHashRate":25,"created":"2017-09-16T11:00:00"},{"poolHashRate":25,"created":"2017-09-16T12:00:00"},{"poolHashRate":15,"created":"2017-09-16T13:00:00"}]}');//debug
  //.done(function( data )) {
    //data = JSON.parse(data);

    labels = [];
    poolHashRate = [];
    networkHashRate = [];
    maxHashRate = 0;

    $.each(data.stats, function(index,value) {
      labels.push(value.created);
      poolHashRate.push(value.poolHashRate);
      if (value.poolHashRate > maxHashRate) {
        maxHashRate = value.poolHashRate;
      }
    });

    var dataSales = {
      //labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
      labels: labels,
      series: [
        poolHashRate,
        networkHashRate
         //[287, 385, 490, 562, 594, 626, 698, 895, 952],
        //[67, 152, 193, 240, 387, 435, 535, 642, 744],
        //[23, 113, 67, 108, 190, 239, 307, 410, 410]
      ]
    };

    var optionsSales = {
      lineSmooth: false,
      low: 0,
      high: maxHashRate,
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
  });

  };

$(document).ready(function(){
  loadPoolList();
});
