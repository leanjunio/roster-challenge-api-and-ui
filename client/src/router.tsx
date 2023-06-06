import { createBrowserRouter } from "react-router-dom";
import { UpdateArtistPage } from './pages/artist/update';
import { CreateArtistPage } from './pages/artist/create';
import { Home } from './pages/home';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/artists/",
    element: <CreateArtistPage />
  },
  {
    path: "/artists/:id",
    element: <UpdateArtistPage />
  },
])