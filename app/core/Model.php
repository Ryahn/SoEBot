<?php
class Model {
    public static function makeHash() {
        return bin2hex(random_bytes(32));
    }
}
