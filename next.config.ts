import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite je natívny WASM balík — musí ostať mimo serverového bundlu.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
