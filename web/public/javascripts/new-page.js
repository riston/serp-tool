$(document).ready(function() {

	function addBlock() {
		$('#groupTpl').tmpl().appendTo($('p.group-text'));	
	}
	
	$('.add-group').click(function(e) {
		e.preventDefault();
		addBlock();
	});

	$('form').on('click', '.remove-group', function(e) {
		e.preventDefault();
		$(this).closest('.group').remove();
	});

	addBlock();
});