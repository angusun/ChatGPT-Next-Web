"use client";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Router from "next/router";
import { eraseCookie } from "@/common/utils";

export interface User {
  username: string;
  realname: string;
  email: string;
  avatar: string;
  role: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface UserControlStore {
  user: User;
  getInfo: () => void;
}

export const ACCESS_KEY = "user-control";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useUserStore = create<UserControlStore>()(
  persist(
    (set, get) => ({
      user: {} as User,
      async getInfo() {
        if (fetchState > 0) return;
        fetchState = 1;
        try {
          const res = await axios.request({
            url: "/api/user-info",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("getInfo process");
          if (res.status === 200 && res.data) {
            set(() => ({ user: res.data }));
          }
        } catch (error: any) {
          ("use client");
          console.log(401);
          console.log(error.response);
          localStorage.removeItem("token");
          eraseCookie("token");
          if (process.browser) {
            //Runs only on client side
            // Router.push("/user/login");
            window.location.href = "/user/login";
          }
        }

        fetchState = 2;
      },
    }),
    {
      name: ACCESS_KEY,
      version: 1,
    },
  ),
);