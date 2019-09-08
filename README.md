# Restaurant List
蒐集各地美食餐廳資料庫，快速瀏覽各式餐廳及評價星數，點擊後進一步查看詳細資訊，也能搜尋特定餐廳名稱或分類。

## Features
* 使用者可以新增單筆餐廳
* 使用者可以瀏覽全部餐廳列表
* 使用者可以查看單筆餐廳詳細資訊
* 使用者可以修改單筆餐廳內容
* 使用者可以刪除單筆餐廳
* 使用者可以搜尋特定餐廳名稱或類別

## Preview pages
![preview](/images/index_page.png)
![preview](/images/show_page.png)

## Environment and package used
* [Node.js](https://nodejs.org/en/) v10.15.0
* [Express.js](https://expressjs.com/) v4.17.1
* [express-handlebars](https://www.npmjs.com/package/express-handlebars) v3.1.0
* [Font Awesome](https://fontawesome.com/) v5.8.1
* [Bootstrap](https://getbootstrap.com/) v4.3.1
* [MongoDB](https://www.mongodb.com/download-center/community) v4.0.12
* [mongoose](https://mongoosejs.com/) v5.6.12

## Installation and usage
**於終端機輸入指令複製專案**
```git=
git clone https://github.com/HuangMinShi/restaurant_list_db.git
```

**切換至專案資料夾**
```=
cd restaurant_list_db
```

**安裝專案運行環境**
```npm=
npm i express
```

**安裝 MongoDB Community Server 並啟動資料庫**
[MongoDB Community Server](https://www.mongodb.com/download-center/community)


**安裝專案套件**
```npm=
npm i nodemon
npm i mongoose
```

**創造資料庫種子資料並啟動伺服器**
```npm=
npm run addSeed
npm run dev
```

**於瀏覽器輸入URL**
```
http://localhost:3000
```