const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL || "your-custom-domain.com"}`;
};

export default getBaseUrl;
