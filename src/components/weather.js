import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";

// ICONS
import LanguageIcon from "@mui/icons-material/Language";
import CloudIcon from "@mui/icons-material/Cloud";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// EXTERNAL LIBRARY
import axios from "axios";
import { useTranslation } from "react-i18next";
import { SelectedCityContext } from "../context/CitySelectionContext";
import moment from "moment/moment";
import "moment/min/locales";
import { useContext } from "react";
let cancelAxios = null;
function Weather({ darkMode, setDarkMode }) {
  const { selectedValue, setSelectedValue, cities } =
    useContext(SelectedCityContext);
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState("en");
  const [dateTime, setDateTime] = useState("");
  const [temp, setTemp] = useState({
    name: "",
    temp: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  function handelDarkMode() {
    if (darkMode === false) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }
  function formatTemperature(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return "-";
    }
    if (locale === "ar") {
      return `${value.toLocaleString("ar-EG")}°`;
    } else {
      return `${value.toLocaleString("en-US")}°`;
    }
  }
  function handelLanguageChanger() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateTime(moment().format("MMMM Do YYYY"));
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);

  useEffect(() => {
    setDateTime(moment().format("MMMM Do YYYY"));
  }, []);

  useEffect(() => {
    if (!selectedValue || !selectedValue.lat || !selectedValue.lon) return;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${selectedValue.lat}&lon=${selectedValue.lon}&appid=45e904d931a8696bff6a0b44379629b6`,
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then((response) => {
        console.log(response);
        const TempResponse = Math.round(response.data.main.temp - 272.15);
        const description = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const name = response.data.name;
        setTemp({ temp: TempResponse, description, min, max, name, icon });
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      cancelAxios();
    };
  }, [selectedValue]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* WEATHER CARD */}

        <Card
          dir={locale === "ar" ? "rtl" : "ltr"}
          sx={{
            width: "100%",
            borderRadius: "30px",
            boxShadow: "0 11px 1px rgba(0,0,0,0.05)",
            border: " 3px solid #eee",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "start" }}>
            <Typography gutterBottom variant="h2" component="div">
              {t(temp.name)}
            </Typography>

            {/* DATE AND TIME */}
            <Typography
              variant="h5"
              sx={{ color: "text.secondary", width: "100%" }}
            >
              {dateTime}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: "text.secondary",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <IconButton aria-label="change" color="primary">
                <LanguageIcon
                  sx={{
                    fontSize: "30px",
                    color: darkMode === true ? "white" : "blue",
                  }}
                  onClick={handelLanguageChanger}
                />
              </IconButton>
              {/* <button onClick={handelDarkMode}>Dark</button> */}
              <IconButton aria-label="change" color="primary">
                <DarkModeIcon
                  sx={{
                    fontSize: "30px",
                    color: darkMode === true ? "white" : "black",
                  }}
                  onClick={handelDarkMode}
                />
              </IconButton>
            </Typography>
            {/* @DATE AND TIME@ */}
          </CardContent>

          <Divider />

          {/* TEMP AND STATUS SECTION */}
          <CardContent>
            <Grid container spacing={2}>
              <Grid
                size={7}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "center",
                }}
              >
                <Typography gutterBottom variant="h2" component="div">
                  <span>
                    {formatTemperature(temp.temp)}
                    {/* CLOUD IMAGE */}
                    <span>
                      <img
                        src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`}
                        alt="cloud img"
                        style={{ position: "absolute" }}
                      />
                    </span>
                    {/* @CLOUD IMAGE@ */}
                  </span>
                </Typography>

                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  {t(temp.description)}
                </Typography>

                <br />
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {t("Min")}:{formatTemperature(temp.min)} | {t("Max")}:
                  {formatTemperature(temp.max)}
                </Typography>
              </Grid>
              <Grid size={5}>
                <CloudIcon
                  sx={{
                    fontSize: "9rem",
                    color: darkMode === true ? "wheat" : " #149fda",
                  }}
                />
                <select
                  value={selectedValue.name}
                  onChange={(e) => {
                    const selectedCity = cities.find(
                      (c) => c.name === e.target.value
                    );
                    setSelectedValue(selectedCity);
                  }}
                  style={{
                    fontSize: "15px",
                    fontFamily: "cairoMed",
                    textAlign: "center",
                  }}
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </Grid>
            </Grid>
          </CardContent>

          {/* @TEMP AND STATUS SECTION@ */}
        </Card>
        {/* @WEATHER CARD@ */}
      </Box>
    </Container>
  );
}

export default Weather;
