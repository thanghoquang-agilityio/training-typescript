import ROUTES from './routes';

const SIDEBAR_LIST = [
  {
    path: ROUTES.homePage,
    iconName: 'film',
    title: 'Home',
  },
  {
    path: ROUTES.favoritesPage,
    iconName: 'heart-sidebar',
    title: 'Favorites',
  },
  {
    path: ROUTES.trendingPage,
    iconName: 'trending',
    title: 'Trending',
  },
  {
    path: 'javascript:void(0)',
    iconName: 'calendar',
    title: 'Coming soon',
  },
];

export default SIDEBAR_LIST;
