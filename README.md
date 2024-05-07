# MongoDB Transactions in NodeJS

Setting up environment
- Open .env file
- Add `DATABASE_URL` for mongodb, make sure to include /db-name at the end

Your final url should look like this 
`mongodb://<yourusername>:<yourpassword>@<yourhost>/<yourdb>`

### Installing dependencies
```
npm install
```

#### Running Prisma Transaction file
```
npx prisma generate
node prisma.js
```

#### Running Mongoose Transaction file
```
node mongoose.js
```

