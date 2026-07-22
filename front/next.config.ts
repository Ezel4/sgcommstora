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
  async redirects() {
    if (process.env.NODE_ENV !== "production") return [];

    return [
      {
        source: "/pubs",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Le canvas de l'éditeur (Store Editor) est volontairement chargé
        // dans une iframe par /editeur, sur la même origine (voir
        // src/lib/editor/messaging.ts). DENY bloquerait ce cadrage légitime ;
        // SAMEORIGIN l'autorise tout en refusant tout cadrage externe.
        source: "/editeur/canvas",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
      {
        // Le reste de l'application n'a aucune raison d'être cadré, sur cette
        // origine ou une autre.
        source: "/((?!editeur/canvas).*)",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },
};

export default nextConfig;
