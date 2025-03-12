// Function to construct API URL
const getApiUrl = (
    source: string,
    searchTerm: string,
    startDate: string | null,
    endDate: string | null,
    page: number,
    pageSize: number
): string => {
    const newsApiKey = process.env.REACT_APP_NEWSAPI_KEY;
    const guardianApiKey = process.env.REACT_APP_GUARDIAN_KEY;
    const nyTimesApiKey = process.env.REACT_APP_NYTIMES_KEY;

    if (source === "NewsAPI") {
        let url = `https://newsapi.org/v2/everything?q=${searchTerm || "news"}&page=${page}&pageSize=${pageSize}&sortBy=publishedAt&apiKey=${newsApiKey}`;
        if (startDate) url += `&from=${startDate}`;
        if (endDate) url += `&to=${endDate}`;
        return url;
    } else if (source === "The Guardian") {
        let url = `https://content.guardianapis.com/search?q=${searchTerm || "news"}&api-key=${guardianApiKey}&show-fields=byline,headline,bodyText,publication&order-by=newest&page=${page}&page-size=${pageSize}`;
        if (startDate) url += `&from-date=${startDate}`;
        if (endDate) url += `&to-date=${endDate}`;
        return url;
    } else if (source === "New York Times") {
        let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm || "news"}&sort=newest&api-key=${nyTimesApiKey}&page=${page}`;
        if (startDate) url += `&begin_date=${startDate.replace(/-/g, "")}`;
        if (endDate) url += `&end_date=${endDate.replace(/-/g, "")}`;
        return url;
    }
    return "";
};

export {
    getApiUrl
};