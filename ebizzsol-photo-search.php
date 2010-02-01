<?php
/*
Plugin Name: eBizzSol Photo Search
Plugin URI: http://eBizzSol.com/
Description: A Photo Search Plugins for WordPress.
Version: 0.0.2
Author: Rifat Nabi, Bapin Zaman
Author URI: http://www.vistaarc.com, http://www.ebizzsol.com
*/
?>
<?php

add_action('init','ebsPs_init');
function ebsPs_init() {
    wp_register_script('ebsPsFancybox', WP_PLUGIN_URL . '/ebizzsol-photo-search/fancybox/jquery.fancybox-1.2.6.pack.js');
    wp_register_script('ebsPsFront', WP_PLUGIN_URL . '/ebizzsol-photo-search/js/ebsPsFront.js');
    wp_enqueue_script('jquery');
    wp_enqueue_script('ebsPsFancybox');
    wp_enqueue_script('ebsPsFront');
    
    wp_register_style('ebsPsFancybox', WP_PLUGIN_URL . '/ebizzsol-photo-search/fancybox/jquery.fancybox-1.2.6.css');
    wp_enqueue_style('ebsPsFancybox');
        
}

//add_action('edit_page_form','ebsPs_init');
add_action('admin_head','ebsPs_admin_head');
function ebsPs_admin_head() {
    global $post_ID;
    
echo <<< EOF
    <script type="text/javascript">
        var ebsPsGrp = 'ebsPsG$post_ID';
    </script>
EOF;

}

add_action('admin_init','ebsPs_admin_init');
function ebsPs_admin_init() {
    if(function_exists('add_meta_box')) :
        add_meta_box( 'ebsPsFields', 'eBizzSol Photo Search (<strong class="ebsPsN"><span class="ebsPsF">flick</span><span class="ebsPsR">r</span></strong>)', 'ebsPs_insert_panel', 'post', 'normal', 'high' );
        
        wp_register_script('ebsPsMain', WP_PLUGIN_URL . '/ebizzsol-photo-search/js/ebsPs.js');
        wp_enqueue_script('ebsPsMain');
        
        wp_register_style('ebsPsCss', WP_PLUGIN_URL . '/ebizzsol-photo-search/css/style.css');
        wp_enqueue_style('ebsPsCss');
        
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
<div id="ebsPsLoader" style="display: none;"><img src="<?php echo WP_PLUGIN_URL; ?>/ebizzsol-photo-search/images/loader.gif" alt="Loading.." /></div>
<div id="ebsPsImages"></div>
<?php
}
?>