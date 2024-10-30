<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;
$id = (int) $_POST['id'];
$task = isset($_REQUEST['task']) ? $_REQUEST['task'] : '';

//verify nonce
check_admin_referer( 'item-manage-' . $id);

if(current_user_can( 'publish_posts' )) {

    $sql = "SELECT COUNT(id) FROM ".$wpdb->prefix."cis_images";
    $count_fields = $wpdb->get_var($sql);

    //validate data
    $safe_post_name = sanitize_text_field($_POST['name']);
    $safe_post_published = intval($_POST['published']);
    $safe_post_id_slider = intval($_POST['id_slider']);
    $safe_post_img_name = sanitize_text_field($_POST['img_name']);
    $safe_post_img_url = esc_url($_POST['img_url']);
    $safe_post_caption = wp_kses_post($_POST['caption']);

    $safe_post_redirect_url = esc_url($_POST['redirect_url']);
    $safe_post_redirect_target = intval($_POST['redirect_target']);
    $safe_post_popup_img_name = sanitize_text_field($_POST['popup_img_name']);
    $safe_post_popup_img_url = esc_url($_POST['popup_img_url']);

    if ($id == 0 && $count_fields < 5 && ($safe_post_img_name != '' || $safe_post_img_url != '')) {
        $sql = "SELECT MAX(`ordering`) FROM `" . $wpdb->prefix . "cis_images` WHERE `id_slider` = " . (int)$safe_post_id_slider;
        $max_order = $wpdb->get_var($sql) + 1;

        $wpdb->query($wpdb->prepare(
            "
			INSERT INTO " . $wpdb->prefix . "cis_images
			( 
				`name`,
				`published`,
				`id_slider`,
				`img_name`,
				`img_url`,
				`caption`,
				
				`redirect_url`,
				`redirect_target`,
				`popup_img_name`,
				`popup_img_url`,
				
				`ordering`
			)
			VALUES ( %s, %d, %d, %s, %s, %s, %s, %s, %s, %s, %d)
			",
            $safe_post_name,
            $safe_post_published,
            $safe_post_id_slider,
            $safe_post_img_name,
            $safe_post_img_url,
            $safe_post_caption,

            $safe_post_redirect_url,
            $safe_post_redirect_target,
            $safe_post_popup_img_name,
            $safe_post_popup_img_url,

            $max_order
        ));

        $insrtid = (int)$wpdb->insert_id;
        if ($insrtid != 0) {
            if ($task == 'save')
                $redirect = "admin.php?page=cis_items&act=edit&id=" . $insrtid;
            elseif ($task == 'save_new')
                $redirect = "admin.php?page=cis_items&act=new";
            else
                $redirect = "admin.php?page=cis_items";
        } else
            $redirect = "admin.php?page=cis_items&error=1";
    } elseif ($id != 0) {
        $q = $wpdb->query($wpdb->prepare(
            "
			UPDATE " . $wpdb->prefix . "cis_images
			SET
				`name` = %s,
				`published` = %d,
				`id_slider` = %d,
				`img_name` = %s,
				`img_url` = %s,
				`caption` = %s,
				
				`redirect_url` = %s,
				`redirect_target` = %s,
				`popup_img_name` = %s,
				`popup_img_url` = %s
			WHERE
				`id` = '" . $id . "'
			",
            $safe_post_name, $safe_post_published, $safe_post_id_slider, $safe_post_img_name, $safe_post_img_url, $safe_post_caption, $safe_post_redirect_url, $safe_post_redirect_target, $safe_post_popup_img_name, $safe_post_popup_img_url
        ));
        if ($q !== false) {
            if ($task == 'save')
                $redirect = "admin.php?page=cis_items&act=edit&id=" . $id;
            elseif ($task == 'save_new')
                $redirect = "admin.php?page=cis_items&act=new";
            else
                $redirect = "admin.php?page=cis_items";
        } else
            $redirect = "admin.php?page=cis_items&error=1";
    } else {
        $redirect = "admin.php?page=cis_items&error=1";
    }
}
else {
    $redirect = "admin.php?page=cis_items&error=1";
}
header("Location: ".$redirect);
exit();
?>