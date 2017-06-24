<?php

class Functions {

	public function dump($value)
	{
		echo "<pre>";
		var_dump($value);
		echo "</pre>";
	}

	public function escape($value)
	{
		return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
	}

}
