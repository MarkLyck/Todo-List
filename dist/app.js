let $todos = $('#todos')
let $newTodoBtn = $('#new-todo')

let $titleInput = $('#title-input')
let $descInput = $('#description-input')
let $addTodoBtn = $('#add-todo')

let $modalContainer = $('#modal-container')
let $modal = $('.modal')
let $newTodoModal = $('.new-todo-modal')

let $loginModal = $('.login-modal')
let $loginInput = $('#login-input')
let $loginBtn = $('#login-btn')

let $filterAllBtn = $('#filter-all')
let $filterCompletedBtn = $('#filter-completed')
let $filterTodoBtn = $('#filter-todo')

let $searchBtn = $('#search-btn')
let $searchBar = $('#search-bar')

let user = ''
let userID = ''
let todosData = []






$loginInput.on('keydown', function(e){
  if (e.keyCode === 13) {
    e.preventDefault()
    login()
  }
})

function login() {
  if ($loginInput.val() !== '') {
    user = $loginInput.val()
    let userExists = false

    $.ajax({
      url: 'https://tiny-za-server.herokuapp.com/collections/todo-users/',
      type: 'GET',
      dataType: 'JSON',
      success: (response) => {
        response.forEach(existingUser => {
          if (existingUser.user === user) {
            userExists = true
            userID = existingUser._id // Set the id.
            todosData = JSON.parse(existingUser.todos)
            addTodos()
          }
        })
        if (userExists) { // Log them in.
        } else { // Create new user
          newUserObject = {
            user: $loginInput.val()
          }
          $.ajax({
            url: 'https://tiny-za-server.herokuapp.com/collections/todo-users/',
            type: 'POST',
            dataType: 'JSON',
            success: (response) => {
              userID = response._id
            },
            data: newUserObject
          })
        }
      }
    })
    $modal.css('display', 'none') // Hides modal container
    $modalContainer.css('display', 'none') // Show new-todo modal
  }
}

$loginBtn.on('click', login)












$newTodoBtn.on('click',() => {
  $modalContainer.css('display', 'flex') // Hides modal container
  $newTodoModal.css('display', 'flex') // Show new-todo modal
  $modalContainer.on('click', (e) => {
    if (e.target.id === 'modal-container') {
      $modalContainer.css('display', 'none')
      $modal.css('display', 'none')
    }
  })
})

$addTodoBtn.on('click',() => {
  if ($titleInput.val() !== '') {
    postObject = {
      todos: JSON.stringify([{
        title: $titleInput.val(),
        description: $descInput.val(),
        state: 0
      }])
    }
    todosData.push({
      title: $titleInput.val(),
      description: $descInput.val(),
      state: 0
    })
    addTodos()
    put()
    $titleInput.val('')
    $descInput.val('')
  } else {
    throw new Error('You must give the todo a title.')
  }
  $modal.css('display', 'none') // Hides all modals
  $modalContainer.css('display', 'none') // Hides modal container
})


$filterAllBtn.on('click', function() {
  $('.filter-button').removeClass('selected')
  $(this).addClass('selected')
  addTodos()
  if ($searchBar.css('width') !== '0px') { // If the search bar is open, hide it.
    toggleSearchBar()
  }
})
$filterCompletedBtn.on('click', function() {
  $('.filter-button').removeClass('selected')
  $(this).addClass('selected')
  addTodos('completed')
  if ($searchBar.css('width') !== '0px') {
    toggleSearchBar()
  }
})
$filterTodoBtn.on('click', function() {
  $('.filter-button').removeClass('selected')
  $(this).addClass('selected')
  addTodos('uncompleted')
  if ($searchBar.css('width') !== '0px') {
    toggleSearchBar()
  }
})





function addTodos(filterType, searchWord) {
  $todos.empty()

  let filteredTodos = todosData
  if (filterType !== undefined) {
    if (filterType === 'completed') {
      filteredTodos = filteredTodos.filter(function(todo){
        return todo.state === 1
      })
    } else if (filterType === 'uncompleted') {
      filteredTodos = filteredTodos.filter(function(todo){
        return todo.state === 0
      })
    } else {
      filteredTodos = filteredTodos.filter(function(todo){
        return todo.title.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1
      })
    }
  }

  filteredTodos.forEach(todo => {
    let $li = $('<li><i class="fa fa-circle" aria-hidden="true"></i><div class="list-header"><h3>' + todo.title + '</h3><button class="trash-btn" type="button"><i class="fa fa-trash-o" aria-hidden="true"></i></button></div><div class="list-descr"><p>' + todo.description + '</p></div></li>')
    $todos.append($li)
    if (todo.state === 1) {
      $li.addClass('completed')
      $li.children('i').removeClass('fa-circle').addClass('fa-check')
    }
    if (todo.description === '') {
      $li.children('div').children('p').css('display', 'none');
      $li.children('div').children('h3').css('border-bottom-right-radius', '3px');
      $li.children('div').children('h3').css('border-bottom-left-radius', '3px');
      $li.children('div').children('.trash-btn').css('border-bottom-right-radius', '3px');
    }
    $li.children('i').on('click', toggleTODO)
    $li.children('div').children('h3').on('click', toggleTODO)
    $li.children('div').children('.trash-btn').on('click', deleteTodo)
  })
}



function deleteTodo(e) {
  todosData.forEach((todo, i) => {
    if (todo.title === $(e.target).closest('li').children('div').children('h3').text()) {
      todosData.splice(i, 1)
    }
    put()
    $todos.empty()
    addTodos()
  })
}






function toggleTODO(e) {
  $(e.target).closest('li').toggleClass('completed')
  if ($(e.target).closest('li').hasClass('completed')) {
    todosData.forEach((todo, i) => {
      if (todo.title === $(e.target).closest('li').children('div').children('h3').text()) {
        todosData[i] = {
          title: todo.title,
          description: todo.description,
          state: 1
        }
        $(e.target).closest('li').children('i').removeClass('fa-circle').addClass('fa-check')
      }
    })
    put()
  } else {
    todosData.forEach((todo, i) => {
      if (todo.title === $(e.target).closest('li').children('div').children('h3').text()) {
        todosData[i] = {
          title: todo.title,
          description: todo.description,
          state: 0
        }
        $(e.target).closest('li').children('i').removeClass('fa-check').addClass('fa-circle')
      }
    })
    put()
    addTodos()
  }
}







function put() {
  $.ajax({
    url: 'https://tiny-za-server.herokuapp.com/collections/todo-users/' + userID,
    type: 'PUT',
    dataType: 'JSON',
    success: (response) => {
      console.log('PUT: ', response);
    },
    data: {
      todos: JSON.stringify(todosData)
    }
  })
}

$searchBtn.on('click', toggleSearchBar)

function toggleSearchBar() {
  if ($searchBar.css('width') === '0px') {
    $searchBar.css('width', 'calc(100% - 181px)')
    $searchBar.css('padding-left', '20px')
  } else {
    $searchBar.css('width', '0')
    $searchBar.css('padding-left', '0')
    $searchBar.blur()
  }
}

$searchBar.on('keyup', function(e){
  addTodos('search', $searchBar.val())
  if (e.keyCode === 13) {
    toggleSearchBar()
    $searchBar.val('')
  }
})
