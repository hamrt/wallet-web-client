import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./screens/App";
import "@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css";

ReactDOM.render(App(), document.getElementById("root"));
