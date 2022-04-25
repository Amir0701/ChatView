import axios from 'axios';

import { API_URL } from "@/services/config";

export default axios.create({
    baseURL: API_URL,
    timeout: 1000
});