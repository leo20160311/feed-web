export default {
    url: {
        oauthUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fd6bbc89436a5ee&redirect_uri=https%3a%2f%2fneau-lib.xiaonei.io%2ffeed%2foauth%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
        feedUrl: 'https://neau-lib.xiaonei.io/feed',
        socketUrl: "wss://neau-lib.xiaonei.io",
        appId: "wx9fd6bbc89436a5ee",
        // oauthUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fd6bbc89436a5ee&redirect_uri=http://feedserver.feit.me/oauth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
        // feedUrl: 'http://feedServer.feit.me',
        // socketUrl: "ws://feedServer.feit.me",
        // appId: 'wx9fd6bbc89436a5ee',
    },
    videoVframe: '&vframe/jpg/offset/0/rotate/auto',
    //全局user
    user: {
        oauth: false,
        //前端页面正在从后台服务器获取用户信息
        fetching: false,
        _id: '',
        pass: false,
        focus: [],
        followers: [],
        shields: [],
    },
}