import { paths } from 'src/routes/paths';

export const HOST_API = import.meta.env.VITE_HOST_API;
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
