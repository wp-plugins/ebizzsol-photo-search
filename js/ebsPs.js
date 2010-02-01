var $j = jQuery.noConflict();

$j.fn.insertAtCaret = function (tagName) {
    return this.each(function(){
        if (document.selection) {
            //IE support
            this.focus();
            sel = document.selection.createRange();
            sel.text = tagName;
            //this.focus();
        }else if (this.selectionStart || this.selectionStart == '0') {
            //MOZILLA/NETSCAPE support
            startPos = this.selectionStart;
            endPos = this.selectionEnd;
            scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + tagName + this.value.substring(endPos,this.value.length);
            //this.focus();
            this.selectionStart = startPos + tagName.length;
            this.selectionEnd = startPos + tagName.length;
            this.scrollTop = scrollTop;
        } else {
            this.value += tagName;
            //this.focus();
        }
    });
};

$j(function(){
    var ebsPsScope = $j('div.ebsPsBox');
    $j('div.taghint', ebsPsScope).click(function(){
        $j(this).css('visibility', 'hidden').siblings('.newtag').focus();
    });

    $j('input.newtag', ebsPsScope).blur(function() {
        if( this.value == '' )
            $j(this).siblings('.taghint').css('visibility', '');
    }).focus(function(){
        $j(this).siblings('.taghint').css('visibility', 'hidden');
    }).keyup(function(e){
        if ( 13 == e.which ) {
            ebsPsJsSearch();
            return false;
        }
    }).keypress(function(e){
        if ( 13 == e.which ) {
            ebsPsJsSearch();
            e.preventDefault();
            return false;
        }
    });
    
    $j('#ebsPsSearch').click(function(e){
        ebsPsJsSearch();
        e.preventDefault();
        return false;
    });
    
});

function ebsPsJsSearch() {
    $j.getJSON("http://api.flickr.com/services/rest/?api_key=1b21384bd8bc85c3b67e667e8a076e58&method=flickr.photos.search&per_page=30&sort=relevance&text="+escape($j('#ebsPsSearchTerm').val())+"&extras=owner_name&format=json&jsoncallback=?",
    function(data){
        //alert(data.photos.total);
        $j('#ebsPsImages').empty();
        var ebsPsGrp = 'ebsPsG'+rand(9999);
        $j.each(data.photos.photo, function(i,item){
            var ebsPsImg = 'http://farm'+item.farm+'.static.flickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_s.jpg';
            var ebsPsImgURI = 'http://www.flickr.com/photos/'+item.owner+'/'+item.id+'/';
            var ebsPsTitle = item.title+' by '+item.ownername;
            $j("<img/>").attr("src", ebsPsImg).attr("alt", ebsPsTitle).bind('click', function(){
                
                var imgHtml = $j("<p>").append($j(this).clone()).html();
                
                ebsPsTitle = $j("<a>").attr("href", ebsPsImgURI).html(ebsPsTitle);
                ebsPsTitle = $j("<p>").append(ebsPsTitle).html();
                
                imgHtml = $j("<a>").attr("href", ebsPsImg.replace('_s.jpg', '.jpg')).attr("title", ebsPsTitle).attr("class", 'thickbox').attr("rel", ebsPsGrp).html(imgHtml);
                imgHtml = $j("<p>").append(imgHtml).html();
                
                if( (typeof tinyMCE != "undefined") && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden() ) {
                    tinyMCE.execCommand("mceInsertContent",false, imgHtml);
                } else {
                    $j('#content').insertAtCaret(imgHtml);
                }
            }).appendTo("#ebsPsImages");
        });
    });    
    return false;
}

function rand(n) {
     return Math.floor(Math.random() * n);
}