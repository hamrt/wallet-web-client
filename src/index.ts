import "react-app-polyfill/stable";
import ReactDOM from "react-dom";
import App from "./screens/App";
import "@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css";
import "./index.css";

ReactDOM.render(App(), document.getElementById("root"));
