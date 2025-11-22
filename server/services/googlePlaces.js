import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});

// Helper to get photo URL
const getPhotoUrl = (photoReference) => {
    if (!photoReference) return null;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
};

// Fetch top places for the explore section
export async function getExplorePlaces(destination, category = 'attractions') {
    try {
        let query = `Top tourist attractions in ${destination}`;
        if (category === 'hotels') query = `Top rated hotels in ${destination}`;
        if (category === 'restaurants') query = `Best restaurants in ${destination}`;

        const response = await client.textSearch({
            params: {
                query: query,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        const places = response.data.results.slice(0, 6).map(place => ({
            name: place.name,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            address: place.formatted_address,
            photo: place.photos ? getPhotoUrl(place.photos[0].photo_reference) : null,
            place_id: place.place_id,
            types: place.types,
            geometry: place.geometry.location,
            description: category === 'attractions' ? "Popular tourist attraction" : (category === 'hotels' ? "Top rated hotel" : "Popular restaurant")
        }));

        return places;
    } catch (error) {
        console.error(`Error fetching explore places (${category}):`, error);
        return [];
    }
}

// Fetch details for a specific place (for the article/summary)
export async function getPlaceDetails(placeId) {
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                fields: ["name", "rating", "formatted_phone_number", "editorial_summary", "photos", "website"],
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        const data = response.data.result;
        return {
            ...data,
            photo: data.photos ? getPhotoUrl(data.photos[0].photo_reference) : null,
            summary: data.editorial_summary ? data.editorial_summary.overview : null
        };
    } catch (error) {
        console.error("Error fetching place details:", error);
        return null;
    }
}
