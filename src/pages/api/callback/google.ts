import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID =
  "558071633873-vlkimvff2hgkq7ab8uc3lo12te505vkf.apps.googleusercontent.com";

const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/api/callback/google";

const client = new OAuth2Client({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
  scopes: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get auth code
  const { code } = req.query;
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const userResponse = await client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });

  // Redirect back to app
  // res.redirect("/");

  return res.status(200).json({
    user: userResponse.data,
  });
}
