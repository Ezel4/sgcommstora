import type { NextConfig } from "next";
import path from "node:path";

// Racine du workspace ancrée sur ce dossier (et non un lockfile parent).
// Évite le warning Next "multiple lockfiles / inferred workspace root".
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
