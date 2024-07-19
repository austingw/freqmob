export type UserLike = {
  postId: number;
  liked: boolean;
};

export type UserLikeResponse = {
  status: number;
  data: UserLike;
  message: string;
};

export type UserLikesResponse = {
  status: number;
  data: UserLike[];
  message: string;
};

export type UpdateProfile = {
  avatar: string;
  bandcamp: string;
  soundcloud: string;
  spotify: string;
  website: string;
};
