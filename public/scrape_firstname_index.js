(function(jQuery){
  jQuery(function(){

    var searchYear = null;
    var currentName = 'Roland';

    var processPage = function(){
      jQuery('#search_result tr td a.name_link').each(function(key, value){
        jQuery.getJSON('http://localhost:3000/firstnames/create?callback=?', {
          name: jQuery(value).text(),
          rank: jQuery(value).parent().parent().find('td:first').text(),
          count: jQuery(value).parent().parent().find('td.total_right>div').text(),
          sex: 'male'
        }, function(data){
          console.log('saved #' + jQuery(value).parent().parent().find('td:first').text() + ' - ' + jQuery(value).text() + ' - Year: ' + searchYear);
        });
      });

      setTimeout(function(){
        if(jQuery('#search_result table.search tr:last td').length !== 1000){ // DEBUG - number way to high
            var data = jQuery('#search_result table.search tr:last td a.pages').attr("attr-data");
            do_search_request(data);
        } else {
          if(searchYear && searchYear != 2011){
            searchYear = searchYear + 1;
          } else if(!searchYear) {
            searchYear = 1902;
          }
          
          // set the search_to_year and search_to_from selects
          currentName = jQuery('#search_form table.search input#search_name').val();
          jQuery('#search_to_year option[value="' + searchYear + '"]').attr('selected', 'selected');
          jQuery('#search_from_year option[value="' + searchYear + '"]').attr('selected', 'selected');
          jQuery('#search_button').click();
          // setTimeout(function(){
          //   makeSureResultsExist();
          // }, 10000);
        }
      }, 3000);
    };
    
    var makeSureResultsExist = function(){
      var errorMessage = 'Der Vorname, den Sie angegeben haben, kommt in der Schweizer Bevölkerung weniger als dreimal oder gar nicht vor.';
      if(jQuery('#search_form>div.error').text() === errorMessage){
        // request the next most used name -> do another search()
        jQuery.getJSON('http://localhost:3000/firstnames/' + currentName + '?callback=?', function(data){
          console.log(data);
        });
        
      } else {
        processPage();
      }
    };

    this.do_search_request = function(data) {
        if(AutoComplete) {
            AutoComplete.hide();
        }
        Search = true;
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
                    Search = false;

                    // execute some scraper code
                    processPage();
                }
            }
        }); 
    };
    window.do_search_request = this.do_search_request;
    
    this.search = function(){
        if(AutoComplete) {
            AutoComplete.hide();
        }
        Search = true;
        if(!jQuery("#search_from_year").val() && !jQuery("#search_to_year").val()) {
            jQuery("#search_from_year").val( jQuery("#default_search_from_year").val() );
            jQuery("#search_to_year").val( jQuery("#default_search_to_year").val() );
        }
        var sex_str = '';
        if(jQuery("#search_form input[name='sex']:checked").val() != undefined) {
            sex_str = "&sex=" + jQuery("#search_form input[name='sex']:checked").val();
        }
        jQuery.ajax({
          url: 'index.php?route=statistic/search/search',
          type: 'post',
          data: jQuery('#search_form input[type=\'text\'], #search_form input[type=\'hidden\'], #search_form input[type=\'radio\']:checked, #search_form select'),
          dataType: 'json',
          cache: false,
          async: true,
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
              if(jQuery('#main_search').length > 0) {
                  location = 'index.php?route=statistic/search&q=' + jQuery("#search_form input[type='text']").val() + sex_str + year_str;
              } else {
                  jQuery('#search_result').html(json['html']);
              }
              Search = false;
              
              // execute the scrape for the specific year
              makeSureResultsExist();
            }
          }
        });
    }
    window.search = this.search;

    processPage();
  });
})(jQuery);

