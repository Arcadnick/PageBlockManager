<?php
class Database {
    private $pdo;

    public function __construct($dbFile) {
        //$this->pdo = new PDO("sqlite:" . $dbFile);
        $this->pdo = new PDO("sqlite:" . __DIR__ . $dbFile);

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function query($sql, $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}