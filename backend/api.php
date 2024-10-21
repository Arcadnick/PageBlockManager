<?php
require 'db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$db = new Database('/blocks.db'); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data && isset($data['action']) && $data['action'] === 'save') {
        saveDataToDatabase($db, $data['data']); 
        echo json_encode(["status" => "success"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'load') {
    $data = loadDataFromDatabase($db); 
    echo json_encode($data);
}

function saveDataToDatabase($db, $fields) {
    $db->query('DELETE FROM blocks'); 
    $stmt = $db->query('INSERT INTO blocks (content, row, column) VALUES (:content, :row, :column)');
    
    foreach ($fields as $rowIndex => $row) {
        foreach ($row as $columnIndex => $block) {
            $stmt->execute([
                // ':number' => $block['number'],
                ':content' => $block['number'], 
                ':row' => $rowIndex, 
                ':column'=> $columnIndex
            ]);
        }
    }
}

function loadDataFromDatabase($db) {
    $stmt = $db->query('SELECT content, row, column FROM blocks');
    $blocks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Преобразуем блоки в двумерный массив
    $fields = [];
    foreach ($blocks as $block) {
        // Убедимся, что каждая строка существует как массив
        if (!isset($fields[$block['row']])) {
            $fields[$block['row']] = [];
        }
        // Заполняем ячейку на основе column
        $fields[$block['row']][$block['column']] = [
            'content' => $block['content'],
            'number' => $block['column']
        ];
    }

    // Удаляем пустые строки и преобразуем обратно в простой массив
    return array_values(array_filter($fields, fn($field) => !empty($field)));
}