<template>
  <div class="container">
    <div class="header button" @click="wechatLogin">
      <div class="left" v-bind:style="{backgroundImage:`url(${avatarUrl})`}"></div>
      <div class="middle">
        <div class="name">{{nickName}}</div>
        <div v-bind:class="{boy:gender===1,girl:gender===2}"></div>
      </div>
      <div class="right">
        <div class="text1">粉丝数:{{followers.length}}</div>
      </div>
    </div>
    <div class="main">
      <div class="item button" @click="item1Click">
        <div class="icon icon1"></div>
        <div class="text">我发出的动态</div>
      </div>
      <div class="item button" @click="item2Click">
        <div class="icon icon2"></div>
        <div class="text">通知</div>
        <div class="number-text" v-show="notifies.length>0">{{notifies.length>99?'···':notifies.length}}</div>
      </div>
      <div class="item button" @click="item3Click">
        <div class="icon icon3"></div>
        <div class="text">我的关注</div>
      </div>
        <div class="item button" @click="item4Click">
        <div class="icon icon4"></div>
        <div class="text">黑名单</div>
      </div>
      <div class="item button"  @click="item5Click">
        <div class="icon icon5"></div>
        <div class="text">我的粉丝</div>
      </div>
      <!-- <div class="item button">
        <div class="icon icon4"></div>
        <div class="text">我发出的回复</div>
      </div> -->
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
import store from "../helper/store";
import pageHelper from "./helper";
import events from "../helper/events";
export default {
  created: async function() {
    const userGet = await axios({
      url: `${config.url.feedUrl}/user/get`,
      withCredentials: true
    });
    config.user.fetching = false;
    this.prepared = true;
    // if (!userGet.data || !userGet.data._id) {
    //   window.location.href = config.url.oauthUrl;
    //   //未能获取到用户信息，location
    //   return;
    // }
    const {
      avatarUrl,
      nickName,
      gender,
      pass,
      _id,
      focus,
      followers,
      shields
    } = userGet.data;
    this.avatarUrl = avatarUrl;
    nickName === undefined
      ? (this.nickName = "点我登陆")
      : (this.nickName = nickName);

    this.gender = gender;
    config.user.focus = focus;
    config.user.followers = followers;
    config.user.shields = shields;
    config.user.oauth = true;
    config.user._id = _id;
    config.user.pass = pass;
    //web-socket 通过 之前的http请求获得了该用户的用户信息后,发送一条socket消息;
    events.$on("socketConnected", () => {
      this.$socket.emit("init", _id);
    });

    //查看 客户端 是否已经获得了用户信息
    const _this = this;
    async function checkPrepared() {
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (_this.prepared) {
            resolve("ok");
            clearInterval(intervalId);
          }
        }, 100);
      });
    }
    await checkPrepared();

    //接收服务器推送的 notify 消息
    this.$options.sockets.res = data => {
      store.notify.notifies = data;
      this.notifies = store.notify.notifies;
      console.log(`look:::::::`, this.notifies);
      events.$emit("newNotifies", store.notify.notifies);
    };
  },
  activated: async function() {
    this.notifies = store.notify.notifies;
    this.followers = config.user.followers;
  },
  data: function() {
    return {
      avatarUrl: "",
      nickName: "",
      gender: -1,
      prepared: false,
      followers: [],
      notifies: [],
      praiseNotifies: []
    };
  },
  methods: {
    wechatLogin: function() {
      window.location.href = config.url.oauthUrl;
    },
    item1Click: function() {
      this.$router.push({ name: "userThreadList" });
    },
    item2Click: function() {
      this.$router.push({ name: "notify" });
    },
    item3Click: function() {
      this.$router.push({ name: "focusPage" });
    },
    item4Click: function() {
      this.$router.push({ name: "shieldPage" });
    },
    item5Click: function() {
      this.$router.push({ name: "fansPage" });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  position: fixed;
}

.header {
  height: 15vh;
  border-top: 10px solid rgb(223, 223, 223);
  width: 100vw;
  display: flex;
  align-items: center;
  padding-left: 4vw;
  .left {
    width: 10vh;
    height: 10vh;
    border: 1px solid rgb(219, 219, 219);
    border-radius: 50%;
    background-size: 100% 100%;
  }
  .middle {
    margin-left: 8vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 5vw;
      margin-bottom: 1vw;
    }
    .boy {
      background-size: 100% 100%;
      width: 5vw;
      height: 5vw;
      background-image: url("../../assets/boy.png");
    }
    .girl {
      background-size: 100% 100%;
      width: 5vw;
      height: 5vw;
      background-image: url("../../assets/girl.png");
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    margin-left: 20vw;
    .text1 {
      font-size: 4vw;
      color: #59a181;
    }
  }
}
.main {
  display: flex;
  flex-direction: column;
  border-top: 7px solid rgb(223, 223, 223);
  .item {
    height: 9vh;
    display: flex;
    align-items: center;
    padding-left: 4vw;
    border-bottom: 1px solid rgb(223, 223, 223);
  }
  .icon {
    background-size: 100% 100%;
    height: 4vh;
    width: 4vh;
  }
  .number-text {
    height: 4.5vw;
    width: 4.5vw;
    background-color: rgb(248, 94, 94);
    border-radius: 50%;
    line-height: 4.5vw;
    font-size: 3vw;
    color: white;
    text-align: center;
    position: relative;
    left: -1.5vw;
    top: -2vw;
  }
  .text {
    margin-left: 5vw;
  }
  .icon1 {
    background-image: url("../../assets/note.png");
  }
  .icon2 {
    background-image: url("../../assets/letter.png");
  }
  .icon3 {
    background-image: url("../../assets/focus.png");
  }
  .icon4 {
    background-image: url("../../assets/blackList.png");
  }
  .icon5 {
    background-image: url("../../assets/fans.png");
  }
}
.button:active {
  background-color: #e0e0e0;
}
</style>


