import { SITE_URL, LOCAL_URL } from "astro:env/client";

export async function getData(
  dataType: string = "data",
  local: boolean = false
) {
  // حماية قصوى: لو إحنا في مرحلة الـ Build على فيرسل، استخدم SITE_URL دايماً
  // حتى لو الكود باعت local = true
  const isVercel = process.env.VERCEL === '1';
  const siteUrl = (isVercel || !local) ? SITE_URL : LOCAL_URL;

  // لو لسه الـ siteUrl مش متعرف (حماية من الـ undefined)
  if (!siteUrl) {
    console.warn(`Warning: URL for ${dataType} is missing. Using fallback.`);
    return null; 
  }

  const endpoint = dataType !== "data" ? dataType : "all";
  
  try {
    // بناء الرابط وتنظيفه من أي علامات زيادة
    const baseUrl = siteUrl.replace(/\/$/, '');
    const fullUrl = `${baseUrl}/api/${endpoint}`;

    const res = await fetch(fullUrl);
    
    if (!res.ok) {
      throw new Error(`Error ${res.status} fetching ${dataType}`);
    }
    
    const data = await res.json();
    return data[dataType];
  } catch (error) {
    console.error(`Fetch failed for ${dataType}:`, error);
    return null;
  }
}
