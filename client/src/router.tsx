import { createBrowserRouter } from "react-router-dom";
import { UpdateArtistPage } from './pages/artist/update/UpdateArtistPage';
import { CreateArtistPage } from './pages/artist/create/CreateArtistPage';
import { Home } from './pages/Home';

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