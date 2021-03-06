/* datasource-images.js */

APP.factory(
	'Images', 
function (
	Notifications,
	Loader
) {

	var Self = {};

	Self.Group = {};

	Self.DS = new kendo.data.DataSource({
		transport: {
			read: {
				url: '/wp-json/poeticsoft/woo-images-read',
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				processData: false
			},
			destroy: {
				url: '/wp-json/poeticsoft/woo-images-remove',
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				processData: false
			},
			parameterMap: function (Data) { return JSON.stringify(Data); }
		},
		schema: {
			model: {
				id: 'name',
				fields: {
					ordername: { type: 'string', editable: false },
					thumb: { type: 'string', editable: false },
					name: { type: 'string', editable: false },
					size: { type: 'string', editable: false },
					date: { type: 'date', editable: false },
					sku: { type: 'string', editable: false },
					attid: { type: 'string', editable: false }
				}
			},
			data: 'Data',
			errors: function (Response) {

				if (Response.Status.Code == 'KO') { return Response.Status.Reason; }
				return null;
			}
		},
		group: { 
			field: 'sku',
			aggregates: [
				{ 
					field: 'sku', 
					aggregate: 'count' 
				}
			]
		},
		sort: [
			{
				field: 'ordername',
				dir: 'asc'
			},	
			{
				field: 'sku',
				dir: 'asc'
			}
		],	
		error: Notifications.show,
		change: function() {

			Self.Group = {};
			
			this.view().forEach(function(G){

				Self.Group[G.value] = {
					count: G.items.length,
					items: G.items
				}
			});
		},
		requestEnd: function(E) {			

			Loader.ready('Images');
		}
	});

  return Self;
});
        