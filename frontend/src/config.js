// In production with no REACT_APP_API_URL, use same-origin (""). Otherwise use env or localhost for dev.
const url = process.env.REACT_APP_API_URL;
export const API_BASE =
  url && url !== ""
    ? url
    : process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:5000";
