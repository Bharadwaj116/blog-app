const axios = require("axios");
const querystring = require("querystring");
const dotenv = require("dotenv");

dotenv.config();

const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const redirectUri = "http://localhost:5004/github/callback";

const authorizeGithub = (req, res) => {
  const params = querystring.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

const callbackGithub = async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange the received code for an access token
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = response.data.access_token;

    // Use the access token to get user data
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    // Perform further authentication and authorization logic
    // ...

    // Redirect the user or send a response
    // res.redirect('/dashboard'); // Redirect to a protected route
    // or
    res.status(200).json({ token: accessToken, user: userData }); // Send the access token in the response
  } catch (error) {
    console.error("Error occurred during authentication:", error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
};

module.exports = { 
  authorizeGithub,
  callbackGithub,
};
