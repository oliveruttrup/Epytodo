module.exports = {
    getAllUsers: 'SELECT * FROM user',
    getUserById: 'SELECT * FROM user WHERE id = ?',
    updateUser: 'UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?',
    deleteUser: 'DELETE FROM user WHERE id = ?'
};
