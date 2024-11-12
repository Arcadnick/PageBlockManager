<?php
require 'db.php';

$db = new Database('/blocks.db'); 

$db->query("
    CREATE TABLE IF NOT EXISTS blocks (
        id_block INTEGER PRIMARY KEY AUTOINCREMENT,
        content VARCHAR,
        column INTEGER,
        row INTEGER,
        blockNumber INTEGER,
        UNIQUE(id_block)
    )
");

$db->query("
    CREATE TABLE IF NOT EXISTS blocks_resources (
        id_blocks_resources INTEGER PRIMARY KEY AUTOINCREMENT,
        id_resource INTEGER,
        id_block INTEGER,
        UNIQUE(id_blocks_resources)
    )
");

$db->query("
    CREATE TABLE IF NOT EXISTS resources (
        id_resource INTEGER PRIMARY KEY AUTOINCREMENT,
        id_section INTEGER,
        is_master INTEGER,
        master_json VARCHAR,
        composition_json VARCHAR,
        subtitle VARCHAR,
        name VARCHAR,
        created INTEGER,
        changed INTEGER,
        keywords VARCHAR,
        author VARCHAR,
        description VARCHAR,
        content TEXT,
        publish BOOLEAN,
        enabled BOOLEAN,
        place INTEGER,
        weight INTEGER,
        status INTEGER,
        link VARCHAR,
        mime_type VARCHAR,
        UNIQUE(id_section, name, link)
    )
");

echo "Миграции успешно выполнены!";
