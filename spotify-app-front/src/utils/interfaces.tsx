export interface Access {
  data: DataAccess;
}

interface DataAccess {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface AlbumData {
  name: string;
  tracks: {
    items: TrackList[];
  };
}

interface TrackList {
  items: Tracks[];
}

interface Tracks {
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
}

export interface UserData {
  display_name: string;
  id: string;
}
