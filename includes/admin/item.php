<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;

if($id != 0) {
	//get the rows
	$sql = "SELECT * FROM ".$wpdb->prefix."cis_images WHERE id = '".$id."'";
	$row = $wpdb->get_row($sql);
}
else {
	$row = (object) array('id' => 0);
}

$sql = "SELECT id,name FROM ".$wpdb->prefix."cis_sliders";
$c_row = $wpdb->get_results($sql);
$slider_options = array();
if(is_array($c_row))
	foreach($c_row as $arr)
		$slider_options[$arr->id] = $arr->name;

$sql = "SELECT COUNT(id) FROM ".$wpdb->prefix."cis_images";
$count_items = $wpdb->get_var($sql);
if($id == 0 && $count_items >= 5) {
	?>
	<div style="color: rgb(235, 9, 9);font-size: 16px;font-weight: bold;">Please Upgrade to Commercial Version to have more than 5 Creative Items!</div>
	<div id="cpanel" style="float: left;">
		<div class="icon" style="float: right;">
			<a href="http://creative-solutions.net/wordpress/creative-image-slider" target="_blank" title="Buy Commercial version">
				<table style="width: 100%;height: 100%;text-decoration: none;">
					<tr>
						<td align="center" valign="middle">
							<img src="<?php echo plugins_url( '../images/shopping_cart.png' , __FILE__ );?>" /><br />
							Buy Commercial Version
						</td>
					</tr>
				</table>
			</a>
		</div>
	</div>
	<div style="font-style: italic;font-size: 12px;color: #949494;clear: both;">Updrading to Commercial is easy, and will take only <u style="color: rgb(44, 66, 231);font-weight: bold;">5 minutes!</u></div>
	<?php 
}
else {
//********************************************************************DEFAULTS *****************************************************************************************-
$slider_global_options = Array();
$slider_global_options["showreadmore"] = 1;
$slider_global_options["readmoretext"] = 'Read More!';
$slider_global_options["readmorestyle"] = 'red';
$slider_global_options["readmoreicon"] = 'pencil';
$slider_global_options["readmoresize"] = 'normal';
$slider_global_options["overlaycolor"] = '#000000';
$slider_global_options["overlayopacity"] = 50;
$slider_global_options["textcolor"] = '#ffffff';
$slider_global_options["overlayfontsize"] = 18;
$slider_global_options["textshadowcolor"] = '#000000';
$slider_global_options["textshadowsize"] = 2;
$slider_global_options["readmorealign"] = 1;
$slider_global_options["captionalign"] = 0;
$slider_global_options["readmoremargin"] = '0px 10px 10px 10px';
$slider_global_options["captionmargin"] = '10px 15px 10px 15px';
$slider_global_options['popup_open_event'] = 4;

//get slider global options
$slider_parent_options = array();
if($id != 0) {
	$sql = "SELECT * FROM ".$wpdb->prefix."cis_sliders WHERE id = '".$row->id_slider."'";
	$slider_parent_options = $wpdb->get_row($sql);
}
$slider_parent_options1 = $slider_parent_options;
$slider_parent_options = array();
foreach($slider_parent_options1 as $k => $val) {
	$slider_parent_options[$k] = $val;
}


//get item height
if($id != 0) {
	$sql = "SELECT `height` FROM ".$wpdb->prefix."cis_sliders WHERE id = '".$row->id_slider."'";
	$item_height = $wpdb->get_var($sql);
}

?>
<!-- ********************************************************************JAVASCRIPT ************************************************************************************* -->
<script type="text/javascript">
(function($) {
	$(document).ready(function() {
		// textarea animation
		$("#cis_caption").focus(function() {
			$(this).stop(true,false).animate({
				'height': '250px'
			},200);
		});
		$("#cis_caption").blur(function() {
			$(this).stop(true,false).animate({
				'height': '45px'
			},200);
		});


	});
})(jQuery);
</script>
<form action="admin.php?page=cis_items&act=cis_submit_data&holder=items" method="post" id="wpcis_form">
<div style="overflow: hidden;margin: 0 0 10px 0;">
	<div style="float:right;">
		<button  id="wpcis_form_save" class="button-primary">Save</button>
		<button id="wpcis_form_save_close" class="button">Save & Close</button>
		<button id="wpcis_form_save_new" class="button">Save & New</button>
		<a href="admin.php?page=cis_items" id="wpcis_add" class="button"><?php echo $t = $id == 0 ? 'Cancel' : 'Close';?></a>
	</div>
</div>
<div id="c_div">
	<div>
		<table cellpadding="0" cellspacing="0" style="width: 100%;">
			<tr>
				<td style="width: 420px;vertical-align: top;" align="top">

<!-- ********************************************************FORM OPTIONS**************************************************************************************************************************************************************************************************************************************************************************************************** -->
					<div style="clear: both;margin: 0px 0 10px 0px;color: #08c; font-style: italic;font-size: 12px;text-decoration: underline;"><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_MAIN_OPTIONS_LABEL' ];?></div>
							<div class="cis_control_label"><label id="" for="cis_name" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_NAME_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_NAME_LABEL' ];?><!-- <span class="star">&nbsp;*</span> --></label></div>
							<div class="cis_controls"><input type="text" name="name" id="cis_name" value="<?php echo $v = $row->id == 0 ? '' : stripslashes($row->name);?>" class="inputbox required" size="40"   ></div>
							
							<div style="clear: both;height: 5px;"></div>
							<div class="cis_control_label"><label id="" for="cis_caption" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_CAPTION_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_CAPTION_LABEL' ];?></label></div>
							<div class="cis_controls">
								<textarea name="caption" id="cis_caption" style="width: 218px;height: 45px;font-size: 13px;resize: none;color: #555;"><?php echo $v = $row->id == 0 ? '' : stripslashes($row->caption);?></textarea>
							</div>
						
							<div style="clear: both;height: 7px;"></div>
							<div class="cis_control_label"><label id="" for="cis_img_name" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_IMAGE_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_IMAGE_LABEL' ];?></label></div>
							<div class="cis_controls">
								<div title="Preview" class="cis_preview_img"><div class="cis_upl_preview_box"><div class="cis_upl_title">Selected Image</div><div class="cis_upl_img_prw">No image selected.</div><img src="" style="display: none" /></div></div>
								<div title="Clear Image" class="cis_clear_img"></div>
								<input type="text" readonly="readonly" name="img_name" id="cis_img_name" value="<?php echo $v = $row->id == 0 ? '' : $row->img_name;?>" class="inputbox wpcis_upload_image_wrapper" size="40"  >
								<input type="button" value="Select" class="wpcis_upload_image" />
							</div>

							<div style="clear: both;height: 7px;"></div>
							<div class="cis_control_label"><label id="" for="cis_img_url" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_IMGURL_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_IMGURL_LABEL' ];?></label></div>
							<div class="cis_controls"><input type="text" name="img_url" id="cis_img_url" value="<?php echo $v = $row->id == 0 ? '' : $row->img_url;?>" class="inputbox" size="40"  ></div>
							
							<div style="clear: both;height: 5px;"></div>
							<div class="cis_control_label"><label id="" for="cis_id_slider" class="hasTooltip" title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_SLIDER_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_SLIDER_LABEL' ];?></label></div>
							<div class="cis_controls">
									<?php 
									$default = $row->id == 0 ? 1 : $row->id_slider;
									//$opts = array(1 => 'Published', 0 => 'Unpublished');
									$opts = $slider_options;
									$options = array();
									echo '<select id="cis_id_slider" class="" name="id_slider">';
									foreach($opts as $key=>$value) :
										$selected = $key == $default ? 'selected="selected"' : '';
										echo '<option '.$selected.' value="'.$key.'">'.$value.'</option>';
									endforeach;
									echo '</select>';
									?>
							</div>


							
							<div style="clear: both;height: 5px;"></div>
							<div class="cis_control_label"><label id="" for="cis_status" class="hasTooltip" title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_STATUS_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_STATUS_LABEL' ];?></label></div>
							<div class="cis_controls">
									<?php 
									$default = $row->id == 0 ? 1 : $row->published;
									$opts = array(1 => 'Published', 0 => 'Unpublished');
									$options = array();
									echo '<select id="cis_status" class="" name="published">';
									foreach($opts as $key=>$value) :
										$selected = $key == $default ? 'selected="selected"' : '';
										echo '<option '.$selected.' value="'.$key.'">'.$value.'</option>';
									endforeach;
									echo '</select>';
									?>
							</div>

							<div style="clear: both;margin: 15px 0 10px 0px;color: #08c; font-style: italic;font-size: 12px;text-decoration: underline;"><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_POPUP_OPTIONS_LABEL' ];?></div>
							
							<div style="clear: both;height: 7px;"></div>
							<div class="cis_control_label"><label id="" for="cis_popup_img_name" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_POPUP_IMAGE_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_POPUP_IMAGE_LABEL' ];?></label></div>
							<div class="cis_controls">
								<div title="Preview" class="cis_preview_img"><div class="cis_upl_preview_box"><div class="cis_upl_title">Selected Image</div><div class="cis_upl_img_prw">No image selected.</div><img src="" style="display: none" /></div></div>
								<div title="Clear Image" class="cis_clear_img"></div>
								<input type="text" readonly="readonly" name="popup_img_name" id="cis_popup_img_name" value="<?php echo $v = $row->id == 0 ? '' : $row->popup_img_name;?>" class="inputbox wpcis_upload_image_wrapper" size="40"  >
								<input type="button" value="Select" class="wpcis_upload_image" />
							</div>
						
							<div style="clear: both;height: 7px;"></div>
							<div class="cis_control_label"><label id="" for="cis_popup_img_url" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_POPUP_IMGURL_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_POPUP_IMGURL_LABEL' ];?></label></div>
							<div class="cis_controls"><input type="text" name="popup_img_url" id="cis_popup_img_url" value="<?php echo $v = $row->id == 0 ? '' : $row->popup_img_url;?>" class="inputbox" size="40"  ></div>


							
							<div style="clear: both;margin: 15px 0 10px 0px;color: #08c; font-style: italic;font-size: 12px;text-decoration: underline;"><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_BUTTON_LINK_OPTIONS_LABEL' ];?></div>
							<div class="cis_control_label"><label id="" for="cis_redirect_url" class="hasTooltip" title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_REDIRECT_URL_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_REDIRECT_URL_LABEL' ];?></label></div>
							<div class="cis_controls"><input type="text" name="redirect_url" id="cis_redirect_url" value="<?php echo $v = $row->id == 0 ? '#' : $row->redirect_url;?>" class="inputbox" size="40"  ></div>
							

							<div style="clear: both;height: 5px;"></div>
							<div class="cis_control_label"><label id="" for="cis_redirect_target" class="hasTooltip" title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_REDIRECT_TARGET_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_REDIRECT_TARGET_LABEL' ];?></label></div>
							<div class="cis_controls">
									<?php 
									$default = $row->id == 0 ? 0 : $row->redirect_target;
									$opts = array(0 => 'Same Window', 1 => 'New Window');
									$options = array();
									echo '<select id="cis_redirect_target" class="" name="redirect_target">';
									foreach($opts as $key=>$value) :
										$selected = $key == $default ? 'selected="selected"' : '';
										echo '<option '.$selected.' value="'.$key.'">'.$value.'</option>';
									endforeach;
									echo '</select>';
									?>
							</div>
					
<!-- ******************************************************** END FORM OPTIONS**************************************************************************************************************************************************************************************************************************************************************************************************** -->
				</td>
				<td style="vertical-align: top;position: relative;"align="top">
<!-- ******************************************************** SLIDER PREVEW**************************************************************************************************************************************************************************************************************************************************************************************************** -->

<!-- ******************************************************** END SLIDER PREVIEW**************************************************************************************************************************************************************************************************************************************************************************************************** -->
				</td>
			</tr>
		</table>
	</div>
</div>
<input type="hidden" name="task" value="" id="wpcis_task">
<input type="hidden" name="id" value="<?php echo $id;?>" >
<?php
//adding a nonce
wp_nonce_field( 'item-manage-' . $id );
?>
</form>
<?php }?>


<style>
.form-horizontal .cis_controls {
margin-left: 200px !important;
}
.cis_row_item_overlay {
	height: auto !important;
}
.cis_button_left, .cis_button_right {
	-webkit-transition:  top linear 0.2s;
	-moz-transition: top linear 0.2s;
	-o-transition: top linear 0.2s;
	transition: top linear 0.2s;
}
</style>