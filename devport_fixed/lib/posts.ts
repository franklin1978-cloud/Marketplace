export type Post = {
  id: number;
  titulo: string;
  empresa: string;
  ubicacion: string;
  tipo: "Trabajo" | "Proyecto";
  tags: string[];
  fecha: string;
  descripcion: string;
};

export const posts: Post[] = [
  { id: 1, titulo: "Dev Frontend Senior", empresa: "Google", ubicacion: "Remoto", tipo: "Trabajo", tags: ["React", "TypeScript", "Next.js"], fecha: "Publicado hace 2 días", descripcion: "Buscamos un desarrollador Frontend Senior para construir experiencias web modernas, accesibles y de alto rendimiento." },
  { id: 2, titulo: "App de gestión académica", empresa: "Startup EdTech", ubicacion: "Remoto", tipo: "Proyecto", tags: ["React Native", "Node.js", "Supabase"], fecha: "Publicado hace 5 días", descripcion: "Proyecto para desarrollar una aplicación de gestión académica con autenticación, panel administrativo y notificaciones." },
  { id: 3, titulo: "Dev Backend", empresa: "Amazon Web Services", ubicacion: "Híbrido", tipo: "Trabajo", tags: ["Node.js", "PostgreSQL", "AWS"], fecha: "Publicado hace 1 semana", descripcion: "Oportunidad para desarrollar APIs robustas, servicios escalables y soluciones backend orientadas a la nube." },
];
