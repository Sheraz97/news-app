interface NewsState {
    newsData: NewsArticle[];
    loading: boolean;
    error: string | null;
};

interface NewsArticle {
    title: string;
    source: string;
    author: string;
    category: string;
    content: string;
    date: string;
}

interface NewsApiResponse {
    articles: Array<{
        title: string;
        source: { name: string };
        author: string | null;
        description: string;
        publishedAt: string;
    }>;
    totalResults: number;
}

interface GuardianApiResponse {
    response: {
        results: Array<{
            fields: {
                headline: string;
                byline: string;
                bodyText: string;
            };
            webPublicationDate: string;
        }>;
        total: number;
    };
}

interface NyTimesApiResponse {
    response: {
        docs: Array<{
            headline: { main: string };
            byline?: { original: string };
            abstract: string;
            pub_date: string;
        }>;
        meta: { hits: number };
    };
}

interface NewsState {
    newsData: NewsArticle[];
    loading: boolean;
    error: string | null;
    totalResults: number;
}

export type {
    NewsState,
    NewsArticle,
    NewsApiResponse,
    GuardianApiResponse,
    NyTimesApiResponse
};