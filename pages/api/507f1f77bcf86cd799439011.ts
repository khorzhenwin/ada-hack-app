// POST Method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

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
  } catch (error) {
    res.status(400).json({ message: "Invalid JSON data in the request body" });
  }
}
