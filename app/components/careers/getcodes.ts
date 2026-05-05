'use server';

interface code {
  dial_code: string;
}

export async function GetCodes() {
  const response = await fetch(`https://countriesnow.space/api/v0.1/countries/codes`);
  const { data } = await response.json();
  const codes = data.map((item: code) => item.dial_code);
  return codes;
}
