// custom-tab-bar/index.js
var list = ''

Component({
    properties: {},
    data: {
        //当前高亮项
        selected: 0,
        //tabBar页面数据
        tabList: [{
                "pagePath": "pages/index/index",
                "text": "首页"
            },
            {
                "pagePath": "pages/user/user",
                "text": "我的"
            }
        ],
        scanResults: [],
        markers: [],
        currentMarker: null
    },
    attached: function () {},
    methods: {
        //底部切换
        switchTab(e) {
            let key = Number(e.currentTarget.dataset.index);
            let tabList = this.data.tabList;
            let selected = this.data.selected;

            if (selected !== key) {
                this.setData({
                    selected: key
                });
                wx.switchTab({
                    url: `/${tabList[key].pagePath}`,
                })
            }
        },

        toSquare(){
            wx.navigateTo({
              url: '/pages/square/square',
            })
        }

    }
})