<?php 
// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;
$id = (int) $_POST['id'];
$task = isset($_REQUEST['task']) ? $_REQUEST['task'] : '';

//verify nonce
check_admin_referer( 'slider-manage-' . $id);

if(current_user_can( 'publish_posts' )) {

    $sql = "SELECT COUNT(id) FROM " . $wpdb->prefix . "cis_sliders";
    $count_sliders = $wpdb->get_var($sql);

//validating data
    $safe_post_name = sanitize_text_field($_POST['name']);
    $safe_post_published = intval($_POST['published']);
    $safe_post_id_category = intval($_POST['id_category']);
    $safe_post_width = sanitize_text_field($_POST['width']);
    $safe_post_height = intval($_POST['height']);
    $safe_post_itemsoffset = intval($_POST['itemsoffset']);
    $safe_post_margintop = intval($_POST['margintop']);
    $safe_post_marginbottom = intval($_POST['marginbottom']);
    $safe_post_paddingtop = intval($_POST['paddingtop']);
    $safe_post_paddingbottom = intval($_POST['paddingbottom']);
    $safe_post_bgcolor = sanitize_hex_color($_POST['bgcolor']);
    $safe_post_showarrows = intval($_POST['showarrows']);
    $safe_post_showreadmore = intval($_POST['showreadmore']);
    $safe_post_readmoretext = sanitize_text_field($_POST['readmoretext']);
    $safe_post_readmorestyle = sanitize_text_field($_POST['readmorestyle']);
    $safe_post_readmoreicon = sanitize_text_field($_POST['readmoreicon']);
    $safe_post_readmoresize = sanitize_text_field($_POST['readmoresize']);
    $safe_post_overlaycolor = sanitize_text_field($_POST['overlaycolor']);
    $safe_post_overlayopacity = sanitize_text_field($_POST['overlayopacity']);
    $safe_post_textcolor = sanitize_hex_color($_POST['textcolor']);
    $safe_post_overlayfontsize = intval($_POST['overlayfontsize']);
    $safe_post_textshadowcolor = sanitize_hex_color($_POST['textshadowcolor']);
    $safe_post_textshadowsize = intval($_POST['textshadowsize']);
    $safe_post_readmorealign = intval($_POST['readmorealign']);
    $safe_post_captionalign = intval($_POST['captionalign']);
    $safe_post_readmoremargin = sanitize_text_field($_POST['readmoremargin']);
    $safe_post_captionmargin = sanitize_text_field($_POST['captionmargin']);
    $safe_post_arrow_template = intval($_POST['arrow_template']);
    $safe_post_arrow_width = intval($_POST['arrow_width']);
    $safe_post_arrow_left_offset = intval($_POST['arrow_left_offset']);
    $safe_post_arrow_center_offset = intval($_POST['arrow_center_offset']);
    $safe_post_arrow_passive_opacity = intval($_POST['arrow_passive_opacity']);
    $safe_post_move_step = intval($_POST['move_step']);
    $safe_post_move_time = intval($_POST['move_time']);
    $safe_post_move_ease = intval($_POST['move_ease']);
    $safe_post_autoplay = intval($_POST['autoplay']);
    $safe_post_autoplay_start_timeout = intval($_POST['autoplay_start_timeout']);
    $safe_post_autoplay_hover_timeout = intval($_POST['autoplay_hover_timeout']);
    $safe_post_autoplay_step_timeout = intval($_POST['autoplay_step_timeout']);
    $safe_post_autoplay_evenly_speed = intval($_POST['autoplay_evenly_speed']);
    $safe_post_overlayanimationtype = intval($_POST['overlayanimationtype']);
    $safe_post_popup_max_size = intval($_POST['popup_max_size']);
    $safe_post_popup_item_min_width = intval($_POST['popup_item_min_width']);
    $safe_post_popup_use_back_img = intval($_POST['popup_use_back_img']);
    $safe_post_popup_arrow_passive_opacity = intval($_POST['popup_arrow_passive_opacity']);
    $safe_post_popup_arrow_left_offset = intval($_POST['popup_arrow_left_offset']);
    $safe_post_popup_arrow_min_height = intval($_POST['popup_arrow_min_height']);
    $safe_post_popup_arrow_max_height = intval($_POST['popup_arrow_max_height']);
    $safe_post_popup_showarrows = intval($_POST['popup_showarrows']);
    $safe_post_popup_image_order_opacity = intval($_POST['popup_image_order_opacity']);
    $safe_post_popup_image_order_top_offset = intval($_POST['popup_image_order_top_offset']);
    $safe_post_popup_show_orderdata = intval($_POST['popup_show_orderdata']);
    $safe_post_popup_icons_opacity = intval($_POST['popup_icons_opacity']);
    $safe_post_popup_show_icons = intval($_POST['popup_show_icons']);
    $safe_post_popup_autoplay_default = intval($_POST['popup_autoplay_default']);
    $safe_post_popup_closeonend = intval($_POST['popup_closeonend']);
    $safe_post_popup_autoplay_time = intval($_POST['popup_autoplay_time']);
    $safe_post_popup_open_event = intval($_POST['popup_open_event']);

    $safe_post_link_open_event = intval($_POST['link_open_event']);
    $safe_post_cis_touch_enabled = intval($_POST['cis_touch_enabled']);
    $safe_post_cis_inf_scroll_enabled = intval($_POST['cis_inf_scroll_enabled']);
    $safe_post_cis_mouse_scroll_enabled = intval($_POST['cis_mouse_scroll_enabled']);
    $safe_post_cis_item_correction_enabled = intval($_POST['cis_item_correction_enabled']);
    $safe_post_cis_animation_type = intval($_POST['cis_animation_type']);
    $safe_post_cis_item_hover_effect = intval($_POST['cis_item_hover_effect']);
    $safe_post_cis_items_appearance_effect = intval($_POST['cis_items_appearance_effect']);
    $safe_post_cis_overlay_type = intval($_POST['cis_overlay_type']);
    $safe_post_cis_touch_type = intval($_POST['cis_touch_type']);
    $safe_post_cis_font_family = sanitize_text_field($_POST['cis_font_family']);
    $safe_post_cis_font_effect = sanitize_text_field($_POST['cis_font_effect']);
    $safe_post_icons_size = intval($_POST['icons_size']);
    $safe_post_icons_margin = intval($_POST['icons_margin']);
    $safe_post_icons_offset = intval($_POST['icons_offset']);
    $safe_post_icons_animation = intval($_POST['icons_animation']);
    $safe_post_icons_color = intval($_POST['icons_color']);
    $safe_post_icons_valign = intval($_POST['icons_valign']);
    $safe_post_ov_items_offset = intval($_POST['ov_items_offset']);
    $safe_post_ov_items_m_offset = intval($_POST['ov_items_m_offset']);
    $safe_post_cis_button_font_family = isset($_POST['cis_button_font_family']) ? sanitize_text_field($_POST['cis_button_font_family']) : "";
    $safe_post_custom_css = isset($_POST['custom_css']) ? sanitize_textarea_field($_POST['custom_css']) : "";
    $safe_post_custom_js = isset($_POST['custom_js']) ? sanitize_textarea_field($_POST['custom_js']) : "";
    $safe_post_slider_full_size = intval($_POST['slider_full_size']);

    if ($id == 0 && $count_sliders < 1) {
        $sql = "SELECT MAX(`ordering`) FROM `" . $wpdb->prefix . "cis_sliders`";
        $max_order = $wpdb->get_var($sql) + 1;

        $wpdb->query($wpdb->prepare(
            "
			INSERT INTO " . $wpdb->prefix . "cis_sliders
			( 
				`name`,
				`published`,
				`id_category`,
				`width`,
				`height`,
				`itemsoffset`,
				`margintop`,
				`marginbottom`,
				`paddingtop`,
				`paddingbottom`,
				`bgcolor`,
				`showarrows`,
				`showreadmore`,
				`readmoretext`,
				`readmorestyle`,
				`readmoreicon`,
				`readmoresize`,
				`overlaycolor`,
				`overlayopacity`,
				`textcolor`,
				`overlayfontsize`,
				`textshadowcolor`,
				`textshadowsize`,
				`readmorealign`,
				`captionalign`,
				`readmoremargin`,
				`captionmargin`,
				`arrow_template`,
				`arrow_width`,
				`arrow_left_offset`,
				`arrow_center_offset`,
				`arrow_passive_opacity`,
				`move_step`,
				`move_time`,
				`move_ease`,
				`autoplay`,
				`autoplay_start_timeout`,
				`autoplay_hover_timeout`,
				`autoplay_step_timeout`,
				`autoplay_evenly_speed`,
				`overlayanimationtype`,
				`popup_max_size`,
				`popup_item_min_width`,
				`popup_use_back_img`,
				`popup_arrow_passive_opacity`,
				`popup_arrow_left_offset`,
				`popup_arrow_min_height`,
				`popup_arrow_max_height`,
				`popup_showarrows`,
				`popup_image_order_opacity`,
				`popup_image_order_top_offset`,
				`popup_show_orderdata`,
				`popup_icons_opacity`,
				`popup_show_icons`,
				`popup_autoplay_default`,
				`popup_closeonend`,
				`popup_autoplay_time`,
				`popup_open_event`,
				`ordering`,
				
				`link_open_event`,
				`cis_touch_enabled`,
				`cis_inf_scroll_enabled`,
				`cis_mouse_scroll_enabled`,
				`cis_item_correction_enabled`,
				`cis_animation_type`,
				`cis_item_hover_effect`,
				`cis_items_appearance_effect`,
				`cis_overlay_type`,
				`cis_touch_type`,
				`cis_font_family`,
				`cis_font_effect`,
				`icons_size`,
				`icons_margin`,
				`icons_offset`,
				`icons_animation`,
				`icons_color`,
				`icons_valign`,
				`ov_items_offset`,
				`ov_items_m_offset`,
				`cis_button_font_family`,
				`custom_css`,
				`custom_js`,
				`slider_full_size`
			)
			VALUES ( %s, %d, %d, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d, %s, %s, %s, %d)
			",
            $safe_post_name,
            $safe_post_published,
            $safe_post_id_category,
            $safe_post_width,
            $safe_post_height,
            $safe_post_itemsoffset,
            $safe_post_margintop,
            $safe_post_marginbottom,
            $safe_post_paddingtop,
            $safe_post_paddingbottom,
            $safe_post_bgcolor,
            $safe_post_showarrows,
            $safe_post_showreadmore,
            $safe_post_readmoretext,
            $safe_post_readmorestyle,
            $safe_post_readmoreicon,
            $safe_post_readmoresize,
            $safe_post_overlaycolor,
            $safe_post_overlayopacity,
            $safe_post_textcolor,
            $safe_post_overlayfontsize,
            $safe_post_textshadowcolor,
            $safe_post_textshadowsize,
            $safe_post_readmorealign,
            $safe_post_captionalign,
            $safe_post_readmoremargin,
            $safe_post_captionmargin,
            $safe_post_arrow_template,
            $safe_post_arrow_width,
            $safe_post_arrow_left_offset,
            $safe_post_arrow_center_offset,
            $safe_post_arrow_passive_opacity,
            $safe_post_move_step,
            $safe_post_move_time,
            $safe_post_move_ease,
            $safe_post_autoplay,
            $safe_post_autoplay_start_timeout,
            $safe_post_autoplay_hover_timeout,
            $safe_post_autoplay_step_timeout,
            $safe_post_autoplay_evenly_speed,
            $safe_post_overlayanimationtype,
            $safe_post_popup_max_size,
            $safe_post_popup_item_min_width,
            $safe_post_popup_use_back_img,
            $safe_post_popup_arrow_passive_opacity,
            $safe_post_popup_arrow_left_offset,
            $safe_post_popup_arrow_min_height,
            $safe_post_popup_arrow_max_height,
            $safe_post_popup_showarrows,
            $safe_post_popup_image_order_opacity,
            $safe_post_popup_image_order_top_offset,
            $safe_post_popup_show_orderdata,
            $safe_post_popup_icons_opacity,
            $safe_post_popup_show_icons,
            $safe_post_popup_autoplay_default,
            $safe_post_popup_closeonend,
            $safe_post_popup_autoplay_time,
            $safe_post_popup_open_event,
            $max_order,

            $safe_post_link_open_event,
            $safe_post_cis_touch_enabled,
            $safe_post_cis_inf_scroll_enabled,
            $safe_post_cis_mouse_scroll_enabled,
            $safe_post_cis_item_correction_enabled,
            $safe_post_cis_animation_type,
            $safe_post_cis_item_hover_effect,
            $safe_post_cis_items_appearance_effect,
            $safe_post_cis_overlay_type,
            $safe_post_cis_touch_type,
            $safe_post_cis_font_family,
            $safe_post_cis_font_effect,
            $safe_post_icons_size,
            $safe_post_icons_margin,
            $safe_post_icons_offset,
            $safe_post_icons_animation,
            $safe_post_icons_color,
            $safe_post_icons_valign,
            $safe_post_ov_items_offset,
            $safe_post_ov_items_m_offset,
            $safe_post_cis_button_font_family,
            $safe_post_custom_css,
            $safe_post_custom_js,
            $safe_post_slider_full_size
        ));

        $insrtid = (int)$wpdb->insert_id;
        if ($insrtid != 0) {
            if ($task == 'save')
                $redirect = "admin.php?page=cis_sliders&act=edit&id=" . $insrtid;
            elseif ($task == 'save_new')
                $redirect = "admin.php?page=cis_sliders&act=new";
            else
                $redirect = "admin.php?page=cis_sliders";
        } else
            $redirect = "admin.php?page=cis_sliders&error=1";
    } elseif ($id != 0) {
        $q = $wpdb->query($wpdb->prepare(
            "
			UPDATE " . $wpdb->prefix . "cis_sliders
			SET
				`name` = %s,
				`published` = %d,
				`id_category` = %d,
				`width` = %s,
				`height` = %s,
				`itemsoffset` = %s,
				`margintop` = %s,
				`marginbottom` = %s,
				`paddingtop` = %s,
				`paddingbottom` = %s,
				`bgcolor` = %s,
				`showarrows` = %s,
				`showreadmore` = %s,
				`readmoretext` = %s,
				`readmorestyle` = %s,
				`readmoreicon` = %s,
				`readmoresize` = %s,
				`overlaycolor` = %s,
				`overlayopacity` = %s,
				`textcolor` = %s,
				`overlayfontsize` = %s,
				`textshadowcolor` = %s,
				`textshadowsize` = %s,
				`readmorealign` = %s,
				`captionalign` = %s,
				`readmoremargin` = %s,
				`captionmargin` = %s,
				`arrow_template` = %s,
				`arrow_width` = %s,
				`arrow_left_offset` = %s,
				`arrow_center_offset` = %s,
				`arrow_passive_opacity` = %s,
				`move_step` = %s,
				`move_time` = %s,
				`move_ease` = %s,
				`autoplay` = %s,
				`autoplay_start_timeout` = %s,
				`autoplay_hover_timeout` = %s,
				`autoplay_step_timeout` = %s,
				`autoplay_evenly_speed` = %s,
				`overlayanimationtype` = %s,
				`popup_max_size` = %s,
				`popup_item_min_width` = %s,
				`popup_use_back_img` = %s,
				`popup_arrow_passive_opacity` = %s,
				`popup_arrow_left_offset` = %s,
				`popup_arrow_min_height` = %s,
				`popup_arrow_max_height` = %s,
				`popup_showarrows` = %s,
				`popup_image_order_opacity` = %s,
				`popup_image_order_top_offset` = %s,
				`popup_show_orderdata` = %s,
				`popup_icons_opacity` = %s,
				`popup_show_icons` = %s,
				`popup_autoplay_default` = %s,
				`popup_closeonend` = %s,
				`popup_autoplay_time` = %s,
				`popup_open_event` = %s,
				
				`link_open_event` = %d,
				`cis_touch_enabled` = %d,
				`cis_inf_scroll_enabled` = %d,
				`cis_mouse_scroll_enabled` = %d,
				`cis_item_correction_enabled` = %d,
				`cis_animation_type` = %d,
				`cis_item_hover_effect` = %d,
				`cis_items_appearance_effect` = %d,
				`cis_overlay_type` = %d,
				`cis_touch_type` = %d,
				`cis_font_family` = %s,
				`cis_font_effect` = %s,
				`icons_size` = %d,
				`icons_margin` = %d,
				`icons_offset` = %d,
				`icons_animation` = %d,
				`icons_color` = %d,
				`icons_valign` = %d,
				`ov_items_offset` = %d,
				`ov_items_m_offset` = %d,
				`cis_button_font_family` = %s,
				`custom_css` = %s,
				`custom_js` = %s,
				`slider_full_size` = %d
			WHERE
				`id` = '" . $id . "'
			",
            $safe_post_name,
            $safe_post_published,
            $safe_post_id_category,
            $safe_post_width,
            $safe_post_height,
            $safe_post_itemsoffset,
            $safe_post_margintop,
            $safe_post_marginbottom,
            $safe_post_paddingtop,
            $safe_post_paddingbottom,
            $safe_post_bgcolor,
            $safe_post_showarrows,
            $safe_post_showreadmore,
            $safe_post_readmoretext,
            $safe_post_readmorestyle,
            $safe_post_readmoreicon,
            $safe_post_readmoresize,
            $safe_post_overlaycolor,
            $safe_post_overlayopacity,
            $safe_post_textcolor,
            $safe_post_overlayfontsize,
            $safe_post_textshadowcolor,
            $safe_post_textshadowsize,
            $safe_post_readmorealign,
            $safe_post_captionalign,
            $safe_post_readmoremargin,
            $safe_post_captionmargin,
            $safe_post_arrow_template,
            $safe_post_arrow_width,
            $safe_post_arrow_left_offset,
            $safe_post_arrow_center_offset,
            $safe_post_arrow_passive_opacity,
            $safe_post_move_step,
            $safe_post_move_time,
            $safe_post_move_ease,
            $safe_post_autoplay,
            $safe_post_autoplay_start_timeout,
            $safe_post_autoplay_hover_timeout,
            $safe_post_autoplay_step_timeout,
            $safe_post_autoplay_evenly_speed,
            $safe_post_overlayanimationtype,
            $safe_post_popup_max_size,
            $safe_post_popup_item_min_width,
            $safe_post_popup_use_back_img,
            $safe_post_popup_arrow_passive_opacity,
            $safe_post_popup_arrow_left_offset,
            $safe_post_popup_arrow_min_height,
            $safe_post_popup_arrow_max_height,
            $safe_post_popup_showarrows,
            $safe_post_popup_image_order_opacity,
            $safe_post_popup_image_order_top_offset,
            $safe_post_popup_show_orderdata,
            $safe_post_popup_icons_opacity,
            $safe_post_popup_show_icons,
            $safe_post_popup_autoplay_default,
            $safe_post_popup_closeonend,
            $safe_post_popup_autoplay_time,
            $safe_post_popup_open_event,

            $safe_post_link_open_event,
            $safe_post_cis_touch_enabled,
            $safe_post_cis_inf_scroll_enabled,
            $safe_post_cis_mouse_scroll_enabled,
            $safe_post_cis_item_correction_enabled,
            $safe_post_cis_animation_type,
            $safe_post_cis_item_hover_effect,
            $safe_post_cis_items_appearance_effect,
            $safe_post_cis_overlay_type,
            $safe_post_cis_touch_type,
            $safe_post_cis_font_family,
            $safe_post_cis_font_effect,
            $safe_post_icons_size,
            $safe_post_icons_margin,
            $safe_post_icons_offset,
            $safe_post_icons_animation,
            $safe_post_icons_color,
            $safe_post_icons_valign,
            $safe_post_ov_items_offset,
            $safe_post_ov_items_m_offset,
            $safe_post_cis_button_font_family,
            $safe_post_custom_css,
            $safe_post_custom_js,
            $safe_post_slider_full_size
        ));

        if ($q !== false) {
            if ($task == 'save')
                $redirect = "admin.php?page=cis_sliders&act=edit&id=" . $id;
            elseif ($task == 'save_new')
                $redirect = "admin.php?page=cis_sliders&act=new";
            else
                $redirect = "admin.php?page=cis_sliders";
        } else
            $redirect = "admin.php?page=cis_sliders&error=1";
    } else {
        $redirect = "admin.php?page=cis_sliders&error=1";
    }
}
else {
    $redirect = "admin.php?page=cis_sliders&error=1";
}
header("Location: ".$redirect);
exit();
?>