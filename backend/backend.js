const express = require('express')
const mysql = require('mysql')
var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json());
app.use(express.static('kepek'))

var connection
function kapcsolat(){
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'marvel2024'
    })
    connection.connect((err) => {
        if (err) {
            console.error('Hiba az adatbázis kapcsolatban:', err)
            throw err  // dobunk egy hibát, hogy a hívó függvény kezelje
        }
    })
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/film', (req, res) => {
    try {
        kapcsolat()
        connection.query('SELECT * from film', (err, rows, fields) => {
            if (err) {
                console.error('Lekérdezési hiba:', err)
                res.status(500).send("Hiba történt a filmek lekérdezése során.")
            } else {
                res.status(200).send(rows)
            }
        })
    } catch (err) {
        console.error('Kapcsolat hiba:', err)
        res.status(500).send("Hiba történt az adatbázis csatlakozás során.")
    } finally {
        if (connection && connection.end) connection.end()
    }
})

app.post('/szavazatFelvitel', (req, res) => {
    try {
        kapcsolat()
        connection.query('insert into szavazat values (null,?)', [req.body.bevitel1], (err, rows, fields) => {
            if (err) {
                console.error('Szavazat felvitel hiba:', err)
                res.status(500).send("Hiba történt a szavazat rögzítése során.")
            } else {
                res.status(200).send("Sikeres szavazás!")
            }
        })
    } catch (err) {
        console.error('Kapcsolat hiba:', err)
        res.status(500).send("Hiba történt az adatbázis csatlakozás során.")
    } finally {
        if (connection && connection.end) connection.end()
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
