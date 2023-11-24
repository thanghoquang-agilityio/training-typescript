export const ROUTES = {
  homePage: '/',
  favoritesPage: '/favorites.html',
  trendingPage: '/trending.html',
};

export const SIDEBAR_LIST = [
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

export const NAVBAR_LIST = [
  { category: 'movies', title: 'Movies' },
  { category: 'series', title: 'Series' },
  { category: 'documentaries', title: 'Documentaries' },
];
