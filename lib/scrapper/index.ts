import axios from "axios";

import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) {
    return;
  }

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios(url, options);
    const $ = cheerio.load(response.data);

    // Extracting data from Amazon
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".a-price-whole").slice(0, 1),
      $(".a-price.a-text-price").slice(0, 1)
    );
    const originalPrice = extractPrice(
      $(".a-price.a-text-price span.a-offscreen").slice(0, 1)
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imagesUrl = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    //    const discription = $('#feature-bullets ul.a-unordered-list li span').text()
    const description = extractDescription($)

    // Constructing the data
    const data = {
      url,
      currency: currency || "EGP",
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      image: imagesUrl[0],
      priceHistory: [],
      discountRate: Number(discountRate),
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };


    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}
