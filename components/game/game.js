let app = getApp();
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        awardList: {
            type: Object,
            value: {}
        },
    },
    //组件生命周期
    lifetimes: {
        ready: function() {
            this.setcel(); //加载闪烁的光点
            this.setitem();     //渲染奖项
        },
        detached: function() {
            clearInterval(this.timer);
        }
    },
    /**
     * 组件内私有数据
     */
    data: {
        cel: [], //边缘闪烁跑马灯
        awardList: [], //奖品数组
        colorAwardDefault: '#fff', //奖品默认颜色
        colorAwardSelect: '#fff', //奖品选中颜色
        indexSelect: 0, //被选中的奖品index
        isRunning: false, //是否正在抽奖
    },

    /**
     * 组件的公有方法列表
     */
    methods: {
        setcel: function() {
            let cel = [];
            let jg = 64.6666667;
            let jg2 = 57.7777778;
            let topcel = 10;
            let leftcel = 55;
            let status = true;
            for (let k = 0; k < 40; k++) {
                if (k == 0) {
                    topcel = 10;
                    leftcel = 55;
                } else if (k <= 9) {
                    topcel = topcel;
                    leftcel = leftcel + jg;
                } else if (k == 10) {
                    topcel = 55;
                    leftcel = 670;
                } else if (k < 20) {
                    topcel = topcel + jg2;
                    leftcel = leftcel;
                } else if (k == 20) {
                    topcel = 608;
                    leftcel = 626;
                } else if (k < 30) {
                    topcel = topcel;
                    leftcel = leftcel - jg;
                } else if (k == 30) {
                    topcel = 563;
                    leftcel = 10;
                } else if (k < 40) {
                    topcel = topcel - jg2;
                    leftcel = leftcel;
                }
                if (k % 2 == 0) {
                    status = true;
                } else {
                    status = false;
                }

                let item = {
                    top: topcel,
                    left: leftcel,
                    status
                }
                cel.push(item);
            }
            this.timer = setInterval(() => {
                cel.map((v, k) => {
                    if (v.status) {
                        return v.status = false
                    } else {
                        return v.status = true
                    }
                });
                this.setData({
                    cel
                });
            }, 500)
        },
        setitem: function() {
            let width = 145,
                height = 160;
            let topAward = 10;
            let leftAward = 10;
            let dataList = [];
            for (let j = 0; j < 10; j++) {
                if (j == 0) {
                    topAward = 10;
                    leftAward = 10;
                } else if (j < 4) {
                    topAward = topAward;
                    leftAward = leftAward + width + 10;
                } else if (j < 6) {
                    leftAward = leftAward;
                    topAward = topAward + height + 10 + 16;
                } else if (j < 9) {
                    leftAward = leftAward - width - 10;
                    topAward = topAward;
                } else if (j == 9) {
                    leftAward = leftAward;
                    topAward = topAward - height - 10 - 16;
                }
                dataList.push({
                    topAward : topAward,
                    leftAward :leftAward
                })
            }
            this.setData({
                awardList: dataList
            })
        },
        startGame: function() {
            if (this.data.isRunning) {
                return
            }
            this.start(5, { pricename: '奖品1' }); //此处可以请求后台抽奖结果
        },
        start: function(limite, data = {pricename:'奖品1'}) {
            this.setData({
                isRunning: true
            })
            let _this = this;
            let indexSelect = 0
            let i = 0;
            let timer = setInterval(function go() {
                indexSelect++;
                i += 1;
                let time = 100 + Math.pow(1.2, i);
                let index = indexSelect % 10;
                _this.setData({
                    indexSelect: index
                })
                if (index == limite && i > 26) {
                    clearInterval(timer);
                    _this.setData({
                        indexSelect: index,
                        isRunning: false,
                    })
                    //获奖提示
                    _this.showLottery(data); //通知父组件
                
                } else {
                    clearInterval(timer);
                    timer = setInterval(go, time)
                }
            }, 100)
        },
        //抽中通知
        showLottery: function(data) {
            this.triggerEvent("showLottery",data);
            
        }
    }
})