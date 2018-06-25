<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \Firebase\JWT\JWT;




// Routes
// get all products by user
$app->get('/products/{user}', function ($request, $response, $args) {
	$user = $request->getAttribute("user");
	$sth = $this->db->prepare("SELECT * FROM products WHERE client_user=:user ORDER BY id");
	$sth->bindValue("user", $user);
	$sth->execute();
	$response = $sth->fetchAll();
	return $this->response->withJson($response);
});

// Retrieve product by id
$app->get('/products/id/[{id}]', function ($request, $response, $args) {
	$sth = $this->db->prepare("SELECT * FROM products WHERE id=:id");
	$sth->bindParam("id", $args['id']);
	$sth->execute();
	$response = $sth->fetchObject();
	return $this->response->withJson($response);
});

// Update product with given id
$app->put('/products/id/{id}', function ($request, $response, $args) {
	$input = $request->getParsedBody();
	$id = (int) $request->getAttribute("id");
	$sql = "UPDATE products SET title=:title WHERE id=:id";
	$sth = $this->db->prepare($sql);

	$sth->bindValue("id", $id);
	$sth->bindValue("title", "Teste manual");

	$sth->execute();
	$input['id'] = $id;
	return $this->response->withJson($input);
});



// Return if user exists
$app->get('/clients/userexists/{user}', function (Request $request, Response $response, array $args) {
	$sth = $this->db->prepare("SELECT * FROM clients WHERE user=:user");
	$sth->bindParam("user", $args['user']);
	$sth->execute();
	$response = $sth->fetchAll();

	// verify password.
	if ($response) {
		return $this->response->withJson(['exists' => true]);
	} else {
		return $this->response->withJson(['exists' => false]);
	}

});

// Register new client
$app->post('/clients', function ($request, $response) {
	$input = $request->getParsedBody();
	$keys = array_keys($input); // Pega as chaves do array

	// Register Client
	$sth = $this->db->prepare("INSERT INTO clients (".implode(',', $keys).") VALUES (:".implode(",:", $keys).")");

	foreach ($input as $key => $value) {
		$sth ->bindValue(':'.$key, $value);
	}

	$sth->execute();
	$input['id'] = $this->db->lastInsertId();


	// Register User
	$sth2 = $this->db->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");

	$sth2 ->bindValue('username', $input['username']);
	$sth2 ->bindValue('email', $input['email']);
	// $sth2 ->bindValue('password', password_hash(random_password(), PASSWORD_DEFAULT)); // generate pass hash
	$sth2 ->bindValue('password', password_hash('teste', PASSWORD_DEFAULT)); // generate pass hash

	$sth2->execute();
	$input['id'] = $this->db->lastInsertId();


	return $this->response->withJson($input);

});

// Get all clients
$app->get('/clients/', function (Request $request, Response $response, array $args) {
	$sth = $this->db->prepare("SELECT * FROM clients ORDER BY id");
	$sth->execute();
	$response = $sth->fetchAll();
	return $this->response->withJson($response);
});

// Retrieve client by username
$app->get('/clients/user/[{user}]', function (Request $request, Response $response, array $args) {
	$sth = $this->db->prepare("SELECT * FROM clients WHERE user=:user");
	$sth->bindParam("user", $args['user']);
	$sth->execute();
	$response = $sth->fetchObject();
	return $this->response->withJson($response);
});



function random_password( $length = 8 ) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
    $password = substr( str_shuffle( $chars ), 0, $length );
    return $password;
}









$app->post('/login', function (Request $request, Response $response, array $args) {

    $input = $request->getParsedBody();
    $sql = "SELECT * FROM users WHERE username= :username";
    $sth = $this->db->prepare($sql);
    $sth->bindParam('username', $input['username']);
    $sth->execute();
    $user = $sth->fetchObject();

    // verify user address.
    if(!$user) {
        return $this->response->withJson(['error' => true, 'message' => 'These credentials do not match our records.']);
    }

    // verify password.
    if (!password_verify($input['password'], $user->password)) {
        return $this->response->withJson(['error' => true, 'message' => 'These credentials do not match our records.']);
    }

    $settings = $this->get('settings'); // get settings array.
    $token = JWT::encode(['id' => $user->id, 'username' => $user->username], $settings['jwt']['secret'], "HS256");

    return $this->response->withJson(['token' => $token]);

});

$app->group('/auth', function(\Slim\App $app) {

	// Retrieve user by username
	$app->get('/users/user/[{user}]', function (Request $request, Response $response, array $args) {
		$sth = $this->db->prepare("SELECT * FROM users WHERE user=:user");
		$sth->bindParam("user", $args['user']);
		$sth->execute();
		$response = $sth->fetchObject();
		return $this->response->withJson($response);
	});


});
