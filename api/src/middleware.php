<?php

// Application middleware

$app->add(new \Tuupola\Middleware\JwtAuthentication([
	"path"    	=> ["/auth"],
    "attribute" => "decoded_token_data",
    "secret"    => "supersecretkeyyoushouldnotcommittogithub",
    "algorithm" => ["HS256"],
    "error"     => function ($response, $arguments) {
        $data["status"] = "error";
        $data["message"] = $arguments["message"];

		return $response
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }

]));
