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
        this.canvas.width = this.dom.offsetWidth
        this.canvas.height = this.dom.offsetHeight
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
                container.y = 100 + 50 * i
                container.x = 100 + 50 * j
                // container.mask = true
                container.cursor = 'pointer'
                // 方块
                let square = new createjs.Shape();
                square.name = 'square';
                square.graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, 50, 50);
                // 标题
                let title = new createjs.Text();
                title.x = 25
                title.y = 25
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
            // 如果有选中，对比2者是否一样
            if (me.chooseContainer) {
                me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, 50, 50);
                me.chooseContainer.children[1].color = '#000'
                me.contrast(me.chooseContainer, e.target.parent)
                me.chooseContainer = null
            } else {
                me.checked(e.target.parent)
            }
            // console.log(e.target.parent.name, e.target.parent)
        })
    }

    // 选中状态标记
    checked (target) {
        let me = this
        // 取消选中
        if (me.chooseContainer) {
            me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.1)').beginStroke('red').rect(0, 0, 50, 50);
            me.chooseContainer.children[1].color = '#000'
        }
        // 更改目标
        me.chooseContainer = target
        me.chooseContainer.children[0].graphics.clear().beginFill('rgba(0,0,0,0.8)').beginStroke('red').rect(0, 0, 50, 50);
        me.chooseContainer.children[1].color = 'red'
    }

    // 对比点击的2个是否一样
    contrast (a, b) {
        if (a.name === b.name) {
            a.removeAllChildren()
            b.removeAllChildren()
        }
    }
}
