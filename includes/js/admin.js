(function($) {
$(document).ready(function() {
	
	/////////////////////////////////////////////////////////////////////////TASKS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//check/uncheck all
	$("#wpcis_check_all").click(function() {
		if($(this).is(":checked")) {
			$('.wpcis_row_ch').attr('checked',true);
		}
		else {
			$('.wpcis_row_ch').attr('checked',false);
		}
		
		wpcis_check_the_selection();
	});
	
	//unpublish task
	$(".wpcis_unpublish").click(function() {
		var id = $(this).attr("wpcis_id");
		$("#wpcis_def_id").val(id);
		$("#wpcis_task").val('unpublish');
		$("#wpcis_form").submit();
		return false;
	});
	//publish task
	$(".wpcis_publish").click(function() {
		var id = $(this).attr("wpcis_id");
		$("#wpcis_def_id").val(id);
		$("#wpcis_task").val('publish');
		$("#wpcis_form").submit();
		return false;
	});

	//publish list task
	$("#wpcis_publish_list").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l > 0) {
			$("#wpcis_task").val('publish');
			$("#wpcis_form").submit();
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});
	//unpublish list task
	$("#wpcis_unpublish_list").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l > 0) {
			$("#wpcis_task").val('unpublish');
			$("#wpcis_form").submit();
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});

	//publish task async // extra rule
	$(".wpcis_publish_async").click(function() {
		var id = $(this).attr("wpcis_id");
		$("#wpcis_def_id").val(id);
		$("#wpcis_task").val('publish');
		$("#wpcis_form").submit();
		return false;
	});
	
	//edit list task
	$("#wpcis_edit").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l > 0) {
			var id = $('.wpcis_row_ch:checked').first().val();
			var url_part1 =$("#wpcis_form").attr("action");
			var url = url_part1 + '&act=edit&id=' + id;
			window.location.replace(url);
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});
	//delete task
	$("#wpcis_delete").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l > 0) {
			if(confirm('Delete selected items?')) {
				$("#wpcis_task").val('delete');
				$("#wpcis_form").submit();
			}
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});	
	//delete all task * Extra rule
	$("#wpcis_delete_all").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l > 0) {
			if(confirm('Delete selected items?')) {
				$("#wpcis_task").val('delete');
				$("#wpcis_form").submit();
			}
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});

	//re-create list task // extra rule
	$("#wpcis_recreate").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_recreate:checked').length);
		if(l > 0) {
			var id = $('.wpcis_recreate:checked').first().val();
			var url_part1 =$("#wpcis_form").attr("action");
			var url = url_part1 + '&act=edit&id=' + id;
			window.location.replace(url);
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});
	
	
	//filter select
	$(".wpcis_select").change(function() {
		$("#wpcis_form").submit();
	});
	//filter select
	$(".wpcis_select_added").change(function() {
		$("#wpcis_form").submit();
	});
	//filter search
	$("#wpcis_filter_search_submit").click(function() {
		$("#wpcis_form").submit();
	});
	
	//list of checkbox
	$('.wpcis_row_ch').click(function() {
		if(!($(this).is(':checked'))) {
			$("#wpcis_check_all").attr('checked',false);
		}
		wpcis_check_the_selection();
	});


	//reorder task async // extra rule
	$(".wpcis_reorder_async").click(function() {
		var id = $(this).attr("wpcis_id");
		$("#wpcis_def_id").val(id);
		$("#wpcis_task").val('publish');
		$("#wpcis_form").submit();
		return false;
	});

	//recreate task
	$("#wpcis_recreate_tmb").click(function(e) {
		e.preventDefault();
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l > 5) {
			var id = $('.wpcis_row_ch:checked').first().val();
			var url_part1 =$("#wpcis_form").attr("action");
			var url = url_part1 + '&act_sub=edit&id=' + id;
			window.location.replace(url);
			return false;
		}
		else {
			alert('Please first make a selection from the list');
			return false;
		}
	});
	
	function wpcis_check_the_selection() {
		var l = parseInt($('.wpcis_row_ch:checked').length);
		if(l == 0) {
			$('.wpcis_disabled').addClass('button-disabled');
			$('.wpcis_disabled').attr('title','Please make a selection from the list, to activate this button');
		}
		else {
			$('.wpcis_disabled').removeClass('button-disabled');
			$('.wpcis_disabled').attr('title','');
		}
	};

	// extra checks
	function wpcis_check_disabled_selection() {
		var l = $('.wpcis_row_ch:checked').length;
		var l_cal = parseInt(l) + 3*1;
		if(l > 5) {
			$('.wpcis_disabled').addClass('max_length');
		}
		else {
			$('.wpcis_disabled').removeClass('max_length');
		}
	};
	
	/////////////////////////////////////////////////////Add form//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$("#wpcis_form_save").click(function() {
		if(!wpcis_validate_form())
			return false;
		$("#wpcis_task").val('save');
		$("#wpcis_form").submit();
		return false;
	});
	$("#wpcis_form_save_close").click(function() {
		if(!wpcis_validate_form())
			return false;
		$("#wpcis_task").val('save_close');
		$("#wpcis_form").submit();
		return false;
	});
	$("#wpcis_form_save_new").click(function() {
		if(!wpcis_validate_form())
			return false;
		$("#wpcis_task").val('save_new');
		$("#wpcis_form").submit();
		return false;
	});
	
	//function to validate forms form
	function wpcis_validate_form() {
		var tested = true;
		$("#wpcis_form").find('.required').each(function() {
			var val = $.trim($(this).val());
			if(val == '') {
				$(this).addClass('wpcis_error');
				tested = false;
			}
			else
				$(this).removeClass('wpcis_error');
		});
		if(tested)
			return true;
		else
			return false;
	};

	//move all elements
	$("#wpcis_move_all").click(function() {
		if($(this).is(":checked")) {
			$('.wpcis_row_ch').attr('checked',true);
		}
		else {
			$('.wpcis_row_ch').attr('checked',false);
		}
		
		wpcis_check_the_selection();
	});
	
	//////////////////////////////////////////////////Table list sortable///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var wpcis_selected_tr_id = 0;
	function wpcis_make_sortable() {
		var table_name = $("#wpcis_sortable").attr("table_name");
		var reorder_type = $("#wpcis_sortable").attr("reorder_type");
		var nonce = $("#wpcis_ajax_nonce").val();
		
		//sortable
		$("#wpcis_sortable").sortable();
		$("#wpcis_sortable").disableSelection();
		$("#wpcis_sortable").sortable( "option", "disabled", true );
		$("#wpcis_sortable .wpcis_reorder").mousedown(function()
		{
			wpcis_selected_tr_id = $(this).parents('tr').attr("id");
			$( "#wpcis_sortable" ).sortable( "option", "disabled", false );
		});
		$( "#wpcis_sortable" ).sortable(
		{
			update: function(event, ui) 
			{
				var order = $("#wpcis_sortable").sortable('toArray').toString();
				$.post
				(
						"admin.php?page=creativeimageslider&act=cis_submit_data&holder=creativeajax&nonce=" + nonce,
						{order: order,type: reorder_type,table_name: table_name},
						function(data)
						{
							//window.location.reload();
							return false;
						}
				);
			}
		});
		$( "#wpcis_sortable" ).sortable(
		{
			stop: function(event, ui) 
			{
				$( "#wpcis_sortable" ).sortable( "option", "disabled", true );
			}
		});
	}
	wpcis_make_sortable();
	
	function wpcis_generate_td_width() {
		$('.ui-state-default').each(function() {
			$(this).find('td').each(function(i) {
				if(i == $(this).find('td').length)
					var w = $(this).width()-2;
				else
					var w = $(this).width();
				$(this).attr("w",w);
				$(this).css('width',w);
			});
		})
	};
	wpcis_generate_td_width();
	
	//field type limit
	$("#wpcis_id_type").change(function() {
		var id = $(this).val();
		if(id == 13 || id == 14) {
			alert('Please Upgrade to PRO Version to use this field type');
			$(this).val(1);
			return false;
		}
	});


	//UPLOADER/////////////////////////////////////////////////////////////////////////////////////////

	var file_frame;
 
  	jQuery('.wpcis_upload_image').on('click', function( event ){

  		var $wrapper_element = $(this).prev('input');
  		 var id = $wrapper_element.attr("id");
  		 console.log(id);
	    event.preventDefault();

	    // file_frame = false;
	    // // If the media frame already exists, reopen it.
	    // if ( file_frame ) {
	    //   file_frame.open();
	    //   return;
	    // }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      title: jQuery( this ).data( 'uploader_title' ),
	      button: {
	        text: jQuery( this ).data( 'uploader_button_text' ),
	      },
	      multiple: false  // Set to true to allow multiple files to be selected
	    });
 
	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {
	      // We set multiple to false so only get one image from the uploader
	      attachment = file_frame.state().get('selection').first().toJSON();
	      $wrapper_element.val(attachment.url);
	      // Do something with attachment.id and/or attachment.url here
	    });

	    // Finally, open the modal
	    file_frame.open();
  	});

	$(".cis_clear_img").on('click', function() {
		var $wrapper_element = $(this).next('input');
		$wrapper_element.val('');
	});

	$('.cis_preview_img').hover(function() {
		$(this).addClass('cis_high_z_index');
		var $box = $(this).find('.cis_upl_preview_box');
		var $img_selected_txt = $box.find('.cis_upl_img_prw');
		var $img_selected = $box.find('img');
		var img_url = $(this).parent('div').find('.wpcis_upload_image_wrapper').val();
		if(img_url == '') {
			$img_selected_txt.show();
			$img_selected.hide();
		}
		else {
			$img_selected_txt.hide();
			$img_selected.attr('src',img_url).show();
		}
		$box.stop().fadeIn(400);

	},function() {
		$(this).removeClass('cis_high_z_index');
		var $box = $(this).find('.cis_upl_preview_box');
		$box.hide();
	});








		
					
});
})(jQuery);