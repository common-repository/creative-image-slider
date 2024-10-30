<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;
delete_option('wpcis_db_version');

require_once(ABSPATH . '/wp-admin/includes/upgrade.php');

$sql = "DROP TABLE IF EXISTS `".$wpdb->prefix."cis_sliders`";
$wpdb->query($sql);

$sql = "DROP TABLE IF EXISTS `".$wpdb->prefix."cis_images`";
$wpdb->query($sql);

$sql = "DROP TABLE IF EXISTS `".$wpdb->prefix."cis_categories`";
$wpdb->query($sql);

?>