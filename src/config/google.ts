console.log(
  process.env
    .GOOGLE_CLIENT_ID
);

export const googleConfig = {
  clientId:
    process.env
      .GOOGLE_CLIENT_ID || "",
};