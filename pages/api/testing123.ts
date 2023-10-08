// POST Method
export default async function handler(req, res) {
  //   if (req.method !== "POST") {
  //     res.status(405).json({ message: "Method not allowed" });
  //     return;
  //   }

  const { text, phoneNumber } = req.body;

  // Check bearer token
  const bearerToken = req.headers.authorization;
  if (!bearerToken || bearerToken !== "Ada@2023") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  await sendWAmessage(text, phoneNumber);

  console.log(req.body);
  return res.status(200).json({ message: "success" });
}

async function sendWAmessage(text, phoneNumber) {
  const req = {};
  req["platform"] = "WA";
  req["type"] = "text";
  req["from"] = "60136959014";
  req["to"] = `${phoneNumber}`;
  req["text"] = text ? text : "Boey so handsome can i have one night with you?";

  const waAPIKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjY2ZDYzNDY0LTJhNjktNDg1MS05MjI1LTZjY2U3MDY2YTE2NiIsImNvdW50cnlDb2RlIjoiIiwiZW1haWwiOiJUZWFtMjBAYWRhLWFzaWEuY29tIiwiZXhwIjoyMzI3OTM1MTE5LCJpYXQiOjE2OTY3ODMxMTksIm5hbWUiOiJBRE1JTiIsInJvbGVDb2RlIjoiT1dORVIiLCJyb2xlSWQiOiJPV05FUiIsInNpZCI6ImFwaWtleSIsInN0eXBlIjoidXNlciIsInVpZCI6ImM4OWJmNGMwLWIwMzktNGEyZC1hYjEzLTBhNDNiMTgwNGRjYyJ9.p8M1d0YIrllrOMnceTYeWfmNe4-j77o_t7B9K2CcweA";

  const endpoint = "https://bizmsgapi.ada-asia.com/prod/message";

  const header = {
    "Content-Type": "application/json", // Set Content-Type to application/json
    Authorization: `Bearer ${waAPIKey}`,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: header,
    body: JSON.stringify(req),
  });

  if (res.status === 200 || res.status === 201) {
    return res.json();
  } else {
    return null;
  }
}