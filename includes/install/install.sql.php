<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;
global $wpscf_db_version;

delete_option("wpcis_db_version");
add_option("wpcis_db_version", $wpcis_db_version);

require_once(ABSPATH . '/wp-admin/includes/upgrade.php');

$sql =
"
CREATE TABLE `".$wpdb->prefix."cis_sliders` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(10) unsigned NOT NULL,
  `id_category` int(10) unsigned NOT NULL,
  `id_template` smallint(5) unsigned NOT NULL,
  `name` text NOT NULL,
  `width` text NOT NULL,
  `height` int(10) unsigned NOT NULL,
  `margintop` int(10) unsigned NOT NULL,
  `marginbottom` int(10) unsigned NOT NULL,
  `itemsoffset` int(10) unsigned NOT NULL,
  `paddingtop` int(10) unsigned NOT NULL,
  `paddingbottom` int(10) unsigned NOT NULL,
  `bgcolor` text NOT NULL,
  `readmoresize` text NOT NULL,
  `readmoreicon` text NOT NULL,
  `showreadmore` tinyint(3) unsigned NOT NULL default '1',
  `readmoretext` text NOT NULL,
  `readmorestyle` text NOT NULL,
  `overlaycolor` text NOT NULL,
  `overlayopacity` tinyint(3) unsigned NOT NULL,
  `textcolor` text NOT NULL,
  `overlayfontsize` int(10) unsigned NOT NULL,
  `textshadowcolor` text NOT NULL,
  `textshadowsize` tinyint(3) unsigned NOT NULL,
  `showarrows` tinyint(3) unsigned NOT NULL,
  `readmorealign` tinyint(3) unsigned NOT NULL,
  `readmoremargin` text NOT NULL,
  `captionalign` tinyint(3) unsigned NOT NULL,
  `captionmargin` text NOT NULL,
  `alias` text NOT NULL,
  `created` datetime NOT NULL,
  `publish_up` datetime NOT NULL,
  `publish_down` datetime NOT NULL,
  `published` tinyint(1) NOT NULL,
  `checked_out` int(10) unsigned NOT NULL,
  `checked_out_time` datetime NOT NULL,
  `access` int(10) unsigned NOT NULL,
  `featured` tinyint(3) unsigned NOT NULL,
  `ordering` int(11) NOT NULL,
  `language` char(7) NOT NULL,
  `arrow_template` smallint(5) unsigned NOT NULL DEFAULT '37',
  `arrow_width` smallint(5) unsigned NOT NULL DEFAULT '32',
  `arrow_left_offset` smallint(5) unsigned NOT NULL DEFAULT '10',
  `arrow_center_offset` smallint(6) NOT NULL DEFAULT '0',
  `arrow_passive_opacity` smallint(5) unsigned NOT NULL DEFAULT '70',
  `move_step` int(10) unsigned NOT NULL DEFAULT '600',
  `move_time` int(10) unsigned NOT NULL DEFAULT '600',
  `move_ease` int(10) unsigned NOT NULL DEFAULT '60',
  `autoplay` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `autoplay_start_timeout` int(10) unsigned NOT NULL DEFAULT '3000',
  `autoplay_step_timeout` int(10) unsigned NOT NULL DEFAULT '5000',
  `autoplay_evenly_speed` int(10) unsigned NOT NULL DEFAULT '28',
  `autoplay_hover_timeout` int(10) unsigned NOT NULL DEFAULT '800',
  `overlayanimationtype` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `popup_max_size` tinyint(3) unsigned NOT NULL DEFAULT '90',
  `popup_item_min_width` smallint(5) unsigned NOT NULL DEFAULT '300',
  `popup_use_back_img` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `popup_arrow_passive_opacity` tinyint(3) unsigned NOT NULL DEFAULT '70',
  `popup_arrow_left_offset` tinyint(3) unsigned NOT NULL DEFAULT '12',
  `popup_arrow_min_height` tinyint(3) unsigned NOT NULL DEFAULT '25',
  `popup_arrow_max_height` tinyint(3) unsigned NOT NULL DEFAULT '50',
  `popup_showarrows` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `popup_image_order_opacity` tinyint(3) unsigned NOT NULL DEFAULT '70',
  `popup_image_order_top_offset` tinyint(3) unsigned NOT NULL DEFAULT '12',
  `popup_show_orderdata` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `popup_icons_opacity` tinyint(3) unsigned NOT NULL DEFAULT '50',
  `popup_show_icons` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `popup_autoplay_default` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `popup_closeonend` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `popup_autoplay_time` int(10) unsigned NOT NULL DEFAULT '5000',
  `popup_open_event` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `link_open_event` tinyint(3) unsigned NOT NULL DEFAULT '3',
  `cis_touch_enabled` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cis_inf_scroll_enabled` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cis_mouse_scroll_enabled` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cis_item_correction_enabled` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `cis_animation_type` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cis_item_hover_effect` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `cis_overlay_type` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cis_touch_type` tinyint(3) unsigned NOT NULL DEFAULT '2',
  `cis_font_family` text NOT NULL,
  `cis_font_effect` text NOT NULL,
  `cis_items_appearance_effect` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `icons_size` tinyint(3) unsigned NOT NULL DEFAULT '40',
  `icons_margin` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `icons_offset` tinyint(3) unsigned NOT NULL DEFAULT '5',
  `icons_animation` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `icons_color` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `icons_valign` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `ov_items_offset` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `ov_items_m_offset` smallint(6) NOT NULL DEFAULT '0',
  `cis_button_font_family` text NOT NULL,
  `custom_css` text NOT NULL,
  `custom_js` text NOT NULL,
  `slider_full_size` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM CHARACTER SET = `utf8`;
";
dbDelta($sql);
$sql =
"
INSERT IGNORE INTO `".$wpdb->prefix."cis_sliders` (`id`, `id_user`, `id_category`, `id_template`, `name`, `width`, `height`, `margintop`, `marginbottom`, `itemsoffset`, `paddingtop`, `paddingbottom`, `bgcolor`, `readmoresize`, `readmoreicon`, `showreadmore`, `readmoretext`, `readmorestyle`, `overlaycolor`, `overlayopacity`, `textcolor`, `overlayfontsize`, `textshadowcolor`, `textshadowsize`, `showarrows`, `readmorealign`, `readmoremargin`, `captionalign`, `captionmargin`, `alias`, `created`, `publish_up`, `publish_down`, `published`, `checked_out`, `checked_out_time`, `access`, `featured`, `ordering`, `language`, `arrow_template`, `arrow_width`, `arrow_left_offset`, `arrow_center_offset`, `arrow_passive_opacity`, `move_step`, `move_time`, `move_ease`, `autoplay`, `autoplay_start_timeout`, `autoplay_step_timeout`, `autoplay_evenly_speed`, `autoplay_hover_timeout`, `overlayanimationtype`, `popup_max_size`, `popup_item_min_width`, `popup_use_back_img`, `popup_arrow_passive_opacity`, `popup_arrow_left_offset`, `popup_arrow_min_height`, `popup_arrow_max_height`, `popup_showarrows`, `popup_image_order_opacity`, `popup_image_order_top_offset`, `popup_show_orderdata`, `popup_icons_opacity`, `popup_show_icons`, `popup_autoplay_default`, `popup_closeonend`, `popup_autoplay_time`, `popup_open_event`) VALUES
(1, 0, 1, 1, 'BMW i8 [Slider Example]', '100%', 200, 0, 0, 2, 2, 2, '#000000', 'mini', 'picture', 1, 'View Image', 'red', '#000000', 50, '#ffffff', 15, '#000000', 2, 1, 2, '0px 10px 10px 10px', 2, '10px 15px 30px 15px', '', '2014-01-16 20:51:38', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 0, '0000-00-00 00:00:00', 0, 0, 1, '', 39, 32, 10, 0, 70, 600, 600, 60, 1, 3000, 5000, 25, 800, 0, 90, 150, 1, 70, 12, 30, 50, 1, 70, 12, 1, 50, 1, 1, 1, 5000, 0);
";
$wpdb->query($sql);

$sql =
"
CREATE TABLE `".$wpdb->prefix."cis_images` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(10) unsigned NOT NULL,
  `id_slider` int(10) unsigned NOT NULL,
  `name` text NOT NULL,
  `img_name` text NOT NULL,
  `img_url` text NOT NULL,
  `readmoresize` text NOT NULL,
  `readmoreicon` text NOT NULL,
  `showreadmore` tinyint(3) unsigned NOT NULL,
  `readmoretext` text NOT NULL,
  `readmorestyle` text NOT NULL,
  `overlaycolor` text NOT NULL,
  `overlayopacity` tinyint(3) unsigned NOT NULL,
  `textcolor` text NOT NULL,
  `overlayfontsize` int(10) unsigned NOT NULL,
  `textshadowcolor` text NOT NULL,
  `textshadowsize` tinyint(3) unsigned NOT NULL,
  `showarrows` tinyint(3) unsigned NOT NULL,
  `readmorealign` tinyint(3) unsigned NOT NULL,
  `readmoremargin` text NOT NULL,
  `captionalign` tinyint(3) unsigned NOT NULL,
  `captionmargin` text NOT NULL,
  `overlayusedefault` tinyint(3) unsigned NOT NULL,
  `buttonusedefault` tinyint(3) unsigned NOT NULL,
  `caption` text NOT NULL,
  `redirect_url` text NOT NULL,
  `redirect_itemid` int(10) unsigned NOT NULL,
  `redirect_target` smallint(3) unsigned NOT NULL,
  `published` tinyint(1) NOT NULL,
  `publish_up` datetime NOT NULL,
  `publish_down` datetime NOT NULL,
  `created` datetime NOT NULL,
  `ordering` mediumint(8) unsigned NOT NULL,
  `popup_img_name` text NOT NULL,
  `popup_img_url` text NOT NULL,
  `popup_open_event` tinyint(3) unsigned NOT NULL DEFAULT '4',
  PRIMARY KEY (`id`),
  KEY `id_slider` (`id_slider`),
  KEY `id_user` (`id_user`),
  KEY `ordering` (`ordering`)
) ENGINE=MyISAM CHARACTER SET = `utf8`;
";
dbDelta($sql);
$sql =
"
INSERT IGNORE INTO `".$wpdb->prefix."cis_images` (`id`, `id_user`, `id_slider`, `name`, `img_name`, `img_url`, `readmoresize`, `readmoreicon`, `showreadmore`, `readmoretext`, `readmorestyle`, `overlaycolor`, `overlayopacity`, `textcolor`, `overlayfontsize`, `textshadowcolor`, `textshadowsize`, `showarrows`, `readmorealign`, `readmoremargin`, `captionalign`, `captionmargin`, `overlayusedefault`, `buttonusedefault`, `caption`, `redirect_url`, `redirect_itemid`, `redirect_target`, `published`, `publish_up`, `publish_down`, `created`, `ordering`, `popup_img_name`, `popup_img_url`, `popup_open_event`) VALUES
(1, 0, 1, '2015 BMW i8 is an Icon of Progress...', '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-1-tmb.jpg', 'normal', 'pencil', 1, 'Read More!', 'red', '#000000', 50, '#ffffff', 18, '#000000', 2, 0, 1, '0px 10px 10px 10px', 0, '10px 15px 10px 15px', 0, 0, 'Sometimes it is time to leave the city. Escape the restrictions of everyday life. The <a href=\"http://en.wikipedia.org/wiki/BMW_i8\" target=\"_blank\">BMW i8</a> is an icon of progress. It combines the energizing performance of a sports car with benchmark efficiency. <a href=\"https://www.youtube.com/watch?v=8Eajqcnc43U\" target=\"_blank\">View Trailer.</a>', '#', 104, 0, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2014-02-27 06:34:40', 1, '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-1.jpg', 4),
(2, 0, 1, 'The BMW i8 is a Plug-in Hybrid Sports Car Developed by BMW.', '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-2-tmb.jpg', 'normal', 'pencil', 1, 'Read More!', 'red', '#000000', 50, '#ffffff', 18, '#000000', 2, 0, 1, '0px 10px 10px 10px', 0, '10px 15px 10px 15px', 0, 0, 'The BMW i8, first introduced as the BMW Concept Vision Efficient Dynamics, is a <a href=\"http://en.wikipedia.org/wiki/Plug-in_hybrid\" target=\"_blank\">plug-in hybrid sports car</a> developed by BMW. The 2015 model year BMW i8 has a 7.1 kWh lithium-ion battery pack that delivers an all-electric range of 37 km (23 mi) under the New European Driving Cycle. <a href=\"http://en.wikipedia.org/wiki/BMW_i8\" target=\"_blank\">Read more...</a>', '#', 104, 0, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2014-02-27 06:33:44', 2, '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-2.jpg', 4),
(3, 0, 1, '2015 BMW i8 History...', '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-3-tmb.jpg', 'normal', 'pencil', 1, 'Read More!', 'red', '#000000', 50, '#ffffff', 18, '#000000', 2, 0, 1, '0px 10px 10px 10px', 0, '10px 15px 10px 15px', 0, 0, 'The i8 is part of BMW’s \"Project i\" and it is being marketed as a new brand, <a href=\"http://en.wikipedia.org/wiki/BMW_i\" target=\"_blank\">BMW i</a>, sold separately from BMW or Mini. The <a href=\"http://en.wikipedia.org/wiki/BMW_i3\" target=\"_blank\">BMW i3</a>, launched for retail customers in Europe in the fourth quarter of 2013, was the first model of the i brand available in the market. <a href=\"http://en.wikipedia.org/wiki/BMW_i8\" target=\"_blank\">Read more...</a>', '#', 104, 0, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2014-02-27 06:38:21', 3, '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-3.jpg', 4),
(4, 0, 1, 'BMW i8 Overview...', '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-4-tmb.jpg', 'normal', 'pencil', 1, 'Read More!', 'red', '#000000', 50, '#ffffff', 18, '#000000', 2, 0, 1, '0px 10px 10px 10px', 0, '10px 15px 10px 15px', 0, 0, 'With swan-wing doors, a shark-nose front end, and a supercar stance, the i8 plug-in hybrid is BMW’s most revolutionary car in decades. The interior seats four in trappings worthy of an Ian Schrager hotel. A turbocharged three-cylinder engine/electric motor duo with a combined 357 hp delivers M3-like acceleration, a 155-mph top speed, and Prius-like efficiency.', 'http://creative-solutions.net/joomla/creative-image-slider', 104, 1, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2014-02-27 06:40:29', 4, '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-4.jpg', 4),
(5, 0, 1, 'BMW Announces Complete 2014 i8 Pricing..., Including All Options...', '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-5-tmb.jpg', 'normal', 'pencil', 1, 'Read More!', 'red', '#000000', 50, '#ffffff', 18, '#000000', 2, 0, 1, '0px 10px 10px 10px', 0, '10px 15px 10px 15px', 0, 0, 'Powered By <a href=\"http://creative-solutions.net/wordpress/creative-image-slider\" target=\"_blank\">Creative Image Slider</a>', '#', 104, 0, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2014-02-27 06:36:58', 5, '', 'http://creative-solutions.net/images/sliders/bmw-i8/item-5.jpg', 4);
";
$wpdb->query($sql);

$sql =
"
CREATE TABLE `".$wpdb->prefix."cis_categories` (
 `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `published` tinyint(1) NOT NULL,
  `publish_up` datetime NOT NULL,
  `publish_down` datetime NOT NULL,
  `ordering` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM CHARACTER SET = `utf8`;
";
dbDelta($sql);
$sql =
"
INSERT IGNORE INTO `".$wpdb->prefix."cis_categories` (`id`, `name`, `published`, `ordering`) VALUES
(1, 'Uncategorized', 1, 0);
";
$wpdb->query($sql);


?>