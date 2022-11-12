/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "img.icons8.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination:
            "https://oaidalleapiprodscus.blob.core.windows.net/private/org-BqTRcerQbrw98tpqaJLhWmGI/user-Y59GmBC2R9RDhBN1BqtCPhVD/img-pPIYdJuWeEe7OAfxufvWalIX.png?st=2022-11-12T11%3A48%3A36Z&se=2022-11-12T13%3A48%3A36Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-11-12T08%3A13%3A48Z&ske=2022-11-13T08%3A13%3A48Z&sks=b&skv=2021-08-06&sig=LYz5YoNirqS9%2B%2BrseAHbBXhvnfzRY/zwgl13T10AIDA%3D",
        },
      ],
    };
  },
};

module.exports = nextConfig;
