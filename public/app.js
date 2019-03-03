$(document).ready(function(){
  $.getJSON('/api/todos') //since url of api is same as frontend
  .then(addTodos)

  $('#todoInput').keypress(function(event) {
    if(event.which == 13) {
      createTodo()
    }
  });

  $('.list').on('click', 'li', function() {
    updateTodo($(this))
  })

  $('.list').on('click', 'span', function(e) {
    e.stopPropagation();
    removeTodo($(this).parent());
  })
});

function addTodos(todos) {
  todos.forEach(todo => {
    addTodo(todo)
  });
}

function createTodo() {
  var usrInput = $('#todoInput').val();
  $.post('/api/todos', {name: usrInput})
  .then(function(newTodo) {
    $('#todoInput').val('');
    addTodo(newTodo);
  })
  .catch(function(err) {
    console.log(err);
  })
}

function addTodo(todo) {
  var newTodo = $('<li class="task">' + todo.name + '<span> X </span> </li>');
  newTodo.data('id',todo._id);
  newTodo.data('completed', todo.completed);
  if(todo.completed) {
    $.addClass("done");
  }
  $('.list').append(newTodo);
}

function removeTodo(todo) {
  var clickedID = todo.data('id');
    var deleteUrl = '/api/todos/' + clickedID;
    todo.remove();
    $.ajax({
      method: 'DELETE',
      url: deleteUrl
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    })
}

function updateTodo(todo) {
  var updateUrl = '/api/todos/' + todo.data('id');
  var isDone = !todo.data('completed');
  var updateData = {completed: !isDone};
  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(function(updatedTodo) {
    todo.toggleClass("done");
    todo.data("completed", isDone);
  })
}