const LAZADA_API_URL = "https://www.lazada.com.my/tag/";

async function getLazadaAPI(category = "clothes", page = "1") {
  const url = `${LAZADA_API_URL}${category}/?page=${page}&q=${category}&ajax=true&rating=5`;
  try {
    const response = await fetch(url).then((res) => {
      return res.json();
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getLazadaProductsFromAPI(userInput, pageNo = 1, setOf40) {
  const res = await getLazadaAPI(userInput, setOf40);
  const items = res.mods.listItems;
  const products = [];

  if (pageNo < 1) pageNo = 1;
  for (let i = (pageNo - 1) * 3; i < pageNo * 3; i++) {
    const name = items[i].name;
    const price = items[i].priceShow.replace("RM", "");
    const seller_name = items[i].sellerName;
    const seller_location = items[i].location;
    const image = items[i].image;
    const url = "https:" + items[i].itemUrl;
    const rating = items[i].ratingScore;

    products.push({
      image,
      name,
      price,
      rating,
      seller_name,
      seller_location,
      url,
    });
  }

  return products;
}
