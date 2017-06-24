<?php
require_once('core/init.php');

try {
    $user = DB::getDBI()->query("SELECT user_username FROM users WHERE user_username = ?", array('Ryahn'));

} catch (Exception $e) {
    echo $e->getMessage();
}
