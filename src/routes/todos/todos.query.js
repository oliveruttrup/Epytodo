module.exports = {
    getAllTodos: 'SELECT * FROM todo',
    getTodoById: 'SELECT * FROM todo WHERE id = ?',
    createTodo: 'INSERT INTO todo SET ?',
    updateTodo: 'UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ?',
    deleteTodo: 'DELETE FROM todo WHERE id = ?'
};
