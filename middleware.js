import { NextResponse } from 'next/server';
import { neighborhoodViewPath } from '@/lib/neighborhoodViews';

// 301s for the old neighborhood property-type URLs (2026-10-05, per Ryan):
//   /neighborhoods/aquarina?propertyType=Condo -> /neighborhoods/aquarina/condos-for-sale
//   /neighborhoods/aripeka/land-for-sale        -> /neighborhoods/aripeka/lots-for-sale
// Other query parameters (price, beds, sort…) are kept. Type combinations
// without a clean URL (e.g. Home,Condo) stay on the query-string form.
export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  const landMatch = pathname.match(/^\/neighborhoods\/([^/]+)\/land-for-sale\/?$/);
  if (landMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/neighborhoods/${landMatch[1]}/lots-for-sale`;
    return NextResponse.redirect(url, 301);
  }

  const baseMatch = pathname.match(/^\/neighborhoods\/([^/]+)\/?$/);
  const propertyType = searchParams.get('propertyType');
  if (baseMatch && propertyType) {
    const viewPath = neighborhoodViewPath(baseMatch[1], propertyType);
    if (viewPath) {
      const url = request.nextUrl.clone();
      url.pathname = viewPath;
      url.searchParams.delete('propertyType');
      return NextResponse.redirect(url, 301);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/neighborhoods/:path*'],
};
