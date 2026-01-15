exports.isAdmin = (req, res, next) => {
if (req.headers.role !== 'admin') {
return res.status(403).json({ message: 'Admin only' })
}
next()
}