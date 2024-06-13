import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yhdhvleomigkqkqiqpyi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZGh2bGVvbWlna3FrcWlxcHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1MjkxNDUsImV4cCI6MjAzMjEwNTE0NX0.zROIdKMB32Yy5Ljaj4U2PYA4duWZ4zNkQuX7MsIqIH4";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authApi = createApi({
  tagTypes: ["auth"],
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: supabaseUrl,
    prepareHeaders: (headers) => {
      headers.set('apikey', supabaseAnonKey);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginWithPassword: builder.mutation({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
        return { data };
      },
      invalidatesTags: ["auth"],
    }),
    signUpNewUser: builder.mutation({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
        return { data };
      },
      invalidatesTags: ["auth"],
    }),
  }),
});


export const { useLoginWithPasswordMutation, useSignUpNewUserMutation } = authApi;

export const postApi = createApi({
  tagTypes: ["post"],
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${supabaseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if (getState()?.authState?.session) {
        headers.set('Authorization', getState()?.authState?.session)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    postList: builder.mutation({
      queryFn: async () => {
        let { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
        return { data };
      },
      invalidatesTags: ["post"],
    }),
    postCreate: builder.mutation({
      queryFn: async (payload) => {
        const { data, error } = await supabase
          .from('posts')
          .insert([
            { ...payload },
          ])
          .select()
        if (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
        return { data };
      },
      invalidatesTags: ["post"],
    })
  }),
})

export const { usePostListMutation, usePostCreateMutation } = postApi;
