const siteUrl = "https://portfolio-sofi2-0.vercel.app";

export async function getData(dataType: string = "data", local: boolean = false) {
  const endpoint = dataType !== "data" ? dataType : "all";

  try {
    const fullUrl = `${siteUrl}/api/${endpoint}`;
    const res = await fetch(fullUrl);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data[dataType];
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
