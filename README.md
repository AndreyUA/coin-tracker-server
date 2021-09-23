# Documentation

## Start

    - to server localy enter "npm run server" (with hot-reload);
    - or "npm run start" (without hot-reload).

## API documentation

By default localy server is running on http://localhost:5000/.

### /api/register (POST):
    register new account (family);

    json example:
    {
        "familyName": "Some family name",
        "email": "test@test.com",
        "password": "111asd111"
    }

    response: token.

### /api/login (GET):
    get account (family) information from DB;

    headers example:
    "Authorization": "Bearer someValidJWT"

    response: account object.

### /api/login (POST):
    login account (family);

    json example:
    {
        "email": "test@test.com",
        "password": "111asd111"
    }

    response: token.

### /api/family (PATCH):
    add new person for account (family);

    headers example:
    "Authorization": "Bearer someValidJWT"

    json example:
    {
        "name": "Test person"
    }

    response: account object.

### /api/family/:id (DELETE):
    remove person from account (family);

    headers example:
    "Authorization": "Bearer someValidJWT"

    json example:
    {
        "id": "idOfPerson"
    }

    response: account object.

### /api/budget (POST):
    create new budger for you account (family);

    headers example:
    "Authorization": "Bearer someValidJWT"

    json example:
    {
        "name": "Test name",
        "total": 20000
    }

    response: budget object.

### /api/budget/all (GET):
    get all IDs of budgets for current family;

    headers example:
    "Authorization": "Bearer someValidJWT"

    response: array of budgets objects for current family with ID and NAME.

### /api/budget/:id (GET):
    get budget by id;

    headers example:
    "Authorization": "Bearer someValidJWT"

    respose: budget object.

### /api/budget/:id (PATCH):
    add transaction to budget;

    headers example:
    "Authorization": "Bearer someValidJWT"

    json example:
    {
        "money": 1000,
        "name": "Test person",
        "purchase": "meat"
    }

    response: budget object.

### /api/post (POST)
    add new post;

    headers example:
    "Authorization": "Bearer someValidJWT"

    json example:
    {
        "name": "Test person",
        "text": "Some test text"
    }

    response: post object.

### /api/post/:id (DELETE)
    delete post;

    headers example:
    "Authorization": "Bearer someValidJWT"

    response: deleted post object.

### /api/post/all (GET)
    get all posts;

    headers example:
    "Authorization": "Bearer someValidJWT"

    response: array of posts objects.

### /api/todo/all (GET)
    get all todo list;

    headers example:
    "Authorization": "Bearer someValidJWT"

    response: array of todo objects.

### /api/todo (POST)
    add new todo;

    headers example:
    "Authorization": "Bearer someValidJWT"

    response: todo objects.
