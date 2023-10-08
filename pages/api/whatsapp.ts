// POST Method
export default async function handler(req, res) {
  //   if (req.method !== "POST") {
  //     res.status(405).json({ message: "Method not allowed" });
  //     return;
  //   }
  // Check bearer token
  const bearerToken = req.headers.authorization;
  if (!bearerToken || bearerToken !== "Ada@2023") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  try {
    // Parse the JSON data from the request body
    const reqBodyString = JSON.stringify(req.body);
    const requestData = JSON.parse(reqBodyString);

    // Respond with the parsed JSON data
    res.status(200).json(requestData);

    sendWAmessage(requestData);

  } catch (error) {
    res.status(400).json({ message: "Invalid JSON data in the request body" });
  }
}


async function sendWAmessage(req) {
  req.body.platform = 'WA';
  req.body.type = 'text';
  req.body.from = '60136959014'
  req.body.to = "60175228785"
  req.body.text = req;

  const waAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjY2ZDYzNDY0LTJhNjktNDg1MS05MjI1LTZjY2U3MDY2YTE2NiIsImNvdW50cnlDb2RlIjoiIiwiZW1haWwiOiJUZWFtMjBAYWRhLWFzaWEuY29tIiwiZXhwIjoyMzI3ODk1ODcyLCJpYXQiOjE2OTY3NDM4NzIsIm5hbWUiOiJBRE1JTiIsInJvbGVDb2RlIjoiT1dORVIiLCJyb2xlSWQiOiJPV05FUiIsInNpZCI6ImFwaWtleSIsInN0eXBlIjoidXNlciIsInVpZCI6ImM4OWJmNGMwLWIwMzktNGEyZC1hYjEzLTBhNDNiMTgwNGRjYyJ9.K3-8lHBq1_7VfD5jXbzW8s6sUma1HKIYRYKpQT-HBVc";

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
}