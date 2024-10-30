<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;
$id = (int) $_POST['id'];
$task = isset($_REQUEST['task']) ? $_REQUEST['task'] : '';

//verify nonce
check_admin_referer( 'category-manage-' . $id);

if(current_user_can( 'publish_posts' )) {

    $post_name_safe = sanitize_text_field($_POST['name']);
    $post_published_safe = (int) $_POST['published'];

    if ($id == 0) {

        $wpdb->query($wpdb->prepare(
            "
			INSERT INTO " . $wpdb->prefix . "cis_categories
			( 
				`name`, `published`
			)
			VALUES ( %s, %d)
			",
            $post_name_safe, $post_published_safe
        ));

        $last_task = '';
        $insrtid = (int)$wpdb->insert_id;
        if ($insrtid != 0) {
            if ($task == 'save') {
                $redirect = "admin.php?page=cis_categories&act=edit&id=" . $insrtid;
                $last_task = 'save';
            } elseif ($task == 'save_new')
                $redirect = "admin.php?page=cis_categories&act=new";
            else
                $redirect = "admin.php?page=cis_categories";
        } else
            $redirect = "admin.php?page=cis_categories&error=1";
    } else {
        $q = $wpdb->query($wpdb->prepare(
            "
			UPDATE " . $wpdb->prefix . "cis_categories
			SET
				`name` = %s, 
				`published` = %d
			WHERE
				`id` = '" . $id . "'
			",
            $post_name_safe, $post_published_safe
        ));

        if ($q !== false) {
            if ($task == 'save')
                $redirect = "admin.php?page=cis_categories&act=edit&id=" . $id;
            elseif ($task == 'save_new')
                $redirect = "admin.php?page=cis_categories&act=new";
            else
                $redirect = "admin.php?page=cis_categories";
        } else
            $redirect = "admin.php?page=cis_categories&error=1";
    }
}
else {
    $redirect = "admin.php?page=cis_categories&error=1";
}
header("Location: ".$redirect);
exit();
?>