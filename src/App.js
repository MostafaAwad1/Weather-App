// import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Weather from "./components/weather";
import CssBaseline from "@mui/material/CssBaseline";
import SelectedCityProvider from "./context/CitySelectionContext";
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    typography: {
      fontFamily: "cairoMed",
    },
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SelectedCityProvider>
        <div
          className="App"
          style={{
            backgroundColor: darkMode === true ? "#b4b4b44d" : "#ecf9f2",
          }}
        >
          <Weather darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </SelectedCityProvider>
    </ThemeProvider>
  );
}

export default App;
