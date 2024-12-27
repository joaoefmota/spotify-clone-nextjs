import { Price } from "@/types/stripe.types";

export const getUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  url = url.includes("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("postData: ", url, data);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("Failed to fetch", res);
    throw new Error("Failed to fetch");
  }
  return res.json();
};

export const toDateTime = (secs: number) => {
  let t = new Date("1970-01-01T00:30:00Z");
  t.setSeconds(secs);
  return t;
};
