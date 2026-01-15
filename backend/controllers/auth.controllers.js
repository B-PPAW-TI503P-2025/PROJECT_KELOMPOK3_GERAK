const db = require('../config/db')


exports.login = (req, res) => {
const { username, password } = req.body


const sql = 'SELECT * FROM users WHERE username=? AND password=?'
db.query(sql, [username, password], (err, result) => {
if (err) return res.status(500).json(err)
if (result.length === 0)
return res.status(401).json({ message: 'Login gagal' })


res.json({
success: true,
role: result[0].role
})
})
}