const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const Car = sequelize.define('car',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    manufacturer:{type: DataTypes.STRING},
    model:{type: DataTypes.STRING},
    token:{type: DataTypes.STRING},
    user_token:{type: DataTypes.STRING},
    price:{type: DataTypes.INTEGER},
    production_year:{type: DataTypes.INTEGER},
})
const User = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    token:{type: DataTypes.STRING},
    credits:{type: DataTypes.INTEGER},
    login:{type: DataTypes.STRING},
    password:{type: DataTypes.STRING},
    name:{type: DataTypes.STRING},
    lastname:{type: DataTypes.STRING},
    phone:{type: DataTypes.INTEGER},
    email:{type: DataTypes.STRING},
})
const Rent = sequelize.define('rent',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    user_id:{type: DataTypes.INTEGER},
    car_id:{type: DataTypes.INTEGER},
    user_token:{type: DataTypes.STRING},
    start_rent_time:{type: DataTypes.STRING},
    end_rent_time:{type: DataTypes.STRING},
    start_rent_date:{type: DataTypes.STRING},
    end_rent_date:{type: DataTypes.STRING},
    cost:{type: DataTypes.INTEGER}
})
const Admin = sequelize.define('admin',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    login:{type: DataTypes.STRING},
    password:{type: DataTypes.STRING},
    email:{type: DataTypes.STRING},
    level:{type: DataTypes.INTEGER}
})
const Request = sequelize.define('request',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    car_id:{type: DataTypes.INTEGER},
    user_id:{type: DataTypes.INTEGER},
    user_token:{type: DataTypes.STRING},
    reason:{type: DataTypes.STRING},
    start_rent_time:{type: DataTypes.STRING},
    end_rent_time:{type: DataTypes.STRING},
    start_rent_date:{type: DataTypes.STRING},
    end_rent_date:{type: DataTypes.STRING},
})

User.hasMany(Rent)
Rent.belongsTo(User)

Car.hasMany(Rent)
Rent.belongsTo(Car)

User.hasMany(Request)
Request.belongsTo(User)

module.exports = {
    Car,
    User,
    Admin,
    Rent,
    Request,
}