'use server';

interface country {
  country: string;
}

export async function GetCountries() {
  const response = await fetch(`https://countriesnow.space/api/v0.1/countries/`);
  const { data } = await response.json();
  const countries = data.map((item: country) => item.country);
  return countries;
}
