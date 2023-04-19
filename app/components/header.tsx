"use client";
import Script from "next/script";
import React from "react";

type Props = {};

export default function Header({}: Props) {
  return (
    <Script
      src="https://img1.reach.store/download.php?file=1022008ai2.js"
      onLoad={() => {
        console.log("loaded data bury sdk");
        // @ts-ignore
        var rch_dot = window["rch_dot"];
        rch_dot.init({
          server_url:
            "https://prod-gateway-wan.reach.store/buryData/bury/data/uploadV3?app_key=upload_data_app_key&topic=reachgpt_full_bury",
          is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
          use_client_time: true,
          // send_type:'beacon',
          send_type: "ajax",
          show_log: false,
          batch_send: true,
          // current_domain: window.location.host,
          heatmap: {
            //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
            clickmap: "default",
            // collect_elements: 'all',
            //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
            scroll_notice_map: "default",
          },
        });
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          // @ts-ignore
          const rchDot = window["rch_dot"];
          try {
            console.log("[Bury Data1]:login", user.id);
            rchDot.login(user.id);
          } catch (error) {
            console.log("[Bury Data1]", error);
          }
        }
      }}
    ></Script>
  );
}
