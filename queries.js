
const { Pool } = require('pg');
const bcrypt = require('bcrypt')


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'softjobs',
    port: '5432',
    allowExitOnIdle: true
})


const registerUser = async (user) => {

    let { email, bcryptPassword, rol, lenguage } = user
    const query = ' INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)';
    const values = [email, bcryptPassword, rol, lenguage]

    try {
        return await pool.query(query, values) 

    }
    catch (error) {
        console.log(error);
    }
}



const verifyUser = async (email, password) => {

    const values = [email]
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows: [users], rowCount } = await pool.query(query, values);
    if (!rowCount)
        throw { code: 404, message: 'El usuario no existe' };
    const { password: passwordEncrypted } = users;
    const correctPassword = bcrypt.compareSync(password, passwordEncrypted);
    if (!rowCount || !correctPassword) {

        throw { code: 401, message: "Email y/o contraseña inválidos" }

}

};

const profileView = async (email) => {

        const query = "SELECT * FROM usuarios WHERE email = $1";
        const values = [email];
        const { rows: [user] } = await pool.query(query, values);
        return user;

    }
    
module.exports = { registerUser, verifyUser, profileView }