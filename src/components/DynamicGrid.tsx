import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  nCols?: number;
  nColsXl?: number;
  nColsXXl?: number;
  mdCols?: number;
  lgCols?: number;
  noMargin?: number;
  nColsXXXl?: number;
  nGap?: number;
  nGapMobile?: number;
  grid:number | null
}

export const DynamicGrid = ({
  children,
  nCols,
  nColsXl,
  nColsXXl,
  mdCols,
  lgCols,
  nColsXXXl,
  noMargin,
  nGap,
  nGapMobile,
  grid
}: GridProps): JSX.Element => {
  const colsXXl = nColsXXl ? `xxl:grid-cols-${nColsXXl} ` : `xxl:grid-cols-5`;

  const colsMd = mdCols ? `md:grid-cols-${mdCols}` : ` md:grid-cols-2`;
  const colsLg = lgCols ? `lg:grid-cols-${lgCols}` : `lg:grid-cols-3`;
  const colsXl = nColsXl ? `xl:grid-cols-${nColsXl} ` : `xl:grid-cols-4`;

  const cols = nCols ? `grid-cols-${nCols}` : `grid-cols-1`;
  const cols2 = nCols ? `grid-cols-${nCols}` : `grid-cols-2`;
  const cols3 = nCols ? `grid-cols-${nCols}` : `grid-cols-3`;
  const margin = noMargin ? `mb-24 mt-5` : `my-24`;

  const colsXXXL = nColsXXXl
    ? `xxxl:grid-cols-${nColsXXXl}`
    : `xxxl:grid-cols-6`;

  const gapSizeMobile = nGapMobile ? `gap-${nGapMobile}` : "gap-6";

  const gapSize = nGap ? `gap-${nGap}` : "gap-6";

  return (
    <ul
      className={`grid ${grid === 1 ? cols : grid === 2 ? cols2 : cols3} ${colsMd} ${colsLg} ${colsXl} ${colsXXl} ${colsXXXL} ${gapSizeMobile} md:${gapSize} ${margin} `}
    >
   
      {children}
    </ul>
  );
};
