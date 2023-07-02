const mongoose = require('mongoose')

// 连接数据库
mongoose.connect("mongodb://localhost:27017/db1")// 数据库db1
.then( res =>{
    console.log(res+'数据库连接成功！')
})
.catch(err =>{
    console.log('数据库连接失败！',err)
})


// 创建用户色库
const usersWHSchema = new mongoose.Schema({
    _openid:{
        type:String
    },
    colors:{
        type:Array
    }
})

// 创建国风色库
const cStyleColorSchema = new mongoose.Schema({
    CMYK:{
        type:Array
    },
    RGB:{
        type:Array
    },
    hex:{
        type:String
    },
    name:{
        type:String
    },
    pinyin:{
        type:String
    }
})

// 创建颜色组合库
const colorCombinationSchema = new mongoose.Schema({
    combination:{
        type:Array
    },
    name:{
        type:String
    },
    type:{
        type:String
    }
})

//将字段写入表
const usersWH = mongoose.model('usersWH',usersWHSchema)
const cStyleColor = mongoose.model('cStyleColor',cStyleColorSchema)
const colorCombination = mongoose.model('colorCombination',colorCombinationSchema)


// 给表添加元素
// usersWH.create({
//     _openid:'1111',
//     colors:[
//     ]
// })


module.exports = {
    usersWH,
    cStyleColor,
    colorCombination
}