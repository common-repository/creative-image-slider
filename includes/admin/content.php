<?php
// no direct access!
defined('ABSPATH') or die("No direct access");
?>
<div id="wpcis_content">
	<?php 
		if($page == 'creativeimageslider')
			include('overview.php');
		elseif($page == 'cis_sliders') {
			if($act == '')
				include('sliders.php');
			elseif($act == 'new' || $act == 'edit')
				include('slider.php');
		}
		elseif($page == 'cis_items') {
			if($act == '')
				include('items.php');
			elseif($act == 'new' || $act == 'edit')
				include('item.php');
		}
		elseif($page == 'cis_categories') {
			if($act == '')
				include('categories.php');
			elseif($act == 'new' || $act == 'edit')
				include('category.php');
		}
	?>
</div>