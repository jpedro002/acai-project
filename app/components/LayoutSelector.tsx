import { Suspense } from 'react';
import LayoutV1 from './layouts/LayoutV1';
import LayoutV2 from './layouts/LayoutV2';
import LayoutV3 from './layouts/LayoutV3';

interface LayoutSelectorProps {
  layout?: string;
}

export default function LayoutSelector({ layout = 'v1' }: LayoutSelectorProps) {
  const renderLayout = () => {
    switch (layout.toLowerCase()) {
      case 'v2':
        return <LayoutV2 />;
      case 'v3':
        return <LayoutV3 />;
      case 'v1':
      default:
        return <LayoutV1 />;
    }
  };

  return renderLayout()
}
