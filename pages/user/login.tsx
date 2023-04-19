import "../styles/globals.scss";
import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
import {
  FormInput,
  Input,
  Modal,
  Toast,
  showModalLogin,
  showToast,
} from "@/app/components/ui-lib";
import { IconButton } from "@/app/components/button";
import CopyIcon from "../../app/icons/copy.svg";
import UserIcon from "../../app/icons/chat.svg";
import axios from "axios";
import md5 from "md5";
import { setCookie } from "./utils";

export interface LoginParams {
  username: string;
  password: string;
}

export default function Login() {
  const [loginParams, setLoginParams] = useState({
    username: "",
    password: "",
  } as LoginParams);

  const login = async () => {
    try {
      const res = await axios.request({
        url: "https://sec.reach.store/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: loginParams.username,
          password: md5(loginParams.password),
        }),
      });
      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setCookie("token", res.data.token, 1);
        window.location.href = "/";
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 400) {
        showToast("用户名或密码错误");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className="login-modal-mask">
        <Modal
          title="登录 - ReachGPT"
          actions={[
            // <IconButton
            //   key="copy"
            //   icon={<CopyIcon />}
            //   bordered
            //   text={"取消"}
            //   onClick={() => {
            //     console.log(loginParams);
            //   }}
            // />,
            <IconButton
              key="download"
              icon={<UserIcon />}
              bordered
              text={"登录"}
              onClick={() => {
                login();
              }}
            />,
          ]}
          onClose={() => {}}
        >
          <div className={styles.loginBody}>
            <div className={styles.loginItem}>
              <span>用户名:</span>
              <FormInput
                value={loginParams.username}
                className={styles.loginInput}
                type="text"
                onChange={(val) => {
                  console.log(val);
                  setLoginParams({
                    password: loginParams.password,
                    username: val.target.value,
                  });
                }}
              ></FormInput>
            </div>
            <div className={styles.loginItem}>
              <span>密码:</span>
              <FormInput
                value={loginParams.password}
                className={styles.loginInput}
                type="password"
                onChange={(val) => {
                  console.log(loginParams);
                  setLoginParams({
                    username: loginParams.username,
                    password: val.target.value,
                  });
                }}
              ></FormInput>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
