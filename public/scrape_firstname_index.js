(function(jQuery){
  jQuery(function(){

    var processPage = function(){
      jQuery('#search_result tr td a.name_link').each(function(key, value){
        jQuery.getJSON('http://localhost:3000/firstnames/create?callback=?', {
          name: jQuery(value).text(),
          rank: jQuery(value).parent().parent().find('td:first').text(),
          count: jQuery(value).parent().parent().find('td.total_right>div').text()
        }, function(data){
          console.log('saved #' + jQuery(value).parent().parent().find('td:first').text() + ' - ' + jQuery(value).text());
        });
      });

      setTimeout(function(){
        if(jQuery('#search_result table.search tr:last td a.pages')){
          var data = jQuery('#search_result table.search tr:last td a.pages').attr("attr-data");
          do_search_request(data);
        }
      }, 3000);
    };

    this.do_search_request = function(data) {
        // if(AutoComplete) {
        //     AutoComplete.hide();
        // }
        // Search = true;
        jQuery.ajax({
            url: 'index.php?route=statistic/search/search',
            type: 'post',
            data: data,
            dataType: 'json',
            cache: false,
            beforeSend: function() {
                jQuery('#sex_choose').css('display','none');
                jQuery('#sex_choose input[type=\'radio\']').attr('checked',false);
                jQuery('#search_result').empty();
                jQuery('#search_button').attr('disabled', true);
                jQuery('#reset_button').attr('disabled', true);
                if(jQuery('#reset_button').length > 0) {
                    jQuery('#reset_button').after('<span class="wait">&nbsp;<img src="catalog/view/theme/default/image/loading.gif" alt="" /></span>');
                } else {
                    jQuery('#search_button').after('<span class="wait">&nbsp;<img src="catalog/view/theme/default/image/loading.gif" alt="" /></span>');
                }
            },  
            complete: function() {
                jQuery('#search_button').attr('disabled', false);
                jQuery('#reset_button').attr('disabled', false);
                jQuery('.wait').remove();
            },      
            success: function(json) {
                jQuery('.error').remove();
                if (json['error']) {
                    var error = '';
                    for(e in json['error']) {
                        error += json['error'][e] + '<br />';
                    }
                    jQuery('#search_form').prepend('<div class="error" style="display: none;">' + error + '</div>');
                    jQuery('.error').fadeIn('slow');
                    Search = false;
                } else if(json['sex_choose']) {
                    jQuery('#sex_choose').fadeIn();
                } else {
                    var year_str = "&search_from_year=" + jQuery("#search_form input[name='search_from_year']").val();
                    year_str += "&search_to_year=" + jQuery("#search_form input[name='search_to_year']").val();
                    jQuery('#search_result').html(json['html']);
                    // Search = false;

                    // execute some scraper code
                    processPage();
                }
            }
        }); 
    };
    window.do_search_request = this.do_search_request;

    processPage();
  });
})(jQuery);

