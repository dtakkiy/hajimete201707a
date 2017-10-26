var pointList = [
  { id: '1', place: 'パシフィコ', lat: 35.458316, lng: 139.635411 },
  { id: '2', place: '横浜スタジアム', lat: 35.443122, lng: 139.638545 },
  { id: '3', place: '山下公園', lat: 35.445610, lng: 139.649645 },
  { id: '4', place: '三渓園', lat: 35.412815, lng: 139.662988 },
  { id: '5', place: '平野ボート・ヨコハママリーナ', lat: 35.384572, lng: 139.626519 },
  { id: '6', place: '八景島', lat: 35.342388, lng: 139.636093 },
];

var $distanceItem = $('.distance-item');
var storageDistance = parseFloat(localStorage.getItem('distance'));

$(function() {
  'use.strict';

  var selectedPointIdList = [];

  $('#start-place').val(localStorage.getItem('start')); //開始地点取得
  $('#goal-place').val(localStorage.getItem('goal'));   //ゴール地点取得

  var $suggests = $('.suggests');
    $suggests.append(
      pointList.map(function(point) {
          return '<div class="suggest-item">' +
              '<input type="checkbox" class="suggest-item-check" data-point-id="' + point.id + '"/> ' + point.place +
              '</div>';
      }).join('')
  );

  $('.suggest-item-check').change(function() {
      var pointId = $(this).attr('data-point-id');

      var index = selectedPointIdList.indexOf(pointId);
      if (index !== -1) {
        selectedPointIdList.splice(index, 1);
      } else {
        selectedPointIdList.push(pointId);
      }
  });

  $('#ok').click(function() {
      var sp = startPlace.getPlace();
      var start = localStorage.getItem('start');
      if (sp) {
        start = new google.maps.LatLng(sp.geometry.location.lat(), sp.geometry.location.lng());
      }

      var gp = goalPlace.getPlace();
      var goal = localStorage.getItem('goal');
      if (gp) {
        goal = new google.maps.LatLng(gp.geometry.location.lat(), gp.geometry.location.lng());
      }

      var waypoints = selectedPointIdList.map(function(pId) {
          for (var i = 0; i < pointList.length; i += 1) {
              if (pointList[i].id === pId) {
                  return pointList[i];
              }
          }
          return null;
      }).filter(function(point) {
          return !!point;
      }).map(function(point) {
          return { location: new google.maps.LatLng(point.lat, point.lng) };
      });

      var request = {
          origin: start,
          destination: goal,
          waypoints: waypoints,
          travelMode: 'WALKING'
      };

      if (directionsDisplay != null) {
          directionsDisplay.setMap(null);
          directionsDisplay = null;
      }

      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
      directionsService.route(request, function(result, status) {

        if (status == 'OK') {
            var distance = 0;

            var route = result.routes[0];
            for (var i = 0; i < route.legs.length; i++) {
                distance += parseInt(route.legs[i].distance.text.replace('km', '').trim(), 10);
            }

            $distanceItem.html(distance + ' km');

            if (storageDistance + 5 < distance) {
                alert('距離がおかしいよ！再設定してください');
            } else {
                directionsDisplay.setDirections(result);
            }
        }
      });
  });

  /* 戻るボタン */
  $('#back').click(function() {
      location.href = "input.html";
  });

});

var directionsDisplay;
var directionsService;
var stepDisplay;
var startPlace;
var goalPlace;
var map;

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  stepDisplay = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
  });
  directionsDisplay.setMap(map);

  pointList.forEach(function(point) {
      new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: map,
          title: point.place,
      });
  });

  var start = localStorage.getItem('start');
  var goal = localStorage.getItem('goal');

  var request = {
      origin: start,
      destination: goal,
      travelMode: 'WALKING'
  };

  directionsService.route(request, function(result, status) {
      console.log(result);
      if (status == 'OK') {
          directionsDisplay.setDirections(result);

          var distance = 0.0;

          var route = result.routes[0];
          for (var i = 0; i < route.legs.length; i++) {
              distance += parseFloat(route.legs[i].distance.text.replace('km', '').trim())
          }

          $distanceItem.html(distance + ' km');

          if (storageDistance + 5 < distance) {
              alert('距離がおかしいよ！');
              location.href = 'input.html';
          } 
      } else if ('ZERO_RESULTS' == status) {
        /* 該当なしの場合 */
        alert('該当する結果が見つかりませんでした。\nスタート、ゴール地点を再入力して下さい。');
        location.href = "input.html";
      }

  });

  $('.target-distance-item').html(storageDistance + ' km');
  startPlace = new google.maps.places.Autocomplete(document.getElementById('start-place'), {});
  goalPlace = new google.maps.places.Autocomplete(document.getElementById('goal-place'), {});
}
