export interface NewDbJokeLike {
  joke_id: number;
  user_id: number;
  is_like: boolean;
}

export interface DbJokeLike extends NewDbJokeLike {
  id: number;
}

export interface NewJokeLike {
  jokeId: number;
  userId: number;
  isLike: boolean;
}

export interface JokeLike extends NewJokeLike {
  id: number;
}

export type FilterJokesLikes = Partial<JokeLike>;

export interface JokeIdWithRatingDb {
  joke_id: number;
  rating: number;
}