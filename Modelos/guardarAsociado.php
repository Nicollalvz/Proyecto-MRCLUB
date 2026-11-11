<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/asociado.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception("Método HTTP no permitido.");
    }
    
    // Leer JSON o datos normales del formulario
    $json = file_get_contents('php://input');
    $datos = null;
    
    if (!empty($json)) {
        $datos = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $datos = null;
        }
    }
    
    // Si no hay JSON, usar los datos del formulario
    if (!is_array($datos)) {
        $datos = $_POST;
    }

    if (!is_array($datos)) {
        http_response_code(400);
        throw new Exception("Datos inválidos.");
    }

    $campos = ["documento", "nombres", "apellidos", "fechaNacimiento", "genero", "direccionResidencia", "ciudad", "telefono", "email"];
    foreach ($campos as $campo) {
        if (!isset($datos[$campo])) {
            http_response_code(400);
            throw new Exception("Falta el campo: " . $campo);
        }
    }

    // Validar contraseña (acepta con eñe o sin eñe por seguridad)
    if (!isset($datos['contraseña']) && !isset($datos['contrasena'])) {
        http_response_code(400);
        throw new Exception("Falta el campo: contraseña");
    }

    if (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        throw new Exception("Email inválido.");
    }

    $asociado = new Asociado($datos);
    $resultado = $asociado->guardar();

    if ($resultado) {
        http_response_code(201);
        echo json_encode(["success" => true, "mensaje" => "Asociado guardado exitosamente."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error al guardar el asociado."]);
    }

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["success" => false, "mensaje" => "El documento ya existe."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error de base de datos: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "mensaje" => $e->getMessage()]);
}