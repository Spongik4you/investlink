/**
 * Orașe majore pentru țările frecvente.
 *
 * Deliberat NU un dataset global (ar fi sute de KB pentru un câmp secundar).
 * Pentru o țară cu listă → sugestii; pentru restul → input liber. Acoperă
 * majoritatea cazurilor fără să umfle bundle-ul. Nimeni nu filtrează pe oraș,
 * deci datele sunt informative, nu critice.
 */
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "United States": ["New York", "San Francisco", "Los Angeles", "Chicago", "Boston", "Austin", "Seattle", "Miami", "Washington", "Denver"],
  "United Kingdom": ["London", "Manchester", "Edinburgh", "Birmingham", "Bristol", "Cambridge", "Leeds", "Glasgow"],
  Germany: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf"],
  France: ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Lille", "Nice"],
  Romania: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Brașov", "Constanța", "Sibiu"],
  Moldova: ["Chișinău", "Bălți", "Tiraspol", "Cahul", "Ungheni", "Comrat"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Málaga"],
  Italy: ["Rome", "Milan", "Turin", "Naples", "Bologna", "Florence"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
  Switzerland: ["Zurich", "Geneva", "Basel", "Lausanne", "Bern"],
  Singapore: ["Singapore"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Waterloo"],
  Poland: ["Warsaw", "Kraków", "Wrocław", "Gdańsk", "Poznań"],
  Ukraine: ["Kyiv", "Lviv", "Kharkiv", "Odesa", "Dnipro"],
  India: ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  Ireland: ["Dublin", "Cork", "Galway", "Limerick"],
  Portugal: ["Lisbon", "Porto", "Braga", "Coimbra"],
  Sweden: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"],
  Estonia: ["Tallinn", "Tartu", "Pärnu"],
};

export function citiesForCountry(country: string): string[] {
  return CITIES_BY_COUNTRY[country] ?? [];
}
