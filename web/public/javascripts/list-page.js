$(document).ready(function() {
	var deleteAll = {

		doRequest: function(jobid, cb) {
			$.post(this.url, { 'jobid': jobid }, function(result) {
				return cb(null, result);
			});
		},

		clickListeners: function() {
			var self = this;
			this.buttons.bind('click', function(e) {
				var ref = self.errorTemplate.tmpl().appendTo(self.appendTo);
				var deleteButton = ref.find('button.btn');
				deleteButton.attr('data-jobid', $(this).attr('data-jobid'));

				console.log(deleteButton);
				deleteButton.one('click', function(e) {
					var id = $(this).attr('data-jobid');
					var $alert = $(this).closest('.alert');

					$alert.alert('close');
					// Remove the entry from page
					$button = $('button[data-jobid="' + id + '"]');
					$group = $button.closest('.accordion-group').remove();
					self.doRequest(id, function(err, result) {
						
					});
				});
			});
		},

		init: function() {
			this.buttons = $('button.delete-all');
			this.errorTemplate = $('#errorTpl');
			this.url = '/serp/delete-all';
			this.appendTo = $('h2');
			this.clickListeners();
		}
	};

	deleteAll.init();
});