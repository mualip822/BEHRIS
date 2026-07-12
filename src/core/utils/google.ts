import axios from "axios";

export interface GoogleUserPayload {
  email: string;
  name: string;
  picture?: string;
}

export const verifyGoogleToken = async (
  accessToken: string
): Promise<GoogleUserPayload> => {
  try {
    console.log("========== GOOGLE VERIFY ==========");
    console.log("ACCESS TOKEN:", accessToken.substring(0, 30) + "...");

    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("GOOGLE USER:", data);

    if (!data.email) {
      throw new Error("Google email not found");
    }

    return {
      email: data.email,
      name: data.name || "Google User",
      picture: data.picture || "",
    };
  } catch (err: any) {
    console.error(err.response?.data || err);

    throw new Error(
      err.response?.data?.error_description ||
      err.message ||
      "Google access token invalid"
    );
  }
};