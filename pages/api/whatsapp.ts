// this is a POST method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  req.body["platform"] = "WA";
  req.body["type"] = "text";
  req.body["from"] = "60136959014";
  req.body.to = req.body.to.toString(); // required
  req.body.text = req.body.text; // required

  res.status(200).json({ message: "success" });

  await sendWhatsappMessage(req);
  return;
}

const sendWhatsappMessage = async (req) => {
  const waAPIKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjY2ZDYzNDY0LTJhNjktNDg1MS05MjI1LTZjY2U3MDY2YTE2NiIsImNvdW50cnlDb2RlIjoiIiwiZW1haWwiOiJUZWFtMjBAYWRhLWFzaWEuY29tIiwiZXhwIjoyMzI4MTAzMDc3LCJpYXQiOjE2OTY5NTEwNzcsIm5hbWUiOiJBRE1JTiIsInJvbGVDb2RlIjoiT1dORVIiLCJyb2xlSWQiOiJPV05FUiIsInNpZCI6ImFwaWtleSIsInN0eXBlIjoidXNlciIsInVpZCI6ImM4OWJmNGMwLWIwMzktNGEyZC1hYjEzLTBhNDNiMTgwNGRjYyJ9.x2LH4f3cfHJMXOrx74nwG3iAXdbqgPAlWTdnNrrIJzI";
  const endpoint = "https://bizmsgapi.ada-asia.com/prod/message";

  const header = {
    "Content-Type": "application/json", // Set Content-Type to application/json
    Authorization: `Bearer ${waAPIKey}`,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: header,
    body: JSON.stringify(req.body),
  });

  if (res.status === 200 || res.status === 201) {
    return res.json();
  } else {
    return null;
  }
};
