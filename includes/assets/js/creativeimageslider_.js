(function($) {
$(window).load(function() {
	
	//claculate proper width
	function cis_calculate_width() {
		$('.cis_images_holder').each(function() {
			var $wrapper = $(this);
			var total_w = 0;
			$wrapper.find('.cis_row_item').each(function() {
				$(this).find('img').css('width','auto');
				var w = parseInt($(this).find('img').width());
				$(this).find('img').width(w);
				var m_r = isNaN(parseFloat($(this).css('margin-right'))) ? 0 : parseFloat($(this).css('margin-right'));
				var m_l = isNaN(parseFloat($(this).css('margin-left'))) ? 0 : parseFloat($(this).css('margin-left'));
				total_w += w + m_r*1 + m_l*1;
			});
			total_w = total_w + 1*1;
			$wrapper.width(total_w);
		});
	};
	
	setTimeout(function() {
		cis_calculate_width();
	},400);		
	setTimeout(function() {
		cis_calculate_width();
	},1200);	


	//resize
	$(window).resize(function() {
	  cis_calculate_width();
	});
	
	$(".cis_row_item img").each(function() {
		var $cis_overlay = $(this).next('.cis_row_item_overlay');
		if($cis_overlay.attr('cis_animation') == 'enabled')
			return;
		$cis_overlay.css({'visibility' : 'hidden','display' : 'block'});
		var h = $cis_overlay.height();
		$cis_overlay.css({'visibility' : 'visible','display' : 'block','height' : '0'}).attr('h',h);
		$cis_overlay.attr('cis_animation','enabled');
	});
	
	$(".cis_row_item img").each(function() {
		if($(this).attr('cis_loaded') == 'loaded')
			return;
		cis_make_pr($(this));
	});
	
	function cis_make_pr($el) {
		if($el.attr('cis_loaded') == 'loaded')
			return;
		var item_width = $el.width();
		$el.parents('.cis_row_item').find('.cis_row_item_loader').animate({
			width: item_width
		},400,'swing',function() {
			$el.parents('.cis_row_item').find('.cis_row_item_loader').fadeOut(200,function() {
				$el.parents('.cis_row_item_inner').hide().removeClass('cis_row_hidden_element').fadeIn(200);
			});
		});
	};
	
});

$(document).ready(function() {
	//creative popup///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*
	//add popup html
	*/
	function cis_add_creative_popup_html() {
		var cis_base = $(".cis_main_wrapper").attr("cis_base");
		var popup_loader_loading_class = 'cis_popup_wrapper_loader';
		var loader_popup_html = '<div class="cis_popup_wrapper '+ popup_loader_loading_class +'" cis_popup_autoplay="2"><div class="cis_popup_autoplay_bar_holder"><div class="cis_popup_autoplay_bar_wrapper"><div class="cis_popup_autoplay_bar"></div></div></div><div class="cis_popup_item_holder"><img src="" class="cis_popup_left_arrow" /><img src="" class="cis_popup_right_arrow" /><div class="cis_popup_item_order_info"></div><img src="' + cis_base + 'assets/images/play.png" class="cis_popup_autoplay_play" /><img src="' + cis_base + 'assets/images/pause.png" class="cis_popup_autoplay_pause cis_popup_topright_icon_hidden"/><img src="' + cis_base + 'assets/images/close.png" class="cis_popup_close" /><div style="height: auto;font-weight: normal;text-shadow: rgb(0, 0, 0) 0px 3px 3px;padding: 4px 10px 5px 8px;line-height: 15px;color: rgb(255, 255, 255);font-style: italic;font-size: 12px;position: absolute;display: block;z-index: 10;bottom: 5px;right: -200px;background: rgba(0, 0, 0, 0.39);border: solid 1px rgba(68, 65, 65, 0.59);border-top-left-radius: 6px;border-bottom-left-radius: 6px;border-right: 0;box-shadow: 1px 1px 3px 1px rgba(5, 0, 0, 0.6);-webkit-box-shadow: 1px 1px 3px 1px rgba(5, 0, 0, 0.6);-moz-box-shadow: 1px 1px 3px 1px rgba(5, 0, 0, 0.6);opacity: 0.7;">By <a href="http://creative-solutions.net/wordpress/creative-image-slider" target="_blank" style="font-weight: bold;color: rgb(72, 108, 253);">Creative Image Slider</a></div></div><div class="cis_popup_bottom_holder"></div></div>';
		$('body').append(loader_popup_html);
	};
	cis_add_creative_popup_html();

	/*
	//add overlay html
	*/
	function cis_add_creative_overlay_html() {
		var overlay_html = '<div class="cis_main_overlay"></div>';
		$('body').append(overlay_html);
	};
	cis_add_creative_overlay_html();

	/*
	//popup event function
	*/
	$(".cis_main_wrapper").each(function() {
		$(this).find(".cis_row_item_overlay").each(function() {
			var $this = $(this);
			var cis_popup_event = parseInt($this.attr("cis_popup_event"));

			if(cis_popup_event == 0) {//open popup onclick of button
				$this.find('.creative_btn').click(function(e) {
					e.preventDefault();

					//show overlay
					cis_show_creative_overlay();

					//show popup
					var $loader = $(this).parents('.cis_row_item').find('.cis_row_item_inner');
					cis_animate_creative_popup($loader);
				});
			}
			else if(cis_popup_event == 1) {// open popup on click of overlay + button
				// set cursos pointer css to overlay
				$this.addClass('cis_cursor_pointer');
				// click functon
				$this.click(function(e) {
					//show overlay
					cis_show_creative_overlay();

					//show popup
					var $loader = $(this).parents('.cis_row_item').find('.cis_row_item_inner');
					cis_animate_creative_popup($loader);
				});
			}
			else if(cis_popup_event == 2) { // open link
				var cis_click_target = parseInt($this.attr("cis_click_target"));
				var cis_click_url = $this.attr("cis_click_url");
				var cis_button_visible = parseInt($this.attr("cis_button_visible"));

				if(cis_button_visible == 0) {// if button not visible, onclick ov overlay open link
					// set cursos pointer css to overlay
					$this.addClass('cis_cursor_pointer');

					$this.click(function(e) {
						if(cis_click_target == 1)
							window.open(cis_click_url);
						else
							window.location.href = cis_click_url;

					});
				}
			}
		});
	});

	/*
	//make items ordering
	*/
	function cis_make_creative_items_orders() {
		$('.cis_main_wrapper').each(function(){
			var curr_order = 0;
			$(this).find('.cis_row_item').each(function() {
				$(this).attr("cis_item_order",curr_order)
				curr_order ++;
			})
		})
	};
	cis_make_creative_items_orders();

	/*
	//overlay functions
	*/
	function cis_show_creative_overlay() {
		var windowWidth = $(document).width(); //retrieve current window width
		var windowHeight = $(document).height(); //retrieve current window height
		$('.cis_main_overlay').css({'width':windowWidth,'height':windowHeight}).stop().fadeTo(400,0.8);
	};
	function cis_resize_creative_overlay() {
		var windowWidth = $(document).width(); //retrieve current window width
		var windowHeight = $(document).height(); //retrieve current window height
		$('.cis_main_overlay').css({'width':windowWidth,'height':windowHeight});
	};
	function cis_hide_creative_overlay() {
		$('.cis_main_overlay').stop().fadeOut(400,function() {
			$(this).css({'width':'100%','height':'100%'});
			//reset popup html

			$('.cis_popup_item').remove();
			$('.cis_popup_bottom_holder').removeAttr("style").removeAttr("h").html('');
			$('.cis_popup_wrapper').removeClass('cis_popup_in_progress');
		});
	};

	/*
	//function to create popup paths
	*/
	var cis_popup_paths = new Array();
	$('.cis_main_wrapper').each(function() {
		var cis_slider_id = $(this).attr("cis_slider_id");
		cis_popup_paths[cis_slider_id] = new Array();
		var item_order = 0;
		$(this).find('.cis_row_item').each(function() {
			$this = $(this);
			var item_popup_path = $(this).attr("cis_popup_link");

			if(item_popup_path != '') {
				item_order ++;
				cis_popup_paths[cis_slider_id][item_order] = item_popup_path;
				$this.attr("cis_popup_order", item_order).addClass('cis_has_popup');
			}
		});
		$(this).attr("cis_popup_items_count",item_order);
	});


	/*
	//function to animate popup
	*/
	function cis_animate_creative_popup($loader) {
		//get popup image
		var slider_id = $loader.parents('.cis_main_wrapper').attr("cis_slider_id");
		var slider_id_unique = $loader.parents('.cis_main_wrapper').attr("roll");
		var item_order = $loader.parents('.cis_row_item').attr("cis_popup_order");
		var item_id = $loader.parents('.cis_row_item').attr("item_id");
		var cis_popup_link = cis_popup_paths[slider_id][item_order];

		//get data
		var slider_data =$loader.parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_use_back_img = parseInt(slider_data_array[2]);


		var $cis_popup = $('.cis_popup_wrapper');
		$cis_popup.addClass('cis_popup_in_progress');
		$cis_popup.attr("slider_id", slider_id_unique);
		$cis_popup.addClass('cis_vissible');

		//show or hide overlay bg image
		if(cis_popup_use_back_img == 0)
			$('.cis_main_overlay').addClass('cis_main_overlay_without_bg');
		else
			$('.cis_main_overlay').removeClass('cis_main_overlay_without_bg');


		var popup_loader_animate_timeout1 = 10;
		setTimeout(function() {
			//get loader sizes, coordinates
			var w = parseInt($loader.css('width'));	
			var h = parseInt($loader.css('height'));

			//get body borders
			var body_border_top = parseInt($('body').css('border-top-width'));
			var body_border_left = parseInt($('body').css('border-left-width'));

			//get offsets
			var offset_top = $loader.offset().top;
			var offset_left = $loader.offset().left;

			var offset_top_final = offset_top;
			var offset_left_final = offset_left;

			//scroll positions
			var vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
			var hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position

			//show popup
			
			$cis_popup
			.hide()
			.attr("start_data", w + ',' + h + ',' + offset_top_final + ',' + offset_left_final + ',' + vScrollPosition + ',' + hScrollPosition)
			.css({
				'width': w,
				'height': h,
				'top': offset_top,
				'left': offset_left_final
			})
			.fadeIn(400, function() {
				cis_show_image(item_id);
			});
		},popup_loader_animate_timeout1);
	};

	//function to back the popup to start position
	function cis_reset_creative_popup() {
		var $cis_popup = $('.cis_popup_wrapper');
		var slider_id = $cis_popup.attr("slider_id");

		//hide arrows 
		cis_popup_hide_arrows();
		//hide image order data
		cis_popup_hide_item_order();
		//hide popup autoplay bar
		cis_popup_hide_autoplay_bar();
		//hide tpright arrows
		cis_popup_hide_topright_icons();		
		//hide back
		cis_popup_hide_back();

		//check if popup is ready
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		//set popup ready!
		$cis_popup.addClass('cis_popup_in_progress');

		var $cis_popup_item = $cis_popup.find('.cis_popup_item');
		var $cis_popup_bottom = $cis_popup.find('.cis_popup_bottom_holder');

		$cis_popup.removeClass("cis_vissible");

		var start_data = $cis_popup.attr("start_data");
		var start_data_array = start_data.split(",");
		var bottom_h = parseInt($cis_popup.find('.cis_popup_bottom_holder').attr("h"));

		var cis_popup_animate_back_timeout = 0;
		setTimeout(function() {

			//hide item
			$cis_popup_item.fadeOut(400);

			$('.cis_main_overlay').stop().fadeTo(400,0.8);

			//animate main popup
			$cis_popup.stop().animate({
				'height':'-=' + bottom_h
			},
			{
				duration: 400, 
				queue: false, 
				easing: 'swing',
				complete: function() {
					setTimeout(function() {
						$("body").stop().animate({
							scrollTop: start_data_array[4]
						},400);

						$cis_popup
						.removeClass("cis_popup_wrapper_loader_shaddow")
						.animate({
							'width': start_data_array[0],
							'height': start_data_array[1],
							'top': start_data_array[2],
							'left': start_data_array[3]
						},400,'swing', function() {
							$cis_popup.fadeOut(400);
							cis_hide_creative_overlay();

							// trigger mouseleave, to continue auto-play(if exists).
							$('.cis_wrapper_' + slider_id).trigger("mouseleave");

							// show back
							$('.cis_main_wrapper').each(function() {
								var roll = $(this).attr("roll");
								if(roll == slider_id) {
									cis_show_back_canvas($(this).children('div').last());
								}
							});
						});
					},100);
				}
			});

			//animate popup bottom
			$cis_popup_bottom.stop().animate({
				'height':'0'
			},
			{
				duration: 400, 
				queue: false, 
				easing: 'swing', 
				complete: function() {
					$(this).hide();
				}
			});
		},cis_popup_animate_back_timeout);
		
	};


	function cis_show_image(item_id) {
		$loader = $("#cis_item_" + item_id).find('.cis_row_item_inner');

		var $cis_popup = $('.cis_popup_wrapper');
		$cis_popup.addClass('cis_vissible');
		$cis_popup.attr("item_id", item_id);

		//get popup image
		var slider_id = $loader.parents('.cis_main_wrapper').attr("cis_slider_id");
		var item_order = $loader.parents('.cis_row_item').attr("cis_popup_order");
		var items_count = $loader.parents('.cis_main_wrapper').attr("cis_popup_items_count");
		var cis_popup_link = cis_popup_paths[slider_id][item_order];

		//get data
		var slider_data =$loader.parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_max_size = parseInt(slider_data_array[0]);
		var cis_popup_item_min_width = parseInt(slider_data_array[1]);

		// set item order info
		var cis_popup_item_order_text = item_order + ' of ' + items_count;
		$('.cis_popup_item_order_info').html(cis_popup_item_order_text)

		var cis_title = $("#cis_item_" + item_id).find('.cis_row_item_overlay_txt').html();
		var cis_desc = $("#cis_item_" + item_id).find('.cis_popup_caption').html();
		
		// if url is empty, reset popup
		if(cis_popup_link == '' || cis_popup_link == undefined) {
			$cis_popup.removeClass('cis_popup_in_progress')
			cis_reset_creative_popup();
		};

		//load image
		var $popup_img = $("<img />", { src:cis_popup_link,class:'cis_popup_item'});
		$popup_img
		.error(function() { 
			alert("Error loading image");
			console.log("Error loading image. Url: " + cis_popup_link);
			$cis_popup.removeClass('cis_popup_in_progress')
			cis_reset_creative_popup();
		})
		.load(function() {

			$popup_img.addClass('cis_hidden').appendTo("body");

			var img_width = parseInt($popup_img.width());
			var img_height = parseInt($popup_img.height());
			var img_ratio = img_height / img_width;
			var img_width_final = img_width;
			var img_height_final = img_height;

			$popup_img.attr("w",img_width);
			$popup_img.attr("h",img_height);

			var $popup_img_final = $popup_img;
			$popup_img.remove();
			$popup_img_final.removeClass('cis_hidden');

			//$cis_popup.find('.cis_popup_item_holder').prepend($popup_img_final);

			var windowWidth = parseInt($(window).width()); //retrieve current window width
			var windowHeight = parseInt($(window).height()); //retrieve current window height
			var vScrollPosition = parseInt($(document).scrollTop()); //retrieve the document scroll ToP position
			var hScrollPosition = parseInt($(document).scrollLeft()); //retrieve the document scroll Left position

			// set limits
			var cis_max_percent_w = cis_popup_max_size;
			var cis_max_percent_h = cis_popup_max_size;

			// calculate max sizes
			var max_allowed_w = parseInt(windowWidth * cis_max_percent_w / 100);
			var max_allowed_h = parseInt(windowHeight * cis_max_percent_h / 100);

			//if image height greater than max allowed size, make corrections!
			if(img_height > max_allowed_h) {
				var img_height_check = max_allowed_h;
				var img_width_check = max_allowed_h / img_ratio;

				//check if calculated with in allowed range
				if(img_width_check > max_allowed_w) {
					img_width_check = max_allowed_w;
					img_height_check = max_allowed_w * img_ratio;
				}

				//set values
				img_width_final = img_width_check;
				img_height_final = img_height_check;

			}	
			else if(img_width > max_allowed_w) {
				var img_width_check = max_allowed_w;
				var img_height_check = max_allowed_w * img_ratio;

				//check if calculated with in allowed range
				if(img_height_check > max_allowed_h) {
					img_height_check = max_allowed_h;
					img_width_check = max_allowed_h / img_ratio;
				}

				//set values
				img_width_final = img_width_check;
				img_height_final = img_height_check;
			}

			// get autoplay bar
			var $autoplay_bar_holder = $('.cis_popup_autoplay_bar_holder');
			var $autoplay_bar_holder = $('.cis_popup_autoplay_bar');
			var autolplay_bar_h = parseInt($autoplay_bar_holder.attr("h"));

			//get bottom
			var bottom_htm = '<div class="cis_popup_bottom_inner_wrapper cis_hidden"><div class="cis_popup_bottom_inner">';
			bottom_htm += '<div class="cis_popup_bottom_title">' + cis_title + '</div>';
			if(cis_desc != '')
				bottom_htm += '<div class="cis_popup_bottom_desc">' + cis_desc + '</div>';
			bottom_htm += '<div class="cis_popup_bottom_line"></div></div></div>';

			//get bottom height
			var bottom_htm_dummy = bottom_htm;
			$cis_popup.append(bottom_htm_dummy);
			$(".cis_popup_bottom_inner_wrapper").width(img_width_final);
			var bottom_height = $(".cis_popup_bottom_inner_wrapper").height();

			// check if total width in allowed range
			if(img_height_final + 1*bottom_height > max_allowed_h) {
				img_height_final = max_allowed_h - bottom_height;
				img_height_final = img_height_final > img_height ? img_height : img_height_final;
				img_width_final = img_height_final / img_ratio;

				//check min size
				var cis_min_width = cis_popup_item_min_width;
				if(img_width_final < cis_min_width) {
					img_width_final = cis_min_width;
					img_height_final = img_width_final * img_ratio;
				}
			}

			//calculate buttom height again
			$cis_popup.append(bottom_htm_dummy);
			$(".cis_popup_bottom_inner_wrapper").width(img_width_final);
			bottom_height = $(".cis_popup_bottom_inner_wrapper").height();

			$(".cis_popup_bottom_inner_wrapper").remove();
			$cis_popup.find('.cis_popup_bottom_holder').attr("h",bottom_height).hide().html(bottom_htm);
			$(".cis_popup_bottom_inner_wrapper").removeClass('cis_hidden');

			//get final offsets
			var popup_top_final = vScrollPosition + 0.3*(windowHeight - img_height_final - bottom_height);
			//if we have negative top offset, turn off scrolling behaviour, set fixed top position
			var cis_scroll_disable = false;
			if(popup_top_final < vScrollPosition) {
				popup_top_final = vScrollPosition + 12*1;
				if(!$cis_popup.hasClass('cis_popup_disable_scrolling_behaviour'))
					$cis_popup.addClass('cis_popup_disable_scrolling_behaviour')
				cis_scroll_disable = true;
			}
			else {
				$cis_popup.removeClass('cis_popup_disable_scrolling_behaviour')
			}

			var popup_left_final = hScrollPosition + 0.5 * (windowWidth - img_width_final);
			//if we have negative top offset, turn off scrolling behaviour, set fixed top position
			if(popup_left_final < hScrollPosition) {
				popup_left_final = hScrollPosition + 12*1;
				if(!$cis_popup.hasClass('cis_popup_disable_scrolling_behaviour'))
					$cis_popup.addClass('cis_popup_disable_scrolling_behaviour')
			}
			else if(!cis_scroll_disable){
				$cis_popup.removeClass('cis_popup_disable_scrolling_behaviour')
			}	

			//place image
			$popup_img_final.css({
				'width': img_width_final,
				'height': img_height_final,
				'display': 'none'
			});

			$cis_popup.find('.cis_popup_item_holder').prepend($popup_img_final);

			//animate popup
			$cis_popup.stop().animate({
				'width': img_width_final,
				'height': img_height_final,
				'top' : popup_top_final,
				'left' : popup_left_final
			},400, 'easeOutBack', function() {
				//show image
				$popup_img_final.stop().fadeIn(400,function() {

					$('.cis_main_overlay').stop().fadeTo(400,0.96);
					$cis_popup.addClass('cis_popup_wrapper_loader_shaddow');

					//$cis_popup.find('.cis_popup_bottom_holder').css('visibility','visible');
					//prepare bottom
					$cis_popup.stop().animate({
						'height': '+=' + bottom_height
					},400,'swing',function() {

						//set popup ready!
						$cis_popup.removeClass('cis_popup_in_progress');

						//prepare arrows
						cis_prepare_popup_arrows();

						//prepare  order info
						cis_popup_prepare_item_order_info();

						//show autoplay bar wrapper
						cis_popup_show_autoplay_bar();

						// prepare top-right icons
						cis_popup_prepare_topright_icons();

						// prepare popup autoplay
						cis_popup_prepare_autoplay();

						// prepare back
						cis_popup_prepare_back();
					});

					//animate bottom inner
					$cis_popup.find('.cis_popup_bottom_holder').stop().fadeIn(400);

				});

			});

		});
	};

	function cis_resize_image() {
		var $cis_popup = $('.cis_popup_wrapper');

		//check if popup is ready
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		//return, if popup is not visible
		if(!$cis_popup.hasClass('cis_vissible'))
			return;

		// get item id
		var item_id = $cis_popup.attr("item_id");
		$loader = $("#cis_item_" + item_id).find('.cis_row_item_inner');

		//get data
		var slider_data =$loader.parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_max_size = parseInt(slider_data_array[0]);
		var cis_popup_item_min_width = parseInt(slider_data_array[1]);

		//get image
		var $popup_img = $('.cis_popup_item');
		$popup_img.css({'width':'100%','height':'auto'})

		// get sizes
		var img_width = parseInt($popup_img.attr("w"));
		var img_height = parseInt($popup_img.attr("h"));
		var img_ratio = img_height / img_width;
		var img_width_final = img_width;
		var img_height_final = img_height;

		var windowWidth = parseInt($(window).width()); //retrieve current window width
		var windowHeight = parseInt($(window).height()); //retrieve current window height
		var vScrollPosition = parseInt($(document).scrollTop()); //retrieve the document scroll ToP position
		var hScrollPosition = parseInt($(document).scrollLeft()); //retrieve the document scroll Left position

		// set limits
		var cis_max_percent_w = cis_popup_max_size;
		var cis_max_percent_h = cis_popup_max_size;

		// calculate max sizes
		var max_allowed_w = parseInt(windowWidth * cis_max_percent_w / 100);
		var max_allowed_h = parseInt(windowHeight * cis_max_percent_h / 100);

		//if image height greater than max allowed size, make corrections!
		if(img_height > max_allowed_h) {
			var img_height_check = max_allowed_h;
			var img_width_check = max_allowed_h / img_ratio;

			//check if calculated with in allowed range
			if(img_width_check > max_allowed_w) {
				img_width_check = max_allowed_w;
				img_height_check = max_allowed_w * img_ratio;
			}

			//set values
			img_width_final = img_width_check;
			img_height_final = img_height_check;

		}	
		else if(img_width > max_allowed_w) {
			var img_width_check = max_allowed_w;
			var img_height_check = max_allowed_w * img_ratio;

			//check if calculated with in allowed range
			if(img_height_check > max_allowed_h) {
				img_height_check = max_allowed_h;
				img_width_check = max_allowed_h / img_ratio;
			}

			//set values
			img_width_final = img_width_check;
			img_height_final = img_height_check;
		}

		var bottom_height = parseInt($(".cis_popup_bottom_holder").attr("h"));

		// check if total width in allowed range
		if(img_height_final + 1*bottom_height > max_allowed_h) {
			img_height_final = max_allowed_h - bottom_height;
			img_height_final = img_height_final > img_height ? img_height : img_height_final;
			img_width_final = img_height_final / img_ratio;

			//check min size
			var cis_min_width = cis_popup_item_min_width;
			if(img_width_final < cis_min_width) {
				img_width_final = cis_min_width;
				img_height_final = img_width_final * img_ratio;
			}
		}

		// calculate buttom height again
		var  bottom_htm_dummy = $('.cis_popup_bottom_inner_wrapper').html();
		bottom_htm_dummy = '<div class="cis_popup_bottom_inner_wrapper_dummy cis_hidden">' + bottom_htm_dummy + '</div>';

		$cis_popup.append(bottom_htm_dummy);
		$(".cis_popup_bottom_inner_wrapper_dummy").width(img_width_final);
		bottom_height = $(".cis_popup_bottom_inner_wrapper_dummy").height();

		$(".cis_popup_bottom_inner_wrapper_dummy").remove();
		$cis_popup.find('.cis_popup_bottom_holder').attr("h",bottom_height);

		//get final offsets
		var popup_top_final = vScrollPosition + 0.3*(windowHeight - img_height_final - bottom_height);
		//if we have negative top offset, turn off scrolling behaviour, set fixed top position
		var cis_scroll_disable = false;
		if(popup_top_final < vScrollPosition) {
			popup_top_final = vScrollPosition + 12*1;
			if(!$cis_popup.hasClass('cis_popup_disable_scrolling_behaviour'))
				$cis_popup.addClass('cis_popup_disable_scrolling_behaviour')
			cis_scroll_disable = true;
		}
		else {
			$cis_popup.removeClass('cis_popup_disable_scrolling_behaviour')
		}

		var popup_left_final = hScrollPosition + 0.5 * (windowWidth - img_width_final);
		//if we have negative top offset, turn off scrolling behaviour, set fixed top position
		if(popup_left_final < hScrollPosition) {
			popup_left_final = hScrollPosition + 12*1;
			if(!$cis_popup.hasClass('cis_popup_disable_scrolling_behaviour'))
				$cis_popup.addClass('cis_popup_disable_scrolling_behaviour')
		}
		else if(!cis_scroll_disable){
			$cis_popup.removeClass('cis_popup_disable_scrolling_behaviour')
		};


		//animate popup
		var total_h = img_height_final + 1*bottom_height;
		$cis_popup.stop().animate({
			'width': img_width_final,
			'height': total_h,
			'top' : popup_top_final,
			'left' : popup_left_final
		},400,'easeOutBack', function() {
			//resize arrows
			cis_resize_popup_arrows();
		});

	};

	function cis_move_image() {
		var $cis_popup = $('.cis_popup_wrapper');

		//check if popup is ready
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		//return, if popup is not visible
		if(!$cis_popup.hasClass('cis_vissible'))
			return;

		// return, if scrolling not enabled
		if($cis_popup.hasClass('cis_popup_disable_scrolling_behaviour'))
			return;

		var item_id = $cis_popup.attr("item_id");

		var popup_width = $cis_popup.width();
		var popup_height = $cis_popup.height();

		var windowWidth = $(window).width(); //retrieve current window width
		var windowHeight = $(window).height(); //retrieve current window height
		var vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
		var hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position

		//get final offsets
		var popup_top_final = vScrollPosition + 0.3*(windowHeight - popup_height);
		var popup_left_final = (windowWidth - popup_width) / 2;

		//animate popup
		$cis_popup.stop(false,false).animate({
			'top' : popup_top_final,
			'left' : popup_left_final
		},400, 'swing');

	};

	$(window).scroll(function() {
		cis_move_image();
	});	

	$(window).resize(function() {
		cis_resize_creative_overlay();
	    clearTimeout($.data(this, 'cisResizeTimer'));
	    $.data(this, 'cisResizeTimer', setTimeout(function() {
	        cis_resize_image();
	    }, 200));
	});

	//keyup
	$(document).keyup(function (e) {
		var cis_keycode = e.keyCode;
	    if (cis_keycode == 37 || cis_keycode == 39 || cis_keycode == 27) {
	    	var $cis_popup = $('.cis_popup_wrapper');
	    	if($cis_popup.hasClass('cis_vissible')) {
	    		if(cis_keycode == 27) // reset popup when typr ESC button
	    			cis_reset_creative_popup();
	    		else if(cis_keycode == 39) // show next when type right button
	    			cis_popup_show_next_item();
	    		else if(cis_keycode == 37) // show prev when type left button
	    			cis_popup_show_prev_item();
	    	} 
	    }
	});

	$(".cis_main_overlay").on('click', function() {
		cis_reset_creative_popup();
	});

	// prepare back
	function cis_popup_prepare_back() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");
			
		cis_popup_show_back();

		// set hover functions
		$cis_popup.on('mouseenter.cis_popup_hover_handler', function() {
			cis_popup_show_back();
		});
		$cis_popup.on('mouseleave.cis_popup_hover_handler', function() {
			cis_popup_hide_back();
		});
	};
	function cis_popup_show_back() {
		var $back = $('.cis_popup_wrapper').find('.cis_popup_item_holder').children('div').last();
		$back.stop(true,false).animate({
			'right': '0'
		},400,'easeOutBack');
	};	
	function cis_popup_hide_back() {
		var $back = $('.cis_popup_wrapper').find('.cis_popup_item_holder').children('div').last();
		$back.stop(true,false).animate({
			'right': '-200'
		},400,'easeInBack');
	};


	//popup arrow navigation
	function cis_prepare_popup_arrows() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");

		// get slider arrows
		var $left_arrow = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_button_left');
		var $right_arrow = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_button_right');

		var $cis_popup_left_arrow = $('.cis_popup_left_arrow');
		var $cis_popup_right_arrow = $('.cis_popup_right_arrow');

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_arrow_min_height = parseInt(slider_data_array[5]);
		var cis_popup_arrow_max_height = parseInt(slider_data_array[6]);
		var cis_popup_showarrows = parseInt(slider_data_array[7]);
		var cis_popup_arrow_passive_opacity = parseInt(slider_data_array[3]) / 100;
		var cis_popup_arrow_left_offset = parseInt(slider_data_array[4]);

		//set arrow attributes
		var cis_corner_offset = cis_popup_arrow_left_offset;
		$cis_popup_left_arrow.attr({"src":$left_arrow.attr("src"),'op':cis_popup_arrow_passive_opacity,'corner_offset':cis_corner_offset});
		$cis_popup_right_arrow.attr({"src":$right_arrow.attr("src"),'op':cis_popup_arrow_passive_opacity,'corner_offset':cis_corner_offset});

		//calculate arrow height
		var cis_slider_h = parseInt($("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_row_item_inner').height());
		var cis_slider_arrow_h = parseInt($left_arrow.css("height"));
		var arrow_ratio = cis_slider_arrow_h / cis_slider_h;

		var arrow_max_h = parseInt($cis_popup_left_arrow.height());
		var arrow_container_height = parseInt($('.cis_popup_item_holder').height());

		arrow_max_h = cis_popup_arrow_max_height;
		var arrow_min_h = cis_popup_arrow_min_height;
		var arrow_h_claculated = arrow_container_height * 0.085;
		var arrow_h_final = arrow_h_claculated > arrow_max_h ? arrow_max_h : (arrow_h_claculated < arrow_min_h ? arrow_min_h : arrow_h_claculated);

		//get arrow position
		var arrow_top = 0.5 * (arrow_container_height - arrow_h_final);

		var arrow_op_pasive = cis_popup_arrow_passive_opacity;

		// set arrows css
		$cis_popup_left_arrow.css({
			'left': '-64px',
			'top': arrow_top,
			'height': arrow_h_final,
			'opacity': arrow_op_pasive
		});
		$cis_popup_right_arrow.css({
			'left': 'auto',
			'right': '-64px',
			'top': arrow_top,
			'height': arrow_h_final,
			'opacity': arrow_op_pasive
		});


		var cis_popup_show_arrows_ident = cis_popup_showarrows;

		//delete previously declired hover event
		$cis_popup.off('mouseenter.cis_popup_hover_handler');
		$cis_popup.off('mouseleave.cis_popup_hover_handler');

		// arrow showing type
		if(cis_popup_show_arrows_ident == 0) {//never show arrows
			// Do Nothing
		}
		else if(cis_popup_show_arrows_ident == 1) {//show on hover
			// show arrows
			cis_popup_show_arrows();

			// set hover functions
			$cis_popup.on('mouseenter.cis_popup_hover_handler', function() {
				cis_popup_show_arrows();
			});
			$cis_popup.on('mouseleave.cis_popup_hover_handler', function() {
				cis_popup_hide_arrows();
			});
			
		}
		else {
			cis_popup_show_arrows();
		}

	};

	// resize popup arrows
	function cis_resize_popup_arrows() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");

		// get slider arrows
		var $left_arrow = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_button_left');
		var $right_arrow = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_button_right');

		var $cis_popup_left_arrow = $('.cis_popup_left_arrow');
		var $cis_popup_right_arrow = $('.cis_popup_right_arrow');

		//calculate arrow height
		var cis_slider_h = parseInt($("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_row_item_inner').height());
		var cis_slider_arrow_h = parseInt($left_arrow.css("height"));
		var arrow_ratio = cis_slider_arrow_h / cis_slider_h;

		var arrow_max_h = parseInt($cis_popup_left_arrow.height());
		var arrow_container_height = parseInt($('.cis_popup_item_holder').height());

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_arrow_min_height = parseInt(slider_data_array[5]);
		var cis_popup_arrow_max_height = parseInt(slider_data_array[6]);
		var cis_popup_arrow_passive_opacity = parseInt(slider_data_array[3]);

		arrow_max_h = cis_popup_arrow_max_height;
		var arrow_min_h = cis_popup_arrow_min_height;
		var arrow_h_claculated = arrow_container_height * 0.085;
		var arrow_h_final = arrow_h_claculated > arrow_max_h ? arrow_max_h : (arrow_h_claculated < arrow_min_h ? arrow_min_h : arrow_h_claculated);

		//get arrow position
		var arrow_top = 0.5 * (arrow_container_height - arrow_h_final);

		var arrow_op_pasive = cis_popup_arrow_passive_opacity;

		// animate arrows
		$cis_popup_left_arrow.stop().animate({
			'top': arrow_top,
			'height': arrow_h_final
		},400,'easeOutBack');
		$cis_popup_right_arrow.stop().animate({
			'top': arrow_top,
			'height': arrow_h_final
		},400,'easeOutBack');

	};

	function cis_popup_prepare_item_order_info() {
		var $cis_popup = $('.cis_popup_wrapper');

		var item_id = $cis_popup.attr("item_id");

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_image_order_opacity = parseInt(slider_data_array[8]) / 100;
		var cis_popup_show_orderdata = parseInt(slider_data_array[10]);

		var op_pasive = cis_popup_image_order_opacity;
		$('.cis_popup_item_order_info').attr("op",op_pasive);

		var cis_popup_show_item_order_ident = cis_popup_show_orderdata;

		//delete previously declired hover function
		$cis_popup.off('mouseenter.cis_popup_show_order_hover_handler');
		$cis_popup.off('mouseleave.cis_popup_show_order_hover_handler');

		// order info showing type
		if(cis_popup_show_item_order_ident == 0) {//never show
			// Do Nothing
		}
		else if(cis_popup_show_item_order_ident == 1) {//show on hover
			// show arrows
			cis_popup_show_item_order();

			// set hover functions
			$cis_popup.on('mouseenter.cis_popup_show_order_hover_handler', function() {
				cis_popup_show_item_order();
			});
			$cis_popup.on('mouseleave.cis_popup_show_order_hover_handler', function() {
				cis_popup_hide_item_order();
			});
			
		}
		else { //always show
			cis_popup_show_item_order();
		}

	};	

	function cis_popup_prepare_topright_icons() {
		var $cis_popup = $('.cis_popup_wrapper');

		var item_id = $cis_popup.attr("item_id");

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_icons_opacity = parseInt(slider_data_array[11]) / 100;
		var cis_popup_show_icons = parseInt(slider_data_array[12]);

		var op_pasive = cis_popup_icons_opacity;
		$('.cis_popup_autoplay_play').attr("op",op_pasive);
		$('.cis_popup_autoplay_pause').attr("op",op_pasive);
		$('.cis_popup_close').attr("op",op_pasive);

		var cis_popup_show_topright_icons_ident = cis_popup_show_icons;

		//delete previously declired hover function
		$cis_popup.off('mouseenter.cis_popup_show_topright_icons_hover_handler');
		$cis_popup.off('mouseleave.cis_popup_show_topright_icons_hover_handler');

		// order info showing type
		if(cis_popup_show_topright_icons_ident == 0) {//never show
			// Do Nothing
		}
		else if(cis_popup_show_topright_icons_ident == 1) {//show on hover
			// show arrows
			cis_popup_show_topright_icons();

			// set hover functions
			$cis_popup.on('mouseenter.cis_popup_show_topright_icons_hover_handler', function() {
				cis_popup_show_topright_icons();
			});
			$cis_popup.on('mouseleave.cis_popup_show_topright_icons_hover_handler', function() {
				cis_popup_hide_topright_icons();
			});
			
		}
		else { //always show
			cis_popup_show_topright_icons();
		}

	};

	/*
	// Function to show popup top-right icons
	*/
	var cis_popup_topright_icons_timeout1 = '';
	var cis_popup_topright_icons_timeout2 = '';
	function cis_popup_show_topright_icons() {
		var $cis_popup = $('.cis_popup_wrapper');

		//if animation in progress, do not show arrows
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		//clear timeouts
		clearTimeout(cis_popup_topright_icons_timeout1);
		clearTimeout(cis_popup_topright_icons_timeout2);

		var op_pasive = $('.cis_popup_close').attr("op");

		cis_popup_topright_icons_timeout1 = setTimeout(function() {
			$('.cis_popup_close').removeClass('disable_click').stop(true,false).animate({
				'opacity': op_pasive
				// 'top': '12px'
			},400,'easeOutBack');
			$('.cis_popup_autoplay_play').removeClass('disable_click').stop(true,false).animate({
				'opacity': op_pasive
				// 'top': '12px'
			},400,'easeOutBack');
			$('.cis_popup_autoplay_pause').removeClass('disable_click').stop(true,false).animate({
				'opacity': op_pasive
				// 'top': '12px'
			},400,'easeOutBack');
		},100);
	};
	function cis_popup_hide_topright_icons() {
		var $cis_popup = $('.cis_popup_wrapper');

		//clear timeouts
		clearTimeout(cis_popup_topright_icons_timeout1);
		clearTimeout(cis_popup_topright_icons_timeout2);
		
		$('.cis_popup_close').stop(true,false).fadeTo(400,0,function() {
			// $(this).css('top','-30px');
		});
		$('.cis_popup_autoplay_play').stop(true,false).fadeTo(400,0,function() {
			// $(this).css('top','-30px');
		});
		$('.cis_popup_autoplay_pause').stop(true,false).fadeTo(400,0,function() {
			// $(this).css('top','-30px');
		});

	};

	/*
	// Function to show popup item order info
	*/
	var cis_popup_item_order_timeout1 = '';
	var cis_popup_item_order_timeout2 = '';
	function cis_popup_show_item_order() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_image_order_opacity = parseInt(slider_data_array[8]) / 100;
		var cis_popup_image_order_top_offset = parseInt(slider_data_array[9]);

		//if animation in progress, do not show arrows
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		//clear timeouts
		clearTimeout(cis_popup_item_order_timeout1);
		clearTimeout(cis_popup_item_order_timeout2);

		var op_pasive = cis_popup_image_order_opacity;

		cis_popup_item_order_timeout1 = setTimeout(function() {
			$('.cis_popup_item_order_info').stop(true,false).animate({
				'opacity': op_pasive,
				'top': cis_popup_image_order_top_offset
			},400,'easeOutBack');
		},100);
	};
	function cis_popup_hide_item_order() {
		var $cis_popup = $('.cis_popup_wrapper');

		//clear timeouts
		clearTimeout(cis_popup_item_order_timeout1);
		clearTimeout(cis_popup_item_order_timeout2);
		
		$('.cis_popup_item_order_info').stop().fadeTo(400,0,function() {
			$(this).css('top','-30px');
		});
		
	};

	/*
	// Function to show/hide popup arrows
	*/
	var cis_popup_arrows_timeout1 = '';
	var cis_popup_arrows_timeout2 = '';
	function cis_popup_show_arrows() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_arrow_passive_opacity = parseInt(slider_data_array[3]) / 100;
		var cis_popup_arrow_left_offset = parseInt(slider_data_array[4]);

		//if animation in progress, do not show arrows
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		//clear timeouts
		clearTimeout(cis_popup_arrows_timeout1);
		clearTimeout(cis_popup_arrows_timeout2);
		
		var $left_arrow = $cis_popup.find('.cis_popup_left_arrow');
		var $right_arrow = $cis_popup.find('.cis_popup_right_arrow');
		
		var corner_offset = cis_popup_arrow_left_offset;
		var op_passive = cis_popup_arrow_passive_opacity;
		
		var animation_time = 400;
		var start_offset = -64;
		var effect = 'easeOutBack';
		
		cis_popup_arrows_timeout1 = setTimeout(function() {
			$left_arrow.stop(true,false).animate({
				'left': corner_offset,
				'opacity': op_passive
			},animation_time,effect);
			
			$right_arrow.stop(true,false).animate({
				'right': corner_offset,
				'opacity': op_passive
			},animation_time,effect);
		},100);
		
	};
	function cis_popup_hide_arrows() {
		var $cis_popup = $('.cis_popup_wrapper');

		//clear timeouts
		clearTimeout(cis_popup_arrows_timeout1);
		clearTimeout(cis_popup_arrows_timeout2);
		
		var $left_arrow = $cis_popup.find('.cis_popup_left_arrow');
		var $right_arrow = $cis_popup.find('.cis_popup_right_arrow');

		$left_arrow.fadeTo(200,0.2);
		$right_arrow.fadeTo(200,0.2);
		
		var animation_time = 400;
		var start_offset = -64;
		var effect = 'easeInBack';
		
		cis_popup_arrows_timeout2 = setTimeout(function() {
			$left_arrow.stop(true,false).animate({
				'left': start_offset
			},animation_time,effect);
			
			$right_arrow.stop(true,false).animate({
				'right': start_offset
			},animation_time,effect);
		},200);
	};

	// popup top right  functions
	$('.cis_popup_close').on('click', function() {
		cis_reset_creative_popup();
	});

	$('.cis_popup_close').on('mouseenter', function() {
		if($(this).hasClass('disable_click'))
			return;

		$(this).stop(true,false).animate({
			'opacity' : 1
		},300);
	});
	$('.cis_popup_close').on('mouseleave', function() {
		if($(this).hasClass('disable_click'))
			return;

		var opacity_inactive = $(this).attr("op");
		$(this).stop(true,false).animate({
			'opacity' : opacity_inactive
		},300);
	});	

	$('.cis_popup_autoplay_play').on('mouseenter', function() {
		if($(this).hasClass('disable_click'))
			return;

		$(this).stop(true,false).animate({
			'opacity' : 1
		},300);		

	});
	$('.cis_popup_autoplay_play').on('mouseleave', function() {
		if($(this).hasClass('disable_click'))
			return;

		var opacity_inactive = $(this).attr("op");
		$(this).stop(true,false).animate({
			'opacity' : opacity_inactive
		},300);	

	});	
	$('.cis_popup_autoplay_pause').on('mouseenter', function() {
		if($(this).hasClass('disable_click'))
			return;

		$(this).stop(true,false).animate({
			'opacity' : 1
		},300);		
	
	});
	$('.cis_popup_autoplay_pause').on('mouseleave', function() {
		if($(this).hasClass('disable_click'))
			return;

		var opacity_inactive = $(this).attr("op");
		$(this).stop(true,false).animate({
			'opacity' : opacity_inactive
		},300);		

	});

	// popup item order info hover functions
	$('.cis_popup_item_order_info').on('mouseenter', function() {
		$(this).stop(true,false).animate({
			'opacity' : 1
		},300);
	});
	$('.cis_popup_item_order_info').on('mouseleave', function() {
		var opacity_inactive = $(this).attr("op");
		$(this).stop(true,false).animate({
			'opacity' : opacity_inactive
		},300);
	});

	// popup arrows hover functions
	$('.cis_popup_left_arrow').on('mouseenter', function() {
		$(this).animate({
			'opacity' : 1
		},300);
	});
	$('.cis_popup_left_arrow').on('mouseleave', function() {
		var opacity_inactive = $(this).attr("op");
		$(this).animate({
			'opacity' : opacity_inactive
		},300);
	});	
	$('.cis_popup_right_arrow').on('mouseenter', function() {
		$(this).animate({
			'opacity' : 1
		},300);
	});
	$('.cis_popup_right_arrow').on('mouseleave', function() {
		var opacity_inactive = $(this).attr("op");
		$(this).animate({
			'opacity' : opacity_inactive
		},300);
	});

	// popup autoplay functions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var cis_popup_autoplay_start_timeout = '';
	function cis_popup_prepare_autoplay() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");

		// show play icon
		$('.cis_popup_autoplay_pause').addClass('cis_popup_topright_icon_hidden');
		$('.cis_popup_autoplay_play').removeClass('cis_popup_topright_icon_hidden');

		//fixed bug
		$('.cis_popup_autoplay_bar').stop(true,false).css('width','0%');

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_autoplay_default = parseInt(slider_data_array[13]);

		var cis_popup_autoplay_enabled = cis_popup_autoplay_default;
		var cis_popup_autoplay_index = parseInt($cis_popup.attr("cis_popup_autoplay"));

		if((cis_popup_autoplay_index == 2 && cis_popup_autoplay_enabled == 1) || cis_popup_autoplay_index == 1 ) {
			cis_popup_autoplay_start_timeout = setTimeout(function() {
				cis_popup_make_autoplay_start();
			},1200);
		}

		// autoplay hover functionality - will be activated, if will be requested!
		// var cis_popup_autoplay_ident = 1;//if 1, turn on autoplay hover functionlaity, if 2 - no!

		//delete previously declired hover function
		// $cis_popup.off('mouseenter.cis_popup_autoplay_hover_handler');
		// $cis_popup.off('mouseleave.cis_popup_autoplay_hover_handler');

		// if(cis_popup_autoplay_ident == 1) {//show on hover
		// 	// show arrows
		// 	cis_popup_make_autoplay_start();

		// 	// set hover functions
		// 	$cis_popup.on('mouseenter.cis_popup_autoplay_hover_handler', function() {
		// 		cis_popup_make_autoplay_stop();
		// 	});
		// 	$cis_popup.on('mouseleave.cis_popup_autoplay_hover_handler', function() {
		// 		cis_popup_make_autoplay_start();
		// 	});
			
		// }
		// else { //always show
		// 	cis_popup_make_autoplay_start();
		// }
	};

	$('.cis_popup_autoplay_play').on('click', function() {
		if($(this).hasClass('disable_click'))
			return;
		cis_popup_make_autoplay_start();
	});	
	$('.cis_popup_autoplay_pause').on('click', function() {
		if($(this).hasClass('disable_click'))
			return;	
		cis_popup_make_autoplay_stop();
	});

	function cis_popup_make_autoplay_start() {
		var $cis_popup = $('.cis_popup_wrapper');

		//clear auto-play timeout
		clearTimeout(cis_popup_autoplay_start_timeout);
		// toggle icons
		$('.cis_popup_autoplay_play').addClass('cis_popup_topright_icon_hidden');
		$('.cis_popup_autoplay_pause').removeClass('cis_popup_topright_icon_hidden');

		// set autoplay turned on
		$cis_popup.attr("cis_popup_autoplay","1");

		//strat autoplay
		cis_popup_autoplay_start();
	};
	function cis_popup_make_autoplay_stop() {
		var $cis_popup_autoplay_bar = $('.cis_popup_autoplay_bar');

		var bar_curr_width = parseFloat($cis_popup_autoplay_bar.width());
		var bar_total_width = parseFloat($cis_popup_autoplay_bar.parent('div').width());
		var curr_perc = 100 * bar_curr_width / bar_total_width;

		if(curr_perc > 98) {
			return;
		}
		// toggle icons
		$('.cis_popup_autoplay_pause').addClass('cis_popup_topright_icon_hidden');
		$('.cis_popup_autoplay_play').removeClass('cis_popup_topright_icon_hidden');

		//strat autoplay
		cis_popup_autoplay_stop();
	};

	function cis_popup_autoplay_start() {
		var $cis_popup = $('.cis_popup_wrapper');
		var item_id = $cis_popup.attr("item_id");

		var $cis_popup_autoplay_bar = $('.cis_popup_autoplay_bar');

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_autoplay_time = parseInt(slider_data_array[15]);

		var animation_time = cis_popup_autoplay_time;

		var bar_curr_width = parseFloat($cis_popup_autoplay_bar.width());
		var bar_total_width = parseFloat($cis_popup_autoplay_bar.parent('div').width());
		var curr_perc = 100 * bar_curr_width / bar_total_width;

		var remained_perc = 100 - curr_perc;
		var animation_time_remained = animation_time * remained_perc / 100;

		$cis_popup_autoplay_bar.stop(true,false).animate({
			'width': '100%'
		},animation_time_remained,'linear', function() {

			$('.cis_popup_close').addClass('disable_click');
			$('.cis_popup_autoplay_pause').addClass('disable_click');
			$('.cis_popup_autoplay_play').addClass('disable_click');

			cis_popup_show_next_item();
		});

	};

	function cis_popup_autoplay_stop() {
		var $cis_popup = $('.cis_popup_wrapper');

		//clear auto-play timeout
		clearTimeout(cis_popup_autoplay_start_timeout);

		// set autoplay turned off
		$cis_popup.attr("cis_popup_autoplay","0");

		var $cis_popup_autoplay_bar = $('.cis_popup_autoplay_bar');
		var bar_curr_width = parseInt($cis_popup_autoplay_bar.width());
		var animate_back_time = bar_curr_width * 0.9;

		$cis_popup_autoplay_bar.stop(true,false).animate({
			'width':'0%'
		},animate_back_time,'linear');

	};

	// popup arrow functions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$('.cis_popup_right_arrow').on('click', function() {
		cis_popup_show_next_item();
	});
	$('.cis_popup_left_arrow').on('click', function() {
		cis_popup_show_prev_item();
	});

	function cis_popup_show_next_item() {
		var $cis_popup = $('.cis_popup_wrapper');

		//check if popup is ready
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		var item_id = parseInt($cis_popup.attr("item_id"));
		var $original_item = $("#cis_item_" + item_id);

		//get data
		var slider_data = $("#cis_item_" + item_id).parents('.cis_main_wrapper').find('.cis_popup_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_popup_closeonend = parseInt(slider_data_array[14]);

		var slider_id = parseInt($original_item.parents('.cis_main_wrapper').attr("cis_slider_id"));
		var item_order = parseInt($original_item.attr("cis_popup_order"));
		var cis_popup_items_length = parseInt($original_item.parents('.cis_main_wrapper').attr("cis_popup_items_count"));

		// if last item, return
		if(item_order == cis_popup_items_length) {
			var cis_popup_last_item_behaviour = cis_popup_closeonend;

			if(cis_popup_last_item_behaviour == 1) {
				//close creative popup, if last item
				cis_reset_creative_popup();
			}
			else {
				// show play icon
				$('.cis_popup_autoplay_pause').addClass('cis_popup_topright_icon_hidden');
				$('.cis_popup_autoplay_play').removeClass('cis_popup_topright_icon_hidden');

				//reset bar
				$('.cis_popup_autoplay_bar').stop(true,false).animate({
					'width': '0%'
				},400,'swing');
			}
			return;
		}
		else {
			var active_item_id = parseInt($original_item.nextAll('.cis_row_item.cis_has_popup').first().attr("item_id"));

			//hide arrows 
			cis_popup_hide_arrows();
			//hide image order data
			cis_popup_hide_item_order();
			//hide popup autoplay bar
			cis_popup_hide_autoplay_bar();
			//hide tpright arrows
			cis_popup_hide_topright_icons();			
			//hide back
			cis_popup_hide_back();

			// set animation progress class
			$cis_popup.addClass('cis_popup_in_progress');

			// the hiding animation accurs in 600ms, so we will hide existing item in that time 
			var bottom_h = parseInt($cis_popup.find('.cis_popup_bottom_holder').attr("h"));

			//animate main popup
			$cis_popup.stop().animate({
				'height':'-=' + bottom_h
			},600,'swing', function() {
				$('.cis_popup_bottom_inner_wrapper').remove()
			});

			//animate bottom holder
			$('.cis_popup_bottom_holder').animate({
				'height': 0
			},600,'swing');

			$('.cis_popup_item').stop().fadeTo(600,0, function() {
				$(this).remove();

				//show new item
				cis_show_image(active_item_id);
			});
		};
	};

	function cis_popup_show_prev_item() {
		var $cis_popup = $('.cis_popup_wrapper');

		//check if popup is ready
		if($cis_popup.hasClass('cis_popup_in_progress'))
			return;

		var item_id = parseInt($cis_popup.attr("item_id"));
		var $original_item = $("#cis_item_" + item_id);

		var slider_id = parseInt($original_item.parents('.cis_main_wrapper').attr("cis_slider_id"));
		var item_order = parseInt($original_item.attr("cis_popup_order"));
		var cis_popup_items_length = parseInt($original_item.parents('.cis_main_wrapper').attr("cis_popup_items_count"));

		// if first item, return
		if(item_order == 1) {
			return;
		}
		else {
			var active_item_id = parseInt($original_item.prevAll('.cis_row_item.cis_has_popup').first().attr("item_id"));

			//hide arrows 
			cis_popup_hide_arrows();
			//hide image order data
			cis_popup_hide_item_order();
			//hide popup autoplay bar
			cis_popup_hide_autoplay_bar();
			//hide tpright arrows
			cis_popup_hide_topright_icons();

			// set animation progress class
			$cis_popup.addClass('cis_popup_in_progress');

			// the hiding animation accurs in 600ms, so we will hide existing item in that time 
			var bottom_h = parseInt($cis_popup.find('.cis_popup_bottom_holder').attr("h"));

			//animate main popup
			$cis_popup.stop().animate({
				'height':'-=' + bottom_h
			},600,'swing', function() {
				$('.cis_popup_bottom_inner_wrapper').remove()
			});

			//animate bottom holder
			$('.cis_popup_bottom_holder').animate({
				'height': 0
			},600,'swing');

			$('.cis_popup_item').stop().fadeTo(600,0, function() {
				$(this).remove();

				//show new item
				cis_show_image(active_item_id);
			});
		};
	};

	//Popup autoplay bar ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function cis_popup_show_autoplay_bar() {
		setTimeout(function() {
			$('.cis_popup_autoplay_bar_holder').stop().animate({
				'opacity': '0.8'
			},400,'swing');
		},100);
	};

	function cis_popup_hide_autoplay_bar() {
		$('.cis_popup_autoplay_bar_holder').stop(true,false).animate({
			'opacity': '0'
		},400,'swing');
		$('.cis_popup_autoplay_bar').stop(true,false).animate({
			'width': '0%'
		},400,'swing');
	};

	//slider correction////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$('.cis_row_item').mouseenter(function() {
		cis_make_slider_item_correction($(this));
	});

	function cis_make_slider_item_correction($elem) {
		var $loader = $elem.find('.cis_row_item_loader'); 
		var slider_id = $loader.parents('.cis_main_wrapper').attr("cis_slider_id");
		var item_id = $loader.parents('.cis_row_item').attr("item_id");

		// get total items width
		var items_w = parseInt($loader.parents('.cis_main_wrapper').find('.cis_images_holder').width());
		var total_w = parseInt($loader.parents('.cis_main_wrapper').find('.cis_images_row').width());

		//check if slider in scroll progress, then return
		if($loader.parents('.cis_main_wrapper').find('.cis_images_holder').hasClass('cis_scrolling') || $loader.parents('.cis_main_wrapper').find('.cis_images_holder').hasClass('cis_autoplay_back_animation') || items_w < total_w)
			return;

		var $cis_popup = $('.cis_popup_wrapper');

		var loader_width = parseInt($loader.css('width'));
		var items_m_r = parseInt($loader.parents('.cis_row_item').css('margin-right'));

		//get slider_offset
		var image_index = $loader.parents('.cis_row_item').attr("cis_item_order");
		var total_items_width = 0;
		$loader.parents('.cis_main_wrapper').find('.cis_row_item').each(function(i) {
			var w = parseInt($(this).width());
			var m_r = parseInt($(this).css('margin-right'));
			total_items_width = total_items_width + 1*w + 1*m_r;
			if(i == image_index)
				return false;
		});

		var current_left_offset = Math.abs(parseInt($loader.parents('.cis_main_wrapper').find('.cis_images_holder').css('margin-left')));
		var wrapper_width = parseInt($loader.parents('.cis_main_wrapper').width());

		var offset1 = total_items_width - current_left_offset;
		var direction = 0;
		var item_offset_to_move = 0;
		if(offset1 >= wrapper_width) {
			var item_offset = total_items_width - current_left_offset - wrapper_width - items_m_r;
			var item_offset_to_move = item_offset < 0 ? 0 : item_offset;
		}
		else {
			if(offset1 < loader_width) {
				var item_offset_to_move = loader_width - offset1 + 1*items_m_r;
				direction = 1;
			}
		};

		// BUG FIX
		var current_left_offset_with_sign = parseInt($loader.parents('.cis_main_wrapper').find('.cis_images_holder').css('margin-left'));
		if(direction == 1 && item_offset_to_move > 0 && image_index == 0 && current_left_offset_with_sign >= 0)
			return;

		var popup_loader_animate_timeout = 400;
		if(item_offset_to_move > 0) {
			// popup_loader_animate_timeout = Math.abs(item_offset_to_move) * 4;
			if(direction == 1) {
				$loader.parents('.cis_main_wrapper').find('.cis_images_holder').stop(true,false).animate({
					'margin-left': "+=" + item_offset_to_move
				},popup_loader_animate_timeout,'swing');
			}
			else {
				$loader.parents('.cis_main_wrapper').find('.cis_images_holder').stop(true,false).animate({
					'margin-left': "-=" + item_offset_to_move
				},popup_loader_animate_timeout,'swing');
			};
		};
	};

	// slider autoplay///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var cis_evenly_move_intervals = new Array();
	var cis_autoplay_start_timeouts = new Array();
	var cis_autoplay_animate_back_timeouts = new Array();
	function cis_make_autoplay() {
		$(".cis_main_wrapper").each(function() {
			$wrapper = $(this);
			//get autoplay data
			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay = parseInt(slider_data_array[3]);
			var slider_autoplay_start_timeout = parseInt(slider_data_array[4]); 
			var slider_autoplay_step_timeout = parseInt(slider_data_array[5]);
			var slider_autoplay_evenly_speed = parseInt(slider_data_array[6]);
			
			if(slider_autoplay == 0) {
				return;
			}
			else if(slider_autoplay == 1) {
				cis_make_evenly_autoplay($wrapper);
			}
			else if(slider_autoplay == 2) {
				cis_make_steps_autoplay($wrapper);
			}
		});
	};
	cis_make_autoplay();
	
	function cis_make_steps_autoplay($wrapper) {
		var slider_id = $wrapper.attr("roll");
		
		var slider_data = $wrapper.find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
		var slider_autoplay_step_timeout = parseInt(slider_data_array[5]);
		var slider_autoplay_restart_timeout = parseInt(slider_data_array[7]);
		
		cis_autoplay_animate_back_timeouts[slider_id] = '';
		
		cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
			//set interval
			cis_evenly_move_intervals[slider_id] = setInterval(function() {
				cis_move_slider_by_steps($wrapper);
			},slider_autoplay_step_timeout);
		},slider_autoplay_start_timeout);
		
		$wrapper.hover(function() {
			clearTimeout(cis_autoplay_start_timeouts[slider_id]);
			clearTimeout(cis_autoplay_animate_back_timeouts[slider_id]);
			clearInterval(cis_evenly_move_intervals[slider_id]);
			$wrapper.addClass('cis_mouseentered');
		},function() {
			//check if popup vissible///////////////////////////////////
			var $cis_popup = $('.cis_popup_wrapper');
			var popup_slider_id = $cis_popup.attr("slider_id");
			if($cis_popup.hasClass('cis_vissible') && popup_slider_id == slider_id) {
				return;
			}

			cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
				//set interval
				cis_evenly_move_intervals[slider_id] = setInterval(function() {
					cis_move_slider_by_steps($wrapper);
				},slider_autoplay_step_timeout);
			},slider_autoplay_restart_timeout);
			$wrapper.removeClass('cis_mouseentered');
		});
	};
	
	function cis_move_slider_by_steps($wrapper) {
		var slider_id = $wrapper.attr("roll");
		
		var slider_data = $wrapper.find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
		var slider_autoplay_step_timeout = parseInt(slider_data_array[5]);
		
		$cis_images_holder = $wrapper.find('.cis_images_holder');
		var screen_w = parseFloat($cis_images_holder.parent('div').width());
		var total_w = parseFloat($cis_images_holder.width());
		
		if(total_w >= screen_w)
			var result = cis_move_images_holder_left($cis_images_holder);
		else
			var result = cis_move_images_holder_right($cis_images_holder);
		
		if(result == 'end') {
			clearTimeout(cis_autoplay_start_timeouts[slider_id]);
			clearInterval(cis_evenly_move_intervals[slider_id]);
			
			var cis_animate_back_to_start_timeout = slider_autoplay_step_timeout;
			var cis_animate_back_to_start_time = Math.abs(parseInt((total_w - screen_w) * 1.5));
			cis_animate_back_to_start_time = cis_animate_back_to_start_time < 600 ? 600 : cis_animate_back_to_start_time;

			var $sl = $('.cis_wrapper_' + slider_id).find('.cis_images_holder');;
			//set timeout to animate back
			cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
				$sl.addClass('cis_autoplay_back_animation');
				//animate back to start
				$sl.stop(true,false).animate({
					'margin-left': 0
				},cis_animate_back_to_start_time,'easeOutBack', function() {
					var $sl = $('.cis_wrapper_' + slider_id);
					$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');

					//check to see that mouseenter does not happened
					if($wrapper.hasClass('cis_mouseentered'))
						return;
					
					//set new autoplay
					cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
						//set interval
						cis_evenly_move_intervals[slider_id] = setInterval(function() {
							cis_move_slider_by_steps($sl);
						},slider_autoplay_step_timeout);
					},slider_autoplay_start_timeout);
				});
			},cis_animate_back_to_start_timeout);
				
		}
	};
	
	var cis_interval_time = 250;
	function cis_make_evenly_autoplay($wrapper) {
		var slider_id = $wrapper.attr("roll");
		
		var slider_data = $wrapper.find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
		var slider_autoplay_restart_timeout = parseInt(slider_data_array[7]);
		
		cis_autoplay_animate_back_timeouts[slider_id] = '';
		
		cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
			//set interval
			cis_evenly_move_intervals[slider_id] = setInterval(function() {
				cis_move_slider_evenly($wrapper);
			},cis_interval_time);
		},slider_autoplay_start_timeout);
		
		$wrapper.hover(function() {
			clearTimeout(cis_autoplay_start_timeouts[slider_id]);
			clearTimeout(cis_autoplay_animate_back_timeouts[slider_id]);
			clearInterval(cis_evenly_move_intervals[slider_id]);
			$wrapper.addClass('cis_mouseentered');
		},function() {
			//check if popup vissible///////////////////////////////////
			var $cis_popup = $('.cis_popup_wrapper');
			var popup_slider_id = $cis_popup.attr("slider_id");
			if($cis_popup.hasClass('cis_vissible') && popup_slider_id == slider_id) {
				return;
			}

			cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
				//set interval
				cis_evenly_move_intervals[slider_id] = setInterval(function() {
					cis_move_slider_evenly($wrapper);
				},cis_interval_time);
			},slider_autoplay_restart_timeout);
			$wrapper.removeClass('cis_mouseentered');
		});
	};
	
	function cis_move_slider_evenly($wrapper) {
		var slider_id = $wrapper.attr("roll");
		
		//get autoplay data
		var slider_data = $wrapper.find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
		var slider_autoplay_evenly_speed = parseInt(slider_data_array[6]);
		
		$cis_images_holder = $wrapper.find('.cis_images_holder');
		var screen_w = parseFloat($cis_images_holder.parent('div').width());
		var total_w = parseFloat($cis_images_holder.width());
		var curr_left = parseFloat($cis_images_holder.css('margin-left'));
		curr_left = (total_w >= screen_w) ? curr_left - slider_autoplay_evenly_speed : curr_left + 1 * slider_autoplay_evenly_speed;
		
		var cis_single_autoplay_time = 400;
		var cis_autoplay_ease_time = 600;
		var cis_animate_back_to_start_timeout = 2000;
		var cis_animate_back_to_start_time = Math.abs(parseInt((total_w - screen_w) * 1.5));
		cis_animate_back_to_start_time = cis_animate_back_to_start_time < 600 ? 600 : cis_animate_back_to_start_time;
		
		var slider_data = $wrapper.find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var delta_offset = parseInt(slider_data_array[0]);
		var move_speed_time = parseInt(slider_data_array[1]); 
		var ease_effect = parseInt(slider_data_array[2]);
		var cis_effect_type = 'swing';
		
		ease_effect = slider_autoplay_evenly_speed;
		
		if(total_w >= screen_w) {
			//check if end
			if(Math.abs(curr_left) + 1 * screen_w >= total_w) {
				clearTimeout(cis_autoplay_start_timeouts[slider_id]);
				clearInterval(cis_evenly_move_intervals[slider_id]);
				
				var desired_left = screen_w - total_w;
				var desired_left_1 = desired_left;
				desired_left_1 = (total_w < screen_w) ? desired_left_1 + ease_effect * 1 : desired_left_1 - ease_effect * 1; 
				
				//calculate last point speed
				var curr_left_final = parseFloat($cis_images_holder.css('margin-left'));
				var move_speed_time_final = Math.abs(curr_left_final - desired_left_1) * cis_single_autoplay_time  / slider_autoplay_evenly_speed;
				$cis_images_holder.stop(true,false).animate({//swing effect
					'margin-left': desired_left_1
				},move_speed_time_final,cis_effect_type,function() {
					//easing animation on end
					var $sl = $('.cis_wrapper_' + slider_id).find('.cis_images_holder');
					$sl.stop().animate({
						'margin-left': desired_left
					},cis_autoplay_ease_time,'easeOutBack', function() {
						
						//check to see that mouseenter does not happened
						if($wrapper.hasClass('cis_mouseentered'))
							return;
						
						var $sl = $('.cis_wrapper_' + slider_id).find('.cis_images_holder');
						//set timeout to animate back
						cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
							//animate back to start
							$sl.addClass('cis_autoplay_back_animation');
							$sl.stop(true,false).animate({
								'margin-left': 0
							},cis_animate_back_to_start_time,'easeOutBack', function() {
								var $sl = $('.cis_wrapper_' + slider_id);

								$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');
								//check to see that mouseenter does not happened
								if($wrapper.hasClass('cis_mouseentered'))
									return;
								
								//set new autoplay
								cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
									//set interval
									cis_evenly_move_intervals[slider_id] = setInterval(function() {
										cis_move_slider_evenly($sl);
									},cis_interval_time);
								},slider_autoplay_start_timeout);
							});
						},cis_animate_back_to_start_timeout);
					});
				});
			}
			else {
				$cis_images_holder.stop(true,false).animate({
					'margin-left': curr_left
				},cis_single_autoplay_time,'linear');
			}
		}
		else {
			//check if end
			if(Math.abs(curr_left) + 1 * total_w >= screen_w) {
				//clear timeouts, intervals
				clearTimeout(cis_autoplay_start_timeouts[slider_id]);
				clearInterval(cis_evenly_move_intervals[slider_id]);
				
				var desired_left = screen_w - total_w;
				var desired_left_1 = desired_left;
				desired_left_1 =  desired_left_1 + ease_effect * 1;
				
				//calculate last point speed
				var curr_left_final = parseFloat($cis_images_holder.css('margin-left'));
				var move_speed_time_final = Math.abs(curr_left_final - desired_left_1) * cis_single_autoplay_time  / slider_autoplay_evenly_speed;
				$cis_images_holder.stop(true,false).animate({//swing effect
					'margin-left': desired_left_1
				},move_speed_time_final,cis_effect_type,function() {
					//easing animation on end
					var $sl = $('.cis_wrapper_' + slider_id).find('.cis_images_holder');
					$sl.stop().animate({
						'margin-left': desired_left
					},cis_autoplay_ease_time,'easeOutBack', function() {
						//check to see that mouseenter does not happened
						if($wrapper.hasClass('cis_mouseentered'))
							return;
						var $sl = $('.cis_wrapper_' + slider_id).find('.cis_images_holder');
						//set timeout to animate back
						cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
							//animate back to start
							$sl.stop(true,false).animate({
								'margin-left': 0
							},cis_animate_back_to_start_time,'easeOutBack', function() {
								//check to see that mouseenter does not happened
								if($wrapper.hasClass('cis_mouseentered'))
									return;
								
								var $sl = $('.cis_wrapper_' + slider_id);
								//set new autoplay
								cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
									//set interval
									cis_evenly_move_intervals[slider_id] = setInterval(function() {
										cis_move_slider_evenly($sl);
									},cis_interval_time);
								},slider_autoplay_start_timeout);
							});
						},cis_animate_back_to_start_timeout);
					});
				});
			}
			else {
				$cis_images_holder.stop(true,false).animate({
					'margin-left': curr_left
				},cis_single_autoplay_time,'linear');
			}
		}
		
	};
	
	//arrows
	function cis_prepare_arrows() {
		$(".cis_main_wrapper").each(function() {
			var $wrapper = $(this);
			var $left_arrow = $wrapper.find('.cis_button_left');
			var $right_arrow = $wrapper.find('.cis_button_right');

			$left_arrow.removeAttr("style");
			$right_arrow.removeAttr("style");
			
			//get arrows data
			var arr_data = $wrapper.find('.cis_arrow_data').html();
			var arr_data_array = arr_data.split(',');
			var arrow_width = arr_data_array[0];
			var arrow_corner_offset = arr_data_array[1];
			var arrow_middle_offset = arr_data_array[2];
			var arrow_opacity = arr_data_array[3] / 100;
			var show_arrows = arr_data_array[4];
			
			//set data
			$left_arrow.attr("op",arrow_opacity);
			$left_arrow.attr("corner_offset",arrow_corner_offset);
			$right_arrow.attr("op",arrow_opacity);
			$right_arrow.attr("corner_offset",arrow_corner_offset);
			
			//set styles
			$left_arrow.css('width',arrow_width);
			$right_arrow.css('width',arrow_width);
			
			var arrow_height = parseInt ($left_arrow.height());
			var wrapper_height = parseFloat ($wrapper.height());
			var p_t = isNaN(parseFloat($wrapper.css('padding-top'))) ? 0 : parseFloat($wrapper.css('padding-top'));
			var p_b = isNaN(parseFloat($wrapper.css('padding-bottom'))) ? 0 : parseFloat($wrapper.css('padding-bottom'));
			var arrow_top_position = ((wrapper_height + 1 * p_t + 1 * p_b - arrow_height) / 2 ) + 1 * arrow_middle_offset;
			
			$left_arrow.css({
				'top': arrow_top_position,
				'left': '-64px',
				'opacity': arrow_opacity
			});
			$right_arrow.css({
				'top': arrow_top_position,
				'right': '-64px',
				'opacity': arrow_opacity
			});
			
			if(show_arrows == 0) {//never show arrows
				$left_arrow.remove();
				$right_arrow.remove();
			}
			else if(show_arrows == 1) {//show on hover
				$wrapper.hover(function() {
					cis_show_arrows($wrapper);
				}, function() {
					cis_hide_arrows($wrapper);
				})
			}
			else {
				cis_show_arrows($wrapper);
			}
		});
	};
	setTimeout(function() {
		cis_prepare_arrows();
	},1200);
	
	var cis_arrows_timeout1 = '';
	var cis_arrows_timeout2 = '';
	function cis_show_arrows($wrapper) {
		//clear timeouts
		clearTimeout(cis_arrows_timeout1);
		clearTimeout(cis_arrows_timeout2);
		
		var $left_arrow = $wrapper.find('.cis_button_left');
		var $right_arrow = $wrapper.find('.cis_button_right');
		
		var corner_offset = $left_arrow.attr("corner_offset");
		
		var animation_time = 400;
		var start_offset = -64;
		var effect = 'easeOutBack';
		
		cis_arrows_timeout1 = setTimeout(function() {
			$left_arrow.stop(true,false).animate({
				'left': corner_offset
			},animation_time,effect);
			
			$right_arrow.stop(true,false).animate({
				'right': corner_offset
			},animation_time,effect);
		},100);
		
	};
	function cis_hide_arrows($wrapper) {
		//clear timeouts
		clearTimeout(cis_arrows_timeout1);
		clearTimeout(cis_arrows_timeout2);
		
		var $left_arrow = $wrapper.find('.cis_button_left');
		var $right_arrow = $wrapper.find('.cis_button_right');
		
		var animation_time = 300;
		var start_offset = -64;
		var effect = 'easeInBack';
		
		cis_arrows_timeout2 = setTimeout(function() {
			$left_arrow.stop(true,false).animate({
				'left': start_offset
			},animation_time,effect);
			
			$right_arrow.stop(true,false).animate({
				'right': start_offset
			},animation_time,effect);
		},200)
	};
	
//mousewheel**************************************************************
	$('.cis_images_row').mousewheel(function(objEvent, intDelta) {
		if($(this).hasClass('cis_scrolling_vertical'))
			return;
		if(intDelta > 0)
			cis_move_images_holder_left($(this).find('.cis_images_holder'));
		else 
			cis_move_images_holder_right($(this).find('.cis_images_holder'));
	});
	
	// setTimeout(function() {
	// 	//cis_move_images_holder_right($('.cis_images_holder'));
	// },250);
	
	//function to move left

	var cis_effect_type = 'swing';
	var cis_clear_timeout = '';
	var cis_switch_move_direction = false;
	
	function cis_move_images_holder_left($wrapper) {
		
		//get slider data
		var slider_data = $wrapper.parents('.cis_main_wrapper ').find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var delta_offset = parseInt(slider_data_array[0]);
		var move_speed_time = parseInt(slider_data_array[1]); 
		var ease_effect = parseInt(slider_data_array[2]);
		
		clearTimeout(cis_clear_timeout);
		$('.cis_images_holder').addClass('cis_scrolling');
		cis_clear_timeout = setTimeout(function() {
			$('.cis_images_holder').removeClass('cis_scrolling');
		},move_speed_time);
		
		var screen_w = parseFloat($wrapper.parent('div').width());
		var total_w = parseFloat($wrapper.width());
		var curr_left = parseFloat($wrapper.css('margin-left'));
		curr_left -= delta_offset;
		
		//check if end
		if(Math.abs(curr_left) + 1 * screen_w >= total_w) {
			var desired_left = screen_w - total_w;
			var desired_left_1 = desired_left;
			desired_left_1 = (total_w < screen_w) ? desired_left_1 + ease_effect * 1 : desired_left_1 - ease_effect * 1; 
			
			if(total_w < screen_w && !cis_switch_move_direction) {
				cis_switch_move_direction = true;
				cis_move_images_holder_right($wrapper);
				cis_switch_move_direction = false;
				return;
			}
			
			//calculate last point speed
			var curr_left_final = parseFloat($wrapper.css('margin-left'));
			var move_speed_time_final = Math.abs(curr_left_final - desired_left_1) * move_speed_time * 1.2  / delta_offset;
			$wrapper.stop(true,false).animate({
				'margin-left': desired_left_1
			},move_speed_time_final,cis_effect_type,function() {
				$(this).stop().animate({
					'margin-left': desired_left
				},move_speed_time,'easeOutBack')
			});
			
			return 'end';
		}
		else {
			$wrapper.stop(true,false).animate({
				'margin-left': curr_left
			},move_speed_time,cis_effect_type);
		}
		
	};
	function cis_move_images_holder_right($wrapper) {
		
		//get slider data
		var slider_data = $wrapper.parents('.cis_main_wrapper ').find('.cis_moving_data').html();
		var slider_data_array = slider_data.split(',');
		var delta_offset = parseInt(slider_data_array[0]);
		var move_speed_time = parseInt(slider_data_array[1]); 
		var ease_effect = parseInt(slider_data_array[2]);
		
		clearTimeout(cis_clear_timeout);
		$('.cis_images_holder').addClass('cis_scrolling');
		cis_clear_timeout = setTimeout(function() {
			$('.cis_images_holder').removeClass('cis_scrolling');
		},move_speed_time);
		
		
		var screen_w = parseFloat($wrapper.parent('div').width());
		var total_w = parseFloat($wrapper.width());
		var curr_left = parseFloat($wrapper.css('margin-left'));
		curr_left += delta_offset;
		
		//check if start
		if(curr_left >= 0) {
			var desired_left = 0;
			var desired_left_1 = desired_left;
			desired_left_1 = (total_w < screen_w) ? desired_left_1 - ease_effect * 1 : desired_left_1 + ease_effect * 1;
			
			if(total_w < screen_w && !cis_switch_move_direction) {
				cis_switch_move_direction = true;
				var r = cis_move_images_holder_left($wrapper);
				cis_switch_move_direction = false;
				return r;
			}
			
			//calculate last point speed
			var curr_left_final = parseFloat($wrapper.css('margin-left'));
			var move_speed_time_final = Math.abs(curr_left_final - desired_left_1) * move_speed_time * 1.2 / delta_offset;
			$wrapper.stop(true,false).animate({
				'margin-left': desired_left_1
			},move_speed_time_final,cis_effect_type,function() {
				$(this).stop().animate({
					'margin-left': desired_left
				},move_speed_time,'easeOutBack')
			});
			
			return 'end';
		}
		else {
			$wrapper.stop().animate({
				'margin-left': curr_left
			},move_speed_time,cis_effect_type);
		}
	};
	
	//buttons
	$('.cis_button_left').click(function() {
		var $cis_wrapper = $(this).parents('.cis_images_row').find('.cis_images_holder');
		var screen_w = parseFloat($cis_wrapper.parent('div').width());
		var total_w = parseFloat($cis_wrapper.width());
		if(total_w < screen_w)
			cis_move_images_holder_left($cis_wrapper);
		else
			cis_move_images_holder_right($cis_wrapper);
	});
	$('.cis_button_right').click(function() {
		var $cis_wrapper = $(this).parents('.cis_images_row').find('.cis_images_holder');
		var screen_w = parseFloat($cis_wrapper.parent('div').width());
		var total_w = parseFloat($cis_wrapper.width());
		if(total_w < screen_w)
			cis_move_images_holder_right($cis_wrapper);
		else
			cis_move_images_holder_left($cis_wrapper);
	});
	$('.cis_button_left').hover(function() {
		$(this).animate({
			'opacity' : 1
		},300);
	},function() {
		var opacity_inactive = $(this).attr("op");
		$(this).animate({
			'opacity' : opacity_inactive
		},300);
	});
	$('.cis_button_right').hover(function() {
		$(this).animate({
			'opacity' : 1
		},300);
	},function() {
		var opacity_inactive = $(this).attr("op");
		$(this).animate({
			'opacity' : opacity_inactive
		},300);
	});
	
	//disable page scroll
	$('.cis_images_row').bind('mousewheel DOMMouseScroll', function(e) {
	    var scrollTo = null;

	    if (e.type == 'mousewheel') {
	        scrollTo = (e.originalEvent.wheelDelta * -1);
	    }
	    else if (e.type == 'DOMMouseScroll') {
	        scrollTo = 40 * e.originalEvent.detail;
	    }

	    if (scrollTo) {
	        e.preventDefault();
	        $(this).scrollTop(scrollTo + $(this).scrollTop());
	    }
	});
	
	//Items drag effect
	$('.cis_images_row img').on('dragstart', function(event) { event.preventDefault(); });
	$('.cis_row_item_overlay').on('dragstart', function(event) { event.preventDefault(); });
	
	//Globals
	var cis_posXdragStart = 0,
		cis_currentMouseX = -1,
		cis_swipe_offset = 15,
		cis_move_interval='';
	
	$('.cis_images_row').mousemove(function(event) {
		cis_currentMouseX = event.pageX;
    });
	
	$('.cis_images_row').mousedown(function(e) {
		
		//disable drag for overlay
		 if($(e.target).hasClass('cis_row_item_overlay_txt') || $(e.target).hasClass('creative_btn') || 
			$(e.target).hasClass('cis_row_item_overlay') || $(e.target).hasClass('creative_icon-white')) {
			 return;
		 }
		
		cis_posXdragStart = cis_currentMouseX;
		var $cis_wrapper = $(this).find('.cis_images_holder');
		cis_move_interval = setInterval(function() {cis_makeDrag($cis_wrapper);},10);
	});
	
	function cis_makeDrag($cis_wrapper) {
		if(cis_posXdragStart - cis_currentMouseX >= cis_swipe_offset) {
			cis_move_images_holder_left($cis_wrapper);
			cis_clear_interval();
		}
		else if(cis_currentMouseX - cis_posXdragStart >= cis_swipe_offset) {
			cis_move_images_holder_right($cis_wrapper);
			cis_clear_interval();
		}
	};
	
	$('.cis_images_row').mouseup(function() {
		cis_clear_interval();
	});
	$('.cis_images_row').mouseleave(function() {
		cis_clear_interval();
	});
	
	//clear interval
	function cis_clear_interval() {
		clearInterval(cis_move_interval);
	};
	
	//hover animation
	//calculate overlay height
	function cis_calculate_itms_height() {
		$(".cis_row_item").each(function() {
			var $cis_overlay = $(this).find('.cis_row_item_overlay');
			$cis_overlay.css({'visibility' : 'hidden','display' : 'block'});
			//var h = $cis_overlay.height();
			//$cis_overlay.css({'visibility' : 'visible','display' : 'block','height' : '0'}).attr('h',h);
		});
	};
	
	$(".cis_row_item img").load(function() {
		var $this = $(this);
		$this.attr('cis_loaded','loaded');
		var $cis_overlay = $(this).next('.cis_row_item_overlay');
		$cis_overlay.css({'visibility' : 'hidden','display' : 'block'});
		var h = $cis_overlay.height();
		$cis_overlay.css({'visibility' : 'visible','display' : 'block','height' : '0'}).attr('h',h);
		$cis_overlay.attr('cis_animation','enabled');
		
		$this.addClass('cis_loaded');
		setTimeout(function() {
			cis_make_proccess($this);
		},400);
	});
	
	function cis_make_proccess($el) {
		var item_width = $el.width();
		$el.parents('.cis_row_item').find('.cis_row_item_loader').animate({
			width: item_width
		},400,'swing',function() {
			$el.parents('.cis_row_item').find('.cis_row_item_loader').fadeOut(200,function() {
				$el.parents('.cis_row_item_inner').hide().removeClass('cis_row_hidden_element').fadeIn(200);
			});
		});
	};
	
	function cis_getRandomArbitary (min, max) {
	    return Math.random() * (max - min) + min;
	};
	
	function cis_calculate_loaders_width() {
		$('.cis_images_holder').each(function() {
			var $wrapper = $(this);
			var wrapper_width = $wrapper.parents('.cis_images_row').width();
			var items_height = $wrapper.find('.cis_row_item_loader').height();
			
			var loader_prepared_width = items_height * 1.5;
			var loader_ratio_sign = Math.random() < 0.5 ? 1 : -1;
			$wrapper.find('.cis_row_item_loader').each(function() {
				var loader_width_calculated = loader_prepared_width + loader_ratio_sign * cis_getRandomArbitary(0,20);
				$(this).width(loader_width_calculated);
				loader_ratio_sign = loader_ratio_sign == 1 ? -1 : 1;
			});
		});
	};
	cis_calculate_loaders_width();
	
	//overlay functions
	$('.cis_main_wrapper').each(function() {
		var $this = $(this);
		var cis_overlay_type = parseInt($(this).attr("cis_overlay_type"));
		if(cis_overlay_type == 0) { // slide-up on hover

			$this.find(".cis_row_item").hover(function() {
				var animation_enabled = $(this).find('.cis_row_item_overlay').attr('cis_animation');
				if(animation_enabled != 'enabled')
					return;
				
				if(!($(this).parents('.cis_images_holder').hasClass('cis_scrolling'))) {
					var $cis_overlay = $(this).find('.cis_row_item_overlay');
					var overlay_height = parseInt($cis_overlay.attr('h'));
					$cis_overlay.stop().animate({
						height: overlay_height
					},300,'swing');
				}
			},function() {
				var animation_enabled = $(this).find('.cis_row_item_overlay').attr('cis_animation');
				if(animation_enabled != 'enabled')
					return;
				
				var $cis_overlay = $(this).find('.cis_row_item_overlay');
				$cis_overlay.stop().animate({
					height: 0
				},300,'swing');
			});
		}
		else if(cis_overlay_type == 1) { // keep opened
			$this.find(".cis_row_item_overlay").addClass("cis_height_auto");
		}		
		else if(cis_overlay_type == 2) { // special animation
			// TODO!!!
		}
	});

	//make back
	function cis_make_backlinks() {
		$('.cis_main_wrapper').each(function() {
			var cis_back_htm = '<div style="display: block !important;z-index: 99;font-weight: normal;padding: 3px 10px 3px 8px;line-height: 20px;background-color: #000;color: #fff;position: absolute;right: 0px;font-style: italic;font-size: 12px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;bottom: 0px;opacity: 0;background-image: linear-gradient(to bottom,#000000,#383838) !important;text-shadow: 0 3px 3px #000000;border: 1px solid rgb(0, 0, 0);border-top: 0;">By <a style="font-weight: bold;color: rgb(72, 108, 253);" href="http://creative-solutions.net/wordpress/creative-image-slider" target="_blank">Creative Image Slider</a></div>';
			$(this).append(cis_back_htm);
			var $back = $(this).children('div').last();
			var h = parseInt($back.height()) + 7*1;
			$back.attr('h',h);

			$(this).hover(function() {
				cis_show_back_canvas($back);
			},function() {
				cis_hide_back_canvas($back);
			})
		});
	};
	setTimeout(function() {
		cis_make_backlinks();
	},1200);
	function cis_show_back_canvas($back) {
		var h = -1* parseInt($back.attr('h'));
		$back.stop(true,false).animate({
			'bottom': h,
			'opacity': '0.95'
		},'swing');
	};	
	function cis_hide_back_canvas($back) {
		$back.stop(true,false).animate({
			'bottom': '0',
			'opacity': '0'
		},'swing');
	};


});
})(jQuery);