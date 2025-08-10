import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";
export const SelectedCityContext = createContext([]);

export default function SelectedCityProvider({ children }) {
  const { t, i18n } = useTranslation();
  const cities = [
    // { id: 1, name: "", label: t("Select a city")  }, // اختر مدينه
    { id: 2, name: "cairo", label: t("Egypt (Cairo)"), lat: 30.06, lon: 31.25 }, // القاهرة
    {
      id: 3,
      name: "Paris",
      label: t("Paris (Pantin)"),
      lat: 48.9,
      lon: 2.4,
    }, // باريس
    {
      id: 4,
      name: "Mitte",
      label: t("Germany (Mitte)"),
      lat: 52.52,
      lon: 13.405,
    }, // ميته
    {
      id: 5,
      name: "Beijing",
      label: t("China (Beijing)"),
      lat: 39.9042,
      lon: 116.4074,
    },
  ];
  const [selectedValue, setSelectedValue] = useState(cities[0]);
  return (
    <SelectedCityContext.Provider
      value={{ selectedValue, setSelectedValue, cities }}
    >
      {children}
    </SelectedCityContext.Provider>
  );
}
