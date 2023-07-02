// pages/test3/test3.js

var pageNum = 1;
var pageSize = 20;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        colors: [],
        searchList:[],
        rgb: '',
        check: false,
        searchName:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('当前页数：',pageNum)
        this.getColor()
    },

    getColor() {
        wx.showLoading({
            title: '颜色加载中...'
        })
        if (this.data.check == false) {
            wx.request({
                url: 'http://localhost:3000/api/getcStyleColor',
                method:'POST',
                data:{
                    pageNum: pageNum,
                    pageSize: pageSize
                },
                success: res => {
                    this.setData({
                        colors : this.data.colors.concat(res.data.result),
                    })
                    if(this.data.searchName == ''){
                        this.search(this.data.colors,this.data.searchName)
                    }
                    pageNum += 1;
                },
                complete: () => {
                    wx.hideLoading()

                }
            })
        } 

    },

    onChange(event) {
        this.setData({
            searchName: event.detail
        })
        this.search(this.data.colors,this.data.searchName)
      },

    //模糊查询
    search(List, searchText) {
        var result = [];
        for (var i = 0; i < List.length; i++) {
            if (List[i].name.indexOf(searchText) >= 0) {
                result.push(List[i]);
            }
        }
        this.setData({
            searchList: result
        })

        if (this.data.searchList.length == 0) {
            wx.showToast({
                title: "没有相关颜色！",
                icon: 'error'
            })
        }
    },

    //点击复制颜色
    copy(e) {
        console.log(e)
        wx.setClipboardData({
            data: "color:"+e.currentTarget.dataset.color,
            success: function (res) {
                wx.showToast({
                    title: '颜色复制成功',
                    icon: 'success'
                })
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    
    //回到顶部
    handleBackTop() {
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if(this.data.searchName == ''){
            console.log('当前页数：',pageNum)
        this.getColor()
        }
    },
})