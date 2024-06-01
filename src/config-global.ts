import { paths } from 'src/routes/paths';

export const HOST_API = import.meta.env.VITE_HOST_API;
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

export const CLOUDINARY_PRESET_KEY = import.meta.env.CLOUDINARY_PRESET_KEY;
export const CLOUDINARY_CLOUDNAME = import.meta.env.CLOUDINARY_CLOUDNAME;
export const CLOUDINARY_API_KEY = import.meta.env.CLOUDINARY_API_KEY;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
