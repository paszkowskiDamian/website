/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site — `next build` emits plain HTML/CSS/JS into out/,
  // deployable to any static host with no Node server.
  output: "export",
  // Emit each route as <route>/index.html so links resolve on dumb hosts.
  trailingSlash: true,
};

export default nextConfig;
