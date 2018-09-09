<?php
   $name = $_SERVER['REQUEST_URI'];
   $name = preg_replace("/[^a-zA-Z0-9=+,&:\?\/]/", "", $name);
   readfile($_SERVER['DOCUMENT_ROOT'].$name);
?>