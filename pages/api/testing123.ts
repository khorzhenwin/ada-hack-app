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
  
  await callSendRequst(text, phoneNumber.toString());

  return res.status(200).json({ message: "success" });
}

async function callSendRequst(text, phoneNumber) {
  const req = {};
  req["to"] = phoneNumber;
  req["text"] = text ? text : "Something wrong in receiving the message.";

  const endpoint = "https://ada-hack-app.vercel.app/api/whatsapp";

  const header = {
    "Content-Type": "application/json", // Set Content-Type to application/json
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