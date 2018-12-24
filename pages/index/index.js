//index.js
//获取应用实例
let app = getApp()
Page({
    data: {
        awardList: [], //奖品数组
        colorAwardDefault: 'rgb(255,162,0)', //奖品默认颜色
        colorAwardSelect: 'rgb(249,74,36)', //奖品选中颜色
        indexSelect: 0, //被选中的奖品index
        isRunning: false, //是否正在抽奖
        imageAward: [
            '../../images/1.jpg',
            '../../images/2.jpg',
            '../../images/3.jpg',
            '../../images/4.jpg',
            '../../images/5.jpg',
            '../../images/6.jpg',
            '../../images/7.jpg',
            '../../images/8.jpg',
            '../../images/1.jpg',
            '../../images/2.jpg'
        ], //奖品图片数组
    },

    onLoad: function() {
        //奖品item设置
        let awardList = [];
        //间距,怎么顺眼怎么设置吧.
        let width = 147.5,height = 140;
        let topAward = 20;
        let leftAward = 20; 
        for (let j = 0; j < 10; j++) {
            if (j == 0) {
                topAward = 20;
                leftAward = 20;
            } 
            else if (j < 4) {
                topAward = topAward;
                leftAward = leftAward + width + 20;
            } 
            else if (j < 6) {
                leftAward = leftAward;
                topAward = topAward + height + 20;
            } 
            else if (j < 9) {
                leftAward = leftAward - width - 20;
                topAward = topAward;
            } 
            else if (j == 9) {
                leftAward = leftAward;
                topAward = topAward - height - 20;
            }
            let imageAward = this.data.imageAward[j];
            awardList.push({
                topAward: topAward,
                leftAward: leftAward,
                imageAward: imageAward
            });
        }
        this.setData({
            awardList: awardList
        })
    },
    startGame:function(){
        if (this.data.isRunning) return
        let that = this;
        wx.showLoading({
            icon:'none',
            title: '请稍等...',
        })
        setTimeout(()=>{
            wx.hideLoading();
            let resindex = 3; //服务器返回商品index
            that.start(resindex);
        },0)
    },
    start: function (limite) {
        this.setData({
            isRunning: true
        })
        let _this = this;
        let indexSelect = 0
        let i = 0;
        let timer = setInterval(function go() {
            indexSelect++;
            i += 1;
            let time = 100+Math.pow(1.2, i);
            let index = indexSelect % 10;
            _this.setData({
                indexSelect: index
            })
            if (index == limite && i > 30) {
                //去除循环
                clearInterval(timer)
                //获奖提示
                wx.showModal({
                    title: '恭喜您',
                    content: '获得了第' + (_this.data.indexSelect + 1) + "个优惠券",
                    showCancel: false, //去掉取消按钮
                    success: function (res) {
                        if (res.confirm) {
                            _this.setData({
                                isRunning: false,
                                indexSelect:0
                            })
                        }
                    }
                })
            }
            else{
                clearInterval(timer);
                timer = setInterval(go,time)
            }
        }, 100)
    },
})