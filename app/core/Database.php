<?php
class Database {
    private static $_instance = null;
    private $_pdo,
            $_query,
            $_error = false,
            $_results,
            $_stmt,
            $_count = 0;

    private function __construct() {
        try
        {
            $this->_pdo = new PDO('mysql:host=' . Config::get('mysql/host') . ';dbname=' . Config::get('mysql/dbname') . ';charset=' . Config::get('mysql/charset'), Config::get('mysql/user'), Config::get('mysql/pass'), [
              PDO::ATTR_EMULATE_PREPARES => false,
              PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
        } catch(PDOException $e)
        {
            die($e->getMessage());
        }
    }

    public static function getDBI() {
        if(!isset(self::$_instance)) {
            self::$_instance = new Database();
        }
        return self::$_instance;
    }

    public function query($sql, $params = []) {
        $this->_error = false;
        if($this->_query = $this->_pdo->prepare($sql)) {
            if(count($params)) {
                $setI = 1;
                foreach($params as $set) {
                    $this->_query->bindValue($setI, $set);
                    $setI++;
                }
            }
            if($this->_query->execute()) {
                $this->_results = $this->_query->fetchAll(PDO::FETCH_OBJ);
                $this->_count = $this->_pdo->rowCount();
            } else {
                $this->_error = true;
            }
        }
        return $this;
    }

    public function error($message = null) {
        if(is_null($message)) {
            return $this->_error;
        } else {
            throw new Exception('DB Error Message: ' . $message);
        }
    }
}
