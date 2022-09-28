import axios from 'axios';
import { isDevMode } from '../env.js';

export function setupAxios(app) {
  axios.defaults.baseURL = isDevMode() ? "http://localhost:3001/api/v1/" : "http://poker.boldworkplanner.com/";
}