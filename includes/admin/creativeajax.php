<?php

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;

//verify nonce
if(! wp_verify_nonce( $_REQUEST['nonce'], 'reorder-list' )) {
    wp_nonce_ays('none');
    exit();
}

// check user permissions
if(! current_user_can( 'publish_posts' ) ) {
    exit();
}

//header('Content-type: application/json');

$id = (int)$_POST['menu_id'];
$type = sanitize_text_field($_POST['type']);

if($type == 'reorder') {
    $table_name = esc_sql($_POST['table_name']);

	$order = str_replace('option_li_','',$_POST['order']);
    $order_array = explode(',',$order);
    $query ="UPDATE `".$table_name."` SET `ordering` = CASE `id`";

    $prepare_vals = array();
    $prepare_in = '';
	foreach ($order_array as $key => $val)
	{
        $safe_val = intval($val);
		$ord = $key+1;
        $safe_ord = intval($ord);

        $query .= " WHEN %d THEN %d";

        $prepare_vals[] = $safe_val;
        $prepare_vals[] = $safe_ord;

        $prepare_in .= '%d,';
	}
    $prepare_in = trim($prepare_in,',');
    $query .= " END WHERE `id` IN (".$prepare_in.")";

    $prepare_vals_final = array_merge($prepare_vals, $order_array);

    $wpdb->query($wpdb->prepare($query, $prepare_vals_final));
}
elseif($type == 'reorder_list') {
    $table_name = esc_sql($_POST['table_name']);
	//get form configuration
	$order = str_replace('option_li_','',$_POST['order']);
	$order_array = explode(',',$order);

	foreach ($order_array as $key => $val)
	{
		$val_arr = explode('_',$val);
		$field_id = $val_arr[0];
		$form_id = $val_arr[1];
		$order_final_array[$form_id][] = $field_id;
	}

	foreach($order_final_array as $f_id => $ids_array) {
		$query ="UPDATE `".$table_name."` SET `ordering` = CASE `id`";

        $prepare_vals = array();
        $prepare_in = '';
		foreach ($ids_array as $key => $val)
		{
            $safe_val = intval($val);
			$ord = $key+1;
            $safe_ord = intval($ord);
			$query .= " WHEN %d THEN %d";

            $prepare_vals[] = $safe_val;
            $prepare_vals[] = $safe_ord;

            $prepare_in .= '%d,';
		}
        $prepare_in = trim($prepare_in,',');
		$query .= " END WHERE `id` IN (".$prepare_in.")";

        $prepare_vals_final = array_merge($prepare_vals, $ids_array);

		$wpdb->query($wpdb->prepare($query, $prepare_vals_final));
	}
}

exit();
?>