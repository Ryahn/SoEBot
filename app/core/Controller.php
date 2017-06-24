<?php
class Controller {
    public function __construct() {
        $this->checkSession();
    }

    public function model($model) {
        require_once('../app/model' . $model . '.php');
        return new $model();
    }

    public function view($view, $data = []) {
        require_once('../app/views/' . $view . '.php');
    }

    public function checkSession() {
        if(session_id() == '' || !isset($_SESSION)) {
            session_start();
            if(empty($_SESSION[Config::get('session/csrf_token')])) {
                $_SESSION[Config::get('session/csrf_token')] = Model::makeHash();
            }
        }
    }

    public static function checkToken($token) {
        $tokenName = Config::get('session/csrf_token');
        if(isset($_SESSION[$tokenName]) && $token === $_SESSION[$tokenName]) {
            return true;
        }
        return false;
    }
}
