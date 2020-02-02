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
  // console.log(pos.lat);
  // var center = {lat: pos.lat, lng: pos.lng};
  console.log("<%= result %>");
  var locations = [];
  // for(let i=0;i<data.length;i++)
	// {
  //   var a =['Slum '+i+1+'<br> <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">,'+data[i].hunger_latitude+ ',' +data[i].hunger_longitude];
  //   console.log("gjhghjg"+a);
  //   locations.push(a);
  //   console.log(locations);
	// }
  // var locations = [
  //   ['Slum 1<br>\
  //   <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.2183072435819, 72.83263216143747],
  //   ['Slum 2<br>\
  //   <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.066302172508813, 73.00299433382882],
  //   ['Slum 3<br>\
  //   <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.06594216466549, 73.00267323751609],
  //   ['Slum 4<br>\
  //   <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.066626632624107, 73.00187930364768],
  //   ['Slum 5<br>\
  //   <input style="width:100%" class="form-control btn btn-primary" id="submit" name="submit" type="submit" value="Donate Food Here" data-toggle="modal" data-target="#nearbyvolunteers">', 19.066829437402454, 73.00272688169639]
  // ];
  // console.log("hello"+locations);
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