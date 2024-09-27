import { ReactNode } from "react";

export interface Access {
  data: DataAccess;
}

interface DataAccess {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface Artist {
  id: string;
  name: string;
  popularity: number;
}

export interface AlbumData {
  name: string;
  tracks: {
    items: Tracks[];
  };
  artists: Artist[];
  id: string;
}

export interface Tracks {
  artists: [
    {
      name: string;
    }
  ];
  name: string;
  id: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
  error: string;
}

export interface UserData {
  display_name: string;
  id: string;
}

export interface PlaylistData {
  total: number;
  items: Playlist[];
}

export interface Playlist {
  id: string;
  name: string;
  tracks: {
    href: string;
    total: number;
  };
  owner: UserData;
}

export interface AuthContextProps {
  children: ReactNode;
}

export interface searchResponse {
  tracks: {
    items: Tracks[];
    total: number;
    next: string;
  };
  artists: {
    items: Artist[];
    total: number;
    next: string;
  };
  albums: {
    items: AlbumData[];
    total: number;
    next: string;
  };
}

// make sure to put the type for auth context back here eventually

//

export interface genreStateForm {
  pop: Artist[];
  rock: Artist[];
  indie: Artist[];
  hiphop: Artist[];
  rnb: Artist[];
}
