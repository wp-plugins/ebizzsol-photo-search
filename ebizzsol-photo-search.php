<?php
/*
Plugin Name: eBizzSol Photo Search
Plugin URI: http://eBizzSol.com/
Description: A Photo Search Plugins for WordPress.
Version: 0.0.1
Author: eBizzSol
Author URI: http://eBizzSol.com/
*/
?>
<?php

add_action('init','ebsPs_init');
function ebsPs_init() {
    wp_enqueue_script('thickbox');
    wp_enqueue_style('thickbox');
}

add_action('admin_head', 'ebsPs_wp_head');
function ebsPs_wp_head() {
    echo '<link rel="stylesheet" href="' . get_option('siteurl') . '/wp-content/plugins/ebizzsol-photo-search/css/style.css" type="text/css" />'."\n";
    echo '<script src="' . get_option('siteurl') . '/wp-content/plugins/ebizzsol-photo-search/js/ebsPs.js"></script>'."\n";
}

//add_action('edit_page_form','ebsPs_init');
add_action('admin_init','ebsPs_admin_init');
function ebsPs_admin_init() {
    if(function_exists('add_meta_box')) :
        add_meta_box( 'my-custom-fields', 'eBizzSol Photo Search (<strong class="ebsPsN"><span class="ebsPsF">flick</span><span class="ebsPsR">r</span></strong>)', 'ebsPs_insert_panel', 'post', 'normal', 'high' );
    endif;
}
function ebsPs_insert_panel(){
?>
<div class="ebsPsBox">
    <div class="hide-if-no-js">
        <div class="taghint">Search Term</div>
        <input type="text" value="" autocomplete="off" class="newtag" id="ebsPsSearchTerm" />
        <input type="submit" value="Search" class="button" id="ebsPsSearch" />
    </div>
    <p class="howto">Search Photos from <strong class="ebsPsN"><span class="ebsPsF">flick</span><span class="ebsPsR">r</span></strong>.</p>
</div>
<div id="ebsPsImages"></div>
<?php
}
?>