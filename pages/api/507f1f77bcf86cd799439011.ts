// POST Method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // check bearer token
  const bearerToken = req.headers.authorization;
  if (!bearerToken || bearerToken !== "Ada@2023") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  console.log(req);

  res.status(200).json(req);
}
