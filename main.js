const placeInput = document.getElementById("place-input");
let map;
let autocomplete;

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY + '&callback=initMap';
script.async = true;

window.initMap = function () {
  getYourApproximateLocation().then((currentLocation) => {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: currentLocation,
    });

    console.log("Ubicación inicial: ", currentLocation.lat, currentLocation.lng);

    new google.maps.Marker({
      position: currentLocation,
      map: map,
      icon: "./assets/position.svg",
    });

    let infoWindowClick = new google.maps.InfoWindow({
      content: "Clic en el mapa para ubicar cambiar su ubicación",
    });

    infoWindowClick.open(map);

    map.addListener("click", (mapsMouseEvent) => {
      infoWindowClick.close();

      infoWindowClick = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      document.getElementById("lat").value = mapsMouseEvent.latLng.lat();
      document.getElementById("lon").value = mapsMouseEvent.latLng.lng();
      document.getElementById("alt").value = 15;
      console.log("Ubicación nueva: ", mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());

      infoWindowClick.setContent(
        "Ubicación nueva"
      );

      infoWindowClick.open(map);
    });

    searchGoogleMap();
  }).catch((error) => {
    console.error(error);
  });
};

const searchGoogleMap = () => {
  autocomplete = new google.maps.places.Autocomplete(placeInput);
  autocomplete.addListener("place_changed", () => {
    if (placeInput.value !== "") {
      const place = autocomplete.getPlace();
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  });
};

const getYourApproximateLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          const currentLocation = {
            lat: latitude,
            lng: longitude,
          };

          resolve(currentLocation);
        },
        (error) => {
          reject("Error al obtener la ubicación actual");
        }
      );
    } else {
      reject("El navegador no admite la detección de ubicación");
    }
  });
};

document.head.appendChild(script);