// //This avoids repeating the backend URL everywhere.
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "/api",   // ← remove hardcoded localhost:5000
});

export default api;