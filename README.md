# mockery

An attempt at creating a mock backend specifically for e2e and unit testing framework

### How does it work?

First you can add data to the 'state' variable which will be persisted through out the session.

```js
state.me = [{
    "id": 100,
    "firstName": "John",
    "lastName": "Smith",
    "email": "johnsmith@email.com",
    "phone": "(617) 555 - 4321",
    "address": {
        "city": "Boston",
        "state": "MA",
        "zip": "02114"
    }
}]; 
```

Then you can add routes for the Mock service, Here is an example of mocking a login call:

```js
Mockery.imitate('/login', 'POST', function (req, res) {
	res.type('application/json');
    if( state.me.email == req.body.username ){
        res.statusCode(200);
        res.json(state.me);   
    } else {
        res.statusCode(404);
        res.json({
            "status": "not found"
        });
    } 
});
```

### How can i look data up?

lodash is embedded within Mockery, you can use it like this:

```js
Mockery.imitate('/People/:id', 'GET', function (req, res) {
	// Set the type of response, sets the Content-Type header.
	res.type('application/json');
	var person = _.find(state.people, {
		'id': Number(req.params.id)
	});
	if (!person) {
		return res.json(404, {
			error: {
				message: 'Person doesnt exist'
			}
		});
	}

	// Set the status code of the response.
	res.statusCode(200);
	return res.json(person);
});
```

### But what about PUT and POST?

lodash is embedded within Mockery, you can use it like this:

```js
Mockery.imitate('/People/:id', 'PUT', function (req, res) {
	// Set the type of response, sets the Content-Type header.
	res.type('application/json');
	var person = _.find(state.people, {
		'id': Number(req.params.id)
	});
	
    if (!person) {
		return res.json(404, {
			error: {
				message: 'Person doesnt exist'
			}
		});
	}
	person = _.merge(person, req.data);
    // drop the person and subsequently readd
    _.reject(people, {
		id: person.id
	});
	state.people.push(person);

	// Set the status code of the response.
	res.statusCode(200);
	return res.json(person);
});
```
