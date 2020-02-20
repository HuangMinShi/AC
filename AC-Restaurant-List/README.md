# Restaurant List
蒐集各地美食餐廳資料庫，快速瀏覽各式餐廳及評價星數，點擊後進一步查看詳細資訊，也能搜尋或排序特定餐廳名稱或分類，另外更可以新增口袋餐廳名單唷。

## Features
* 使用者可以註冊/登入/登出帳戶
* 使用者可以使用Facebook登入帳戶
* 使用者可以新增單筆餐廳
* 使用者可以瀏覽全部餐廳列表
* 使用者可以查看單筆餐廳詳細資訊
* 使用者可以修改單筆餐廳內容
* 使用者可以刪除單筆餐廳
* 使用者可以搜尋特定餐廳名稱或類別
* 使用者可以依照餐廳名稱、類別及評分排序

## Preview pages
![preview](/public/images/login_page.jpg)
![preview](/public/images/show_page.jpg)

## Environment and package used
* [Node.js](https://nodejs.org/en/) v10.15.0
* [Express.js](https://expressjs.com/) v4.17.1
* [express-handlebars](https://www.npmjs.com/package/express-handlebars) v3.1.0
* [Font Awesome](https://fontawesome.com/) v5.8.1
* [Bootstrap](https://getbootstrap.com/) v4.3.1
* [MongoDB](https://www.mongodb.com/download-center/community) v4.0.12
* [mongoose](https://mongoosejs.com/) v5.6.12
* [method-override](https://www.npmjs.com/package/method-override) v3.0.0
* [express-session](https://www.npmjs.com/package/express-session) v8.1.0
* [passport](https://www.npmjs.com/package/passport) v0.4.0
* [passport-local](https://www.npmjs.com/package/passport-local) v1.0.0
* [passport-facebook](https://www.npmjs.com/package/passport-facebook) v3.0.0
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) v2.4.3
* [connect-flash](https://www.npmjs.com/package/connect-flash) v0.1.1
* [dotenv](https://www.npmjs.com/package/dotenv) v1.16.2

## Installation and usage
**於終端機輸入指令複製專案**
```git=
git clone https://github.com/HuangMinShi/restaurant_list_db.git
```

**切換至專案資料夾**
```=
cd restaurant_list_db_sort
```

**安裝專案運行環境**
```npm=
npm i express
```

**安裝 [MongoDB Community Server](https://www.mongodb.com/download-center/community) 並啟動資料庫**

**安裝專案套件**
```npm=
npm i nodemon mongoose method-override express-session passport passport-local passport-facebook bcryptjs connect-flash dotenv
```

**使用Facebook登入請於專案根目錄中新建.env檔案並設置環境變數**
```
FACEBOOK_ID = ******
FACEBOOK_SECRET = ******
FACEBOOK_CALLBACK = http://localhost:3000/auth/facebook/callback
```

**創造資料庫種子資料並啟動伺服器**
```npm=
npm run addSeed
npm run dev
```
**測試Email及Password**
- email: user1@example.com 
password: 12345678
- email: user2@example.com 
password: 12345678

**於瀏覽器輸入URL**
```
http://localhost:3000
```
