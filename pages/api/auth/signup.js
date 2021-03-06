import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  // powinno tworyzć użytkownika tylko na metodę POST
  if (req.method !== "POST") {
    return;
  }

  //extract incoming data
  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    // invalid data
    res.status(422).json({
      message:
        "Invalid input - password shoul also be at least 7 characters long",
    });
    return;
  }

  // connect to database
  const client = await connectToDatabase();

  const db = client.db();

  // sprawdzanie czuy user już istenije - sprawdzanie unikalności emaili
  const existingUser = await db.collection("users").findOne({ email: email }); //key-value pairs jak argument do szukania dokuemntu/rekordu bazy
  //   albo undefined albo userObject z bazy
  if (existingUser) {
    // user już istneije w bazie
    res.status(422).json({ message: "User exists already" });
    client.close(); //pamietać o zamykaniu połaczenia
    return;
  }

  const hashedPassword = await hashPassword(password); // bo zwraca promise dlatego bez tego było ibket w bazie a nie string

  //zwraca promsia
  const result = db.collection("users").insertOne({
    email,
    password: hashedPassword, //nie zapisać hasła jako plaintext
  });

  res.status(201).json({ message: "Created user!" });
  client.close(); //pamietać o zamykaniu połaczenia
}

export default handler;
