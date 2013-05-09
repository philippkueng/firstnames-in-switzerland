(function(jQuery){
  jQuery(function(){

    var searchYear = 1912;
    var currentName = null;
		var currentSex = null;
		var currentPosition = 1;
		var mostPopularFemaleName = '';
		var mostPopularMaleName = '';
		
		
		var initiateNewYear = function(){
			console.log('getting the most popular female and male firstname of the year ' + searchYear);			
			
      jQuery('#search_to_year option[value="' + searchYear + '"]').attr('selected', 'selected');
      jQuery('#search_from_year option[value="' + searchYear + '"]').attr('selected', 'selected');
			jQuery("#top20_btn").click();
		};
		
		
		var initiatePageProcessing = function(){
			switch(currentSex){
				case 'male':
					currentSex = 'female';
					currentName = mostPopularFemaleName;
					jQuery('#sex_choose ul li:nth-child(4) input').attr('checked', 'checked');
					break;
				case 'female':
					currentSex = null;
					currentName = null;
					if(searchYear === 2011){
						console.log('DONE SCRAPING');
					} else {
						searchYear = searchYear + 1;
						initiateNewYear();						
					}
					break;
				default:
					currentSex = 'male';
					currentName = mostPopularMaleName;
					jQuery('#sex_choose ul li:nth-child(2) input').attr('checked', 'checked');
					break;
			}
			
			jQuery('input#search_name').val(currentName);
			jQuery('#search_button').click();
		};
		

    var processPage = function(){
      jQuery('#search_result tr td a.name_link').each(function(key, value){
        jQuery.getJSON('http://localhost:3000/firstnames/create?callback=?', {
          name: jQuery(value).text(),
          rank: jQuery(value).parent().parent().find('td:first').text(),
          count: jQuery(value).parent().parent().find('td.total_right>div').text(),
          sex: currentSex,
		  		year: searchYear ? searchYear : 'index'
        }, function(data){
          console.log('saved #' + jQuery(value).parent().parent().find('td:first').text() + ' - ' + jQuery(value).text() + ' - Year: ' + searchYear);
        });
      });

      setTimeout(function(){
				// check if there are still some getting displayed, otherwise switch to year or increase year number
        if(jQuery('#search_result table.search tr').length > 4){
            // var data = jQuery('#search_result table.search tr:last td a.pages').attr("attr-data");
						currentPosition += 20;
						var data = 'name=' + currentName + '&search_from_year=' + searchYear + '&search_to_year=' + searchYear + '&sex=' + (currentSex === 'male' ? 1 : 2) + '&pos=' + currentPosition + '&to_pos=' + (currentPosition + 20);
            do_search_request(data);
        } else {
					currentPosition = 1;
					initiatePageProcessing();				
        }
      }, 3000);
    };
    

		// slightly extended version of the do_search_request() function within common.js from the provider
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

   
		// slightly extended version of the search() function within common.js from the provider
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
              
							processPage();
            }
          }
        });
    }
    window.search = this.search;

		
		jQuery("#top20_btn").die(); // remove the listener set up by the provider

		// customized on-click event
		jQuery("#top20_btn").live('click', function(e){
			e.preventDefault();
			jQuery(this).addClass('bold');
			jQuery("#search_btn").removeClass('bold');
			jQuery("#search_block").fadeOut('slow', function(){
				jQuery("#top_to_year").val(searchYear);
				jQuery("#top_from_year").val(searchYear);
				jQuery.ajax({
					url: 'index.php?route=statistic/search/top',
					type: 'post',
					data: jQuery('#top_form select'),
					dataType: 'json',
					cache: false,
					beforeSend: function() {
						jQuery("#top20_block").fadeIn('slow');
					},
					success: function(json) {
						jQuery('#top20').html(json['html']);
						
						// set mostPopularFemaleName and mostPopularMaleName
						console.log('setting the most popular names');
						mostPopularFemaleName = jQuery('div#top20>table.table_top20 tr:nth-child(3) td:nth-child(2) table.top20_grid tr.border:first td:nth-child(2)').text();
						mostPopularMaleName = jQuery('div#top20>table.table_top20 tr:nth-child(3) td:first table.top20_grid tr.border:first td:nth-child(2)').text();
						console.log('female name ' + mostPopularFemaleName);
						console.log('male name ' + mostPopularMaleName);
						
						// switching back to firstname & year view.
						jQuery('#search_btn').click();
						
						initiatePageProcessing();
					}
				});
			});
		});

		initiateNewYear();
  });
})(jQuery);

