import React, { useEffect } from "react";
import { Input, Select, Card, Pagination, Row, Col, DatePicker, Spin, Alert } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { debounce } from "lodash";
import { NewsArticle } from "./types";
import { fetchNewsFailure, fetchNewsStart, fetchNewsSuccess } from "./store/news/newsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { getApiUrl } from "./helpers";
import { getNews } from "./services/news";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const NewsApp: React.FC = () => {
  const dispatch = useDispatch();
  const { newsData, loading, error, totalResults } = useSelector((state: RootState) => state.news);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSource, setSelectedSource] = React.useState("NewsAPI");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedAuthor, setSelectedAuthor] = React.useState("");
  const [authors, setAuthors] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [dateRange, setDateRange] = React.useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);

  useEffect(() => {
    const fetchNews = async () => {
      dispatch(fetchNewsStart());

      try {
        const startDate = dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : null;
        const endDate = dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : null;

        const apiUrl = getApiUrl(selectedSource, searchTerm, startDate, endDate, currentPage, pageSize);

        const response = await getNews(apiUrl);
        let articles: NewsArticle[] = [];
        let authorList: Set<string> = new Set();
        let totalResults = 0;

        if (selectedSource === "NewsAPI") {
          articles = response.data.articles.map((article: any) => {
            authorList.add(article.author || "Unknown");
            return {
              title: article.title,
              source: article.source.name,
              author: article.author || "Unknown",
              category: selectedCategory || "General",
              content: article.description,
              date: article.publishedAt,
            };
          });
          totalResults = response.data.totalResults;
        } else if (selectedSource === "The Guardian") {
          articles = response.data.response.results.map((article: any) => {
            authorList.add(article.fields.byline || "Unknown");
            return {
              title: article.fields.headline,
              source: "The Guardian",
              author: article.fields.byline || "Unknown",
              category: selectedCategory || "General",
              content: article.fields.bodyText.slice(0, 200) + "...",
              date: article.webPublicationDate,
            };
          });
          totalResults = response.data.response.total;
        } else if (selectedSource === "New York Times") {
          articles = response.data.response.docs.map((article: any) => {
            authorList.add(article.byline?.original || "Unknown");
            return {
              title: article.headline.main,
              source: "New York Times",
              author: article.byline?.original || "Unknown",
              category: selectedCategory || "General",
              content: article.abstract,
              date: article.pub_date,
            };
          });
          totalResults = response.data.response.meta.hits;
        }

        // Apply manual author filtering for all sources
        if (selectedAuthor) {
          articles = articles.filter((article) => article.author === selectedAuthor);
        }

        setAuthors(Array.from(authorList));
        dispatch(fetchNewsSuccess({ articles, totalResults }));
      } catch (error) {
        dispatch(fetchNewsFailure("Failed to fetch news. Please try again later."));
      }
    };

    fetchNews();
  }, [searchTerm, selectedCategory, selectedAuthor, selectedSource, dateRange, currentPage, pageSize, dispatch]);

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 500);

  // Handle source change
  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    setSelectedAuthor("");
  };

  // Handle page size change
  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1>News App</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search
          placeholder="Search news..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-item">
          <p>Select Source:</p>
          <Select
            placeholder="Select Source"
            value={selectedSource}
            style={{ width: "100%" }}
            onChange={handleSourceChange}
          >
            <Option value="NewsAPI">NewsAPI</Option>
            <Option value="The Guardian">The Guardian</Option>
            <Option value="New York Times">New York Times</Option>
          </Select>
        </div>

        <div className="filter-item">
          <p>Select Author:</p>
          <Select
            placeholder="Select Author"
            value={selectedAuthor}
            style={{ width: "100%" }}
            onChange={(value: string) => setSelectedAuthor(value)}
            allowClear
          >
            {authors.map((author, index) => (
              <Option key={index} value={author}>{author}</Option>
            ))}
          </Select>
        </div>

        <div className="filter-item">
          <p>Select Category:</p>
          <Select
            placeholder="Select Category"
            value={selectedCategory}
            style={{ width: "100%" }}
            onChange={(value: string) => setSelectedCategory(value)}
            allowClear
          >
            <Option value="business">Business</Option>
            <Option value="entertainment">Entertainment</Option>
            <Option value="general">General</Option>
            <Option value="health">Health</Option>
            <Option value="science">Science</Option>
            <Option value="sports">Sports</Option>
            <Option value="technology">Technology</Option>
          </Select>
        </div>
      </div>

      {/* Date Range Picker */}
      <div>
        <p>Select Date Range:</p>
        <RangePicker
          style={{ marginBottom: 20 }}
          value={dateRange}
          onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : [null, null])}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <Alert message={error} type="error" />
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* News Grid */}
          {newsData.length === 0 ? (
            <div className="error-message">
              <Alert message="No results found." type="info" />
            </div>
          ) : (
            <div className="news-grid">
              {newsData.map((news, index) => (
                <Card key={index} className="news-card">
                  <h3>{news.title}</h3>
                  <p>{news.content}</p>
                  <p className="source"><strong>Source:</strong> {news.source}</p>
                  <p className="author"><strong>Author:</strong> {news.author}</p>
                  <p className="category"><strong>Category:</strong> {news.category}</p>
                  <p className="date"><strong>Date:</strong> {news.date.substring(0, 10)}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="pagination">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalResults}
              onChange={(page: number) => setCurrentPage(page)}
              onShowSizeChange={handlePageSizeChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NewsApp;