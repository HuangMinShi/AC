# Restaurant Forum
目標：建立餐廳論壇，幫助使用者找到心儀的餐廳並建立使用者評論及收藏的互動功能。  
工具：Node.js, Express, MySQL and other Node packages

## Features
| Role | Features | URL  |
|:----:|----------|------|
| 使用者 | 可以註冊網站 | /signup |
| 使用者 | 可以登入網站 | /signin |
| 使用者 | 可以登出網站 | /logout |
| 使用者 | 可以瀏覽所有餐廳 | /restaurants |
| 網站管理者 | 可以新增一筆餐廳 | /admin/restaurants/create |
| 網站管理者 | 可以瀏覽所有餐廳 | /admin/restaurants |
| 網站管理者 | 可以查看一筆餐廳 | /admin/restaurants/:id |
| 網站管理者 | 可以更新一筆餐廳 | /admin/restaurants/:id/edit |
| 網站管理者 | 可以移除一筆餐廳 | /admin/resturants/:id |
| 網站管理者 | 可以瀏覽所有使用者  | /admin/users |
| 網站管理者 | 可以更新一位使用者權限 | /admin/users/:id |

## Environment and package used
- [Node.js v10.15.0](https://nodejs.org/en/)
- [Express.js v4.17.1](https://expressjs.com/)
- [express-handlebars v3.1.0](https://www.npmjs.com/package/express-handlebars)
- [method-override v3.0.0](https://www.npmjs.com/package/method-override)
- [body-parser v1.19.0](https://www.npmjs.com/package/body-parser)
- [express-session v1.17.0](https://www.npmjs.com/package/express-session)
- [passport v0.4.0](https://www.npmjs.com/package/passport)
- [passport-local v1.0.0](https://www.npmjs.com/package/passport-local)
- [bcryptjs v2.4.3](https://www.npmjs.com/package/bcryptjs)
- [connect-flash v0.1.1](https://www.npmjs.com/package/connect-flash)
- [mysql2 v2.0.0](https://www.npmjs.com/package/mysql2)
- [sequelize v5.21.1](https://www.npmjs.com/package/sequelize)
- [sequelize-cli v5.5.1](https://www.npmjs.com/package/sequelize-cli)
- [multer v1.4.2](https://www.npmjs.com/package/multer)
- [faker v4.1.0](https://www.npmjs.com/package/faker)
- [imgur-node-api v0.1.0](https://www.npmjs.com/package/imgur-node-api)
- [Bootstrap v4.1.3](https://getbootstrap.com/)

## Usage
**1.複製專案**

```git
git clone https://github.com/HuangMinShi/AC4-restauant-forum.git
```

**2.切換資料夾**

```git
cd AC4-restauant-forum-master
```

**3.安裝套件**

```npm
npm i express express-handlebars body-parser method-override express-session passport passport-local bcryptjs connect-flash mysql2 sequelize sequelize-cli faker imgur-node-api multer
```

**4.安裝資料庫 [MySQL](https://dev.mysql.com/downloads/windows/installer/)**

  1. MySQL Workbench 輸入（新增資料庫）

  ```sql
  drop database if exists forum;
  create database forum;
  use forum;
  ```
  
  2. cls 輸入（建立資料綱要）

  ```npm
  npx sequelize db:migrate
  ```

  3. cls 輸入（建立種子資料）

  ```npm
  npx sequelize db:seed:all
  ```

  4. cls 輸入（刪除種子資料）

  ```npm
  npx sequelize db:seed:undo:all
  ```

**5.修改config.json**

```json
"development": {
  "username": "root",
  "password": "${於安裝SQL時所設定的password}",
  "database": "forum",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```
 
**6.啟動伺服器**

```npm
npm run dev
```

**7.輸入URL**

```
http://localhost:3000
```

## Others 

**Deployment**

專案佈署於 heroku：
[https://still-thicket-32115.herokuapp.com/signin](https://still-thicket-32115.herokuapp.com/signin)

**Testing account**

- For admin：
  - email: root@example.com
  - password: 12345678
- For user：
  - email: user1@example.com
  - password: 12345678
