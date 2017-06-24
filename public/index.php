<?php
require_once('core/init.php');

try {
    $user = DB::getDBI()->query("SELECT user FROM tbl_users WHERE user = ?", array('Ryahn'));

} catch (Exception $e) {
    echo $e->getMessage();
}
