import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Review } from '@app/Review/Review';
import { DescriptionsPage } from '@app/Descriptions/Descriptions';
import { SchemasPage } from '@app/Schemas/Schemas';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Review />,
    exact: true,
    label: 'Review',
    path: '/',
    title: 'PatternFly Seed | Review Page',
  },
  {
    element: <DescriptionsPage />,
    exact: true,
    label: 'Write descriptions',
    path: '/descriptions',
    title: 'PatternFly Seed | Support Page',
  },
  {
    element: <SchemasPage />,
    exact: true,
    label: 'Write schemas',
    path: '/schemas',
    title: 'PatternFly Seed | Support Page',
  },
  {
    element: <GeneralSettings />,
    exact: true,
    label: 'Settings',
    path: '/settings',
    title: 'PatternFly Seed | General Settings',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
