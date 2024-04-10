const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { loginModel } = require('./backend/model/login');
const { userModel } = require('./backend/model/user');


mongoose.connect(process.env.MONGO_DB_URL + process.env.MONGO_DB_NAME)
.then(() => {
    console.log("Connected to database!");
})
.catch(err => {
    console.log("Connection failed!"); console.log(err);
});

mongoose.connection.on('error', err => {
    console.log(err);
})

const password = '20.04.2024';
bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
.then(async function (hashedPassword) {
    try {
        var user_res = await userModel.create({
            code: 'Admin01',
            phone: '1111111111',
            name: 'Admin',
            email: 'thecrownsattire@gmail.com',
            active: true
        });
        await loginModel.create({
            refName: 'master_user',
            refID: user_res._id,
            email: 'thecrownsattire@gmail.com',
            password: hashedPassword,
            active: true
        });
        console.log('Admin created successfully');
    } catch(err) {
        console.log(err);
    }
})
.catch(function (err) {
    console.log(err);
});