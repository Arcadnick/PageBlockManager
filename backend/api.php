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

// function saveDataToDatabase($db, $fields) {
//     $db->query('DELETE FROM blocks'); 
//     $stmt = $db->prepare('INSERT INTO blocks (content, row, column) VALUES (:content, :row, :column)');
//     foreach ($fields as $rowIndex => $row) {
//         foreach ($row as $columnIndex => $block) {
//             $stmt->execute([
//                 //Пока так, что бы было понятно перемещаются ли блоки
//                 //':content' => $block['content'],
//                 ':content' => $block['number'], 
//                 ':row' => $rowIndex, 
//                 ':column'=> $columnIndex
//             ]);
//         }
//     }
// }

function saveDataToDatabase($db, $fields) {
    try {
        $existingBlocks = $db->query('SELECT id_block, row, column FROM blocks')->fetchAll(PDO::FETCH_ASSOC);

        $blocksInRequest = [];

        foreach ($fields as $rowIndex => $row) {
            foreach ($row as $columnIndex => $block) {
                $blocksInRequest[] = ['row' => $rowIndex, 'column' => $columnIndex];

                $existingBlock = $db->query('SELECT id_block FROM blocks WHERE row = :row AND column = :column', [
                    ':row' => $rowIndex,
                    ':column' => $columnIndex
                ])->fetch(PDO::FETCH_ASSOC);

                if ($existingBlock) {
                    $db->query('UPDATE blocks SET content = :content WHERE row = :row AND column = :column', [
                        ':content' => $block['number'], 
                        ':row' => $rowIndex, 
                        ':column' => $columnIndex
                    ]);
                } else {
                    $db->query('INSERT INTO blocks (content, row, column) VALUES (:content, :row, :column)', [
                        ':content' => $block['number'], 
                        ':row' => $rowIndex, 
                        ':column' => $columnIndex
                    ]);
                }
            }
        }

        foreach ($existingBlocks as $existingBlock) {
            $blockExistsInRequest = false;
            foreach ($blocksInRequest as $block) {
                if ($block['row'] == $existingBlock['row'] && $block['column'] == $existingBlock['column']) {
                    $blockExistsInRequest = true;
                    break;
                }
            }

            if (!$blockExistsInRequest) {
                $db->query('DELETE FROM blocks WHERE row = :row AND column = :column', [
                    ':row' => $existingBlock['row'],
                    ':column' => $existingBlock['column']
                ]);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}

function loadDataFromDatabase($db) {
    $stmt = $db->query('SELECT content, row, column FROM blocks');
    $blocks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $fields = [];
    foreach ($blocks as $block) {
        if (!isset($fields[$block['row']])) {
            $fields[$block['row']] = [];
        }
        $fields[$block['row']][$block['column']] = [
            'content' => $block['content'],
            'number' => $block['column']
        ];
    }
    return array_values(array_filter($fields, fn($field) => !empty($field)));
}