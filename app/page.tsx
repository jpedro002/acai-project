import { Suspense } from "react";
import LayoutSelector from "./components/LayoutSelector";

interface PageProps {
  searchParams?: Promise<{
    layout?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const layout = params?.layout || "v1";

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LayoutSelector layout={layout} />
    </Suspense>
  );
}
