export const parseDMS = (dmsString: string): [number, number] | null => {
    // Expected format: 20°48'53.6"N, 100°27'19.7"W
    // Regex to capture: degrees, minutes, seconds, hemisphere
    const regex = /(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([NSEW])/gi;

    const matches = [...dmsString.matchAll(regex)];

    if (matches.length !== 2) {
        console.error("Invalid DMS format", dmsString);
        return null;
    }

    const [latMatch, lngMatch] = matches;

    const parseComponent = (degrees: string, minutes: string, seconds: string, hemisphere: string) => {
        let dd = parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600;
        if (hemisphere.toUpperCase() === 'S' || hemisphere.toUpperCase() === 'W') {
            dd = dd * -1;
        }
        return dd;
    };

    const lat = parseComponent(latMatch[1], latMatch[2], latMatch[3], latMatch[4]);
    const lng = parseComponent(lngMatch[1], lngMatch[2], lngMatch[3], lngMatch[4]);

    return [lat, lng];
};
