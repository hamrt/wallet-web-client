import "react-app-polyfill/stable";
import ReactDOM from "react-dom";
import "@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css";
import "./index.css";
import { App } from "./screens/App";

ReactDOM.render(App(), document.getElementById("root"));
