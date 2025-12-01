// Read query parameters
const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get("lat")) || 55.86;   // Glasgow default
const lng = parseFloat(params.get("lng")) || -4.25;
const zoom = parseInt(params.get("zoom")) || 12;
const query = params.get("q");

// Create map
const map = L.map('map').setView([lat, lng], zoom);

// Add OSM tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Branding text at bottom center
const joycodeLogo = L.control({position: 'bottomcenter'});
joycodeLogo.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'joycode-logo');
  div.innerHTML = "JoyCode Maps";
  return div;
};
joycodeLogo.addTo(map);

// Add search bar
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
}).addTo(map);

geocoder.on('markgeocode', function(e) {
  const latlng = e.geocode.center;
  L.marker(latlng).addTo(map)
    .bindPopup(e.geocode.name).openPopup();
  map.setView(latlng, 14);
});

// Geolocation: show "You are here"
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    L.marker([userLat, userLng]).addTo(map)
      .bindPopup("You are here").openPopup();
  });
}

// Run search if query parameter exists
if (query) {
  geocoder.options.geocoder.geocode(query, function(results) {
    results.forEach(function(r) {
      L.marker(r.center).addTo(map)
        .bindPopup(r.name).openPopup();
      map.setView(r.center, 14);
    });
  });
}