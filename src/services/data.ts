// src/services/data.ts
import { SITE_URL, LOCAL_URL } from "astro:env/client";

export async function getData(dataType: string = "data", local: boolean = false) {
  // حماية: لو إحنا على Vercel، اجبر الكود يستخدم SITE_URL حتى لو الـ Component طلب local
  const isVercel = import.meta.env.VERCEL === '1' || import.meta.env.NODE_ENV === 'production';
  
  // اختيار الرابط مع توفير رابط احتياطي (Fallback)
  const siteUrl = (isVercel || !local) 
    ? (SITE_URL || "https://portfolio-sofi2-0.vercel.app") 
    : (LOCAL_URL || "http://localhost:4322");

  const endpoint = dataType !== "data" ? dataType : "all";
  
  try {
    const baseUrl = siteUrl.replace(/\/$/, '');
    const fullUrl = `${baseUrl}/api/${endpoint}`;

    console.log(`[Data Service] Fetching ${dataType} from: ${fullUrl}`);

    const res = await fetch(fullUrl);
    
    if (!res.ok) {
      console.error(`[Data Service] Error ${res.status} for ${dataType}`);
      return null;
    }
    
    const data = await res.json();
    // تأكد إن الـ dataType موجود في الـ JSON اللي راجع
    return data ? data[dataType] : null;
  } catch (error) {
    console.error(`[Data Service] Failed to fetch ${dataType}:`, error);
    return null;
  }
}
}
