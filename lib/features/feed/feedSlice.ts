import { Post } from '@/lib/types/post';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface PostsPage {
  posts: Post[];
  page: number;
  pageSize: number;
  total: number;
}

interface FeedState {
  postsById: Record<string, Post>;
  feedIds: string[];
  nextPage: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState = {
  postsById: {},
  feedIds: [],
  nextPage: 1,
  loading: false,
  error: null,
  hasMore: true,
} satisfies FeedState as FeedState;

export const fetchPosts = createAsyncThunk<
  PostsPage,
  void,
  { state: RootState }
>(
  'feed/fetchPosts',
  async (_, { getState, signal }) => {
    const page = getState().feed.nextPage;
    const response = await fetch(`/api/posts?page=${page}`, { signal });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      throw new Error(
        body?.error ?? `Could not fetch posts (HTTP ${response.status}).`,
      );
    }

    return (await response.json()) as PostsPage;
  },
  {
    condition: (_, { getState }) => {
      const { loading, hasMore } = getState().feed;
      return !loading && hasMore;
    },
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, page, pageSize, total } = action.payload;

        for (const post of posts) {
          if (state.postsById !== null) {
            if (!state.postsById[post.id]) {
              state.feedIds.push(post.id);
            }

            state.postsById[post.id] = post;
          }
        }

        state.nextPage = page + 1;
        state.hasMore = page * pageSize < total;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;

        if (!action.meta.aborted && !action.meta.condition) {
          state.error = action.error.message ?? 'Could not fetch posts.';
        }
      });
  },
});

export const selectFeedPosts = (state: RootState) =>
  state.feed.feedIds.map((id) => state.feed.postsById[id]);

export default feedSlice.reducer;
