var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

var url = 'http://ec2-54-228-148-142.eu-west-1.compute.amazonaws.com/index.php?route=statistic/search&q=michael&search_from_year=1902&search_to_year=2011';

console.log('requesting the page');

page.open(url, function(status){
	if(status === "success"){
		console.log('first request was successful');
		setTimeout(function(){
			page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function(){
				console.log('jquery code injection was successful');
				page.evaluate(function(){
					console.log('page evaluation done');
					
					var names = [];
					$('#search_result table tr td a.name_link').each(function(key, value){
						names.push({
							name: $(value).text(),
							rank: $(value).parent().parent().find('td:first').text(),
							count: $(value).parent().parent().find('td.total_right>div').text()
						});
					});
					
					console.log(JSON.stringify(names));
				});
				phantom.exit();
			});		
		}, 10000);
	}
});
