$(document).ready(function() {			
	// Show tooltips on questions
	// $(".thumbs .thumb").mouseenter(function(event) {
	// 	tip = $(this).attr("name");
	// 				
	// 	$(this).qtip({
	// 		content: tip,
	// 		position: {
	// 			corner: {
	// 				target: 'topMiddle',
	// 				tooltip: 'bottomMiddle'
	// 			}
	// 		},
	// 		style: { 
	// 			name: 'cream',
	// 			border: {
	// 				width: 2,
	// 				radius: 4
	// 			},
	// 			tip: {
	// 				corner: 'bottomMiddle',
	// 				size: {
	// 					x: 18,
	// 					y: 10
	// 				}
	// 			}
	// 		},
	// 		show: { ready: true }
	// 	});
	// });
	

					
		$(".thumbs .thumb").qtip({
			content: $(this).attr("name"),
			position: {
				corner: {
					target: 'topMiddle',
					tooltip: 'bottomMiddle'
				}
			},
			style: { 
				name: 'cream',
				textAlign: 'center',
				background: '#333',
				color: '#fff',
				border: {
					width: 1,
					radius: 4,
					color: '#333'
				},
				tip: {
					corner: 'bottomMiddle',
					size: {
						x: 18,
						y: 10
					}
				}
			},
			show: 'mouseover',
			hide: 'mouseout'
		});

});