const express = require('express')
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const bcrypt = require('bcrypt')


app.listen(3000, console.log("Server on"))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


const { report } = require('./middlewares');
const { registerUser, verifyUser, profileView } = require('./queries');


app.post("/usuarios", async (req, res) => {

    const { email, password, rol, lenguage } = req.body;

    try {

        const bcryptPassword = await bcrypt.hash(password, 10);

        console.log("Contraseña encriptado: ", bcryptPassword)

        const rows = await registerUser({ email, bcryptPassword, rol, lenguage });

        console.log(rows)
        return res.json("Usuario registrado.");
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }

});

app.post('/login',report, async (req, res) => {

    const { email, password } = req.body;
    await verifyUser(email, password);
    
    const token = jwt.sign({ email }, 'secretKey') 
    res.send(token);
}
)

app.get("/usuarios", report, async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "MiContraseñaSecreta")

        const productos = await obtenerProductos()
        res.send(productos)


    } catch (error) {
        res.status(error.code || 500).send(error)

    }
})


