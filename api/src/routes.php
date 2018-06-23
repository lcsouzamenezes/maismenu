<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes
// get all products
$app->get('/products/{user}', function ($request, $response, $args) {
	$user = $request->getAttribute("user");
	$sth = $this->db->prepare("SELECT * FROM products WHERE client_user=:user ORDER BY id");
	$sth->bindValue("user", $user);
	$sth->execute();
	$response = $sth->fetchAll();
	return $this->response->withJson($response);
});

// Retrieve client by username
$app->get('/products/id/[{id}]', function ($request, $response, $args) {
	$sth = $this->db->prepare("SELECT * FROM products WHERE id=:id");
	$sth->bindParam("id", $args['id']);
	$sth->execute();
	$response = $sth->fetchObject();
	return $this->response->withJson($response);
});

// Update todo with given id
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



// Get all clients
$app->get('/clients/', function ($request, $response, $args) {
	$sth = $this->db->prepare("SELECT * FROM clients ORDER BY id");
	$sth->execute();
	$response = $sth->fetchAll();
	return $this->response->withJson($response);
});

// Retrieve client by username
$app->get('/clients/user/[{user}]', function ($request, $response, $args) {
	$sth = $this->db->prepare("SELECT * FROM clients WHERE user=:user");
	$sth->bindParam("user", $args['user']);
	$sth->execute();
	$response = $sth->fetchObject();
	return $this->response->withJson($response);
});

// Register new client
$app->post('/clients', function ($request, $response) {
	$input = $request->getParsedBody();
	$keys = array_keys($input); // Pega as chaves do array

	$sth = $this->db->prepare("INSERT INTO clients (".implode(',', $keys).") VALUES (:".implode(",:", $keys).")");

	$input['password'] = password_hash('teste', PASSWORD_DEFAULT); // generate pass hash

	foreach ($input as $key => $value) {
		$sth ->bindValue(':'.$key, $value);
	}

	$sth->execute();
	$input['id'] = $this->db->lastInsertId();
	return $this->response->withJson($input);
});



function random_password( $length = 8 ) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
    $password = substr( str_shuffle( $chars ), 0, $length );
    return $password;
}
