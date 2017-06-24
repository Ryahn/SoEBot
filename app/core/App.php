<?php
class App {
    protected   $controller = 'Home',
                $method = 'index',
                $params = [];

    public function __construct() {
        $url = $this->parseUrl();
        $newUrl = $url[0];

        //Check if controller exists
        if(file_exists('../app/controllers/' . $newUrl . '.php')) {
            $this->controller = $newUrl;
            unset($url[0]);
        }

        require_once('../app/controllers/' . $this->controller . '.php');
        $this->controller = new $this->controller;

        //Check if method exists
        if(isset($url[1])) {
            if(method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        $this->params = $url ? array_values($url) : [];

        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    //Explode and trimm the sanitized url. Allow access to other parts of url
    public function parseUrl() {
        if(isset($_GET['url'])) {
            return $url = explode('/', filter_var(rtrim($_GET['url'], ''), FILTER_SANITIZE_URL));
        }
    }
}
