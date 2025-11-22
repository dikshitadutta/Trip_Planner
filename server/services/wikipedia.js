import axios from 'axios';

export async function getWikipediaSummary(query) {
    try {
        // Search for the page first
        const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                list: 'search',
                srsearch: query,
                format: 'json',
                origin: '*'
            },
            headers: {
                'User-Agent': 'TripPlanner/1.0 (rishav@example.com)' // Replace with valid contact info if possible, or generic app info
            }
        });

        if (!searchRes.data.query.search.length) return null;

        const pageTitle = searchRes.data.query.search[0].title;

        // Get the summary for the top result
        const summaryRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`, {
            headers: {
                'User-Agent': 'TripPlanner/1.0 (rishav@example.com)'
            }
        });

        return summaryRes.data.extract;
    } catch (error) {
        console.error(`Error fetching Wikipedia summary for ${query}:`, error.message);
        return null;
    }
}
