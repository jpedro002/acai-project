import { Suspense } from "react";
import LayoutSelector from "./components/LayoutSelector";
import LayoutV1Skeleton from "./components/layouts/LayoutV1Skeleton";

interface PageProps {
  searchParams?: Promise<{
    layout?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const layout = params?.layout || "v1";

  return (
    <Suspense fallback={<LayoutV1Skeleton />}>
      <LayoutSelector layout={layout} />
    </Suspense>
  );
}
