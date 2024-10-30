<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;

if($id != 0) {
//get the rows
$sql = "SELECT * FROM ".$wpdb->prefix."cis_categories WHERE id = '".$id."'";
$row = $wpdb->get_row($sql);
}

?>

<form action="admin.php?page=cis_categories&act=cis_submit_data&holder=categories" method="post" id="wpcis_form">
<div style="overflow: hidden;margin: 0 0 10px 0;">
	<div style="float:right;">
		<button  id="wpcis_form_save" class="button-primary">Save</button>
		<button id="wpcis_form_save_close" class="button">Save & Close</button>
		<button id="wpcis_form_save_new" class="button">Save & New</button>
		<a href="admin.php?page=cis_categories" id="wpcis_add" class="button"><?php echo $t = $id == 0 ? 'Cancel' : 'Close';?></a>
	</div>
</div>

	<div class="cis_control_label"><label id="" for="cis_name" class="hasTooltip " title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_NAME_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_NAME_LABEL' ];?><!-- <span class="star">&nbsp;*</span> --></label></div>
	<div class="cis_controls"><input type="text" name="name" id="cis_name" value="<?php echo $v = $id == 0 ? '' : $row->name;?>" class="inputbox required" size="40"   ></div>

	<div style="clear: both;height: 5px;"></div>
	<div class="cis_control_label"><label id="" for="cis_status" class="hasTooltip" title="<?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_STATUS_DESCRIPTION' ];?>" ><?php echo $slider_dictionary[ 'COM_CREATIVEIMAGESLIDER_STATUS_LABEL' ];?></label></div>
	<div class="cis_controls">
			<?php 
			$default = $id == 0 ? 1 : $row->published;
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
<input type="hidden" name="task" value="" id="wpcis_task">
<input type="hidden" name="id" value="<?php echo $id;?>" >
<?php
//adding a nonce
wp_nonce_field( 'category-manage-' . $id );
?>
</form>