<?php

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;

if(!defined('CIS_FILE_PATH')) {
	define('CIS_FILE_PATH', dirname(__FILE__) . '/');

}
require_once(CIS_FILE_PATH . 'parser.php');

function wpcis_creativeslider_shortcode_function( $atts ) {

	extract( shortcode_atts( array(
			'id' => 0,
	), $atts ) );

	wpcis_enqueue_front_scripts($id);
	return wpcis_render_html($id);


}
add_shortcode( 'creativeslider', 'wpcis_creativeslider_shortcode_function' );

//add_action('template_redirect','wpcis_my_shortcode_head');
function wpcis_my_shortcode_head(){
	global $posts;
	$pattern = get_shortcode_regex();
	preg_match('/(\[(creativeslider) id="([0-9]+)"\])/s', $posts[0]->post_content, $matches);
	if (is_array($matches) && $matches[2] == 'creativeslider') {
		$slider_id = (int) $matches[3];
		wpcis_enqueue_front_scripts($slider_id);
	}
}

function wpcis_enqueue_front_scripts($slider_id) {
	global $wpdb;
	
	wp_enqueue_style('wpcis-styles1', plugin_dir_url( __FILE__ ) . 'assets/css/main.css');
	wp_enqueue_style('wpcis-styles2', plugin_dir_url( __FILE__ ) . 'assets/css/creative_buttons.css');
	wp_enqueue_style('wpcis-styles3', plugin_dir_url( __FILE__ ) . 'assets/css/creativecss-ui.css');

	wp_enqueue_script('wpcis-script1', plugin_dir_url( __FILE__ ) . 'assets/js/mousewheel.js', array('jquery','jquery-ui-core','jquery-ui-widget'));
	wp_enqueue_script('wpcis-script2', plugin_dir_url( __FILE__ ) . 'assets/js/easing.js', array('jquery','jquery-ui-core','jquery-ui-widget'));
	wp_enqueue_script('wpcis-script3', plugin_dir_url( __FILE__ ) . 'assets/js/jquery.mobile.custom.js', array('jquery','jquery-ui-core','jquery-ui-widget'));
	wp_enqueue_script('wpcis-script4', plugin_dir_url( __FILE__ ) . 'assets/js/creativeimagesliderlightbox.js', array('jquery','jquery-ui-core','jquery-ui-widget'));
	wp_enqueue_script('wpcis-script5', plugin_dir_url( __FILE__ ) . 'assets/js/creativeimageslider.js', array('jquery','jquery-ui-core','jquery-ui-widget'));
	wp_enqueue_script('wpcis-script6', plugin_dir_url( __FILE__ ) . 'assets/js/main.js', array('jquery','jquery-ui-core','jquery-ui-widget'));
}

if(!function_exists('cis_hex2rgb')) {

	function cis_hex2rgb($hex) {
		$hex = str_replace("#", "", $hex);

		if(strlen($hex) == 3) {
			$r = hexdec(substr($hex,0,1).substr($hex,0,1));
			$g = hexdec(substr($hex,1,1).substr($hex,1,1));
			$b = hexdec(substr($hex,2,1).substr($hex,2,1));
		} else {
			$r = hexdec(substr($hex,0,2));
			$g = hexdec(substr($hex,2,2));
			$b = hexdec(substr($hex,4,2));
		}
		$rgb = array($r, $g, $b);
		return implode(",", $rgb); // returns the rgb values separated by commas
		//return $rgb; // returns an array with the rgb values
	}
}

function wpcis_get_slider_data($id)
{
	global $wpdb;

	$query = 'SELECT ' .
		'sp.id slider_id, ' .
		'sp.id_template, ' .
		'sp.width, ' .
		'sp.height, ' .
		'sp.itemsoffset, ' .
		'sp.margintop, ' .
		'sp.marginbottom, ' .
		'sp.paddingtop, ' .
		'sp.paddingbottom, ' .
		'sp.showarrows, ' .
		'sp.bgcolor, ' .
		'sp.showreadmore, ' .
		'sp.readmoretext, ' .
		'sp.readmorestyle, ' .
		'sp.readmoresize, ' .
		'sp.readmoreicon, ' .
		'sp.readmorealign, ' .
		'sp.readmoremargin, ' .
		'sp.captionalign, ' .
		'sp.captionmargin, ' .
		'sp.overlaycolor, ' .
		'sp.overlayopacity, ' .
		'sp.textcolor, ' .
		'sp.overlayfontsize, ' .
		'sp.textshadowcolor, ' .
		'sp.textshadowsize, ' .
		'sp.arrow_template, ' .
		'sp.arrow_width, ' .
		'sp.arrow_left_offset, ' .
		'sp.arrow_center_offset, ' .
		'sp.arrow_passive_opacity, ' .
		'sp.move_step, ' .
		'sp.move_time, ' .
		'sp.move_ease, ' .
		'sp.autoplay, ' .
		'sp.autoplay_start_timeout, ' .
		'sp.autoplay_hover_timeout, ' .
		'sp.autoplay_step_timeout, ' .
		'sp.autoplay_evenly_speed, ' .

		'sp.overlayanimationtype, ' .
		'sp.popup_max_size, ' .
		'sp.popup_item_min_width, ' .
		'sp.popup_use_back_img, ' .
		'sp.popup_arrow_passive_opacity, ' .
		'sp.popup_arrow_left_offset, ' .
		'sp.popup_arrow_min_height, ' .
		'sp.popup_arrow_max_height, ' .
		'sp.popup_showarrows, ' .
		'sp.popup_image_order_opacity, ' .
		'sp.popup_image_order_top_offset, ' .
		'sp.popup_show_orderdata, ' .
		'sp.popup_icons_opacity, ' .
		'sp.popup_show_icons, ' .
		'sp.popup_autoplay_default, ' .
		'sp.popup_closeonend, ' .
		'sp.popup_autoplay_time, ' .
		'sp.popup_open_event, ' .
		'sp.link_open_event, ' .

		// 3.0 options
		'sp.cis_touch_enabled, ' .
		'sp.cis_inf_scroll_enabled, ' .
		'sp.cis_mouse_scroll_enabled, ' .
		'sp.cis_item_correction_enabled, ' .
		'sp.cis_animation_type, ' .
		'sp.cis_item_hover_effect, ' .
		'sp.cis_items_appearance_effect, ' .
		'sp.cis_overlay_type, ' .
		'sp.cis_touch_type, ' .
		'sp.cis_font_family, ' .
		'sp.cis_font_effect, ' .
		'sp.icons_size, ' .
		'sp.icons_margin, ' .
		'sp.icons_offset, ' .
		'sp.icons_animation, ' .
		'sp.icons_color, ' .
		'sp.icons_valign, ' .
		'sp.cis_button_font_family, ' .
		'sp.ov_items_offset, ' .
		'sp.ov_items_m_offset, ' .
		'sp.custom_css, ' .
		'sp.custom_js,' .
		'sp.slider_full_size ' .

		'FROM ' .
		'`'.$wpdb->prefix.'cis_sliders` sp ' .
		'WHERE sp.published = \'1\' ' .
		'AND sp.id = \'' . $id . '\'';

	$results = $wpdb->get_results($query);
	return $results;
}

function wpcis_get_slider_items($id)
{
	global $wpdb;

	$query = 'SELECT '.
		'sa.id img_id, ' .
		'sa.name img_name, ' .
		'sa.img_name img_path, ' .
		'sa.img_url img_url_path ,' .
		'sa.caption ,' .
		'sa.showarrows item_showarrows, ' .
		'sa.showreadmore item_showreadmore, ' .
		'sa.readmoretext item_readmoretext, ' .
		'sa.readmorestyle item_readmorestyle, ' .
		'sa.readmoresize item_readmoresize, ' .
		'sa.readmoreicon item_readmoreicon, ' .
		'sa.readmorealign item_readmorealign, ' .
		'sa.readmoremargin item_readmoremargin, ' .
		'sa.captionalign item_captionalign, ' .
		'sa.captionmargin item_captionmargin, ' .
		'sa.overlaycolor item_overlaycolor, ' .
		'sa.overlayopacity item_overlayopacity, ' .
		'sa.textcolor item_textcolor, ' .
		'sa.overlayfontsize item_overlayfontsize, ' .
		'sa.textshadowcolor item_textshadowcolor, ' .
		'sa.textshadowsize item_textshadowsize, ' .
		'sa.overlayusedefault, ' .
		'sa.buttonusedefault, ' .
		'sa.redirect_url, ' .
		'sa.redirect_itemid, ' .
		'sa.redirect_target, ' .

		'sa.popup_img_name, ' .
		'sa.popup_img_url, ' .
		'sa.popup_open_event item_popup_open_event ' .

		'FROM '.
		'`'.$wpdb->prefix.'cis_images` sa '.
		'WHERE sa.published = \'1\' '.
		'AND sa.id_slider = \''.$id.'\''.
		'ORDER BY sa.ordering,sa.id';

		$results = $wpdb->get_results($query);
		return $results;
}

function wpcis_make_statistics() {
	if(!file_exists(ABSPATH.PLUGINDIR.'/creative-image-slider/wpcis.log') and is_writable(ABSPATH.PLUGINDIR.'/creative-image-slider')) 
	{
		// send domain, for usage statistics 
		// this will run only once

		$domain = $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

		if (strpos($domain, '/wp-admin/') !== false || strpos($domain, '/wp-json/') !== false || strpos($domain, '/wp-content/') !== false) 
		{
			return;
		}

		$context = stream_context_create(array('ssl'=>array(
		    'verify_peer' => false
		)));
		
		$fh = @fopen('https://creative-solutions.net/make-statistics?ext=cis-wp&domain='.$domain, 'r', false, $context);
		@fclose($fh);

		$fh = fopen(ABSPATH.PLUGINDIR.'/creative-image-slider/wpcis.log', 'a');
		fclose($fh);
	}
}

function wpcis_render_slider($id) {
	global $wpdb;
    global $wpcis_module_id;
    $wpcis_module_id ++;

    $module_id = $wpcis_module_id;
	//$module_id = 0;
	$id_slider = $id;

	$slider_data_array = wpcis_get_slider_data($id);
	$slider_data = $slider_data_array[0];

	//get items
	$slider_items = wpcis_get_slider_items($id);

	if(sizeof($slider_items) == 0) {
		return 'Creative Image Slider: Please add some items!';
	}

	wpcis_make_statistics();

	$cis_width = $slider_data->width;
	$cis_item_height = (int) $slider_data->height;
	$cis_id_template = (int) $slider_data->id_template;
	$cis_margintop = (int) $slider_data->margintop;
	$cis_marginbottom = (int) $slider_data->marginbottom;
	$cis_paddingtop = (int) $slider_data->paddingtop;
	$cis_paddingbottom = (int) $slider_data->paddingbottom;
	$cis_itemsoffset = (int) $slider_data->itemsoffset;
	$cis_showarrows = (int) $slider_data->showarrows;
	$cis_bgcolor =  $slider_data->bgcolor;
	$cis_showreadmore = (int) $slider_data->showreadmore;
	$cis_readmoretext =  $slider_data->readmoretext;
	$cis_readmorestyle =  $slider_data->readmorestyle;
	$cis_readmoresize =  $slider_data->readmoresize;
	$cis_readmoreicon =  $slider_data->readmoreicon;
	$cis_readmorealign =  (int) $slider_data->readmorealign;
	$cis_readmoremargin =  $slider_data->readmoremargin;
	$cis_overlaycolor =  $slider_data->overlaycolor;
	$cis_overlayopacity = (int) $slider_data->overlayopacity;
	$cis_textcolor = $slider_data->textcolor;
	$cis_overlayfontsize = (int) $slider_data->overlayfontsize;
	$cis_textshadowcolor =  $slider_data->textshadowcolor;
	$cis_textshadowsize = (int) $slider_data->textshadowsize;
	$cis_captionalign = (int) $slider_data->captionalign;
	$cis_captionmargin = $slider_data->captionmargin;

	$cis_arrow_template = $slider_data->arrow_template;
	$cis_arrow_width = $slider_data->arrow_width;
	$cis_arrow_left_offset = $slider_data->arrow_left_offset;
	$cis_arrow_center_offset = $slider_data->arrow_center_offset;
	$cis_arrow_passive_opacity = $slider_data->arrow_passive_opacity;

	$cis_move_step = $slider_data->move_step;
	$cis_move_time = $slider_data->move_time;
	$cis_move_ease = $slider_data->move_ease;
	$cis_autoplay = $slider_data->autoplay;
	$cis_autoplay_start_timeout = $slider_data->autoplay_start_timeout;
	$cis_autoplay_hover_timeout = $slider_data->autoplay_hover_timeout;
	$cis_autoplay_step_timeout = $slider_data->autoplay_step_timeout;
	$cis_autoplay_evenly_speed = $slider_data->autoplay_evenly_speed;

	$cis_overlayanimationtype = (int) $slider_data->overlayanimationtype;

	// this section is used for js in cis_popup_data element
	$cis_popup_max_size = (int) $slider_data->popup_max_size;
	$cis_popup_item_min_width = (int) $slider_data->popup_item_min_width;
	$cis_popup_use_back_img = (int) $slider_data->popup_use_back_img;
	$cis_popup_arrow_passive_opacity = (int) $slider_data->popup_arrow_passive_opacity;
	$cis_popup_arrow_left_offset = (int) $slider_data->popup_arrow_left_offset;
	$cis_popup_arrow_min_height= (int) $slider_data->popup_arrow_min_height;
	$cis_popup_arrow_max_height = (int) $slider_data->popup_arrow_max_height;
	$cis_popup_showarrows = (int) $slider_data->popup_showarrows;
	$cis_popup_image_order_opacity = (int) $slider_data->popup_image_order_opacity;
	$cis_popup_image_order_top_offset = (int) $slider_data->popup_image_order_top_offset;
	$cis_popup_show_orderdata= (int) $slider_data->popup_show_orderdata;
	$cis_popup_icons_opacity = (int) $slider_data->popup_icons_opacity;
	$cis_popup_show_icons = (int) $slider_data->popup_show_icons;
	$cis_popup_autoplay_default = (int) $slider_data->popup_autoplay_default;
	$cis_popup_closeonend = (int) $slider_data->popup_closeonend;
	$cis_popup_autoplay_time = (int) $slider_data->popup_autoplay_time;

	// 3.0 options
	$cis_link_open_event = (int) $slider_data->link_open_event;
	$cis_popup_open_event = (int) $slider_data->popup_open_event;

	$cis_touch_enabled = (int) $slider_data->cis_touch_enabled; // 0 - disabled, 1 - enabled, 2 - only on touch devices
	$cis_inf_scroll_enabled = (int) $slider_data->cis_inf_scroll_enabled;
	$cis_mouse_scroll_enabled = (int) $slider_data->cis_mouse_scroll_enabled;
	$cis_item_correction_enabled = (int) $slider_data->cis_item_correction_enabled;

	// options to add in html
	$cis_animation_type = (int) $slider_data->cis_animation_type;
	$cis_item_hover_effect = (int) $slider_data->cis_item_hover_effect;
	$cis_items_appearance_effect = (int) $slider_data->cis_items_appearance_effect;
	$cis_overlay_type = (int) $slider_data->cis_overlay_type;
	$cis_touch_type = (int) $slider_data->cis_touch_type;

	$cis_icons_size = (int) $slider_data->icons_size;
	$cis_icons_margin = (int) $slider_data->icons_margin;
	$cis_icons_offset = (int) $slider_data->icons_offset;
	$cis_icons_animation = (int) $slider_data->icons_animation;
	$cis_icons_color = (int) $slider_data->icons_color;
	$cis_icons_valign = (int) $slider_data->icons_valign;

	$cis_font_family = $slider_data->cis_font_family;
	$cis_button_font_family = $slider_data->cis_button_font_family;
	$cis_font_effect = $slider_data->cis_font_effect;

	$cis_ov_items_offset = $slider_data->ov_items_offset;
	$cis_ov_items_m_offset = $slider_data->ov_items_m_offset;
	$cis_custom_css = stripslashes($slider_data->custom_css);
	$cis_custom_js = stripslashes($slider_data->custom_js);

	$cis_slider_full_size = $slider_data->slider_full_size;

	// add google font
	$cis_googlefont = 'cis-googlewebfont-';
	$cis_google_fonts = '';
	if (strpos($cis_font_family,$cis_googlefont) !== false) {
		$cis_google_fonts = str_replace($cis_googlefont, '', $cis_font_family);
		$cis_font_family = str_replace($cis_googlefont, '', $cis_font_family);
	}
	if (strpos($cis_button_font_family,$cis_googlefont) !== false) {
		$cis_google_fonts = $cis_google_fonts . '|' . str_replace($cis_googlefont, '', $cis_button_font_family);
		$cis_button_font_family = str_replace($cis_googlefont, '', $cis_button_font_family);
	}
	$cis_google_fonts = trim($cis_google_fonts,'|');

	if($cis_google_fonts != '') {
		$cis_google_font_link = 'https://fonts.googleapis.com/css?family='.$cis_google_fonts;
		$cis_google_fonts_css_link = '<link rel="stylesheet" type="text/css" href="'.$cis_google_font_link.'">';
	}
	else {
		$cis_google_fonts_css_link  = '';
	}

	// get buttons
	$left_button_src = plugin_dir_url( __FILE__ ) .'/assets/images/arrows/cis_button_left'.$cis_arrow_template.'.png';
	$right_button_src = plugin_dir_url( __FILE__ ) .'/assets/images/arrows/cis_button_right'.$cis_arrow_template.'.png';

	// get options data
	$cis_arrow_data = $cis_arrow_width.','.$cis_arrow_left_offset.','.$cis_arrow_center_offset.','.$cis_arrow_passive_opacity.','.$cis_showarrows;
	$cis_moving_data = $cis_move_step.','.$cis_move_time.','.$cis_move_ease.','.$cis_autoplay.','.$cis_autoplay_start_timeout.','.$cis_autoplay_step_timeout.','.$cis_autoplay_evenly_speed.','.$cis_autoplay_hover_timeout;
	$cis_popup_data = $cis_popup_max_size.','.$cis_popup_item_min_width.','.$cis_popup_use_back_img.','.$cis_popup_arrow_passive_opacity.','.$cis_popup_arrow_left_offset.','.$cis_popup_arrow_min_height.','.$cis_popup_arrow_max_height.','.$cis_popup_showarrows.','.$cis_popup_image_order_opacity.','.$cis_popup_image_order_top_offset.','.$cis_popup_show_orderdata.','.$cis_popup_icons_opacity.','.$cis_popup_show_icons.','.$cis_popup_autoplay_default.','.$cis_popup_closeonend.','.$cis_popup_autoplay_time;
	$cis_options_data = $cis_animation_type.','.$cis_item_hover_effect.','.$cis_items_appearance_effect.','.$cis_overlay_type.','.$cis_touch_type.','.$cis_icons_size.','.$cis_icons_margin.','.$cis_icons_offset.','.$cis_icons_animation.','.$cis_icons_color.','.$cis_icons_valign.','.$cis_ov_items_offset.','.$cis_ov_items_m_offset.','.$cis_showreadmore;

	$wrapper = new cis_template_parser;

	$wrapper->get_tpl(CIS_FILE_PATH . 'templates/wrapper.tpl');

	$wrapper->set_tpl('{MAIN_PATH}',  plugin_dir_url( __FILE__ ));
	$wrapper->set_tpl('{SLIDER_ID}',  $id);
	$wrapper->set_tpl('{MODULE_ID}',  $module_id);
	$wrapper->set_tpl('{OVERLAY_ANIMATION_TYPE}', $cis_overlayanimationtype);
	$wrapper->set_tpl('{OVERLAY_TYPE}', $cis_overlay_type);
	$wrapper->set_tpl('{INF_SCROLL_ENABLED}', $cis_inf_scroll_enabled);
	$wrapper->set_tpl('{MOUSE_SCROLL_ENABLED}', $cis_mouse_scroll_enabled);
	$wrapper->set_tpl('{TOUCH_ENABLED}', $cis_touch_enabled);
	$wrapper->set_tpl('{ITEM_CORRECTION_ENABLED}', $cis_item_correction_enabled);
	$wrapper->set_tpl('{POPUP_EVENT}', $cis_popup_open_event);
	$wrapper->set_tpl('{LINK_EVENT}', $cis_link_open_event);
	$wrapper->set_tpl('{WRAPPER_CLASS}',  'cis_wrapper_' . $module_id . '_' . $id);
	$wrapper->set_tpl('{LEFT_BUTTON_SRC}', $left_button_src);
	$wrapper->set_tpl('{RIGHT_BUTTON_SRC}', $right_button_src);
	$wrapper->set_tpl('{CIS_ARROW_DATA}', $cis_arrow_data);
	$wrapper->set_tpl('{CIS_MOVING_DATA}', $cis_moving_data);
	$wrapper->set_tpl('{CIS_POPUP_DATA}', $cis_popup_data);
	$wrapper->set_tpl('{CIS_OPTIONS_DATA}', $cis_options_data);
	$wrapper->set_tpl('{ITEMS_HEIGHT}', $cis_item_height);
	$wrapper->set_tpl('{SLIDER_FULL_SIZE}', $cis_slider_full_size);

	$items_css = '';
	$loader_color_class = 'cis_row_item_loader_color1';
	$items = '';
	foreach($slider_items as $k => $slider_item) {
		//get image
		$img_path = $slider_item->img_path != '' ? $slider_item->img_path : $slider_item->img_url_path;

		//get popup image
		$popup_img_src = '';
		if( ($slider_item->item_popup_open_event != 2 && $slider_item->item_popup_open_event != 3)  && !($slider_item->item_popup_open_event == 4 && ($cis_popup_open_event == 2 && $cis_popup_open_event == 3)) ) {//check if popup enabled

			//if we have uploaded popup image
			if($slider_item->popup_img_name != '') {
				$popup_img_src = $slider_item->popup_img_name;
			}
			elseif($slider_item->popup_img_url != '') {
				$popup_img_src = $slider_item->popup_img_url;
			}
			else {
				$popup_img_src = ($slider_item->img_path != '') ? $slider_item->img_path : $slider_item->img_url_path;
			}
		}

		$loader_color_class = $loader_color_class == 'cis_row_item_loader_color1' ? 'cis_row_item_loader_color2' : 'cis_row_item_loader_color1';

		//get click url
		$click_url = $slider_item->redirect_url;

		//is button visible
		$cis_button_visible = (($slider_item->buttonusedefault == 0 && $cis_showreadmore == 1) || ($slider_item->buttonusedefault == 1 && $slider_item->item_showreadmore == 1)) ? 1 : 0;

		//overlay
		$cis_row_item_overlay_class = $cis_overlay_type == 1 ? 'cis_height_100_perc' : '';

		//item name
		$item_name_html = '';
		if($cis_showreadmore == 1) {

			// add ful size class
			$cis_row_item_txt_wrapper_class = $cis_overlay_type == 1 ? 'cis_position_absolute cis_align_center' : '';
			$cis_row_item_overlay_txt_class = $cis_overlay_type == 1 ? 'cis_margin_0' : '';

			$item_name = new cis_template_parser;
			$item_name->get_tpl(CIS_FILE_PATH . 'templates/item_name.tpl');

			$item_name->set_tpl('{ITEM_NAME_CLASS}', $cis_row_item_txt_wrapper_class);
			$item_name->set_tpl('{ITEM_OVERLAY_CLASS}', $cis_row_item_overlay_txt_class);
			$item_name->set_tpl('{ITEM_NAME_FONT_EFFECT_CLASS}', $cis_font_effect);
			$item_name->set_tpl('{ITEM_NAME}', $slider_item->img_name);

			$item_name->tpl_parse();
			$item_name_html = $item_name->template;
			unset($item_name);
		}

		//button
		$item_button_html = '';
		if($cis_popup_open_event == 2 || $cis_link_open_event == 2) {

			//click target
			$click_target = $slider_item->redirect_target == 0 ? '' : ' target="_blank"';

			//read more text
			$item_readmoretext = $cis_readmoretext;

			//button styles
			$button_style = 'creative_btn-' . $cis_readmorestyle;
			$button_size = 'creative_btn-' . $cis_readmoresize;
			$button_icon_color = $cis_readmorestyle == 'gray' ? 'white' : 'white';
			$button_icon_html = $cis_readmoreicon == 'none' ? '' : '<i class="creative_icon-'.$button_icon_color.' creative_icon-'.$cis_readmoreicon.'"></i> ';

			// add full size class
			$cis_btn_wrapper_class = $cis_overlay_type == 1 ? 'cis_position_absolute cis_align_center' : '';
			$cis_creative_btn_class = $cis_overlay_type == 1 ? 'cis_margin_0' : '';

			$item_button = new cis_template_parser;
			$item_button->get_tpl(CIS_FILE_PATH . 'templates/item_button.tpl');

			$item_button->set_tpl('{BUTTON_WRAPPER_CLASS}', $cis_btn_wrapper_class);
			$item_button->set_tpl('{CLICK_URL}', $click_url);
			$item_button->set_tpl('{BUTTON_STYLE}', $button_style);
			$item_button->set_tpl('{BUTTON_SIZE}', $button_size);
			$item_button->set_tpl('{BUTTON_CLASS}', $cis_creative_btn_class);
			$item_button->set_tpl('{CLICK_TARGET}', $click_target);
			$item_button->set_tpl('{BUTTON_ICON_HTML}', $button_icon_html);
			$item_button->set_tpl('{BUTTON_TEXT}', $item_readmoretext);

			$item_button->tpl_parse();
			$item_button_html = $item_button->template;
			unset($item_button);
		}

		$item = new cis_template_parser;

		$item->get_tpl(CIS_FILE_PATH . 'templates/item.tpl');

		$item->set_tpl('{ITEM_ID}', $slider_item->img_id);
		$item->set_tpl('{POPUP_IMG_SRC}', $popup_img_src);
		$item->set_tpl('{ITEM_CAPTION}', stripslashes($slider_item->caption));
		$item->set_tpl('{LOADER_COLOR_CLASS}', $loader_color_class);
		$item->set_tpl('{ITEM_HEIGHT}', $cis_item_height);
		$item->set_tpl('{IMG_PATH}', $img_path);
		$item->set_tpl('{ITEM_NAME}', $slider_item->img_name);
		$item->set_tpl('{OVERLAY_CLASS}', $cis_row_item_overlay_class);
		$item->set_tpl('{POPUP_EVENT}', $cis_popup_open_event);
		$item->set_tpl('{LINK_EVENT}', $cis_link_open_event);
		$item->set_tpl('{CLICK_URL}', $click_url);
		$item->set_tpl('{CLICK_TARGET}', $slider_item->redirect_target);
		$item->set_tpl('{BUTTON_VISIBLE}', $cis_button_visible);
		$item->set_tpl('{ITEM_NAME_HTML}', $item_name_html);
		$item->set_tpl('{ITEM_BUTTON_HTML}', $item_button_html);

		$item->tpl_parse();
		$items = $items . $item->template;
		unset($item);
	}

	$wrapper->set_tpl('{ITEMS}', $items);

	//generate css
	$cis_overlaycolor_rgb = cis_hex2rgb($cis_overlaycolor);
	$cis_overlayopacity = $cis_overlayopacity / 100;
	$cis_overlaycolor_rgba = 'rgba('.$cis_overlaycolor_rgb.','.$cis_overlayopacity.')';

	//get txt text shadow;
	if($cis_textshadowsize == 0)
		$cis_textshadow_rule = 'text-shadow: none;';
	elseif($cis_textshadowsize == 1)
		$cis_textshadow_rule = 'text-shadow: -1px 2px 0px '.$cis_textshadowcolor.';';
	elseif($cis_textshadowsize == 2)
		$cis_textshadow_rule = 'text-shadow: -1px 2px 2px '.$cis_textshadowcolor.';';
	elseif($cis_textshadowsize == 3)
		$cis_textshadow_rule = 'text-shadow: -1px 2px 4px '.$cis_textshadowcolor.';';

	$cis_css = '';
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.'.cis_main_wrapper {';
	if($cis_slider_full_size != 1)
		$cis_css .= 'width: '.$cis_width.'!important;';
	$cis_css .= 'margin: '.$cis_margintop.'px auto '.$cis_marginbottom.'px;';
	$cis_css .= 'padding: '.$cis_paddingtop.'px 0px '.$cis_paddingbottom.'px 0px;';
	$cis_css .= 'background-color: '.$cis_bgcolor.';';
	$cis_css .= '}';
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.' .cis_row_item_overlay {';
	$cis_css .= 'background-color: '.$cis_overlaycolor.';';
	$cis_css .= 'background-color: '.$cis_overlaycolor_rgba.';';
	$cis_ta = $cis_readmorealign == 2 ? 'center' : 'left';
	$cis_css .= 'text-align: '.$cis_ta.';';
	$cis_css .= '}';
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.' .cis_row_item {';
	$cis_css .= 'margin-right: '.$cis_itemsoffset.'px;';
	$cis_css .= '}';
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.' .cis_row_item_overlay_txt {';
	$cis_css .= $cis_textshadow_rule;
	$cis_css .= 'font-size: '.$cis_overlayfontsize.'px;';
	$cis_css .= 'color: '.$cis_textcolor.';';
	$cis_css .= 'margin: '.$cis_captionmargin.';';
	$cis_text_align = $cis_captionalign == 0 ? 'left' : ($cis_captionalign == 1 ? 'right' : 'center');
	$cis_css .= 'text-align: '.$cis_text_align.';';
	$cis_css .= '}';
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.' .creative_btn {';
	$cis_css .= 'margin: '.$cis_readmoremargin.';';
	$cis_float = $cis_readmorealign == 0 ? 'left' : ($cis_readmorealign == 1 ? 'right' : 'none');
	$cis_css .= 'float: '.$cis_float.';';
	$cis_css .= '}';

	// 3.0 updates
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.' .cis_row_item_txt_wrapper {';
	$cis_css .= 'font-family: '.$cis_font_family.';';
	$cis_css .= '}';
	$cis_css .= '#cis_slider_'.$id_slider.'_'.$module_id.' .cis_btn_wrapper {';
	$cis_css .= 'font-family: '.$cis_button_font_family.';';
	$cis_css .= '}';

	// cusstom css
	$cis_custom_css = str_replace('SLIDER_ID', $id_slider.'_'.$module_id, $cis_custom_css);
	$cis_css_render =  '<style>'.$cis_css.$cis_custom_css.'</style>';

	// custom js
	$cis_js_render = '';
	if($cis_custom_js != '') {
		$cis_custom_js = str_replace('SLIDER_ID', $id_slider.'_'.$module_id, $cis_custom_js);
		$cis_js_render = '<script type="text/javascript">(function($) {$(document).ready(function() {'.$cis_custom_js.'})})(jQuery);</script>';
	}

	$wrapper->set_tpl('{STYLES}', $cis_css_render);
	$wrapper->set_tpl('{GOOGLE_FONTS}', $cis_google_fonts_css_link);
	$wrapper->set_tpl('{JAVASCRIPT}', $cis_js_render);

	$wrapper->tpl_parse();
	return $wrapper->template;

}

function wpcis_render_html($slider_id)
{
	return wpcis_render_slider($slider_id);
}
?>