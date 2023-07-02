// 引入库...
const express = require('express')
const app = express()
const { usersWH } = require('./dbTest')
const { cStyleColor } = require('./dbTest')
const { colorCombination } = require('./dbTest')
const request = require('request')
const { response } = require('express')

//封装数据
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Get请求使用res.query来获取data，Post请求使用res.body来获取data

//用户登录
app.get("/api/login", async (req, res) => {
    const { code } = req.query
    if (code) {
        request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxb52875ebec86d053&secret=d84506107b10f2d5fff17bc03d966756&js_code=${code}&grant_type=authorization_code`
        }, (err, response, data) => {
            res.send(data)
        })
    }

})


//添加用户记录
app.post('/api/addUser', async (req, res) => {
    try {
        const { _openid, colors } = req.body
        const result = await usersWH.create(req.body);
        res.send(result);
    } catch (err) {
        res.send('fail');
    }
})


// 获取国风色库
app.post('/api/getcStyleColor', async (req, res) => {
    try {
        const { pageNum, pageSize } = req.body
        const result = await cStyleColor.find().skip((pageNum - 1) * pageSize).limit(pageSize) //分页查询
        const count = await cStyleColor.countDocuments();
        res.send({ result })
    } catch (err) {
        res.send('查询失败：', err)
    }
})

// 获取用户色库
app.post('/api/usersWH', async (req, res) => {
    try {
        const { _openid } = req.body
        const result = await usersWH.find({
            '_openid': _openid
        })
        res.send(result)
    } catch (err) {
        res.send('查询失败：', err)
    }
})

// 获取颜色组合库
app.post('/api/colorCombination', async (req, res) => {
    try {
        const { pageNum, pageSize } = req.body
        const result = await colorCombination.find().skip((pageNum - 1) * pageSize).limit(pageSize) //分页查询
        res.send(result)
    } catch (err) {
        res.send('查询失败：', err)
    }
})

//更新个人色库
app.post('/api/updateColor', async (req, res) => {
    try {
        const { colors, id } = req.body
        await usersWH.findByIdAndUpdate(id, {
            colors
        })
        res.send('更新成功')
    } catch (err) {
        res.send('更新失败：', err)
    }
})

// 删除数据库文档
// app.post('/api/delate', async (req, res) => {
//     try {
//         const result = await colorCombination.remove({ 'type': 'gradient' },1)
//         res.send('删除成功',result)
//     } catch (err) {
//         res.send('失败：', err)
//     }

// })


//色彩转换接口转发
app.post('/api/convertApi', async (req, res) => {
    try {
        const { r, g, b, method } = req.body
        request.post({
            url: 'https://www.qtccolor.com/tool/converter.aspx',
            form: {
                r: r,
                g: g,
                b: b,
                method: method,
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body)
            }
        })
    } catch (err) {
        res.send('转发失败：', err)
    }
})

//渐变色库接口转发
app.get('/api/gradientColorsApi', async (req, res) => {
    try {
        request.get({
            url: 'https://uigradients.com/static/js/app.53b91acd33d920dc4ee4.js',

        }, function (error, response, query) {
            if (!error && response.statusCode == 200) {
                //处理数据
                var data = query

                //截取指定字段后面
                const data2 = data.lastIndexOf(`[{name:"Blu"`)
                const resut = data.substring(data2, data.length)

                //截取指定前面
                let c1 = resut.indexOf(`},function(e,t,n){"use strict";`)
                let c2 = resut.substring(0, c1);

                var result = c2.replaceAll('name', '"name"').replaceAll('colors', '"colors"')
                let list = []
                list = JSON.parse(result)
                res.send(list)
                //res.send(query)
            }
        })
    } catch (err) {
        res.send('转发失败：', err)
    }
})



app.listen(3000, () => {
    console.log('server 3000 runing!')
})