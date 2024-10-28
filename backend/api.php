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
    try {
        $existingBlocks = $db->query('SELECT id_block, row, column FROM blocks')->fetchAll(PDO::FETCH_ASSOC);
        $existingBlockIds = [];
        $blocksInRequest = [];

        foreach ($fields as $rowIndex => $row) {
            foreach ($row as $columnIndex => $block) {
                $blocksInRequest[] = ['row' => $rowIndex, 'column' => $columnIndex];

                $existingBlock = $db->query('SELECT id_block FROM blocks WHERE row = :row AND column = :column', [
                    ':row' => $rowIndex,
                    ':column' => $columnIndex
                ])->fetch(PDO::FETCH_ASSOC);

                if ($existingBlock) {
                    $existingBlockIds[] = $existingBlock['id_block'];
                    $db->query('UPDATE blocks SET content = :content WHERE row = :row AND column = :column', [
                        ':content'=> $block['content'],
                        ':row' => $rowIndex, 
                        ':column' => $columnIndex
                    ]);
                    $idBlock = $existingBlock['id_block'];
                } else {
                    $db->query('INSERT INTO blocks (content, row, column) VALUES (:content, :row, :column)', [
                        ':content'=> $block['content'],
                        ':row' => $rowIndex, 
                        ':column' => $columnIndex
                    ]);
                    $idBlock = $db->query('SELECT last_insert_rowid()')->fetchColumn();
                }
                updateOrInsertBlockResource($db, $idBlock);
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

                $db->query('DELETE FROM blocks_resources WHERE id_block = (SELECT id_block FROM blocks WHERE row = :row AND column = :column)', [
                    ':row' => $existingBlock['row'],
                    ':column' => $existingBlock['column']
                ]);

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

function updateOrInsertBlockResource($db, $idBlock, $idResource = 1) {
    try {
        $existingResource = $db->query('SELECT id_blocks_resources FROM blocks_resources WHERE id_block = :id_block', [
            ':id_block' => $idBlock
        ])->fetch(PDO::FETCH_ASSOC);

        if ($existingResource) {
            $db->query('UPDATE blocks_resources SET id_resource = :id_resource WHERE id_block = :id_block', [
                ':id_resource' => $idResource,
                ':id_block' => $idBlock
            ]);
        } else {
            $db->query('INSERT INTO blocks_resources (id_resource, id_block) VALUES (:id_resource, :id_block)', [
                ':id_resource' => $idResource,
                ':id_block' => $idBlock
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка обновления или вставки записи в blocks_resources: ' . $e->getMessage()]);
    }
}