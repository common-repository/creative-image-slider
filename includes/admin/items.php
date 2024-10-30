<?php 

// no direct access!
defined('ABSPATH') or die("No direct access");

global $wpdb;

$task = isset($_REQUEST['task']) ? $_REQUEST['task'] : '';
$ids = isset($_REQUEST['ids']) ?  $_REQUEST['ids'] : array();
$filter_state = isset($_REQUEST['filter_state']) ? (int) $_REQUEST['filter_state'] : 2;
$filter_slider = isset($_REQUEST['filter_slider']) ? (int) $_REQUEST['filter_slider'] : 0;
$filter_search = isset($_REQUEST['filter_search']) ? stripslashes(str_replace(array('\'','"'), '', trim(sanitize_text_field($_REQUEST['filter_search'])))) : '';

if($task != '' && current_user_can( 'publish_posts' )) {
	// verify nonce
	check_admin_referer('items-manage');
	//unpublish task
	if ($task == 'unpublish') {
		if (is_array($ids)) {
			foreach ($ids as $id) {
				$idk = (int)$id;
				if ($idk != 0) {
					$sql = "UPDATE " . $wpdb->prefix . "cis_images SET `published` = '0' WHERE `id` = '" . $idk . "'";
					$wpdb->query($sql);
				}
			}
		}
	}
	//publish task
	if ($task == 'publish') {
		if (is_array($ids)) {
			foreach ($ids as $id) {
				$idk = (int)$id;
				if ($idk != 0) {
					$sql = "UPDATE " . $wpdb->prefix . "cis_images SET `published` = '1' WHERE `id` = '" . $idk . "'";
					$wpdb->query($sql);
				}
			}
		}
	}
	//delete task
	if ($task == 'delete') {
		if (is_array($ids)) {
			foreach ($ids as $id) {
				$idk = (int)$id;
				if ($idk != 0) {
					$sql = "DELETE FROM " . $wpdb->prefix . "cis_images WHERE `id` = '" . $idk . "'";
					$wpdb->query($sql);
				}
			}
		}
	}
}

//get the rows
$sql = 
		"
			SELECT 
				sp.id,
				sp.name,
				sp.published,
				sp.ordering,
				sp.img_name,
				sp.img_url,
				sa.id slider_id,
				sa.name slider_name
			FROM ".$wpdb->prefix."cis_images sp
			INNER JOIN ".$wpdb->prefix."cis_sliders AS sa ON sa.id=sp.id_slider
			WHERE 1 
		";

if($filter_state == 1)
	$sql .= " AND sp.published = '1'";
elseif($filter_state == 0)
	$sql .= " AND sp.published = '0'";

if($filter_search != '') {
	if (stripos($filter_search, 'id:') === 0) {
		$sql .= " AND sp.id = " . (int) substr($filter_search, 3);
	}
	else {
		$sql .= " AND sp.name LIKE '%".$filter_search."%'";
	}
}
if($filter_slider != 0) {
	$sql .= " AND sa.id = '".$filter_slider."'";
}

$sql .= " ORDER BY `slider_id`,`ordering`,`id` ASC";
$rows = $wpdb->get_results($sql);


//get sliders
$sliders_sql = "SELECT `id`, `name` FROM `".$wpdb->prefix."cis_sliders` order by `ordering`,`name` ";
$sliders_rows = $wpdb->get_results($sliders_sql);
?>
<form action="admin.php?page=cis_items" method="post" id="wpcis_form">
<div style="overflow: hidden;margin: 0 0 10px 0;">
	<div style="float: left;">
		<select id="wpcis_filter_state" class="wpcis_select" name="filter_state">
			<option value="2" <?php if($filter_state == 2) echo 'selected="selected"';?> >Select Status</option>
			<option value="1"<?php if($filter_state == 1) echo 'selected="selected"';?> >Published</option>
			<option value="0"<?php if($filter_state == 0) echo 'selected="selected"';?> >Unpublished</option>
		</select>
		<select id="wpcis_filter_slider" class="wpcis_select" name="filter_slider">
			<option value="0">Select Slider</option>
			<?php 
				foreach($sliders_rows as $slider) {
					$selected = $filter_slider == $slider->id ? 'selected="selected"' : '';
					echo '<option value="'.$slider->id.'" '.$selected.'>'.$slider->name.'</option>';
				}
			?>
		</select>
		<input type="search" placeholder="Filter items by name" value="<?php echo $filter_search;?>" id="wpcis_filter_search" name="filter_search">
		<button id="wpcis_filter_search_submit" class="button-primary">Search</button>
		<a href="admin.php?page=cis_items"  class="button">Reset</a>
	</div>
	<div style="float:right;">
		<a href="admin.php?page=cis_items&act=new" id="wpcis_add" class="button-primary">New</a>
		<button id="wpcis_edit" class="button button-disabled wpcis_disabled" title="Please make a selection from the list, to activate this button">Edit</button>
		<button id="wpcis_publish_list" class="button button-disabled wpcis_disabled" title="Please make a selection from the list, to activate this button">Publish</button>
		<button id="wpcis_unpublish_list" class="button button-disabled wpcis_disabled" title="Please make a selection from the list, to activate this button">Unpublish</button>
		<button id="wpcis_delete" class="button button-disabled wpcis_disabled" title="Please make a selection from the list, to activate this button">Delete</button>
	</div>
</div>
<table class="widefat" >
	<thead>
		<tr>
			<th nowrap align="center" style="width: 30px;text-align: center;"><input type="checkbox" name="toggle" value="" id="wpcis_check_all" /></th>
			<th nowrap align="center" style="width: 30px;text-align: center;">Order</th>
			<th nowrap align="center" style="width: 30px;text-align: center;">Status</th>
			<th nowrap align="left" style="text-align: left;padding-left: 22px;">Name</th>
			<th nowrap align="left" style="text-align: left;">Thumbnail</th>
			<th nowrap align="left" style="text-align: left;">Slider</th>
			<th nowrap align="center" style="width: 30px;text-align: center;">Id</th>
		</tr>
	</thead>
<tbody id="wpcis_sortable" table_name="<?php echo $wpdb->prefix;?>cis_images" reorder_type="reorder_list">
<?php        
			$k = 0;
			for($i=0; $i < count( $rows ); $i++) {
				$row = $rows[$i];
?>
				<tr class="row<?php echo $k; ?> ui-state-default" id="option_li_<?php echo $row->id; ?>_<?php echo $row->slider_id; ?>">
					<td nowrap valign="middle" align="center" style="vertical-align: middle;width: 30px;" >
						<input style="margin-left: 8px;" type="checkbox" id="cb<?php echo $i; ?>" class="wpcis_row_ch" name="ids[]" value="<?php echo $row->id; ?>" />
					</td>
					<td valign="middle" align="center" style="vertical-align: middle;width: 30px;">
						<div class="wpcis_reorder"></div>
					</td>
					<td valign="middle" align="center" style="vertical-align: middle;width: 30px;">
						<?php if($row->published == 1) {?>
						<a href="#" class="wpcis_unpublish" wpcis_id="<?php echo $row->id; ?>">
							<img src="<?php echo plugins_url( '../images/published.png' , __FILE__ );?>" alt="^" border="0" title="Published" />
						</a>
						<?php } else {?>
						<a href="#" class="wpcis_publish" wpcis_id="<?php echo $row->id; ?>">
							<img src="<?php echo plugins_url( '../images/unpublished.png' , __FILE__ );?>" alt="v" border="0" title="Unpublished" />
						</a>
						<?php }?>
					</td>
					<td valign="middle" align="left" style="vertical-align: middle;padding-left: 22px;" now_w="1">
						<a href="admin.php?page=cis_items&act=edit&id=<?php echo $row->id;?>"><?php echo stripslashes($row->name); ?></a>
					</td>
					<td valign="middle" align="left" style="vertical-align: middle;">
						<?php
						$item_url = $row->img_name != '' ? $row->img_name : $row->img_url;
						$item_img_html = '<img src="'.$item_url.'" style="height: 35px;" />';
						?>
						<a href="admin.php?page=cis_items&act=edit&id=<?php echo $row->id;?>"><?php echo $item_img_html; ?></a>
					</td>
					<td valign="middle" align="left" style="vertical-align: middle;" now_w="1">
						<a href="admin.php?page=cis_sliders&act=edit&id=<?php echo $row->slider_id;?>"><?php echo $row->slider_name; ?></a>
					</td>
					<td valign="middle" align="center" style="vertical-align: middle;width: 30px;">
						<?php echo $row->id; ?>
					</td>
				</tr>
<?php
				$k = 1 - $k;
			} // for
?>
</tbody>
</table>
<input type="hidden" name="task" value="" id="wpcis_task" />
<input type="hidden" name="ids[]" value="" id="wpcis_def_id" />
<?php
//adding a nonce
wp_nonce_field( 'items-manage' );
?>
<input type="hidden" name="" value="<?php echo $nonce = wp_create_nonce( 'reorder-list');?>" id="wpcis_ajax_nonce" />
</form>