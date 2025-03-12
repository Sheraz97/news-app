import axios from "axios";

export const getNews = async (url: string) => {
    return axios.get(url);
};
