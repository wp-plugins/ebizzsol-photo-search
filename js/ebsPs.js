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
    }).keypress(function(e){
        if ( 13 == e.which ) {
            ebsPsJsSearch(1);
            e.preventDefault();
            return false;
        }
    });
    
    $j('#ebsPsSearch').click(function(e){
        ebsPsJsSearch(1);
        e.preventDefault();
        return false;
    });
    
});

var ebsPsBusy = false;
function ebsPsJsSearch(cur) {
    
    cur = parseInt(cur);
    if(ebsPsBusy) return;
    ebsPsBusy = true;
    $j('#ebsPsLoader').fadeIn();
    $j.getJSON("http://api.flickr.com/services/rest/?api_key=1b21384bd8bc85c3b67e667e8a076e58&method=flickr.photos.search&per_page=30&sort=relevance&text="+escape($j('#ebsPsSearchTerm').val())+"&page="+cur+"&extras=owner_name&format=json&jsoncallback=?",
    function(data){
        
        var total = data.photos.total;
        var page = Math.ceil(total/30);
        
        $j('#ebsPsLoader').fadeOut();
        $j('#ebsPsImages').empty();
        $j.each(data.photos.photo, function(i,item){
            var ebsPsImg = 'http://farm'+item.farm+'.static.flickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_s.jpg';
            var ebsPsImgURI = item.owner+'/'+item.id;
            var ebsPsTitle = item.title+' by '+item.ownername;
            
            $j("<img/>").attr("src", ebsPsImg).attr("alt", ebsPsTitle).bind('click', function(){
                
                var imgHtml = $j("<p>").append($j("<img/>").attr("src", ebsPsImg.replace('_s.jpg', $j('#ebsPsSize').val()+'.jpg')).attr("alt", ebsPsTitle)).html();
                
                //ebsPsTitle = $j("<a>").attr("href", ebsPsImgURI).html(ebsPsTitle);
                ebsPsTitle = $j("<p>").append(ebsPsTitle).html();
                
                imgHtml = $j("<a>").attr("href", ebsPsImg.replace('_s.jpg', '.jpg')).attr("title", ebsPsTitle).attr("class", 'ebsPsImg').attr("rel", ebsPsGrp).attr("rev", ebsPsImgURI).html(imgHtml);
                imgHtml = $j("<p>").append(imgHtml).html();
                
                if( (typeof tinyMCE != "undefined") && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden() ) {
                    tinyMCE.execCommand("mceInsertContent",false, imgHtml);
                } else {
                    $j('#content').insertAtCaret(imgHtml);
                }
            }).appendTo("#ebsPsImages");
        });
        
        if(page>1) {
            var pagination = $j("<div>").addClass('ebsPsPagination');
            
            var i;
            // Prev Button
            i = cur-1;
            if(i==0) {
                pagination.append($j("<span>").html('&laquo;').addClass('this-page con'));
                pagination.append($j("<span>").html('&#139;').addClass('this-page con'));
            } else {
                pagination.append($j("<a>").attr("href", 'javascript://').attr("onclick", 'ebsPsJsSearch(1)').html('&laquo;'));
                pagination.append($j("<a>").attr("href", 'javascript://').attr("onclick", 'ebsPsJsSearch('+i+')').html('&#139;'));
            }
            
            var c = 0;
            var s = cur - 5;
            if(s < 1) s = 1;
            for(i = s; (i <= page) && (c < 11); ++i, c++) {
                if(i==cur) {
                    var tmp = $j("<span>").html(i).addClass('this-page');
                } else {
                    var tmp = $j("<a>").attr("href", 'javascript://').attr("onclick", 'ebsPsJsSearch('+i+')').html(i);
                }
                
                pagination.append(tmp);
            }
            
            // Next Button
            i = cur+1;
            if(cur==page) {
                pagination.append($j("<span>").html('&raquo;').addClass('this-page con'));
                pagination.append($j("<span>").html('&#155;').addClass('this-page con'));
            } else {
                pagination.append($j("<a>").attr("href", 'javascript://').attr("onclick", 'ebsPsJsSearch('+i+')').html('&#155;'));
                pagination.append($j("<a>").attr("href", 'javascript://').attr("onclick", 'ebsPsJsSearch('+page+')').html('&raquo;'));
            }
            
            pagination.appendTo("#ebsPsImages");
        }
        
    });
    ebsPsBusy = false;
    return false;
}

function rand(n) {
     return Math.floor(Math.random() * n);
}