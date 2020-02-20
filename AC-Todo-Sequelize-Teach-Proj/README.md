# Simple Todo List
使用Node.js, Express 及 MySQL 實作的 web app

## Features
1. 使用者可以在首頁瀏覽待辦清單
2. 使用者可以新增一筆待辦事項
3. 使用者可以編輯待辦事項的內容 (一次只能編輯一筆)
4. 使用者可以刪除任何一筆待辦事項 (一次只能刪除一筆)
5. 使用者可以透過 email 及 password 註冊並登入
6. 使用者可以透過 Facebook 帳號登入
7. 使用者必須登入後才可以建立專屬於自己的待辦清單

## Environment and package used
* [Node.js](https://nodejs.org/en/) v10.15.0
* [Express.js](https://expressjs.com/) v4.17.1
* [express-handlebars](https://www.npmjs.com/package/express-handlebars) v3.1.0
* [Bootstrap](https://getbootstrap.com/) v4.3.1
* [method-override](https://www.npmjs.com/package/method-override) v3.0.0
* [express-session](https://www.npmjs.com/package/express-session) v8.1.0
* [passport](https://www.npmjs.com/package/passport) v0.4.0
* [passport-local](https://www.npmjs.com/package/passport-local) v1.0.0
* [passport-facebook](https://www.npmjs.com/package/passport-facebook) v3.0.0
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) v2.4.3
* [connect-flash](https://www.npmjs.com/package/connect-flash) v0.1.1
* [dotenv](https://www.npmjs.com/package/dotenv) v1.16.2
* [mysql2](https://www.npmjs.com/package/mysql2) v1.7.0
* [sequelize](https://sequelize.org/master/) v5.19.2
* [sequelize-cli](https://sequelize.org/master/) v5.5.1

## Installation and usage
**複製專案**
```git
git clone https://github.com/HuangMinShi/AC3-todo-sequelize-teach-proj.git
```

**切換專案**
```git
cd todo-sequelize
```

**安裝環境**
```npm
npm i express
```

**安裝[MySQL](https://dev.mysql.com/downloads/windows/installer/)並啟動資料庫**
1. MySQL workbench 輸入
```sql
drop database if exists todo_sequelize;
create database todo_sequelize;
use todo_sequelize;
```
2. command 輸入並建立資料綱要
```npm
npx sequelize-cli db:migrate
```
3. command 輸入並建立種子資料
帳號:user1@example.com
密碼:123
```npm
npx sequelize-cli db:seed:all
```
4. commmand 輸入並刪除種子資料
```npm
npx sequelize-cli db:seed:undo:all
```

**修改config.json**
```json
"development": {
  "username": "root",
  "password": "${安裝SQL設定的password}",
  "database": "todo_sequelize",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

**安裝專案套件**
```npm
npm i express-handlebars express body-parser nodemon mongoose method-override express-session passport passport-local passport-facebook bcryptjs connect-flash dotenv mysql2 sequelize sequelize-cli
```

**Facebook登入須於根目錄新增`.env`檔，並設置環境變數**
```
FACEBOOK_ID = ******
FACEBOOK_SECRET = ******
FACEBOOK_CALLBACK = http://localhost:3000/auth/facebook/callback
```
 
**啟動伺服器**
```npm
npm run dev
```

**輸入URL**
```
http://localhost:3000
```
