class game{
    constructor ({
        dom
    }) {
        if (!dom) {
            console.error('请传参dom');
            return;
        }
        this.option = {
            size: [10, 10],
            name: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        }
        this.chooseContainer = null
        this.container = {
            containerArr: [],
            names: []
        }
        createjs.Ticker.timingMode = createjs.Ticker.RAF
        this.dom = dom
        this.canvas = document.createElement('canvas')
        this.boxWidth = Math.min(this.dom.offsetWidth, this.dom.offsetHeight)
        this.singleWidth = (this.boxWidth - 40) / Math.max(...this.option.size)
        this.canvas.width = this.boxWidth
        this.canvas.height = this.boxWidth
        this.dom.appendChild(this.canvas)
        // 舞台
        this.stage = new createjs.Stage(this.canvas)
        createjs.Ticker.on('tick', this.stage)
        this.createNames()
        this.createContent()
        this.events()
        // this.initLayout()
        // this.resize();
        // this.updateLoop();
        // this.update(this.data);
    }

    createContent () {
        for (let i = 0; i < this.option.size[0]; i++) {
            for (let j = 0; j < this.option.size[1]; j++) {
                // 容器
                let container = new createjs.Container();
                container.y = 0 + this.singleWidth * i
                container.x = 0 + this.singleWidth * j
                // container.mask = true
                container.cursor = 'pointer'
                // 方块
                let square = new createjs.Shape();
                square.name = 'square';
                square.graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, this.singleWidth, this.singleWidth);
                // 标题
                let title = new createjs.Text();
                title.x = this.singleWidth / 2
                title.y = this.singleWidth / 2
                title.name = 'title';
                title.textAlign = 'center';
                title.textBaseline = 'middle';
                title.font = `30px Arial`;
                // 随机方块名字
                let random = Math.floor(Math.random() * this.container.names.length)
                let text = this.container.names[random]
                this.container.names.splice(random, 1)
                container.name = title.text = text
                container.addChild(square, title);
                this.container.containerArr.push(container)
                this.stage.addChild(container);
            }
        }
    }

    // 生成随机名字
    createNames () {
        for (let i = 0; i < this.option.size[0] * this.option.size[1] / 2; i++) {
            let text = this.option.name[Math.floor(Math.random() * this.option.name.length)]
            this.container.names.push(text)
        }
        // 生成一对名称
        this.container.names = this.container.names.concat(this.container.names)
    }

    // 点击事件
    events () {
        let me = this
        this.stage.addEventListener('click', e => {
            // 判断点击的是否为同一个
            if (e.target.parent.checked) {
                e.target.parent.checked = false
                me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, this.singleWidth, this.singleWidth);
                me.chooseContainer.children[1].color = '#000'
                me.chooseContainer = null
                return
            }
            // 如果有选中，对比2者是否一样
            if (me.chooseContainer) {
                me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, this.singleWidth, this.singleWidth);
                me.chooseContainer.children[1].color = '#000'
                me.contrast(me.chooseContainer, e.target.parent)
                me.chooseContainer = null
            } else {
                me.checked(e.target.parent)
            }
            // console.log(e.target.parent.name, e.target.parent)
        })
        // window.addEventListener('resize', e => {
        //     console.log('a');
        // })
    }

    // 选中状态标记
    checked (target) {
        let me = this
        // 取消选中
        if (me.chooseContainer) {
            me.chooseContainer.checked = false
            me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, this.singleWidth, this.singleWidth);
            me.chooseContainer.children[1].color = '#000'
        }
        // 更改目标
        me.chooseContainer = target
        me.chooseContainer.checked = true
        me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.8)').beginStroke('red').rect(0, 0, this.singleWidth, this.singleWidth);
        me.chooseContainer.children[1].color = 'red'
    }

    // 对比点击的2个是否一样
    contrast (a, b) {
        let me = this
        if (a.name === b.name) {
            let clean = false
            // 同行或同列
            if (a.x === b.x || a.y === b.y) {
                clean = this.noBreakPoint(a, b)
            }
            // console.log(a.x, a.y, b.x, b.y, this.singleWidth);
            // console.log(this.stage.getObjectUnderPoint(30, 30))
            if (clean) {
                a.removeAllChildren()
                b.removeAllChildren()
            } else {
                me.chooseContainer.checked = false
            }
        } else {
            this.chooseContainer.checked = false
        }
    }
    noBreakPoint (a, b) {        
        if (a.x === b.x) {
            let flag = true
            let x = a.x
            let minY = Math.min(a.y, b.y),
                maxY = Math.max(a.y, b.y)
            for (let y = minY + this.singleWidth; y < maxY; y = y + this.singleWidth) {
                // x,y为左上角，应用中心点判断是否存在
                if (this.stage.getObjectUnderPoint(x + this.singleWidth / 2, y + this.singleWidth / 2)) {
                    flag = false
                    // return
                }
            }
            return flag
        } else if (a.y === b.y) {
            let flag = true
            let y = a.y
            let minX = Math.min(a.x, b.x),
                maxX = Math.max(a.x, b.x)
            for (let x = minX + this.singleWidth; x < maxX; x = x + this.singleWidth) {
                if (this.stage.getObjectUnderPoint(x + this.singleWidth / 2, y + this.singleWidth / 2)) {
                    flag = false
                    // return
                }
            }
            return flag
        } else {
            return false
        }
    }
}
