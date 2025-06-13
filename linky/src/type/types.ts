export interface LinkTreeLink {
  id?: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  tree_id?: string;
}

export interface LinkTree {
  id: string;
  user_id: string;
  username: string;
  title: string | null;
  bio: string | null;
  theme: string;
  avatar_url: string | null;
  created_at: string;
}
