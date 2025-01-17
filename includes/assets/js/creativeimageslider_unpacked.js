(function ($) {
	window.CreativeImageSlider = function (options) {

		this.options = options;
		this.wrapper = $('div#' + options.id);

		var cis_is_touch_devise = false;
		if( 'ontouchstart' in window ) {
			cis_is_touch_devise = true;
		}
		this.options.cis_is_touch_devise = cis_is_touch_devise;

		//get slider data
		var slider_data = this.wrapper.find('.cis_options_data').html();
		var slider_data_array = slider_data.split(',');
		var cis_animation_type_index = parseInt(slider_data_array[0]);
		var cis_animation_type = cis_animation_type_index == 1 ? 'javascript' : 'css3';

		this.options.cis_animation_type = cis_animation_type;
		this.options.slider_data_array = slider_data_array;

		//get popup data
		var popup_data = this.wrapper.find('.cis_popup_data').html();
		var popup_data_array = popup_data.split(',');
		this.options.popup_data_array = popup_data_array;
		this.options.cis_popup_paths = new Array;

		// timeouts
		this.cis_arrows_timeout1 = '';
		this.cis_arrows_timeout2 = '';

		this.cis_make_css3_movement_enabled = true;

		this.cis_css3_back_timeout = '';
		this.cis_clear_timeout = '';
		this.cis_drag_speed = 0;
		this.cis_switch_move_direction = false;

		this.cis_evenly_move_intervals = new Array();
		this.cis_autoplay_start_timeouts = new Array();
		this.cis_autoplay_animate_back_timeouts = new Array();
		this.cis_interval_time = 250;
		this.cis_autoplay_inf_scroll_index = 0;

		this.slider_loaded = false;
		this.cis_show_icons_enabled = true;

		// touch properties
		this.cis_posXdragStart = 0;
		this.cis_currentMouseX = -1;
		this.cis_swipe_offset = 15;
		this.cis_move_interval ='';
		this.cis_speed_interval = '';
		this.cis_speed_step_time = 20;
		this.cis_movement_dictance = new Array;
		this.cis_speed_x_start = new Array;
		this.cis_speed_timeout = '';
		this.cis_speed_index = 0;
		this.item_s = 0;
		this.cis_make_touch_effect_bug_fix_enabled = true;
		this.cis_make_drag_enabled = false;
		this.cis_hide_overlays_enabled = true;
		this.cis_make_drag_enabled = true;
		this.cis_remove_dragging_class_timeout;
		this.cis_touch_end_position_interval;
		this.cis_end_point_speed_interval = '';
		this.cis_end_point_speed_step_time = 50;
		this.cis_end_point_ml_start = new Array;
		this.cis_end_point_speed_array = new Array;
		this.cis_end_point_speed = 10000;
		this.cis_speed_check_index = 0;
		this.cis_end_point_speed_index = 0;
		this.cis_final_speed_interval = '';
		this.cis_final_speed_step_time = 50;
		this.cis_final_ml_start = new Array;
		this.cis_final_speed_array = new Array;
		this.cis_final_speed = 10000;
		this.cis_speed_check_index = 0;
		this.cis_final_speed_index = 0;
		this.cis_check_speeds_timeout = 0;

		// init function
		this.init = function() {

			//free limits
			this.options.inf_scroll_enabled = 0;
			this.options.cis_touch_enabled = 0;
			this.options.slider_full_size = 0;

			this.lightbox = options.lightbox;

			// calculate loaders width
			this.cis_calculate_loaders_width();

			// make items ordering
			this.cis_make_creative_items_orders();

			// // items images load function
			this.cis_load_images();

			// remove img titles
			this.removeImgTitles();

			// set slider full width
			if(this.options.slider_full_size == 1) {
				this.makeSliderFullWidth();
			}

		};

		this.sliderLoadedInit = function() {

			setTimeout(function() {

				//prepare slider arrows
				this.cis_prepare_arrows();

				// prepare overlay
				this.prepareOverlay();

				// set overlay event listeners
				this.cis_set_overlay_functions();

				// create overlay events
				this.createOverlayEvents();

				// create slider buttons functions
				this.createSliderButtonsFunctions();

				// set scroll events
				this.setScrollEvents();

				// check item correction
				this.sliderCorrectionCheck();

				// check inf scrolling
				this.infScrollingCheck();

				// make autoplay
				this.cis_make_autoplay();

				// prepare touch
				this.prepareTouch();

				//make backlink
				//this.cis_make_backlinks();

			}.bind(this), 1200);
		};

		this.cis_make_creative_items_orders = function() {
			var curr_order = 0;
			this.wrapper.find('.cis_row_item').each(function() {
				$(this).attr("cis_item_order",curr_order);
				curr_order ++;
			});
			this.wrapper.attr("total_items_count", curr_order);
		};

		this.cis_calculate_loaders_width = function () {
			var $wrapper = this.wrapper.find('.cis_images_holder');
			var wrapper_width = $wrapper.parents('.cis_images_row').width();
			var items_height = $wrapper.find('.cis_row_item_loader').height();

			var loader_prepared_width = items_height * 1.5;
			var loader_ratio_sign = Math.random() < 0.5 ? 1 : -1;

			$wrapper.find('.cis_row_item_loader').each(function(index, el) {
				var loader_width_calculated = loader_prepared_width + loader_ratio_sign * this.cis_getRandomArbitary(25,50);
				$(el).width(loader_width_calculated);
				loader_ratio_sign = loader_ratio_sign == 1 ? -1 : 1;
			}.bind(this));
		};

		this.cis_getRandomArbitary = function  (min, max) {
			return Math.random() * (max - min) + min;
		};

		this.loadImage = function($elem) {
			;			// load
			$elem.on('load', function(e) {
				this.processLoadedImg($elem);
			}.bind(this));

			// error
			$elem.error(function(e) {
				// remove error item
				$elem.parents('.cis_row_item').remove();
				// reset items orders
				this.cis_make_creative_items_orders();
				// reset popup inks
				this.lightbox.createPopupPaths();

				this.cis_calculate_width();
			}.bind(this));
		};

		this.processLoadedImg = function($elem) {
			$elem.addClass('cis_loaded');
			$elem.attr('cis_loaded','loaded');

			this.setOverlayStartVal($elem);

			setTimeout(function() {
				this.cis_make_proccess($elem);
			}.bind(this),400);
		};

		this.cis_load_images = function() {
			//create uniq src
			//this.cis_create_uniq_src();

			this.wrapper.find("img.cis_img_item").each(function(i, elem) {
				if(elem.complete) {
					this.processLoadedImg($(elem));
				}
				else {
					this.loadImage($(elem));
				}
			}.bind(this));
		};

		this.setOverlayStartVal = function($elem) {
			var cis_overlay_animation_type = this.options.cis_overlay_animation_type;
			var cis_overlay_type = this.options.cis_overlay_type;
			var cis_popup_event = this.options.cis_popup_event;
			var cis_link_event = this.options.link_open_event;

			// for touch devices reset follow mouse to fade
			if(cis_overlay_animation_type == 3 && cis_is_touch_devise)
				cis_overlay_animation_type = 2;

			// overlay config //////////

			var $cis_overlay = $elem.next('.cis_row_item_overlay');
			$cis_item = $elem.parents('.cis_row_item');

			$cis_overlay.css({'visibility' : 'hidden','display' : 'block'});
			var h = $cis_overlay.height();

			if(cis_overlay_animation_type == 0) { // slide
				if(cis_overlay_type == 0) { // overlay is bottom fixed
					var cis_hidden_margin = -1*h;
					$cis_overlay.css({'visibility' : 'visible','display' : 'block','margin-bottom' : cis_hidden_margin}).attr('h',h);
				}
				else {
					$cis_overlay.css({'visibility' : 'visible','display' : 'block','top' : '100%'}).attr('h',h);
				}
			}
			else if(cis_overlay_animation_type == 1) {// always keep visible
				$cis_overlay.css({'visibility' : 'visible','display' : 'block','opacity' : '0'});
				$cis_overlay.addClass('cis_transition_default');
				setTimeout(function() {
					$cis_overlay.addClass("cis_opacity_visible");
				},1620);
			}
			else if(cis_overlay_animation_type == 2) {// fade
				$cis_overlay.css({'visibility' : 'visible','display' : 'block','opacity' : '0'});
			}
			else if(cis_overlay_animation_type == 4) {// hidden
				$cis_overlay.addClass('cis_display_none').css({'visibility' : 'hidden','display' : 'none'});
			}
			else if(cis_overlay_animation_type == 3) {// follow mouse
				if(cis_overlay_type == 0) { // overlay is bottom fixed
					var cis_hidden_margin = -1*h;
					$cis_overlay.css({'visibility' : 'visible','display' : 'block','margin-bottom' : cis_hidden_margin});
				}
				else {
					$cis_overlay.css({'visibility' : 'visible','display' : 'block','top' : '100%'}).attr('h',h);
				}
			}
		};

		this.cis_create_uniq_src = function() {
			this.wrapper.find("img.cis_img_item").each(function(index, el) {
				var src = $(el).attr("src") + '?v=' + Math.random();
				$(el).attr("src", src);
			}.bind(this));
		};

		this.cis_make_proccess = function($el) {
			var cis_item_appear_effect_type = parseInt(this.options.slider_data_array[2]);
			var cis_popup_event = this.options.cis_popup_event;
			var cis_link_event = this.options.link_open_event;

			var $cis_row_item = $el.parents('.cis_row_item');
			var $cis_wrapper = $cis_row_item.parents(".cis_main_wrapper");
			var item_width = $el.width();

			$cis_row_item.find('.cis_row_item_loader').animate({
				width: item_width
			},400,'swing',function() {
				var $loader = $el.parents('.cis_row_item').find('.cis_row_item_loader');
				var $item_inner = $el.parents('.cis_row_item_inner');

				// // render overlay items
				// this.cis_render_overlay_items($cis_row_item, cis_popup_event, cis_link_event);
				// if(cis_popup_event == 0 || cis_link_event == 0) {
				// 	this.cis_make_item_icons($cis_row_item, cis_popup_event, cis_link_event, false);
				// }

				this.cis_calculate_width();

				if(cis_item_appear_effect_type == 0) {
					$loader.fadeOut(200,function() {
						$item_inner.hide().removeClass('cis_row_hidden_element').fadeIn(200);
					});
				}
				else if (cis_item_appear_effect_type == 1) {
					var st = $loader.attr("style");
					$cis_row_item.attr("style",st);
					$item_inner.removeClass('cis_row_hidden_element');
					// $item_inner.find('img').addClass('cis_transition_none');
					$item_inner.find('.cis_row_item_overlay').addClass('cis_visibility_hidden');

					$item_inner
						.addClass("cis_flipcard_no_transition")
						.addClass("cis_flipcard_side_2")
						.addClass("cis_flipcard_side")
						.removeClass("cis_flipcard_no_transition");
					$loader
						.addClass("cis_flipcard_side_1")
						.addClass("cis_flipcard_side");

					var flip_direction = Math.floor((Math.random() * 10) + 1) > 5 ? 1 : 2;
					var cis_flip_dir_class = $loader.hasClass("cis_row_item_loader_color2") ? 'cis_flip_h_' + flip_direction : 'cis_flip_v_' + flip_direction;
					$cis_row_item.addClass("cis_flipcard").addClass(cis_flip_dir_class);

					this.cis_show_flipped_item($cis_row_item);
				}
			}.bind(this));
		};

		this.cis_show_flipped_item = function($item) {
			setTimeout(function() {
				$item.addClass("cis_fliped");
			},20);

			setTimeout(function() {
				$item
					.addClass('cis_transition_none')
					.removeClass("cis_fliped")
					.removeClass("cis_flipcard")
					.removeClass("cis_flip_h_1")
					.removeClass("cis_flip_h_2")
					.removeClass("cis_flip_v_1")
					.removeClass("cis_flip_v_2")
					.removeClass("cis_transition_none");
				$item.find('.cis_row_item_loader').hide()
					.removeClass("cis_flipcard_side")
					.removeClass("cis_flipcard_side_1")
					.removeClass("cis_flipcard_side_2");
				$item.find('.cis_row_item_inner')
					.addClass('cis_transition_none')
					.removeClass("cis_flipcard_side")
					.removeClass("cis_flipcard_side_1")
					.removeClass("cis_flipcard_side_2")
					.removeClass("cis_transition_none");
				$item.find('.cis_row_item_overlay')
					.removeClass('cis_visibility_hidden');
			},820);
		};

		this.cis_set_overlay_functions = function() {

			// set overlay functions
			var cis_popup_event = parseInt(this.options.cis_popup_event);
			var cis_link_event = parseInt(this.options.link_open_event);

			var event_type = this.options.cis_is_touch_devise ? 'vclick' : 'click';

			$wrapper = this.wrapper;

			var this_copy = this;

			//icons enabled /////////////////////////////////////////////////////////////////////
			if(cis_popup_event == 0 || cis_link_event == 0) {

				if(cis_popup_event == 0) {
					$wrapper.on(event_type, '.cis_zoom_icon', function(e) {
						e.preventDefault();

						//show overlay
						this_copy.lightbox.cis_show_creative_overlay();

						//show popup
						var $loader = $(this).parents('.cis_row_item').find('.cis_row_item_inner');
						this_copy.lightbox.cis_animate_creative_popup($loader);
					});
				}
				if(cis_link_event == 0) {
					$wrapper.on(event_type, '.cis_link_icon', function(e) {
						var cis_click_target = parseInt($(this).parents('.cis_row_item_overlay').data("cis_click_target"));
						var cis_click_url = $(this).parents('.cis_row_item_overlay').data("cis_click_url");

						if(cis_click_target == 1)
							window.open(cis_click_url);
						else
							window.location.href = cis_click_url;
					});
				}
			};

			// open popup on click of overlay + button
			if(cis_popup_event == 1) {
				// set cursos pointer css to overlay
				$wrapper.find('.cis_row_item_overlay').addClass('cis_cursor_zoom');
				// click function
				$wrapper.on(event_type, '.cis_row_item_overlay', function(e) {
					if($(e.target).hasClass('creative_btn')) {
						if(cis_link_event != 2) {
							e.preventDefault();
						}
						return;
					}
					//show overlay
					this.lightbox.cis_show_creative_overlay();

					//show popup
					var $loader = $(e.target).parents('.cis_row_item').find('.cis_row_item_inner');
					this.lightbox.cis_animate_creative_popup($loader);
				}.bind(this));
				if(cis_link_event != 2) {
					$wrapper.on('click','.creative_btn', function(e) {
						e.preventDefault();
					});
				}
			}
			//open popup onclick of button
			if(cis_popup_event == 2) {
				$wrapper.on(event_type,'.creative_btn', function(e) {
					e.preventDefault();

					//show overlay
					this.lightbox.cis_show_creative_overlay();

					//show popup
					var $loader = $(e.target).parents('.cis_row_item').find('.cis_row_item_inner');
					this.lightbox.cis_animate_creative_popup($loader);
				}.bind(this));
			}
			// open link onclick of overlay
			if(cis_link_event == 1) {
				$wrapper.find('.cis_row_item_overlay').addClass('cis_cursor_pointer');
				$wrapper.on(event_type, '.cis_row_item_overlay', function(e) {
					if($(e.target).hasClass('creative_btn')) {
						if(cis_popup_event == 2) {
							e.preventDefault();
						}
						return;
					}
					if($(e.target).hasClass('cis_zoom_icon') || $(e.target).hasClass('cis_link_icon')) {
						return;
					}
					// set cursor pointer css to overlay

					var cis_click_target = parseInt($(e.target).parents('.cis_row_item').find('.cis_row_item_overlay').data("cis_click_target")); // check e.target
					var cis_click_url = $(e.target).parents('.cis_row_item').find('.cis_row_item_overlay').data("cis_click_url");

					if(cis_click_target == 1)
						window.open(cis_click_url);
					else
						window.location.href = cis_click_url;
				}.bind(this));
			}
			if(cis_link_event == 2) {
				// do nothing. the link will be opened through html
			}

		};

		this.prepareOverlay = function() {
			var $wrapper = this.wrapper;
			var cis_popup_event = parseInt(this.options.cis_popup_event);
			var cis_link_event = parseInt(this.options.link_open_event);
			// render overlay elements
			$wrapper.find(".cis_row_item_overlay").each(function(i, el) {
				var $cis_item = $(el).parents(".cis_row_item");

				this.cis_render_overlay_items($cis_item, cis_popup_event, cis_link_event);
				//open popup onclick of button
				if(cis_popup_event == 0 || cis_link_event == 0) {
					this.cis_make_item_icons($cis_item, cis_popup_event, cis_link_event, true);
				};
			}.bind(this));

			// set icons effects
			this.setIconsEffects();
		};

		this.cis_render_overlay_items = function($cis_item, cis_popup_event, link_open_event) {
			var $cis_item_inner = $cis_item.find('.cis_row_item_inner');
			var item_h = parseInt($cis_item_inner.height());

			var item_w = parseInt($cis_item_inner.width());

			var slider_data_array = this.options.slider_data_array;
			var icon_w = parseInt(slider_data_array[5]);

			var icons_position = parseInt(slider_data_array[10]);
			var overlay_items_vertical_offset = parseInt(slider_data_array[11]);
			var overlay_items_middle_offset = parseInt(slider_data_array[12]);
			var caption_visible = parseInt(slider_data_array[13]);
			var cis_overlay_type = parseInt(slider_data_array[3]);

			// render caption and button
			if(cis_overlay_type == 1) {
				// render caption
				if(caption_visible == 1) {
					$cis_item.find('.cis_txt_inner').addClass('cis_h_padding_set'); // add horizontal padding
					var cis_caption_height = parseInt($cis_item.find('.cis_txt_inner').height());
					var total_items_height = cis_caption_height;

					// check if icon(s) visible
					var icon_visible = ((cis_popup_event == 0 || link_open_event == 0) && icons_position == 1) ? 1 : 0;
					if(icon_visible == 1) {
						total_items_height = total_items_height + icon_w*1 + overlay_items_vertical_offset*1;
					}

					// check if button visible
					var button_visible = (cis_popup_event == 2 || link_open_event == 2) ? 1 : 0;
					if(button_visible == 1) {
						var cis_button_height = parseInt($cis_item.find('.cis_btn_wrapper').height());
						total_items_height = total_items_height + cis_button_height*1 + overlay_items_vertical_offset*1;
					}

					//calculate top position
					var top_offset = ((item_h - total_items_height) / 2) + 1*overlay_items_middle_offset;

					if(icon_visible == 1)
						top_offset = top_offset + 1*icon_w + 1*overlay_items_vertical_offset;

					// set css
					$cis_item.find('.cis_row_item_txt_wrapper').css('top',top_offset);

				}
				// render button
				var button_visible = (cis_popup_event == 2 || link_open_event == 2) ? 1 : 0;
				if(button_visible == 1) {
					var cis_button_height = parseInt($cis_item.find('.cis_btn_wrapper').height());
					var total_items_height = cis_button_height;

					// check if icon(s) visible
					var icon_visible = ((cis_popup_event == 0 || link_open_event == 0) && icons_position == 1) ? 1 : 0;
					if(icon_visible == 1) {
						total_items_height = total_items_height + icon_w*1 + overlay_items_vertical_offset*1;
					}

					if(caption_visible == 1) {
						var cis_caption_height = parseInt($cis_item.find('.cis_row_item_txt_wrapper').height());
						total_items_height = total_items_height + cis_caption_height*1 + overlay_items_vertical_offset*1;
					}

					//calculate top position
					var top_offset = ((item_h - total_items_height) / 2) + 1*overlay_items_middle_offset;
					if(icon_visible == 1)
						top_offset = top_offset + 1*icon_w + 1*overlay_items_vertical_offset;
					if(caption_visible == 1)
						top_offset = top_offset + 1*cis_caption_height + 1*overlay_items_vertical_offset;

					// set css
					$cis_item.find('.cis_btn_wrapper').css('top',top_offset);
				}
			}
			// end render caption and button
		};

		this.cis_make_item_icons = function($cis_item, cis_popup_event, link_open_event, add_html) {
			var $cis_item_inner = $cis_item.find('.cis_row_item_inner');
			var item_h = parseInt($cis_item_inner.height());
			var item_w = parseInt($cis_item_inner.width());

			var slider_data_array = this.options.slider_data_array;
			var icon_w = parseInt(slider_data_array[5]);
			var icons_margin = parseInt(slider_data_array[6]);
			var right_offset = parseInt(slider_data_array[7]);
			var top_offset = right_offset;
			var icons_position = parseInt(slider_data_array[10]) == 0 ? 'top' : 'center';
			var icon_color = parseInt(slider_data_array[9]) == 0 ? 'black' : 'white';
			var icon_animation = parseInt(slider_data_array[8]);

			var overlay_items_vertical_offset = parseInt(slider_data_array[11]);
			var overlay_items_middle_offset = parseInt(slider_data_array[12]);
			var caption_visible = parseInt(slider_data_array[13]);
			var cis_overlay_type = parseInt(slider_data_array[3]);

			if(cis_popup_event == 0) {
				var top_position = (item_h - icon_w) / 2;

				if(icons_position == 'center') {

					var total_items_height = icon_w;
					if(cis_overlay_type == 1) {

						if(caption_visible == 1) {
							var cis_caption_height = parseInt($cis_item.find('.cis_row_item_txt_wrapper').height());
							total_items_height = total_items_height + cis_caption_height*1 + overlay_items_vertical_offset*1;
						}

						var button_visible = (cis_popup_event == 2 || link_open_event == 2) ? 1 : 0;
						if(button_visible == 1) {
							var cis_button_height = parseInt($cis_item.find('.cis_btn_wrapper').height());
							total_items_height = total_items_height + cis_button_height*1 + overlay_items_vertical_offset*1;
						}
					}

					var right_position = link_open_event == 0 ? (item_w + 1 * icons_margin) / 2 : (item_w - icon_w) / 2;
					var top_position = (item_h - total_items_height) / 2 + 1*overlay_items_middle_offset;

				}
				else {
					var right_position = link_open_event == 0 ?  icon_w + icons_margin + right_offset : right_offset;
					var top_position = top_offset;
				}

				if(add_html) {
					// check if icon has animation
					if(icon_animation != 4)
						var zoom_icon_html = '<div class="cis_zoom_icon cis_zoom_icon_hidden cis_icon_effect_'+ icon_animation + ' cis_icon_' + icon_color + '" title="Zoom"><div class="cis_zoom_icon_inner "></div></div>';
					else
						var zoom_icon_html = '<div class="cis_zoom_icon cis_icon_' + icon_color + '" title="Zoom"><div class="cis_zoom_icon_inner "></div></div>';

					if(cis_overlay_type == 0)
						$cis_item_inner.append(zoom_icon_html);
					else
						$cis_item_inner.find('.cis_row_item_overlay ').append(zoom_icon_html);
				}

				var $cis_zoom_icon = $cis_item_inner.find('.cis_zoom_icon');
				$cis_zoom_icon.css({
					'width' : icon_w,
					'height' : icon_w,
					'top' : top_position,
					'right' : right_position
				});

			}
			if(link_open_event == 0) {
				var top_position = (item_h - icon_w) / 2;

				if(icons_position == 'center') {
					var total_items_height = icon_w;
					if(cis_overlay_type == 1) {

						if(caption_visible == 1) {
							var cis_caption_height = parseInt($cis_item.find('.cis_row_item_txt_wrapper').height());
							total_items_height = total_items_height + cis_caption_height*1 + overlay_items_vertical_offset*1;
						}

						var button_visible = (cis_popup_event == 2 || link_open_event == 2) ? 1 : 0;
						if(button_visible == 1) {
							var cis_button_height = parseInt($cis_item.find('.cis_btn_wrapper').height());
							total_items_height = total_items_height + cis_button_height*1 + overlay_items_vertical_offset*1;
						}
					}

					var right_position = cis_popup_event == 0 ? (item_w - 2 * icon_w  - icons_margin) / 2 : (item_w - icon_w) / 2;
					var top_position = (item_h - total_items_height) / 2 + 1*overlay_items_middle_offset;
				}
				else {
					var right_position = cis_popup_event == 0 ? right_offset : right_offset;
					var top_position = top_offset;
				}

				if(add_html) {
					if(icon_animation != 4)
						var link_icon_html = '<div class="cis_link_icon cis_link_icon_hidden cis_icon_effect_'+ icon_animation + ' cis_icon_' + icon_color + '" title="Open Link"></div>';
					else
						var link_icon_html = '<div class="cis_link_icon cis_icon_' + icon_color + '" title="Open Link"></div>';

					if(cis_overlay_type == 0)
						$cis_item_inner.append(link_icon_html);
					else
						$cis_item_inner.find('.cis_row_item_overlay').append(link_icon_html);
				}

				var $cis_link_icon = $cis_item_inner.find('.cis_link_icon');
				$cis_link_icon.css({
					'width' : icon_w,
					'height' : icon_w,
					'top' : top_position,
					'right' : right_position
				});
			};
		};

		this.setIconsEffects = function() {
			// zoom icon
			this.wrapper.on('mouseenter', '.cis_zoom_icon', function() {
				$(this).addClass('cis_zoom_icon_active');
			});
			this.wrapper.on('mouseleave', '.cis_zoom_icon', function() {
				$(this).removeClass('cis_zoom_icon_active');
			});

			// link icon
			this.wrapper.on('mouseenter', '.cis_link_icon', function() {
				$(this).addClass('cis_link_icon_active');
			});
			this.wrapper.on('mouseleave', '.cis_link_icon', function() {
				$(this).removeClass('cis_link_icon_active');
			});
		};

		this.cis_show_item_icons = function($cis_row_item) {
			var cis_item_id = $cis_row_item.data("item_id");
			$wrapper = this.wrapper;

			var cis_popup_event = parseInt($wrapper.data("cis_popup_event"));
			var cis_link_event = parseInt($wrapper.data("link_open_event"));

			setTimeout(function() {
				if(cis_popup_event == 0) {
					$wrapper.find('.cis_zoom_icon').addClass('cis_zoom_icon_hidden');
					$wrapper.find('.cis_item_' + cis_item_id).find('.cis_zoom_icon').removeClass('cis_zoom_icon_hidden');
				}
				if(cis_link_event == 0) {
					$wrapper.find('.cis_link_icon').addClass('cis_link_icon_hidden');
					$wrapper.find('.cis_item_' + cis_item_id).find('.cis_link_icon').removeClass('cis_link_icon_hidden');
				}
			},1);
		};

		this.cis_prepare_arrows = function() {
			var $wrapper = this.wrapper;
			var $left_arrow = $wrapper.find('.cis_button_left');
			var $right_arrow = $wrapper.find('.cis_button_right');

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
					this.cis_show_arrows();
				}.bind(this), function() {
					this.cis_hide_arrows();
				}.bind(this));
			}
			else {
				cis_show_arrows();
			}
		};

		this.cis_show_arrows = function() {
			$wrapper = this.wrapper;
			//get arrows data
			var arr_data = $wrapper.find('.cis_arrow_data').html();
			var arr_data_array = arr_data.split(',');
			var show_arrows = arr_data_array[4];

			if(show_arrows == 0)
				return;

			//clear timeouts
			clearTimeout(this.cis_arrows_timeout1);
			clearTimeout(this.cis_arrows_timeout2);

			var $left_arrow = $wrapper.find('.cis_button_left');
			var $right_arrow = $wrapper.find('.cis_button_right');

			var corner_offset = $left_arrow.attr("corner_offset");

			var animation_time = 400;
			var start_offset = -64;
			var effect = 'easeOutBack';

			this.cis_arrows_timeout1 = setTimeout(function() {
				$left_arrow.stop(true,false).animate({
					'left': corner_offset
				},animation_time,effect);

				$right_arrow.stop(true,false).animate({
					'right': corner_offset
				},animation_time,effect);
			},100);

		};

		this.cis_hide_arrows = function() {
			$wrapper = this.wrapper;

			//clear timeouts
			clearTimeout(this.cis_arrows_timeout1);
			clearTimeout(this.cis_arrows_timeout2);

			var $left_arrow = $wrapper.find('.cis_button_left');
			var $right_arrow = $wrapper.find('.cis_button_right');

			var animation_time = 300;
			var start_offset = -64;
			var effect = 'easeInBack';

			this.cis_arrows_timeout2 = setTimeout(function() {
				$left_arrow.stop(true,false).animate({
					'left': start_offset
				},animation_time,effect);

				$right_arrow.stop(true,false).animate({
					'right': start_offset
				},animation_time,effect);
			},200)
		};

		this.createOverlayEvents = function() {
			var $this = this.wrapper;

			var cis_touch_enabled = this.options.cis_touch_enabled;
			cis_touch_enabled = isNaN(cis_touch_enabled) ? 0 : cis_touch_enabled;

			var cis_is_touch_devise = this.options.cis_is_touch_devise;

			// if touch enabled, disable itme s selection
			if(cis_touch_enabled != 0) {
				this.cis_disable_selection_on_wrapper();
			}

			var cis_effect_event_type_1 = cis_is_touch_devise ? 'vclick' : 'mouseenter';
			var cis_effect_event_type_2 = cis_is_touch_devise ? 'mouseleave' : 'mouseleave';

			var cis_overlay_animation_type = parseInt(this.options.cis_overlay_animation_type);
			var cis_overlay_type = parseInt(this.options.cis_overlay_type);

			// for touch devices reset follow mouse to fade
			if(cis_overlay_animation_type == 3 && cis_is_touch_devise)
				cis_overlay_animation_type = 2;

			//get slider data
			var slider_data = $this.find('.cis_options_data').html();
			var slider_data_array = slider_data.split(',');
			var cis_image_effect_index = parseInt(slider_data_array[1]);
			var icon_animation = parseInt(slider_data_array[8]);

			// item icons functions ////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if(icon_animation != 4) { // 4 is no icon animation
				$this.on(cis_effect_event_type_1, '.cis_row_item', function(e) {
					if(this.cisMoveInProcess())
						return;
					this.cis_show_icons_enabled = true;

					this.cis_show_item_icons($(e.target).parents('.cis_row_item'));
				}.bind(this));
			}

			// wrapper mouseleave
			$this.on('mouseleave', function(e) {
				this.cis_hide_overlays(true);
			}.bind(this));

			// overlay animations functions //////////////////////////////////////////////////////////////////////////////
			if(cis_overlay_animation_type == 0 || cis_overlay_animation_type == 2 || cis_overlay_animation_type == 3) {
				// slide - 0, fade - 2, follow mouse-3,
				// get event type
				var cis_effect_event_type = cis_is_touch_devise ? 'vclick' : 'mouseenter';

				// add animation rule
				var cis_transition_class = 'cis_transition_default';
				$this.find(".cis_row_item_overlay").addClass(cis_transition_class);

				// get animation last point class
				if(cis_overlay_animation_type == 0) {
					var cis_anim_class = cis_overlay_type == 0 ? 'cis_margin_bottom_reseted' : 'cis_top_reseted';
				}
				else if(cis_overlay_animation_type == 2) { // fade
					var cis_anim_class = 'cis_opacity_visible';
				}
				else if(cis_overlay_animation_type == 3) { // follow mouse
					if(cis_overlay_type == 0) {
						var cis_anim_class = 'cis_margin_bottom_reseted';
					}
				}

				// show overlay event
				$this.on(cis_effect_event_type, '.cis_row_item', function(e) {
					// return if scrolling or grabbing
					if(this.cisMoveInProcess())
						return;

					var cis_item_id = $(e.target).parents('.cis_row_item').data("item_id");
					$wrapper = $this;

					if(cis_overlay_animation_type == 3 && cis_overlay_type == 1) { // follow mouse algorithm

						var cis_pageX =  parseInt(e.pageX);
						var cis_pageY =  parseInt(e.pageY);
						var element_pageX = parseInt($(e.target).parents('.cis_row_item').offset().left);
						var element_pageY = parseInt($(e.target).parents('.cis_row_item').offset().top);
						var element_w = parseInt($(e.target).parents('.cis_row_item').width());
						var element_h = parseInt($(e.target).parents('.cis_row_item').height());

						var deltaX = Math.abs(element_pageX - cis_pageX);
						var deltaX_1 = element_w - deltaX;
						var deltaY = Math.abs(element_pageY - cis_pageY);
						var deltaY_1 = element_h - deltaY;

						var x_sign = 1;
						var x_val = deltaX_1;
						if(deltaX < deltaX_1) {
							x_sign = 3;
							x_val = deltaX;
						}

						var y_sign = 0;
						var y_val = deltaY;
						if(deltaY_1 < deltaY) {
							y_sign = 2;
							y_val = deltaY_1;
						}
						if(x_val < y_val)
							var cis_mouse_dir = x_sign;
						else
							var cis_mouse_dir = y_sign;

						// not using $(this), but class, to apply on infinite items as well.
						var $cis_overlay = $wrapper.find('.cis_item_' + cis_item_id).find('.cis_row_item_overlay');

						// remove transition
						$cis_overlay.removeClass(cis_transition_class);

						// remove old position
						$cis_overlay
							.removeClass('cis_follow_mouse_0')
							.removeClass('cis_follow_mouse_1')
							.removeClass('cis_follow_mouse_2')
							.removeClass('cis_follow_mouse_3')
							.removeClass('cis_follow_mouse_reset');

						// set initial position
						var f_mouse_dir_class = 'cis_follow_mouse_' + cis_mouse_dir;
						$cis_overlay.addClass(f_mouse_dir_class);

						// add transition
						setTimeout(function() {
							$cis_overlay.addClass(cis_transition_class);
							$cis_overlay.removeClass(f_mouse_dir_class).addClass('cis_follow_mouse_reset');
						},25);
					}
					else {
						$this.find('.cis_row_item_overlay').removeClass(cis_anim_class);
						// $(this).find('.cis_row_item_overlay').addClass(cis_anim_class);
						$wrapper.find('.cis_item_' + cis_item_id).find('.cis_row_item_overlay').addClass(cis_anim_class);
					}
				}.bind(this));

				//  mouseleave for follow mouse animation
				if(cis_overlay_animation_type == 3 && cis_overlay_type == 1) {

					$this.on('mouseleave', '.cis_row_item', function(e) {
						// return if scrolling or grabbing
						if(this.cisMoveInProcess())
							return;

						var cis_item_id = $(e.target).parents('.cis_row_item').data("item_id");
						$wrapper = $this;

						var cis_pageX =  parseInt(e.pageX);
						var cis_pageY =  parseInt(e.pageY);
						var element_pageX = parseInt($(e.target).parents('.cis_row_item').offset().left);
						var element_pageY = parseInt($(e.target).parents('.cis_row_item').offset().top);
						var element_w = parseInt($(e.target).parents('.cis_row_item').width());
						var element_h = parseInt($(e.target).parents('.cis_row_item').height());

						var deltaX = Math.abs(element_pageX - cis_pageX);
						var deltaX_1 = element_w - deltaX;
						var deltaY = Math.abs(element_pageY - cis_pageY);
						var deltaY_1 = element_h - deltaY;

						var x_sign = 1;
						var x_val = deltaX_1;
						if(deltaX < deltaX_1) {
							x_sign = 3;
							x_val = deltaX;
						}

						var y_sign = 0;
						var y_val = deltaY;
						if(deltaY_1 < deltaY) {
							y_sign = 2;
							y_val = deltaY_1;
						}
						if(x_val < y_val)
							var cis_mouse_dir = x_sign;
						else
							var cis_mouse_dir = y_sign;

						// var $cis_overlay = $(this).find('.cis_row_item_overlay');
						var $cis_overlay = $wrapper.find('.cis_item_' + cis_item_id).find('.cis_row_item_overlay');

						// remove transition
						$cis_overlay.removeClass(cis_transition_class);

						// set initial position
						var f_mouse_dir_class = 'cis_follow_mouse_' + cis_mouse_dir;

						// add transition
						setTimeout(function() {
							$cis_overlay.addClass(cis_transition_class);
							$cis_overlay.removeClass('cis_follow_mouse_reset').addClass(f_mouse_dir_class);
						},25);
					}.bind(this));
				}
			}

			// image hover effects /////////////////////////////////////////////////////////////////////////////////////////
			var cis_effect_type_classname = 'cis_effect_none';
			if(cis_image_effect_index == 1)
				cis_effect_type_classname = 'cis_effect_zoom';
			else if(cis_image_effect_index == 2)
				cis_effect_type_classname = 'cis_effect_rotate';

			// item hover effects events
			if(cis_effect_type_classname != 'cis_effect_none') {
				$this.find(".cis_row_item img").addClass("cis_transition_default");

				// $(this).addClass('cis_transition_default');
				$this.on(cis_effect_event_type_1, '.cis_row_item', function(e) {
					var cis_item_id = $(e.target).parents('.cis_row_item').data("item_id");
					$wrapper = $this;

					if(this.cisMoveInProcess())
						return;

					$(e.target).parents('.cis_row_item').find('img').addClass(cis_effect_type_classname);
					// $wrapper.find('.cis_item_' + cis_item_id).find('img').addClass(cis_effect_type_classname);
				}.bind(this));
				$this.on(cis_effect_event_type_2, '.cis_row_item', function(e) {
					var cis_item_id = $(e.target).parents('.cis_row_item').data("item_id");
					$wrapper = $this;

					if(this.cisMoveInProcess())
						return;

					$wrapper.find('.cis_item_' + cis_item_id).find('img').removeClass(cis_effect_type_classname);
				}.bind(this));
			}

		};

		this.cisMoveInProcess = function() {
			if(this.wrapper.find('.cis_images_row').hasClass("cis_dragging") || this.wrapper.find('.cis_images_holder').hasClass("cis_scrolling"))
				return true;
			return false;
		};

		this.cis_hide_overlays = function(fired_event) {
			fired_event = fired_event || false;
			$wrapper = this.wrapper;
			var $this = $wrapper;
			var cis_overlay_animation_type = parseInt(options.cis_overlay_animation_type);
			var cis_overlay_type = parseInt(options.cis_overlay_type);
			var cis_is_touch_devise = options.cis_is_touch_devise;

			//get slider data
			var slider_data_array = options.slider_data_array;
			var icon_animation = parseInt(slider_data_array[8]);

			// for touch devices reset follow mouse to fade
			if(cis_overlay_animation_type == 3 && cis_is_touch_devise)
				cis_overlay_animation_type = 2;

			// hide icons
			if(icon_animation != 4) {
				this.cis_show_icons_enabled = true;
				$this.find('.cis_zoom_icon').addClass('cis_zoom_icon_hidden');
				$this.find('.cis_link_icon').addClass('cis_link_icon_hidden');
			}

			// reset overlays
			if(cis_overlay_animation_type == 0 || cis_overlay_animation_type == 2 || cis_overlay_animation_type == 3) {
				// slide - 0, fade - 2, folow mouse - 3
				if(cis_overlay_animation_type == 0) {
					var cis_anim_class = cis_overlay_type == 0 ? 'cis_margin_bottom_reseted' : 'cis_top_reseted';
				}
				else if(cis_overlay_animation_type == 2) { // fade
					var cis_anim_class = 'cis_opacity_visible';
				}
				else if(cis_overlay_animation_type == 3) { // follow mouse
					if(cis_overlay_type == 0) {
						var cis_anim_class = 'cis_margin_bottom_reseted';
					}
					else {
						if(!fired_event)
							$this.find(".cis_row_item_overlay").addClass('cis_follow_mouse_2').removeClass('cis_follow_mouse_reset');
					}
				}

				$this.find(".cis_row_item_overlay").removeClass(cis_anim_class);
			}

			// remove image hover effect
			$wrapper.find('.cis_row_item img').removeClass('cis_effect_zoom').removeClass('cis_effect_rotate');

		};

		this.removeImgTitles = function()  {
			this.wrapper.find('.cis_img_item').attr("title","");
		};

		this.cis_disable_selection_on_wrapper = function() {
			$wrapper = this.wrapper;
			this.cis_disable_selection($wrapper);
			this.cis_disable_selection($wrapper.find('div'));
			this.cis_disable_selection($wrapper.find('img'));

			this.cis_disable_drag();
		};

		this.cis_disable_selection = function($elem) {
			$elem.attr('unselectable', 'on')
				.css('user-select', 'none')
				.on('selectstart', false);
		};

		this.cis_disable_drag = function() {
			$wrapper = this.wrapper;
			//Items drag effect
			$wrapper.find('.cis_images_row').on('dragstart', 'img', function(event) { event.preventDefault(); });
			$wrapper.find('.cis_images_holder').on('dragstart', 'cis_row_item_overlay', function(event) { event.preventDefault(); });
		};

// make slider full width /////////////////////////////////////////////////////////////////////////

		this.makeSliderFullWidth = function() {
			var $wrapper = this.wrapper;
			var $wrapper_canvas = $wrapper.parent('div.cis_main_wrapper_canvas');
			var left_pos = $wrapper.offset().left;
			var wrapper_height = $wrapper.height();
			var wraper_pad_top =parseInt($wrapper.css("padding-top"));
			var wraper_pad_bottom =parseInt($wrapper.css("padding-bottom"));
			var wrapper_margin =$wrapper.css("margin");
			var wrapper_total_height = wrapper_height + 1*wraper_pad_top + 1*wraper_pad_bottom;
			var window_w = parseInt($(window).width());
			var body_w = parseInt($("body").width());

			window_w = body_w > window_w ? body_w : window_w;

			$wrapper_canvas.css({
				height: wrapper_total_height,
				margin: wrapper_margin,
				position: 'relative',
				width: '100%'
			});
			$wrapper.addClass('cis_slider_full_w').css({
				margin: 0,
				position: 'absolute',
				'z-index': '1000',
				width: window_w,
				top: 0,
				left: -1*left_pos
			});

			this.makeSliderFullWidthResizeHandler();
		};

		this.makeSliderFullWidthResizeHandler = function() {
			$(window).resize(function() {
				this.makeSliderFullWidthResize();
			}.bind(this));
		};

		this.makeSliderFullWidthResize = function() {
			var $wrapper = this.wrapper;
			if(!$wrapper.hasClass('cis_slider_full_w'))
				return;

			$wrapper.css({
				position: 'relaitive',
				left: 'auto'
			});

			var left_pos = $wrapper.offset().left;
			var window_w = parseInt($(window).width());
			var body_w = parseInt($("body").width());

			window_w = body_w > window_w ? body_w : window_w;

			$wrapper.css({
				width: window_w,
				left: -1*left_pos
			});
		};

// slider buttons functions ///////////////////////////////////////////////////////////////////////

		this.createSliderButtonsFunctions = function() {
			var $wrapper = this.wrapper;
			var $cis_wrapper = $wrapper.find('.cis_images_holder');

			var screen_w = parseFloat($cis_wrapper.parent('div').width());
			var total_w = parseFloat($cis_wrapper.width());

			$wrapper.find('.cis_button_left').click(function() {
				if(total_w < screen_w)
					this.cis_move_images_holder_left();
				else
					this.cis_move_images_holder_right();
			}.bind(this));
			$wrapper.find('.cis_button_right').click(function() {
				if(total_w < screen_w)
					this.cis_move_images_holder_right();
				else
					this.cis_move_images_holder_left();
			}.bind(this));

			$wrapper.find('.cis_button_left').hover(function() {
				$(this).stop(true,false).animate({
					'opacity' : 1
				},300);
			},function() {
				var opacity_inactive = $(this).attr("op");
				$(this).stop(true,false).animate({
					'opacity' : opacity_inactive
				},300);
			});
			$wrapper.find('.cis_button_right').hover(function() {
				$(this).stop(true,false).animate({
					'opacity' : 1
				},300);
			},function() {
				var opacity_inactive = $(this).attr("op");
				$(this).stop(true,false).animate({
					'opacity' : opacity_inactive
				},300);
			});
		};

		this.cis_calculate_width = function() {

			var slider_id = this.options.id;
			if(this.slider_loaded)
				return;
			var $wrapper = this.wrapper;
			var $cis_images_holder = $wrapper.find('.cis_images_holder');
			var total_items_count = $wrapper.attr("total_items_count");

			var loaded_items_count = $wrapper.find('.cis_img_item.cis_loaded').length;

			// if all items have been loaded, calculate total width
			if(loaded_items_count == total_items_count) {
				this.slider_loaded = true;

				var total_w = 0;
				$wrapper.find('.cis_row_item').each(function() {
					$(this).find('img').css('width','auto');
					var w = parseInt($(this).find('img').width());
					// $(this).find('img').width(w);
					var m_r = isNaN(parseFloat($(this).css('margin-right'))) ? 0 : parseFloat($(this).css('margin-right'));
					var m_l = isNaN(parseFloat($(this).css('margin-left'))) ? 0 : parseFloat($(this).css('margin-left'));
					total_w += w + m_r*1 + m_l*1;
				});
				total_w = total_w + 1*1;
				var half_width = parseInt(total_w / 2);
				$cis_images_holder.width(total_w);
				$cis_images_holder.attr("half_width",half_width);

				// call slider loaded init
				this.sliderLoadedInit();
			}
		};

		this.cis_move_images_holder_left = function() { //wrapper is cis_images_holder
			var $wrapper = this.wrapper;
			var $images_row = $wrapper.find('.cis_images_row');
			var $images_holder = $wrapper.find('.cis_images_holder');
			var cis_inf_scrolling = this.options.inf_scroll_enabled;
			cis_inf_scrolling = isNaN(cis_inf_scrolling) ? 0 : cis_inf_scrolling;
			var cis_animation_type = this.options.cis_animation_type;

			var is_slider_dragging = $images_row.hasClass('cis_dragging') ? true : false;
			var cis_effect_type = cis_animation_type == 'css3' ? (is_slider_dragging ? 'cubic-bezier(0.250, 0.460, 0.450, 0.940)' : 'cubic-bezier(0.250, 0.100, 0.250, 1.000)') :  'swing';

			$wrapper.attr("cis_move_direction","0");

			//get slider data
			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var delta_offset = 0;
			var items_to_move_count = parseInt(slider_data_array[0]);
			var move_speed_time = 600;
			var ease_effect = parseInt(slider_data_array[2]);

			var screen_w = parseInt($images_holder.parent('div').width());
			var total_w = parseInt($images_holder.width());
			var curr_left = cis_animation_type == 'css3' ? this.cis_getTransform($images_holder,'translate_x') : parseInt($images_holder.css('margin-left'));

			//  MOVE BY STEPS ******************************************************************
			// If Movement Type set to Images Count, re-calculate it.
			if(total_w >= screen_w) {

				// var items_to_move_count = 1;
				var first_item_order;
				var total_items_width = 0;
				$images_holder.find('.cis_row_item').each(function(i) {
					var w = parseInt($(this).width());
					var m_r = parseInt($(this).css('margin-right'));

					if(total_items_width >= Math.abs(curr_left)) {
						first_item_order = i;
						return false;
					}
					total_items_width = total_items_width + 1*w + 1*m_r;
				});

				var offset_size = total_items_width - Math.abs(curr_left);
				items_to_move_count = offset_size > 100 ? items_to_move_count - 1*1 : items_to_move_count; // if we have offset, count  it as one item

				var total_move_size = offset_size;
				var items_max_order = first_item_order + 1*items_to_move_count;

				$images_holder.find('.cis_row_item').each(function(i, el) {
					if(i < first_item_order) {
						return true;
					}
					var w = parseInt($(el).width());
					var m_r = parseInt($(el).css('margin-right'));
					if(
						(
							(i < items_max_order && !is_slider_dragging) ||
							(total_move_size < this.cis_drag_speed && is_slider_dragging)
						)
						&&
						(total_move_size + 1*w + 1*m_r <= screen_w)
					)
					{
						total_move_size = total_move_size + 1*w + 1*m_r;
					}
					else {
						if(w > screen_w) {
							total_move_size = total_move_size + (1*w - screen_w);
						}
						return false;
					}
				}.bind(this));

				delta_offset = total_move_size;

				move_speed_time = total_move_size;
				if(move_speed_time > 1000)
					move_speed_time = 1000;
				if(move_speed_time < 600)
					move_speed_time = 600;

				// END  MOVE BY STEPS ******************************************************************
			}

			curr_left -= delta_offset;

			// clear timeout
			clearTimeout(this.cis_css3_back_timeout);
			clearTimeout(this.cis_clear_timeout);
			$images_holder.addClass('cis_scrolling');

			this.cis_clear_timeout = setTimeout(function() {
				$images_holder.removeClass('cis_scrolling');

				if(is_slider_dragging)
					$images_row.removeClass('cis_dragging');
			},move_speed_time);

			//check if end
			if(Math.abs(curr_left) + 1 * screen_w >= total_w) {

				// check if infinite scrolling enabled
				if(cis_inf_scrolling == 1 && total_w >= screen_w) {
					if(total_w != 999999 && $images_holder.attr("inf_enabled") == 1) {
						this.cis_make_infinite_scrolling_move_right();
						this.cis_move_images_holder_left();
					}
				}
				else {
					var desired_left = screen_w - total_w;
					var desired_left_1 = (total_w < screen_w) ? desired_left + ease_effect * 1 : desired_left - ease_effect * 1;

					if(total_w < screen_w && !this.cis_switch_move_direction) {
						this.cis_switch_move_direction = true;
						this.cis_move_images_holder_right();
						this.cis_switch_move_direction = false;
						return;
					}

					//calculate last point speed
					var curr_left_final = cis_animation_type == 'css3' ? this.cis_getTransform($images_holder,'translate_x') : parseInt($images_holder.css('margin-left'));
					var move_speed_time_final = Math.abs(curr_left_final - desired_left_1);

					if(move_speed_time_final > 1000)
						move_speed_time_final = 1000;
					if(move_speed_time_final < 150)
						move_speed_time_final = 150;

					if(cis_animation_type == 'css3') {
						this.cis_clear_quee($images_holder);

						move_speed_time_final_css3 = move_speed_time_final + 'ms';

						this.cis_make_css3_movement($images_holder, move_speed_time_final_css3, cis_effect_type, desired_left_1);

						this.cis_css3_back_timeout = setTimeout(function() {
							this.cis_clear_quee($images_holder);
							// var effect = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'; //easeOutBack
							var cis_effect_type = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'; //easeOutBack like effect
							this.cis_make_css3_movement($images_holder, '600ms', cis_effect_type, desired_left);
						}.bind(this),move_speed_time_final);
					} else {
						$images_holder.stop(true,false).animate({
							'margin-left': desired_left_1
						},move_speed_time_final,cis_effect_type,function() {
							$(this).stop().animate({
								'margin-left': desired_left
							},600,'easeOutBack');
						});
					}

					return 'end';
				}

			}
			else {
				if(cis_animation_type == 'css3') {
					this.cis_clear_quee($images_holder);

					move_speed_time = move_speed_time + 'ms';

					this.cis_make_css3_movement($images_holder, move_speed_time, cis_effect_type, curr_left);
				} else {
					$images_holder.stop(true,false).animate({
						'margin-left': curr_left
					},move_speed_time,cis_effect_type);
				}
			}

			// hide overlays
			$images_holder.find('.cis_row_item').addClass('reset_enabled');
			this.cis_hide_overlays();
			$wrapper.find('.cis_row_item').removeClass('cis_item_mouseentered');
			// end hide overlays
		};

		this.cis_move_images_holder_right = function() {  //wrapper is cis_images_holder
			var $wrapper = this.wrapper;
			var $images_row = $wrapper.find('.cis_images_row');
			var $images_holder = $wrapper.find('.cis_images_holder');
			var cis_inf_scrolling = this.options.inf_scroll_enabled;
			cis_inf_scrolling = isNaN(cis_inf_scrolling) ? 0 : cis_inf_scrolling;
			var cis_animation_type = this.options.cis_animation_type;

			$wrapper.attr("cis_move_direction","1");
			var is_slider_dragging = $images_row.hasClass('cis_dragging') ? true : false;

			var cis_effect_type = cis_animation_type == 'css3' ? (is_slider_dragging ? 'cubic-bezier(0.250, 0.460, 0.450, 0.940)' : 'cubic-bezier(0.250, 0.100, 0.250, 1.000)') :  'swing';

			//get slider data
			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var delta_offset = 0;
			var items_to_move_count = parseInt(slider_data_array[0]);

			var move_speed_time = 600;
			var ease_effect = parseInt(slider_data_array[2]);

			var screen_w = parseInt($images_holder.parent('div').width());
			var total_w = parseInt($images_holder.width());
			var curr_left = cis_animation_type == 'css3' ? this.cis_getTransform($images_holder,'translate_x') : parseInt($images_holder.css('margin-left'));

			//  MOVE BY STEPS ******************************************************************
			// If Movement Type set to Images Count, re-calculate it.
			if(total_w >= screen_w) {
				// var items_to_move_count = 10;
				var first_item_order;
				var last_item_w;
				var total_items_width = 0;
				$images_holder.find('.cis_row_item').each(function(i) {
					var w = parseInt($(this).width());
					var m_r = parseInt($(this).css('margin-right'));

					total_items_width = total_items_width + 1*w + 1*m_r;

					if(total_items_width > Math.abs(curr_left)) {
						first_item_order = i;
						last_item_w = w + 1*m_r;
						return false;
					}
				});
				var offset_size = total_items_width - Math.abs(curr_left);
				offset_size = offset_size != 0 ? last_item_w - offset_size : offset_size;

				// if we have offset, count  it as one item
				items_to_move_count = offset_size > 100 ? items_to_move_count - 1*1 : items_to_move_count;

				var total_move_size = offset_size;

				var items_min_order = first_item_order - 1*items_to_move_count;
				items_min_order = items_min_order < 0 ? 0 : items_min_order;
				var m_r;
				var items_sizes_array = new Array();
				items_sizes_array.length = 0;

				$images_holder.find('.cis_row_item').each(function(i) {
					if(i < items_min_order)
						return true;
					if(i >= first_item_order)
						return false;

					var w = parseInt($(this).width());
					m_r = parseInt($(this).css('margin-right'));
					items_sizes_array.push(w);
				});
				items_sizes_array.reverse();

				for (var tt = 0; tt < items_sizes_array.length; tt ++) {
					// var
					if(total_move_size <= screen_w && (!is_slider_dragging || (is_slider_dragging && total_move_size < this.cis_drag_speed))) {
						var w = items_sizes_array[tt];
						total_move_size = total_move_size + 1*w + 1*m_r;
					}
				}

				delta_offset = total_move_size;

				move_speed_time = total_move_size;
				if(move_speed_time > 1000)
					move_speed_time = 1000;
				if(move_speed_time < 600)
					move_speed_time = 600;
				// END  MOVE BY STEPS ******************************************************************
			}

			curr_left = parseInt(curr_left + 1*delta_offset);

			// clear timeout
			clearTimeout(this.cis_css3_back_timeout);
			clearTimeout(this.cis_clear_timeout);
			$images_holder.addClass('cis_scrolling');

			this.cis_clear_timeout = setTimeout(function() {
				$images_holder.removeClass('cis_scrolling');

				if(is_slider_dragging)
					$images_row.removeClass('cis_dragging');
			},move_speed_time);

			//check if start
			if(curr_left >= 0) {
				// check if infinite scrolling enabled
				if(cis_inf_scrolling == 1 && total_w >= screen_w) {
					if(total_w != 999999 && $images_holder.attr("inf_enabled") == 1) {
						this.cis_make_infinite_scrolling_move_left();
						this.cis_move_images_holder_right();
					}
				}
				else {
					var desired_left = 0;
					var desired_left_1 = (total_w < screen_w) ? desired_left - ease_effect * 1 : desired_left + ease_effect * 1;

					if(total_w < screen_w && !this.cis_switch_move_direction) {
						this.cis_switch_move_direction = true;
						var r = this.cis_move_images_holder_left();
						this.cis_switch_move_direction = false;
						return r;
					}

					//calculate last point speed
					var curr_left_final = cis_animation_type == 'css3' ? this.cis_getTransform($images_holder,'translate_x') : parseInt($images_holder.css('margin-left'));
					var move_speed_time_final = Math.abs(curr_left_final - desired_left_1);

					if(move_speed_time_final > 1000)
						move_speed_time_final = 1000;
					if(move_speed_time_final < 150)
						move_speed_time_final = 150;

					if(cis_animation_type == 'css3') {

						this.cis_clear_quee($images_holder);
						move_speed_time_final_css3 = move_speed_time_final + 'ms';

						this.cis_make_css3_movement($images_holder, move_speed_time_final_css3, cis_effect_type, desired_left_1);
						this.cis_css3_back_timeout = setTimeout(function() {
							this.cis_clear_quee($images_holder);
							// var effect = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'; //easeOutBack
							var cis_effect_type = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'; //easeOutBack like effect
							this.cis_make_css3_movement($images_holder, '400ms', cis_effect_type, desired_left);
						}.bind(this),move_speed_time_final);
					} else {
						$images_holder.stop(true,false).animate({
							'margin-left': desired_left_1
						},move_speed_time_final,cis_effect_type,function() {
							$(this).stop().animate({
								'margin-left': desired_left
							},600,'easeOutBack');
						});
					}

					return 'end';
				}
			}
			else {
				if(cis_animation_type == 'css3') {
					this.cis_clear_quee($images_holder);
					move_speed_time = move_speed_time + 'ms';
					this.cis_make_css3_movement($images_holder, move_speed_time, cis_effect_type, curr_left);
				} else {
					$images_holder.stop(true,false).animate({
						'margin-left': curr_left
					},move_speed_time,cis_effect_type);
				}
			}

			// hide overlays
			$images_holder.find('.cis_row_item').addClass('reset_enabled');
			this.cis_hide_overlays();
			$wrapper.find('.cis_row_item').removeClass('cis_item_mouseentered');
			// end hide overlays
		};

//slider correction////////////////////////////////////////////////////////////////////////////////

		this.sliderCorrectionCheck = function() {
			var $wrapper = this.wrapper;
			var cis_item_correction_enabled = this.options.item_correction_enabled;
			var cis_is_touch_devise = this.options.cis_is_touch_devise;
			if(cis_item_correction_enabled == 0)
				return;

			var cis_event_type = cis_is_touch_devise ? 'vclick' : 'mouseenter';

			$wrapper.on(cis_event_type, '.cis_row_item', function(e) {
				$item = $(e.target).parents('.cis_row_item');

				setTimeout(function() {
					this.cis_make_slider_item_correction($item);
				}.bind(this),10);
			}.bind(this));
		};

		this.cis_make_slider_item_correction = function($elem) {

			//check if user drags it, then retrun
			if($elem.parents('.cis_images_row').hasClass('cis_dragging'))
				return;

			var cis_animation_type = this.options.cis_animation_type;
			var order = $elem.index();
			var items_count = parseInt($elem.parent('div').attr("items_count"));
			items_count = isNaN(items_count) ? 0 : items_count;

			var block_number = parseInt(order / items_count);
			block_number = isNaN(block_number) ? 0 : block_number;

			var is_inf_item = $elem.hasClass('cis_inf_item') ? true : false;

			var $loader = $elem.find('.cis_row_item_loader');
			var $img_holder = $loader.parents('.cis_main_wrapper').find('.cis_images_holder');
			var slider_id = $loader.parents('.cis_main_wrapper').data("id");
			var item_id = $loader.parents('.cis_row_item').data("item_id");

			// get total items width
			var items_w = parseInt($img_holder.width());
			var items_half_width = parseInt($img_holder.attr("half_width"));
			var items_width_start = parseInt($img_holder.attr("single_width"));
			items_width_start = isNaN(items_width_start) ? 0 : items_width_start;

			var total_w = parseInt($loader.parents('.cis_main_wrapper').find('.cis_images_row').width());

			//check if slider in scroll progress, then return
			if($img_holder.hasClass('cis_scrolling') || $img_holder.hasClass('cis_autoplay_back_animation') || items_w < total_w)
				return;

			var $cis_popup = $('.cis_popup_wrapper');

			var loader_width = parseInt($loader.css('width'));
			var items_m_r = parseInt($loader.parents('.cis_row_item').css('margin-right'));

			//get slider_offset
			var image_index = parseInt($loader.parents('.cis_row_item').attr("cis_item_order"));
			image_index = image_index + block_number * items_count * 1;
			var total_items_width = 0;
			$loader.parents('.cis_main_wrapper').find('.cis_row_item').each(function(i) {
				var w = parseInt($(this).width());

				var m_r = parseInt($(this).css('margin-right'));
				total_items_width = total_items_width + 1*w + 1*m_r;
				if(i == image_index)
					return false;
			});

			var current_left_offset_with_sign = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css('margin-left'));
			var current_left_offset = Math.abs(current_left_offset_with_sign);
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
			if(direction == 1 && item_offset_to_move > 0 && image_index == 0 && current_left_offset_with_sign >= 0)
				return;

			var popup_loader_animate_timeout = 400;
			if(item_offset_to_move > 0) {
				var new_l = direction == 1 ? current_left_offset_with_sign + 1*item_offset_to_move : current_left_offset_with_sign - 1*item_offset_to_move;

				if(cis_animation_type == 'css3') {
					this.cis_clear_quee($img_holder);
					this.cis_make_css3_movement($img_holder, '400ms', 'cubic-bezier(0.250, 0.100, 0.250, 1.000)', new_l);
				} else {
					$img_holder.stop(true,false).animate({
						'margin-left': new_l
					},popup_loader_animate_timeout,'swing');
				}
			};
		};

// inf scrolling check ////////////////////////////////////////////////////////////////////////////

		this.infScrollingCheck = function() {
			var $wrapper = this.wrapper;
			var inf_scroll_enabled = this.options.inf_scroll_enabled;
			var cis_is_touch_devise = this.options.cis_is_touch_devise;

			if(inf_scroll_enabled == 0)
				return;

			var $images_holder = $wrapper.find('.cis_images_holder');
			var screen_w = parseFloat($images_holder.parent('div').width());
			var total_w = parseFloat($images_holder.width());

			if(total_w >= screen_w) {
				this.cis_make_infinite_scrolling();
			}
		};

		this.cis_make_infinite_scrolling = function() {
			var $wrapper = this.wrapper;
			var $img_holder = $wrapper.find('.cis_images_holder');
			var q = $img_holder.width();
			var cis_overlay_animation_type = this.options.cis_overlay_animation_type;
			var total_items_count = $wrapper.attr("total_items_count");

			$img_holder.attr("inf_enabled",1);
			var $images_holder_dummy = $img_holder.clone();


			var items_count = 0;

			$img_holder.find('.cis_row_item').each(function(index, el) {
				$this = $(el);

				$this
					.removeClass("cis_fliped")
					.removeClass("cis_flipcard")
					.removeClass("cis_flip_h_1")
					.removeClass("cis_flip_h_2")
					.removeClass("cis_flip_v_1")
					.removeClass("cis_flip_v_2");
				$this.find('.cis_row_item_loader').hide()
					.removeClass("cis_flipcard_side")
					.removeClass("cis_flipcard_side_1")
					.removeClass("cis_flipcard_side_2");
				$this.find('.cis_row_item_inner')
					.removeClass("cis_flipcard_side")
					.removeClass("cis_flipcard_side_1")
					.removeClass("cis_flipcard_side_2");

				$this.find('.cis_row_item_overlay')
					.removeClass("cis_visibility_hidden");

				//remove loader
				$this.find('.cis_row_item_loader').css('display','none');

				// modify id
				var cur_id = $this.attr("id");
				cur_id = cur_id + '_inf';
				$this.attr("id",cur_id);

				if(cis_overlay_animation_type == 1) { // if overlay visible
					$this.find('.cis_row_item_overlay').addClass('cis_opacity_visible');
				}

				// remove class
				$this.find('.cis_row_item_inner').removeClass('cis_row_hidden_element').attr('style','display: block');

				// add infinite class
				$this.addClass('cis_inf_item');

				items_count ++;
			});

			var $images_holder_dummy_modified = $images_holder_dummy.html();

			var $images_holder_dummy_modified_final = $images_holder_dummy_modified + $images_holder_dummy_modified + $images_holder_dummy_modified;

			var wrapper_w = parseInt($img_holder.css('width'));

			var wrapper_new_w = wrapper_w * 4;
			var repeats_count = 3;
			$img_holder.attr("half_width",wrapper_w * 2).css('width',wrapper_new_w).attr("single_width",wrapper_w).attr("items_count",total_items_count).attr("repeats_count",repeats_count);
			$img_holder.append($images_holder_dummy_modified_final);

		};

		this.cis_make_infinite_scrolling_move_right = function() { // wrapper is cis_images_holder
			var $wrapper = this.wrapper;
			var $img_holder = $wrapper.find('.cis_images_holder');
			var cis_animation_type = this.options.cis_animation_type;

			var m_l = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css('margin-left'));
			var half_w = parseInt($img_holder.attr('half_width'));
			var single_w = parseInt($img_holder.attr('single_width'));
			var repeats_count = parseInt($img_holder.attr('repeats_count'));
			var new_m_l = m_l + 1*half_w;

			var final_m_l = m_l + repeats_count * single_w *  1;
			final_m_l = final_m_l > 0 ? final_m_l - 1*single_w : final_m_l;

			if(cis_animation_type == 'css3') {
				this.cis_clear_quee($img_holder);
				this.cis_make_css3_movement($img_holder, '0ms', 'none', final_m_l);
			} else {
				$img_holder.stop(true,true).css('margin-left',final_m_l);
			}

			// make correction on cur_l_start
			var cur_l_start = $img_holder.attr("cur_l_start");
			var cur_l_start_new = cur_l_start*1 + 1*Math.abs(m_l - final_m_l);
			$img_holder.attr("cur_l_start",cur_l_start_new);

			return repeats_count * single_w *  1;
		};

		this.cis_make_infinite_scrolling_move_left = function() {
			var $wrapper = this.wrapper;
			var $img_holder = $wrapper.find('.cis_images_holder');
			var cis_animation_type = this.options.cis_animation_type;

			var m_l = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css('margin-left'));

			var half_w = parseInt($img_holder.attr('half_width'));
			var single_w = parseInt($img_holder.attr('single_width'));
			var repeats_count = parseInt($img_holder.attr('repeats_count'));
			var new_m_l = m_l - 1*half_w;

			var final_m_l = m_l - repeats_count * single_w *  1;
			final_m_l = final_m_l > 0 ? final_m_l - 1*single_w : final_m_l;

			if(cis_animation_type == 'css3') {
				this.cis_clear_quee($img_holder);
				this.cis_make_css3_movement($img_holder, '0ms', 'none', final_m_l);
			} else {
				$img_holder.stop(true,true).css('margin-left',final_m_l);
			}

			// make correction on cur_l_start
			var cur_l_start = $img_holder.attr("cur_l_start");
			var cur_l_start_new = cur_l_start*1 - 1*Math.abs(m_l - final_m_l);
			$img_holder.attr("cur_l_start",cur_l_start_new);

			return repeats_count * single_w *  1;
		};

// page scroll ////////////////////////////////////////////////////////////////////////////////////

		this.setScrollEvents = function() {
			$wrapper = this.wrapper;

			var cis_mouse_scroll_enabled = this.options.mouse_scroll_enabled;
			cis_mouse_scroll_enabled = isNaN(cis_mouse_scroll_enabled) ? 0 : cis_mouse_scroll_enabled;

			if(cis_mouse_scroll_enabled == 1) {

				$wrapper.find('.cis_images_row').bind('mousewheel DOMMouseScroll', function(e) {
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

				$wrapper.find('.cis_images_row').mousewheel(function(e, intDelta) {
					$images_row = $(e.target).parents('.cis_images_row');

					if($images_row.hasClass('cis_scrolling_vertical'))
						return;

					if(intDelta > 0) {
						this.cis_move_images_holder_left();
					}
					else {
						this.cis_move_images_holder_right();
					}
				}.bind(this));
			}
		};

// autoplay ///////////////////////////////////////////////////////////////////////////////////////

		this.cis_make_autoplay = function() {
			$wrapper = this.wrapper;
			//get autoplay data
			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay = parseInt(slider_data_array[3]);

			if(slider_autoplay == 0)
				return;
			else if(slider_autoplay == 1)
				this.cis_make_evenly_autoplay();
			else if(slider_autoplay == 2)
				this.cis_make_steps_autoplay();

		};

		this.cis_make_steps_autoplay = function() {
			var $wrapper = this.wrapper;
			var slider_id = this.options.id;

			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
			var slider_autoplay_step_timeout = parseInt(slider_data_array[5]);
			var slider_autoplay_restart_timeout = parseInt(slider_data_array[7]);

			this.cis_autoplay_animate_back_timeouts[slider_id] = '';

			this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
				//set interval
				this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
					this.cis_move_slider_by_steps();
				}.bind(this), slider_autoplay_step_timeout);
			}.bind(this), slider_autoplay_start_timeout);

			$wrapper.hover(function() {
				clearTimeout(this.cis_autoplay_start_timeouts[slider_id]);
				clearTimeout(this.cis_autoplay_animate_back_timeouts[slider_id]);
				clearInterval(this.cis_evenly_move_intervals[slider_id]);
				$wrapper.addClass('cis_mouseentered');
			}.bind(this), function() {
				//check if popup vissible///////////////////////////////////
				var $cis_popup = $('.cis_popup_wrapper');
				var popup_slider_id = $cis_popup.attr("slider_id");
				if($cis_popup.hasClass('cis_vissible') && popup_slider_id == slider_id) {
					return;
				}

				this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
					//set interval
					this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
						this.cis_move_slider_by_steps();
					}.bind(this), slider_autoplay_step_timeout);

				}.bind(this), slider_autoplay_restart_timeout);
				$wrapper.removeClass('cis_mouseentered');
			}.bind(this));
		};

		this.cis_move_slider_by_steps = function() {
			var $wrapper = this.wrapper;
			var slider_id = this.options.id;
			var cis_animation_type = this.options.cis_animation_type;

			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
			var slider_autoplay_step_timeout = parseInt(slider_data_array[5]);

			$cis_images_holder = $wrapper.find('.cis_images_holder');
			var screen_w = parseFloat($cis_images_holder.parent('div').width());
			var total_w = parseFloat($cis_images_holder.width());

			var cis_move_direction = parseInt($wrapper.attr("cis_move_direction"));
			cis_move_direction = cis_move_direction == 1 ? 1 : 0;

			var curr_left = cis_animation_type == 'css3' ? this.cis_getTransform($cis_images_holder,'translate_x') : parseFloat($cis_images_holder.css('margin-left'));

			if(total_w >= screen_w) {
				if(cis_move_direction == 0)
					var result = this.cis_move_images_holder_left();
				else
					var result = this.cis_move_images_holder_right();
			}
			else {
				if(cis_move_direction == 1) {
					var curr_ = screen_w - total_w;
					if(curr_left == screen_w - total_w)
						var result = this.cis_move_images_holder_left();
					else
						var result = this.cis_move_images_holder_right();
				}
				else {
					if(curr_left == 0)
						var result = this.cis_move_images_holder_right();
					else
						var result = this.cis_move_images_holder_left();
				}
				return;
			}

			if(result == 'end') {
				clearTimeout(this.cis_autoplay_start_timeouts[slider_id]);
				clearInterval(this.cis_evenly_move_intervals[slider_id]);

				var cis_animate_back_to_start_timeout = slider_autoplay_step_timeout;
				var cis_animate_back_to_start_time = Math.abs(parseInt((total_w - screen_w) * 1.5));
				cis_animate_back_to_start_time = cis_animate_back_to_start_time < 600 ? 600 : cis_animate_back_to_start_time;
				cis_animate_back_to_start_time = cis_animate_back_to_start_time > 2000 ? 2000 : cis_animate_back_to_start_time;

				var cis_animate_back_px = (cis_move_direction == 1) ? screen_w - total_w : 0;

				var $sl = $wrapper.find('.cis_images_holder');
				//set timeout to animate back
				this.cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
					$sl.addClass('cis_autoplay_back_animation');
					//animate back to start
					if(cis_animation_type == 'css3') {

						this.cis_clear_quee($cis_images_holder);
						var cis_effect_eaceOutBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
						cis_animate_back_to_start_time_css3 = cis_animate_back_to_start_time + 'ms';
						this.cis_make_css3_movement($sl, cis_animate_back_to_start_time_css3, cis_effect_eaceOutBack, cis_animate_back_px);

						setTimeout(function() {
							var $sl = $wrapper;
							$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');

							//check to see that mouseenter does not happened
							if($wrapper.hasClass('cis_mouseentered'))
								return;

							//set new autoplay
							this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
								//set interval
								this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
									this.cis_move_slider_by_steps();
								}.bind(this), slider_autoplay_step_timeout);
							}.bind(this), slider_autoplay_start_timeout);
						}.bind(this), cis_animate_back_to_start_time);
					} else {
						$sl.stop(true,false).animate({
							'margin-left': cis_animate_back_px
						},cis_animate_back_to_start_time,'easeOutBack', function() {
							var $sl = $wrapper;
							$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');

							//check to see that mouseenter does not happened
							if($wrapper.hasClass('cis_mouseentered'))
								return;

							//set new autoplay
							this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
								//set interval
								this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
									this.cis_move_slider_by_steps();
								}.bind(this), slider_autoplay_step_timeout);
							}.bind(this), slider_autoplay_start_timeout);
						}.bind(this));
					}
				}.bind(this), cis_animate_back_to_start_timeout);
			}
		};

		this.cis_make_evenly_autoplay = function() {
			var $wrapper = this.wrapper;
			var slider_id = this.options.id;

			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
			var slider_autoplay_restart_timeout = parseInt(slider_data_array[7]);

			this.cis_autoplay_animate_back_timeouts[slider_id] = '';

			this.cis_make_evenly_autoplay_restart(slider_autoplay_start_timeout);

			$wrapper.find('.cis_row_item').mouseenter(function() {
				this.cis_make_evenly_autoplay_stop();
				$wrapper.addClass('cis_mouseentered');
			}.bind(this));

			$wrapper.hover(function() {
				this.cis_make_evenly_autoplay_stop();
				$wrapper.addClass('cis_mouseentered');
			}.bind(this), function() {
				this.cis_make_evenly_autoplay_restart(slider_autoplay_restart_timeout);
				$wrapper.removeClass('cis_mouseentered');
			}.bind(this));
		};

		this.cis_make_evenly_autoplay_restart = function(slider_autoplay_restart_timeout) {
			var $wrapper = this.wrapper;
			var slider_id = this.options.id;
			this.cis_make_evenly_autoplay_stop();

			if(slider_id == undefined || slider_id == 'undefined')
				return;

			if($wrapper.hasClass('cis_mouseentered') && slider_autoplay_restart_timeout == 0) {
				return;
			}

			// check if dragging
			var $images_row = $wrapper.find('.cis_images_row');
			var slider_scrolling = $images_row.hasClass('cis_dragging') ? true : false;
			if(slider_scrolling)
				return;

			//check if popup vissible///////////////////////////////////
			var $cis_popup = $('.cis_popup_wrapper');
			var popup_slider_id = $cis_popup.attr("slider_id");
			if($cis_popup.hasClass('cis_vissible') && popup_slider_id == slider_id) {
				return;
			}

			this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
				//set interval
				this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
					this.cis_autoplay_inf_scroll_index = 0;
					this.cis_move_slider_evenly();
				}.bind(this), this.cis_interval_time);
			}.bind(this), slider_autoplay_restart_timeout);
		};

		this.cis_make_evenly_autoplay_stop = function() {
			var slider_id = this.options.id;

			clearTimeout(this.cis_autoplay_start_timeouts[slider_id]);
			clearTimeout(this.cis_autoplay_animate_back_timeouts[slider_id]);
			clearInterval(this.cis_evenly_move_intervals[slider_id]);
		};

		this.cis_move_slider_evenly = function() {
			var $wrapper = this.wrapper;
			var slider_id = this.options.id;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;
			var cis_animation_type = this.options.cis_animation_type;

			//get autoplay data
			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay_start_timeout = parseInt(slider_data_array[4]);
			var slider_autoplay_evenly_speed = parseInt(slider_data_array[6]);
			var delta_offset = parseInt(slider_data_array[0]);
			var move_speed_time = parseInt(slider_data_array[1]);
			var ease_effect = parseInt(slider_data_array[2]);

			$cis_images_holder = $wrapper.find('.cis_images_holder');
			var screen_w = parseFloat($cis_images_holder.parent('div').width());
			var total_w = parseFloat($cis_images_holder.width());
			var curr_left = cis_animation_type == 'css3' ? this.cis_getTransform($cis_images_holder,'translate_x') : parseInt($cis_images_holder.css('margin-left'));

			var cis_move_direction = parseInt($wrapper.attr("cis_move_direction"));
			var cis_move_direction_start = cis_move_direction;
			cis_move_direction = cis_move_direction == 1 ? 1 : 0;
			if(total_w >= screen_w) {
				curr_left = cis_move_direction == 1 ? curr_left + 1*slider_autoplay_evenly_speed : curr_left - 1* slider_autoplay_evenly_speed;
			}
			else {
				cis_move_direction = isNaN(cis_move_direction_start) || (cis_move_direction_start != 0 && cis_move_direction_start != 1) ? 1 : cis_move_direction;
				curr_left = cis_move_direction == 1 ? curr_left + 1*slider_autoplay_evenly_speed : curr_left - 1* slider_autoplay_evenly_speed;
			}

			var cis_single_autoplay_time = 500;
			var cis_autoplay_ease_time = 600;
			var cis_animate_back_to_start_timeout = 2000;
			var cis_animate_back_to_start_time = Math.abs(parseInt((total_w - screen_w) * 1.5));
			cis_animate_back_to_start_time = cis_animate_back_to_start_time < 600 ? 600 : cis_animate_back_to_start_time;
			cis_animate_back_to_start_time = cis_animate_back_to_start_time > 2000 ? 2000 : cis_animate_back_to_start_time;

			// var cis_effect_type = cis_animation_type == 'css3' ? 'cubic-bezier(0.250, 0.100, 0.250, 1.000)' : 'swing';
			var cis_effect_type = cis_animation_type == 'css3' ? 'linear' : 'linear';

			ease_effect = slider_autoplay_evenly_speed;

			if(total_w >= screen_w) {
				//check if end
				if((Math.abs(curr_left) + 1 * screen_w >= total_w && cis_move_direction == 0) || (curr_left >= 0 && cis_move_direction == 1)) {
					if(cis_inf_scrolling == 1) {
						if(cis_move_direction == 0)
							this.cis_make_infinite_scrolling_move_right();
						else
							this.cis_make_infinite_scrolling_move_left();
					}
					else {

						clearTimeout(this.cis_autoplay_start_timeouts[slider_id]);
						clearInterval(this.cis_evenly_move_intervals[slider_id]);

						var desired_left = (curr_left >= 0 && cis_move_direction == 1) ? 0 : screen_w - total_w;
						var cis_animate_back_px = (curr_left >= 0 && cis_move_direction == 1) ? screen_w - total_w : 0;

						//calculate last point speed
						var curr_left_final = cis_animation_type == 'css3' ? this.cis_getTransform($cis_images_holder,'translate_x') : parseInt($cis_images_holder.css('margin-left'));
						var move_speed_time_final = Math.abs(curr_left_final - desired_left) * cis_single_autoplay_time  / slider_autoplay_evenly_speed;


						if(cis_animation_type == 'css3') {
							this.cis_clear_quee($cis_images_holder);

							move_speed_time_final_css3 = move_speed_time_final + 'ms';
							this.cis_make_css3_movement($cis_images_holder, move_speed_time_final_css3, cis_effect_type, desired_left);

							setTimeout(function() {

								//check to see that mouseenter does not happened
								if($wrapper.hasClass('cis_mouseentered'))
									return;

								var $sl = $wrapper.find('.cis_images_holder');
								//set timeout to animate back
								this.cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
									//animate back to start
									$sl.addClass('cis_autoplay_back_animation');

									var cis_effect_eaceOutBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
									var cis_animate_back_to_start_time_css3 = cis_animate_back_to_start_time + 'ms';
									this.cis_make_css3_movement($sl, cis_animate_back_to_start_time_css3, cis_effect_eaceOutBack, cis_animate_back_px);

									setTimeout(function() {
										var $sl = $wrapper;

										$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');
										//check to see that mouseenter does not happened
										if($wrapper.hasClass('cis_mouseentered'))
											return;

										//set new autoplay
										this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
											//set interval
											this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
												this.cis_move_slider_evenly();
											}.bind(this), this.cis_interval_time);
										}.bind(this), slider_autoplay_start_timeout);
									}.bind(this), cis_animate_back_to_start_time);

								}.bind(this),cis_animate_back_to_start_timeout);

							}.bind(this), move_speed_time_final);
						} else {
							$cis_images_holder.stop(true,false).animate({//swing effect
								'margin-left': desired_left
							},move_speed_time_final,cis_effect_type, function() {

								//check to see that mouseenter does not happened
								if($wrapper.hasClass('cis_mouseentered'))
									return;

								var $sl = $wrapper.find('.cis_images_holder');
								//set timeout to animate back
								this.cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
									//animate back to start
									$sl.addClass('cis_autoplay_back_animation');
									$sl.stop(true,false).animate({
										'margin-left': cis_animate_back_px
									},cis_animate_back_to_start_time,'easeOutBack', function() {
										var $sl = $wrapper;

										$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');
										//check to see that mouseenter does not happened
										if($wrapper.hasClass('cis_mouseentered'))
											return;

										//set new autoplay
										this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
											//set interval
											this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
												this.cis_move_slider_evenly();
											}.bind(this), this.cis_interval_time);
										}.bind(this), slider_autoplay_start_timeout);
									}.bind(this));
								}.bind(this),cis_animate_back_to_start_timeout);
							}.bind(this));
						} // end if
					}
				}
				else {
					if(cis_animation_type == 'css3') {
						cis_single_autoplay_time_css3 = cis_single_autoplay_time + 'ms';
						this.cis_make_css3_movement($cis_images_holder, cis_single_autoplay_time_css3, 'linear', curr_left);
					} else {
						$cis_images_holder.stop(true,false).animate({
							'margin-left': curr_left
						},cis_single_autoplay_time,'linear');
					}
				}
			}
			else {
				//check if end
				// if(Math.abs(curr_left) + 1 * total_w >= screen_w) {
				if((Math.abs(curr_left) + 1 * total_w >= screen_w && cis_move_direction == 1) || (curr_left <= 0 && cis_move_direction == 0)) {

					//clear timeouts, intervals
					clearTimeout(this.cis_autoplay_start_timeouts[slider_id]);
					clearInterval(this.cis_evenly_move_intervals[slider_id]);

					var desired_left = (curr_left <= 0 && cis_move_direction == 0) ? 0 : screen_w - total_w;
					var cis_animate_back_px = (curr_left <= 0 && cis_move_direction == 0) ? screen_w - total_w : 0;

					//calculate last point speed
					var curr_left_final = cis_animation_type == 'css3' ? this.cis_getTransform($cis_images_holder,'translate_x') : parseInt($cis_images_holder.css('margin-left'));
					var move_speed_time_final = Math.abs(curr_left_final - desired_left) * cis_single_autoplay_time  / slider_autoplay_evenly_speed;

					if(cis_animation_type == 'css3') {
						this.cis_clear_quee($cis_images_holder);
						move_speed_time_final_css3 = move_speed_time_final + 'ms';
						this.cis_make_css3_movement($cis_images_holder, move_speed_time_final_css3, cis_effect_type, desired_left);

						setTimeout(function() {

							//check to see that mouseenter does not happened
							if($wrapper.hasClass('cis_mouseentered'))
								return;

							var $sl = $wrapper.find('.cis_images_holder');
							//set timeout to animate back
							this.cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
								//animate back to start
								$sl.addClass('cis_autoplay_back_animation');

								var cis_effect_eaceOutBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
								var cis_animate_back_to_start_time_css3 = cis_animate_back_to_start_time + 'ms';
								this.cis_make_css3_movement($sl, cis_animate_back_to_start_time_css3, cis_effect_eaceOutBack, cis_animate_back_px);

								setTimeout(function() {
									var $sl = $('.cis_wrapper_' + slider_id);

									$sl.find('.cis_images_holder').removeClass('cis_autoplay_back_animation');
									//check to see that mouseenter does not happened
									if($wrapper.hasClass('cis_mouseentered'))
										return;

									//set new autoplay
									this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
										//set interval
										this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
											this.cis_move_slider_evenly();
										}.bind(this), this.cis_interval_time);
									}.bind(this), slider_autoplay_start_timeout);
								}.bind(this), cis_animate_back_to_start_time);

							}.bind(this), cis_animate_back_to_start_timeout);

						}.bind(this), move_speed_time_final);
					} else {

						$cis_images_holder.stop(true,false).animate({//swing effect
							'margin-left': desired_left
						},move_speed_time_final,'linear',function() {


							//easing animation on end
							var $sl = $wrapper.find('.cis_images_holder');
							$sl.stop().animate({
								'margin-left': desired_left
							},cis_autoplay_ease_time,'easeOutBack', function() {
								//check to see that mouseenter does not happened
								if($wrapper.hasClass('cis_mouseentered'))
									return;
								var $sl = $wrapper.find('.cis_images_holder');
								//set timeout to animate back
								this.cis_autoplay_animate_back_timeouts[slider_id] = setTimeout(function() {
									//animate back to start
									$sl.stop(true,false).animate({
										'margin-left': cis_animate_back_px
									},cis_animate_back_to_start_time,'easeOutBack', function() {
										//check to see that mouseenter does not happened
										if($wrapper.hasClass('cis_mouseentered'))
											return;

										var $sl = $wrapper;
										//set new autoplay
										this.cis_autoplay_start_timeouts[slider_id] = setTimeout(function() {//set timeout
											//set interval
											this.cis_evenly_move_intervals[slider_id] = setInterval(function() {
												this.cis_move_slider_evenly();
											}.bind(this), this.cis_interval_time);
										}.bind(this), slider_autoplay_start_timeout);
									}.bind(this));
								}.bind(this), cis_animate_back_to_start_timeout);
							}.bind(this));
						}.bind(this));
					}
				}
				else {
					if(cis_animation_type == 'css3') {
						// cis_clear_quee($cis_images_holder);
						cis_single_autoplay_time_css3 = cis_single_autoplay_time + 'ms';
						this.cis_make_css3_movement($cis_images_holder, cis_single_autoplay_time_css3, 'linear', curr_left);

					} else {
						$cis_images_holder.stop(true,false).animate({
							'margin-left': curr_left
						},cis_single_autoplay_time,'linear');
					}
				}
			}
		};

// touch ///////////////////////////////////////////////////////////////////////////////////////////

		this.prepareTouch = function() {
			var $wrapper = this.wrapper;
			var cis_touch_enabled = this.options.cis_touch_enabled;
			var cis_is_touch_devise = this.options.cis_is_touch_devise;
			var cis_animation_type = this.options.cis_animation_type;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;

			var $images_holder = $wrapper.find('.cis_images_holder');
			var screen_w = parseFloat($images_holder.parent('div').width());
			var total_w = parseFloat($images_holder.width());

			// disable touch if we have not enough items
			if(total_w <= screen_w)
				return;

			if( !(cis_touch_enabled == 1 || (cis_touch_enabled == 2 && cis_is_touch_devise)) )
				return;

			$wrapper.find('.cis_images_row').mousemove(function(event) {
				this.cis_currentMouseX = event.pageX;
			}.bind(this));

			// Mobile support
			$wrapper.find('.cis_images_row').on({
				'vmousemove': function(event) {
					this.cis_currentMouseX = event.pageX;
				}.bind(this)
			});
			$wrapper.find('.cis_images_row').on({
				'touchstart touchmove': function(event) {
					var e = event.originalEvent;
					var touches_count = e.touches.length;
					var touch = e.touches[0];
					this.cis_currentMouseX = touch.pageX;
				}.bind(this)
			});

			// add grab cursor to overlay
			$wrapper.find('.cis_row_item_inner img').addClass('cis_cursor_grab');
			$wrapper.find('.cis_row_item_overlay').addClass('cis_cursor_grab');

			$wrapper.find('.cis_images_row').mousedown(function(e) {

				if(cis_is_touch_devise)
					return;

				// disable drag on icons, buttons
				if(
					$(e.target).hasClass('cis_zoom_icon') ||
					$(e.target).hasClass('cis_link_icon') ||
					$(e.target).hasClass('creative_icon-white') ||
					$(e.target).hasClass('cis_button_left') ||
					$(e.target).hasClass('cis_button_right')
				) {
					return;
				}

				// stop slider
				var $cis_wrapper = $wrapper.find('.cis_images_holder');
				this.cis_stop_touch_move();//cis_images_holder

				var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($cis_wrapper,'translate_x') : parseInt($cis_wrapper.css("margin-left"));
				$cis_wrapper.attr("cur_l_start",cur_l);

				// enable touch fix!
				this.cis_make_touch_effect_bug_fix_enabled = true;
				this.cis_make_drag_enabled = true;

				var slider_data = $wrapper.find('.cis_moving_data').html();
				var slider_data_array = slider_data.split(',');
				var slider_autoplay = parseInt(slider_data_array[3]);

				if(slider_autoplay == 1)
					this.cis_make_evenly_autoplay_stop();

				$wrapper.find('.cis_images_row').addClass('cis_row_mouseentered');

				// add cursor grabbing
				$wrapper.find('.cis_row_item_inner img').addClass('cis_cursor_grabbing');
				$wrapper.find('.cis_row_item_overlay').addClass('cis_cursor_grabbing');
				$wrapper.find('.cis_images_row').addClass('cis_cursor_grabbing');

				this.cis_posXdragStart = this.cis_currentMouseX;

				// reset variables
				clearInterval(this.cis_speed_interval);
				clearInterval(this.cis_move_interval);
				this.cis_move_interval = '';
				clearTimeout(this.cis_speed_timeout);
				this.cis_movement_dirrection = [];
				this.cis_movement_dictance = [];
				this.cis_movement_dictance.length = 0;
				this.cis_speed_index = 0;

				// make fake call
				this.cis_makeDrag(false);
				this.cis_calculate_speed();

				var fake_int_call_count = 10;
				var fake_int_call_time = 0;
				var fake_int_call_time_ratio = 1;
				for(var qq = 0; qq < fake_int_call_count; qq ++) {
					fake_int_call_time = fake_int_call_time + 1*fake_int_call_time_ratio;
					setTimeout(function() {
						this.cis_calculate_speed();
						this.cis_makeDrag(false);
					}.bind(this), fake_int_call_time);
				}

				this.cis_move_interval = setInterval(function() {this.cis_makeDrag(false);}.bind(this), 1);
				this.cis_speed_interval = setInterval(function() {this.cis_calculate_speed();}.bind(this), 1);

			}.bind(this));

			$wrapper.find('.cis_images_row').mouseup(function(e) {
				// disable for buttons
				if(
					$(e.target).hasClass('cis_zoom_icon') ||
					$(e.target).hasClass('cis_link_icon') ||
					$(e.target).hasClass('creative_icon-white') ||
					$(e.target).hasClass('cis_button_left') ||
					$(e.target).hasClass('cis_button_right')
				) {
					return;
				}

				if(cis_touch_enabled == 1 || (cis_touch_enabled == 2 && cis_is_touch_devise)) {
					$wrapper.find('.cis_images_row').removeClass('cis_cursor_grabbing');
					$wrapper.find('.cis_row_item_inner img').removeClass('cis_cursor_grabbing');
					$wrapper.find('.cis_row_item_overlay').removeClass('cis_cursor_grabbing');

					$wrapper.find('.cis_images_row').removeClass('cis_row_mouseentered');

					this.cis_clear_interval();

					this.cis_make_touch_effect();
				}

				$(this).removeClass('cis_row_mouseentered');

			}.bind(this));

			$wrapper.find('.cis_images_row').mouseleave(function(e) {

				if(cis_touch_enabled == 1 || (cis_touch_enabled == 2 && cis_is_touch_devise)) {
					$wrapper.find('.cis_images_row').removeClass('cis_cursor_grabbing');
					$wrapper.find('.cis_row_item_inner img').removeClass('cis_cursor_grabbing');
					$wrapper.find('.cis_row_item_overlay').removeClass('cis_cursor_grabbing');

					this.cis_clear_interval();

					if($wrapper.find('.cis_images_row').hasClass("cis_row_mouseentered"))
						this.cis_make_touch_effect();
				}

				$wrapper.find('.cis_images_row').removeClass('cis_mouseentered');
				$wrapper.find('.cis_images_row').removeClass('cis_row_mouseentered');

			}.bind(this));

			// touch mobile events
			$wrapper.find(".cis_images_row").on({
				'touchstart': function(event) {
					var e = event.originalEvent;
					var touches_count = e.touches.length;
					if(touches_count != 1)
						return;

					var touch = e.touches[0];

					this.cis_make_evenly_autoplay_stop();

					// // return on buttons
					if($(touch.target).hasClass('cis_button_left') || $(touch.target).hasClass('cis_button_right')){
						return;
					}

					// stop slider
					var $cis_wrapper = $wrapper.find('.cis_images_holder');
					var $images_row = $wrapper.find('.cis_images_row');
					this.cis_stop_touch_move();

					var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($cis_wrapper,'translate_x') : parseInt($cis_wrapper.css("margin-left"));
					$cis_wrapper.attr("cur_l_start",cur_l);

					// enable touch fix!
					this.cis_make_touch_effect_bug_fix_enabled = true;
					this.cis_make_drag_enabled = true;

					$images_row.addClass('cis_row_mouseentered');

					this.cis_posXdragStart = this.cis_currentMouseX;

					clearInterval(this.cis_speed_interval);
					clearInterval(this.cis_move_interval);
					this.cis_move_interval = 'removed_interval';
					clearTimeout(this.cis_speed_timeout);
					this.cis_movement_dirrection = [];
					this.cis_movement_dictance = [];
					this.cis_speed_index = 0;

					// make fake call
					this.cis_makeDrag(false);
					this.cis_calculate_speed();

					var fake_int_call_count = 10;
					var fake_int_call_time = 0;
					var fake_int_call_time_ratio = 1;
					for(var qq = 0; qq < fake_int_call_count; qq ++) {
						fake_int_call_time = fake_int_call_time + 1*fake_int_call_time_ratio;
						setTimeout(function() {
							this.cis_calculate_speed();
							this.cis_makeDrag(false);
						}.bind(this), fake_int_call_time);
					}

					this.cis_move_interval = setInterval(function() {this.cis_makeDrag(true);}.bind(this),5);
					this.cis_speed_interval = setInterval(function() {this.cis_calculate_speed();}.bind(this),20);
				}.bind(this)
			});

			$wrapper.find(".cis_images_row").on({
				'touchend': function(event) {
					var e = event.originalEvent;
					if($wrapper.find('.cis_images_row').hasClass('cis_row_mouseentered'))
						this.cis_make_touchleave();
				}.bind(this)
			});
		};

		this.cis_make_touchleave = function() {
			var $wrapper = this.wrapper;
			var $images_row = $wrapper.find('.cis_images_row');

			$images_row.removeClass('cis_row_mouseentered');

			this.cis_clear_interval();
			this.cis_make_touch_effect();
		};

		this.cis_stop_touch_move = function() {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;
			var $img_holder = $wrapper.find('.cis_images_holder');

			if(cis_animation_type == 'css3') {
				this.cis_clear_quee($img_holder);
			} else {
				$img_holder.stop(true,false);
			}
			$img_holder.removeClass("cis_scrolling");
		};

		this.cis_clear_interval = function() {
			clearInterval(this.cis_move_interval);
			this.cis_move_interval = 'removed_interval';
			clearInterval(this.cis_speed_interval);
		};

		this.cis_makeDrag = function(is_mobile) { // wrapper is cis_images_row
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;
			var $cis_images_row = $wrapper.find('.cis_images_row');

			if(!this.cis_make_drag_enabled)
				return;

			var delta = this.cis_posXdragStart - this.cis_currentMouseX;

			var drag_sign = $cis_images_row.attr("drag_sign");
			if(Math.abs(delta) > 0) {
				drag_sign = delta > 0 ? 0 : 1;
				$cis_images_row.attr("drag_sign",drag_sign);
			}

			if(delta != 0)
				$cis_images_row.addClass("cis_dragging");

			var drag_direction = delta < 0 ? 'right' : 'left';

			var $img_holder = $wrapper.find('.cis_images_holder');
			var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css("margin-left"));
			var screen_w = parseFloat($img_holder.parent('div').width());
			var total_w = parseFloat($img_holder.width());
			var new_l = cur_l - delta*1;

			//last position drag stoping effect
			if( cis_inf_scrolling == 0 && (cur_l > 0 || (cur_l < 0 && (Math.abs(cur_l) + 1 * screen_w >= total_w))) ) {  // start/end positions
				var st_anim_time = is_mobile ? 70 : 1;

				// make slow drag!
				if(cis_animation_type == 'css3') {
					var new_l_calc = cur_l - delta*0.25;
					this.cis_make_css3_movement($img_holder, '0ms', 'none', new_l_calc);
				}
				else {
					st_anim_time = 1;
					$img_holder.stop(true,false).animate({
						'margin-left' : new_l
					},st_anim_time,'linear');
				}
			}
			else {
				if(cis_animation_type == 'css3') {
					st_anim_time_css3 = st_anim_time + 'ms';
					this.cis_make_css3_movement($img_holder, '0ms', 'none', new_l);
				}
				else {
					$img_holder.css('margin-left',new_l);
				}
			}

			if(cis_inf_scrolling == 0) {
				if(cur_l > 0)
					$cis_images_row.attr("touch_animate_to_point","1");
				else if(cur_l < 0 && (Math.abs(cur_l) + 1 * screen_w >= total_w))
					$cis_images_row.attr("touch_animate_to_point","2");
				else
					$cis_images_row.attr("touch_animate_to_point","0");
			}

			// get sizes
			var screen_w = parseFloat($img_holder.parent('div').width());
			var total_w = parseFloat($img_holder.width());
			curr_left = cur_l;

			// check if infinite scrolling enabled
			if(cis_inf_scrolling == 1 && total_w >= screen_w) {

				if(total_w != 999999 && $wrapper.find(".cis_images_holder").attr("inf_enabled") == 1) {
					if(Math.abs(curr_left) + 1 * screen_w >= total_w) {
						this.cis_make_infinite_scrolling_move_right();
					}
					if(new_l > 0) {
						this.cis_make_infinite_scrolling_move_left();
					}
				}
			}

			//set new cordinates
			this.cis_posXdragStart = this.cis_currentMouseX;
		};

		this.cis_calculate_speed = function() {
			this.cis_speed_x_start[this.cis_speed_index] = this.cis_currentMouseX;
			this.cis_create_speed(this.cis_speed_index);
			this.cis_speed_index ++;
		};

		this.cis_create_speed = function(cis_index) {
			this.cis_speed_timeout = setTimeout(function() {
				this.item_s = this.cis_currentMouseX - this.cis_speed_x_start[cis_index];
				this.cis_movement_dictance.push(this.item_s);
			}.bind(this), this.cis_speed_step_time);
		};

		this.cis_make_touch_effect = function() { // wrapper is cis_images_row
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;
			var $img_holder = $wrapper.find('.cis_images_holder');
			var $images_row = $wrapper.find('.cis_images_row');

			clearInterval(this.cis_speed_interval);
			clearTimeout(this.cis_speed_timeout);

			var slider_data = $wrapper.find('.cis_options_data').html();
			var slider_data_array = slider_data.split(',');
			var cis_touch_type = parseInt(slider_data_array[4]);

			var cur_l_end = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css("margin-left"));
			var cur_l_start = $img_holder.attr("cur_l_start");

			var cis_delta = cur_l_start - cur_l_end;
			cis_delta = isNaN(cis_delta) || cis_delta == 'undefined' ? 0 : cis_delta;

			if(cis_delta == 0 && this.cis_make_touch_effect_bug_fix_enabled) {
				setTimeout(function() {
					this.cis_make_touch_effect();
				}.bind(this), 10);
				this.cis_make_touch_effect_bug_fix_enabled = false;
				return;
			}

			if(!$images_row.hasClass("cis_dragging") && cis_delta == 0)
				return;

			//reverse array
			var cis_movement_dictance_reversed = this.cis_movement_dictance.reverse();
			var cis_array_size = cis_movement_dictance_reversed.length;

			var cis_first_item_sign = 0;
			for(var i = 0; i <  cis_array_size; i++) {
				var distance_item = cis_movement_dictance_reversed[i];
			}

			// get first item sign
			var cis_first_item_sign = 0;
			for(var i = 0; i <  cis_array_size; i++) {
				var distance_item = cis_movement_dictance_reversed[i];
				if(distance_item > 0) {
					cis_first_item_sign = 1;
					break;
				}
				else if(distance_item < 0) {
					cis_first_item_sign = -1;
					break;
				}
			}

			// get final array
			var cis_movement_distances_final = new Array;
			for(var i = 0; i <  cis_array_size; i++) {
				var distance_item = cis_movement_dictance_reversed[i];

				var item_sign = 0;
				if(distance_item == 0)
					item_sign = 0;
				else {
					item_sign = distance_item > 0 ? 1 : -1;
				}

				if(item_sign == cis_first_item_sign || item_sign == 0) {
					cis_movement_distances_final.push(distance_item);
				}
				else {
					break;
				}
			}

			var cis_array_final_size = cis_movement_distances_final.length;

			var one_step_time = 20;
			var counts_of_algoritm = 20;
			var position_ratio = 1;
			var position_ratio_step = 0.05;
			var movement_lenth_total = 0;
			var cis_count_algoritm_final = cis_array_final_size > counts_of_algoritm ? counts_of_algoritm : cis_array_final_size;

			for(var i = 0; i <  cis_count_algoritm_final; i++) {
				var distance_item = cis_movement_distances_final[i];
				var distance_item_weight = distance_item * position_ratio;

				movement_lenth_total += distance_item_weight;
				position_ratio -= position_ratio_step;
			}

			var cis_count_touch_elements = cis_count_algoritm_final;
			cis_count_algoritm_final = cis_count_algoritm_final == 0 ? 1 : cis_count_algoritm_final;
			var movement_distance_calculated = movement_lenth_total / cis_count_algoritm_final;

			var speed = parseInt((movement_distance_calculated / one_step_time) * 1000); // speed in px/s

			// reset arrays
			this.cis_movement_dictance = [];
			this.cis_speed_index = 0;

			if(speed == 0 && cis_delta == 0) {// no movement
				$images_row.removeClass("cis_dragging");
				$img_holder.removeClass("cis_scrolling");

				return;
			}

			// cis_make_drag_enabled = false;
			if((Math.abs(speed) > 0 && (cis_touch_type == 0 || cis_touch_type == 1) ) || (Math.abs(cis_delta) > 0 && speed == 0 && cis_count_touch_elements == 0) ) {
				// disable drag

				var drag_sign = $images_row.attr("drag_sign");
				this.cis_drag_speed = speed != 0 ? Math.abs(speed) * 0.2 : Math.abs(cis_delta);

				// if cis_touch_type is 0, set to move by one
				this.cis_drag_speed = cis_touch_type == 0 ? 0 : this.cis_drag_speed;

				$images_row.addClass("cis_dragging");
				if(drag_sign == 1) {
					this.cis_move_images_holder_right();
				}
				else {
					this.cis_move_images_holder_left();
				}

				return;
			}

			$img_holder.addClass("cis_scrolling");

			//make movement
			// set limit on max soeed
			var cis_max_speed = 10000;
			var speed_sign = speed >= 0 ? 1 : -1;
			speed = Math.abs(speed) > cis_max_speed ? speed_sign * cis_max_speed : speed;

			this.cis_make_touch_move(speed);
		};

		this.cis_make_touch_move = function(speed) {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;

			var $img_holder = $wrapper.find('.cis_images_holder');
			var $images_row = $wrapper.find('.cis_images_row');

			var distance_ratio = cis_is_touch_devise ? 0.8 : 0.5;
			var distance = speed * distance_ratio;
			var speed_time = 1500 + 0.55*Math.abs(distance);
			var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css("margin-left"));
			var new_l = cur_l + 1 * distance;

			// get sizes
			var screen_w = parseInt($img_holder.parent('div').width());
			var total_w = parseInt($img_holder.width());
			var half_w = parseInt($img_holder.attr("half_width"));
			curr_left = cur_l;

			// check if infinite scrolling enabled, make corrections
			if(cis_inf_scrolling == 1 && total_w >= screen_w) {
				//check if end
				if(Math.abs(new_l) + 1 * screen_w >= total_w) {
					var ratio_size = this.cis_make_infinite_scrolling_move_right();
					new_l = new_l + 1*ratio_size;
				}
				if(new_l > 0) {
					var ratio_size = this.cis_make_infinite_scrolling_move_left();
					new_l = new_l - 1*ratio_size;
				}
			}

			// make movement
			//  beautiful effects: easeOutQuart best, easeOutCirc, easeOutCirc, easeOutExpo, easeOutCubic N2, easeOutQuint
			if(cis_animation_type == 'css3') {
				this.cis_clear_quee($img_holder);
				var speed_time_css3 = speed_time + 'ms';
				var cis_effect_touchMove = 'cubic-bezier(0.165, 0.840, 0.440, 1.000)';
				this.cis_make_css3_movement($img_holder, speed_time_css3, cis_effect_touchMove, new_l);
			} else {
				$img_holder.stop(true,false).animate({
					'margin-left':new_l
				},speed_time,'easeOutQuart');
			}

			// set variables
			var screen_w = parseFloat($img_holder.parent('div').width());
			var total_w = parseFloat($img_holder.width());
			var touch_animate_to_point = $images_row.attr("touch_animate_to_point");

			// // make touch end drag effect
			if(cis_inf_scrolling == 0 && (touch_animate_to_point == 1 || touch_animate_to_point == 2)) {

				$images_row.addClass("cis_dragging");

				var new_l = touch_animate_to_point == 1 ? 0 : screen_w - total_w;
				var animate_to_point_time = 600;

				if(cis_animation_type == 'css3') {
					this.cis_clear_quee($img_holder);
					var animate_to_point_time_css3 = animate_to_point_time + 'ms';
					var cis_effect_eaceOutBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
					this.cis_make_css3_movement($img_holder, animate_to_point_time_css3, cis_effect_eaceOutBack, new_l);
				} else {
					$img_holder.stop(true,false).animate({
						'margin-left':new_l
					},animate_to_point_time,'easeOutBack');
				}

				clearTimeout(this.cis_remove_dragging_class_timeout);
				this.cis_remove_dragging_class_timeout = setTimeout(function() {
					$images_row.removeClass("cis_dragging");
					$images_row.find('.cis_images_holder ').removeClass("cis_scrolling");
					$images_row.attr("touch_animate_to_point","0");
				},animate_to_point_time);

				return;
			}

			// set move direction
			var cis_move_direction = speed >= 0 ? 1 : 0;
			$img_holder.attr("cis_move_direction",cis_move_direction);
			$wrapper.attr("cis_move_direction",cis_move_direction);

			// hide overlays
			$images_row.find('.cis_row_item').addClass('reset_enabled');
			this.cis_hide_overlays();
			$wrapper.find('.cis_row_item').removeClass('cis_item_mouseentered');

			$images_row.addClass("cis_dragging");

			//check end position condition
			if(cis_inf_scrolling == 0 && (new_l > 0 || (Math.abs(new_l) + 1 * screen_w >= total_w))) {

				this.cis_touch_calculate_end_point_speed();

				clearInterval(this.cis_touch_end_position_interval);
				this.cis_touch_end_position_interval = setInterval(function() {
					this.cis_check_touch_end_point();
				}.bind(this), 20);
			}

			clearTimeout(this.cis_remove_dragging_class_timeout);
			this.cis_remove_dragging_class_timeout = setTimeout(function() {
				$images_row.removeClass("cis_dragging");
				$images_row.find('.cis_images_holder').removeClass("cis_scrolling");
			},speed_time);

			//check if autoplay enabled

			// get autoplay data
			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay = parseInt(slider_data_array[3]);
			var slider_autoplay_evenly_speed = parseInt(slider_data_array[6]);

			if(slider_autoplay == 1 && Math.abs(distance) > 10) {
				this.cis_touch_start_autoplay();
			}
		};

		this.cis_check_touch_end_point = function() {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;
			var cis_inf_scrolling = this.options.inf_scroll_enabled;

			var $img_holder = $wrapper.find('.cis_images_holder');
			var $images_row = $wrapper.find('.cis_images_row');

			var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($img_holder,'translate_x') : parseInt($img_holder.css("margin-left"));
			var screen_w = parseInt($img_holder.parent('div').width());
			var total_w = parseInt($img_holder.width());

			if(cur_l >= 0 || (Math.abs(cur_l) + 1 * screen_w >= total_w)) {
				clearInterval(this.cis_touch_end_position_interval);
				clearInterval(this.cis_end_point_speed_interval);

				var end_point_size = this.cis_end_point_speed == 10000 ? 250 : this.cis_end_point_speed;
				var end_pos_max = 750;
				end_point_size = end_point_size > end_pos_max ? end_pos_max : end_point_size;
				if(cur_l >= 0) {
					var new_l = cur_l + end_point_size * 0.15;
					var end_pos = 0;
				}
				else {
					var new_l = cur_l - end_point_size * 0.15;
					var end_pos = screen_w - total_w;
				}

				var f_time = 200 + end_point_size * 0.15;
				//good effects:  easeOutCubic
				var last_effect = cis_animation_type == 'css3' ? 'cubic-bezier(0.250, 0.460, 0.450, 0.940)' : 'easeOutQuad';

				if(cis_animation_type == 'css3') {
					this.cis_clear_quee($img_holder);

					f_time_css3 = f_time + 'ms';
					this.cis_make_css3_movement($img_holder, f_time_css3, last_effect, new_l);
					setTimeout(function() {
						var cis_effect_eaceOutBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
						this.cis_make_css3_movement($img_holder, '600ms', cis_effect_eaceOutBack, end_pos);
					}.bind(this), f_time);
				} else {
					$img_holder.stop(true,false).animate({
						'margin-left' : new_l
					},f_time,last_effect, function() {
						$img_holder.stop(true,false).animate({
							'margin-left' : end_pos
						},600,'easeOutBack');
					});
				}
			}
		};

		this.cis_touch_calculate_end_point_speed = function() {
			clearInterval(this.cis_end_point_speed_interval);
			this.cis_end_point_ml_start = [];
			this.cis_end_point_speed_array = [];
			this.cis_end_point_speed_index = 0;
			this.cis_speed_check_index = 0;
			this.cis_end_point_speed = 10000;

			this.cis_end_point_speed_interval = setInterval(function() {this.cis_end_point_calculate_speed();}.bind(this), 20);
		};

		this.cis_end_point_calculate_speed = function() {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;

			this.cis_end_point_ml_start[this.cis_end_point_speed_index] = cis_animation_type == 'css3' ? this.cis_getTransform($wrapper.find('.cis_images_holder'),'translate_x') : parseInt($wrapper.find('.cis_images_holder').css('margin-left'));
			this.cis_end_point_create_speed(this.cis_end_point_speed_index);
			this.cis_end_point_speed_index ++
		};

		this.cis_end_point_create_speed = function(index) {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;

			this.cis_speed_timeout = setTimeout(function() {
				var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($wrapper.find('.cis_images_holder'),'translate_x') : parseInt($wrapper.find('.cis_images_holder').css('margin-left'));
				var speed_0 = Math.abs(cur_l - this.cis_end_point_ml_start[index]) * 1000 / this.cis_end_point_speed_step_time;
				this.cis_end_point_speed = isNaN(speed_0) ? this.cis_end_point_speed : speed_0;
			}.bind(this), this.cis_end_point_speed_step_time);
		};

		// autoplay
		this.cis_touch_start_autoplay = function() {
			var $wrapper = this.wrapper;

			var slider_data = $wrapper.find('.cis_moving_data').html();
			var slider_data_array = slider_data.split(',');
			var slider_autoplay_evenly_speed = parseInt(slider_data_array[6]);

			var slider_evenly_autoplay_step_time = 400;
			var cis_autoplay_speed = parseFloat(slider_autoplay_evenly_speed * 1000 / slider_evenly_autoplay_step_time);

			clearInterval(this.cis_final_speed_interval);
			this.cis_final_ml_start = [];
			this.cis_final_speed_array = [];
			this.cis_final_speed_index = 0;
			this.cis_speed_check_index = 0;
			this.cis_final_speed = 10000;

			this.cis_final_speed_interval = setInterval(function() {this.cis_final_calculate_speed();}.bind(this),20);

			clearTimeout(this.cis_check_speeds_timeout);
			this.cis_check_speeds_timeout = setTimeout(function() {
				this.cis_check_speeds(cis_autoplay_speed);
			}.bind(this), 200);
		};

		this.cis_final_calculate_speed = function() {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;

			this.cis_final_ml_start[this.cis_final_speed_index] = cis_animation_type == 'css3' ? this.cis_getTransform($wrapper.find('.cis_images_holder'),'translate_x') : parseInt($wrapper.find('.cis_images_holder').css('margin-left'));

			this.cis_final_create_speed(this.cis_final_speed_index);
			this.cis_final_speed_index ++;
		};

		this.cis_final_create_speed = function(index) {
			var $wrapper = this.wrapper;
			var cis_animation_type = this.options.cis_animation_type;

			this.cis_speed_timeout = setTimeout(function() {
				var cur_l = cis_animation_type == 'css3' ? this.cis_getTransform($wrapper.find('.cis_images_holder'),'translate_x') : parseInt($wrapper.find('.cis_images_holder').css('margin-left'));
				var speed_0 = Math.abs(cur_l - this.cis_final_ml_start[index]) * 1000 / this.cis_final_speed_step_time;
				this.cis_final_speed = isNaN(speed_0) ? this.cis_final_speed : speed_0;

			}.bind(this), this.cis_final_speed_step_time);
		};

		this.cis_check_speeds = function(cis_autoplay_speed) {
			var $wrapper = this.wrapper;

			this.cis_speed_check_index ++;
			if(this.cis_speed_check_index > 1000) {
				clearInterval(this.cis_final_speed_interval);
				this.cis_final_ml_start = [];
				this.cis_final_speed_array = [];
				this.cis_final_speed_index = 0;
				return;
			}

			if(this.cis_final_speed > cis_autoplay_speed * 2) {
				setTimeout(function() {
					this.cis_check_speeds(cis_autoplay_speed);
				}.bind(this), 20);
				return;
			}
			else {
				clearInterval(this.cis_final_speed_interval);
				this.cis_final_ml_start = [];
				this.cis_final_speed_array = [];
				this.cis_final_speed_index = 0;
				this.cis_speed_check_index = 0;

				this.cis_final_start_touch_autoplay();
			}
		};

		this.cis_final_start_touch_autoplay = function() {
			var $wrapper = this.wrapper;
			var $images_row = $wrapper.find('.cis_images_row');

			$images_row.removeClass("cis_dragging");
			$images_row.find('.cis_images_holder').removeClass("cis_scrolling");

			this.cis_make_evenly_autoplay_restart(0);
		};

// backlink ///////////////////////////////////////////////////////////////////////////////////////////

		this.cis_make_backlinks = function() {
			$wrapper = this.wrapper;
			var cis_back_htm = '<div style="display: block !important;z-index: 1;font-weight: normal;padding: 3px 10px 3px 8px;line-height: 20px;background-color: #000;color: #fff;position: absolute;right: 0px;font-style: italic;font-size: 12px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;bottom: 0px;opacity: 0;background-image: linear-gradient(to bottom,#000000,#383838) !important;text-shadow: 0 3px 3px #000000;border: 1px solid rgb(0, 0, 0);border-top: 0;">By <a style="font-weight: bold;color: rgb(72, 108, 253);" href="http://creative-solutions.net/joomla/creative-image-slider" target="_blank">Creative Image Slider</a></div>';
			$wrapper.append(cis_back_htm);
			var $back = $wrapper.children('div').last();
			var h = parseInt($back.height()) + 7*1;
			$back.attr('h',h);

			this.cis_show_back_canvas($back);
		};

		this.cis_show_back_canvas = function($back) {
			var h = -1* parseInt($back.attr('h'));
			$back.stop(true,false).animate({
				'bottom': h,
				'opacity': '0.95'
			},'swing');
		};

		this.cis_hide_back_canvas = function($back) {
			$back.stop(true,false).animate({
				'bottom': '0',
				'opacity': '0'
			},'swing');
		};

// CSS3 MOVE FUNCTIONS //////////////////////////////////////////////////////////////////////////////

		this.cis_getTransform = function(obj,prop) {
			var matrix = obj.css("-webkit-transform") ||
				obj.css("-moz-transform")    ||
				obj.css("-ms-transform")     ||
				obj.css("-o-transform")      ||
				obj.css("transform");

			if(matrix !== 'none') {
				var values = matrix.split('(')[1].split(')')[0].split(',');
				// var a = values[0];
				// var b = values[1];
				// var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
				if(prop == 'translate_x')
					var transformX = values[4];
				else
					var transformX = 0;
			} else { var transformX = 0; }
			return parseInt(transformX);
		};

		this.cis_clear_quee = function($wrapper){
			var left_ind = this.cis_getTransform($wrapper,'translate_x');
			$wrapper.css({
				'-webkit-transition': 'none',
				'-moz-transition': 'none',
				'-o-transition': 'none',
				'-ms-transition': 'none',
				'transition': 'none',

				'-webkit-transform' : 'translate(' + left_ind + 'px,0px)',
				'-moz-transform' : 'translate(' + left_ind + 'px,0px)',
				'-ms-transform' : 'translate(' + left_ind + 'px,0px)',
				'-o-transform' : 'translate(' + left_ind + 'px,0px)',
				'transform' : 'translate(' + left_ind + 'px,0px)'
			});
		};

		this.cis_make_css3_movement = function($wrapper, time, ease_effect, distance) {
			if(!this.cis_make_css3_movement_enabled)
				return;

			if(ease_effect == 'none') {
				$wrapper.css({
					'-webkit-transition': 'none',
					'-moz-transition': 'none',
					'-o-transition': 'none',
					'-ms-transition': 'none',
					'transition': 'none',


					'-webkit-transform' : 'translate(' + distance + 'px,0px)',
					'-moz-transform' : 'translate(' + distance + 'px,0px)',
					'-ms-transform' : 'translate(' + distance + 'px,0px)',
					'-o-transform' : 'translate(' + distance + 'px,0px)',
					'transform' : 'translate(' + distance + 'px,0px)'
				});
			} else {
				$wrapper.css({
					'-webkit-transition': '-webkit-transform '+ time +' '+ ease_effect + '',
					'-moz-transition': '-moz-transform '+ time +' '+ ease_effect + '',
					'-o-transition': '-o-transform '+ time +' '+ ease_effect + '',
					'-ms-transition': '-ms-transform '+ time +' '+ ease_effect + '',
					'transition': 'transform '+ time +' '+ ease_effect + '',

					'-webkit-transform' : 'translate(' + distance + 'px,0px)',
					'-moz-transform' : 'translate(' + distance + 'px,0px)',
					'-ms-transform' : 'translate(' + distance + 'px,0px)',
					'-o-transform' : 'translate(' + distance + 'px,0px)',
					'transform' : 'translate(' + distance + 'px,0px)'
				});
			}
		};

// END CSS3 MOVE FUNCTIONS //////////////////////////////////////////////////////////////////////////

// call init function ///////////////////////////////////////////////////////////////////////////////
		this.init();
	};

})(jQuery);