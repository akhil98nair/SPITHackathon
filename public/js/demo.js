var pos

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    // console.log(pos);
  })}

function initMap() {
  var center = {lat: 19.06594216466549, lng: 73.00267323751609};
  var locations = [
    ['Slum 1 <br>Donated Food:1 day Ago.<br>\
    <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.2183072435819, 72.83263216143747],
    ['Slum 2<br> Donated Food:2 day Ago.<br>\
    <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.066302172508813, 73.00299433382882],
    ['Slum 3<br> Donated Food:3 day Ago.<br>\
    <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.06594216466549, 73.00267323751609],
    ['Slum 4<br>Donated Food:5 day Ago.<br>\
    <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.066626632624107, 73.00187930364768],
    ['Slum 5<br> Donated Food:12 Hrs Ago.<br>\
    <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.066829437402454, 73.00272688169639]
  ];
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: center
  });
var infowindow =  new google.maps.InfoWindow({});
var marker, count;
for (count = 0; count < locations.length; count++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[count][1], locations[count][2]),
      map: map,
      title: locations[count][0]
    });
google.maps.event.addListener(marker, 'click', (function (marker, count) {
      return function () {
        infowindow.setContent(locations[count][0]);
        infowindow.open(map, marker);
      }
    })(marker, count));
  }
}