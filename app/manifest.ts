import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LOCKED IN — Tu disciplina diaria",
    short_name: "LOCKED IN",
    description: "Organiza tus hábitos, entrenamientos, estudios y lectura.",
    start_url: "/",
    display: "standalone",
    background_color: "#090b12",
    theme_color: "#090b12",
    lang: "es",
    orientation: "portrait",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
  };
}
