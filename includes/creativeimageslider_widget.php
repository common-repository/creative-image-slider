<?php

// no direct access!
defined('ABSPATH') or die("No direct access");

class creativeimageslider_widget extends WP_Widget {

  // Constructor //
  function __construct() {
    $widget_ops = array(
      'classname' => 'creativeimageslider_widget',
      'description' => 'Add Creative Image Slider widget.'
    ); // Widget Settings
    $control_ops = array('id_base' => 'creativeimageslider_widget'); // Widget Control Settings
    WP_Widget::__construct('creativeimageslider_widget', 'Creative Image Slider', $widget_ops, $control_ops); // Create the widget
  }

  // Extract Args
  function widget($args, $instance) {
    extract($args);
    $title = apply_filters('widget_title', $instance['title']);
    // Before widget
    echo $before_widget;
    // Title of widget
    if ($title) {
      echo $before_title . $title . $after_title;
    }
    // the widget content
	
    wpcis_enqueue_front_scripts($instance['slider_id']);
    echo $cis_rendered_content = wpcis_render_slider($instance['slider_id']);
    
    
    // After widget
    echo $after_widget;
  }

  // Update Settings //
  function update($new_instance, $old_instance) {
    $instance['title'] = $new_instance['title'];
    $instance['slider_id'] = $new_instance['slider_id'];
    return $instance;
  }

  // Widget Control Panel //
  function form($instance) {
    $defaults = array(
      'title' => '',
      'slider_id' => 0
    );
    $instance = wp_parse_args((array)$instance, $defaults);
    global $wpdb; ?>
  <p>
    <label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
    <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
           name="<?php echo $this->get_field_name('title'); ?>'" type="text" value="<?php echo $instance['title']; ?>"/>
    <label for="<?php echo $this->get_field_id('slider_id'); ?>">Select a Slider:</label>
    <select name="<?php echo $this->get_field_name('slider_id'); ?>'" id="<?php echo $this->get_field_id('slider_id'); ?>"
            style="width:225px;text-align:center;">
      <option style="text-align:center" value="0">- Select a Slider -</option>
      <?php
      $ids_creativeimageslider = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "cis_sliders order by `id` DESC", 0);
      foreach ($ids_creativeimageslider as $arr_creativeimageslider) {
        ?>
        <option value="<?php echo $arr_creativeimageslider->id; ?>" <?php if ($arr_creativeimageslider->id == $instance['slider_id']) {
          echo "SELECTED";
        } ?>><?php echo $arr_creativeimageslider->name; ?></option>
        <?php }?>
    </select>
  <?php
  }
}

function creativeimageslider_register_widget() {
  return register_widget("creativeimageslider_widget");
}
add_action( 'widgets_init', 'creativeimageslider_register_widget' );
?>