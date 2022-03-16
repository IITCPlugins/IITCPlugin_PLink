export const WebLink = {

    intel: (portal: IITC.Portal): string => {
        const ll = portal.getLatLng();
        return generateLink("https://intel.ingress.com/", { pll: `${ll.lat},${ll.lng}` })
    },


    scanner: (portal: IITC.Portal): string => {
        const ll = portal.getLatLng();
        return generateLink("https://link.ingress.com/", {
            link: `https://intel.ingress.com/portal/${portal.options.guid}`,
            apn: "com.nianticproject.ingress",
            isi: 576505181,
            ibi: "com.google.ingress",
            ifl: "https://apps.apple.com/app/ingress/id576505181",
            ofl: `https://intel.ingress.com/intel?pll=${ll.lat},${ll.lng}`
        });
    },


    google: (portal: IITC.Portal): string => {
        const name = portal.options.data.title;
        const ll = portal.getLatLng();
        const llstr = `${ll.lat},${ll.lng}`;

        return generateLink("https://maps.google.com/maps", {
            ll: llstr, q: `${llstr} (${name})`
        });
    },


    osm: (portal: IITC.Portal): string => {
        const ll = portal.getLatLng();
        return generateLink("https://www.openstreetmap.org/", { mlat: ll.lat, mlon: ll.lng, zoom: 16 }); // TODO use MapZoom?
    },


    bing: (portal: IITC.Portal): string => {
        const ll = portal.getLatLng();
        const name = portal.options.data.title;
        return generateLink("https://www.bing.com/maps/", {
            v: 2,
            cp: `${ll.lat}~${ll.lng}`,
            lvl: 16,// TODO use MapZoom?
            sp: `Point.${ll.lat}_${ll.lng}_${name}___`
        });
    }
}


const generateLink = (url: string, urlParameter: Record<string, string | number> = {}): string => {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const encodedParameters = Object.entries(urlParameter).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
    return encodedParameters ? url + "?" + encodedParameters : url;
}
