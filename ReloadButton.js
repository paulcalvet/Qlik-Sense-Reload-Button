define(["jquery", "qlik", "text!./lib/css/reload_btn.css"], function($, qlik, cssContent) {

    var header0_item1 = {
    ref: "props.section0.item1",
    expression: "optional",
    label: "Host name",
    type: "string"
    };

    var header0_item2 = {
    ref: "props.section0.item2",
    expression: "optional",
    label: "Port",
    type: "string"
    };

    var header0_item3 = {
    ref: "props.section0.item3",
    expression: "optional",
    label: "Owner",
    type: "string"
    };

    var header1_item1 = {
    ref: "props.section1.item1",
    expression: "optional",
    label: "SSE",
    type: "string"
    };

    var header2_item1 = {
    ref: "props.section2.item1",
    expression: "optional",
    label: "Confirmation message",
    type: "string"
    };

    var header2_item2 = {
    ref: "props.section2.item2",
    expression: "optional",
    label: "Success message",
    type: "string"
    };

    var header2_item3 = {
    ref: "props.section2.item3",
    expression: "optional",
    label: "Failed message",
    type: "string"
    };

    var header3_item1 = {
    ref: "myproperties.border",
    type: "boolean",
    component: "switch",
    label: "Reload type",
    options: [{
        value: true,
        label: "Partial Reload"
        }, {
        value: false,
        label: "Full Reload"
        }],
    defaultValue: true
    };


    var header4_item1 = {
    ref: "props.section4.item1",
    expression: "optional",
    label: "Button text",
    type: "string"
    };

    $("<style>").html(cssContent).appendTo("head");

	return {

        definition: {
            type: "items",
            component: "accordion",
            items: {

            appearance: {
                uses: "settings"
            },

            addons: {
				uses: "addons",

                    items: {
                        header0: {
                            type: "items",
                            label: "Query parameters",
                            items: {
                                header0_item1: header0_item1,
                                header0_item2: header0_item2,
                                header0_item3: header0_item3
                                }
                            },
                        header1: {
                            type: "items",
                            label: "SSE Function",
                            items: {
                                header1_item1: header1_item1
                                }
                            },
                        header2: {
                            type: "items",
                            label: "Message",
                            items: {
                                header2_item1: header2_item1,
                                header2_item2: header2_item2,
                                header2_item3: header2_item3
                                }
                            },
                        header3: {
                            type: "items",
                            label: "Reload Option",
                            items: {
                                header3_item1:header3_item1

                            }
                        },
                        header4: {
                            type: "items",
                            label: "Button Option",
                            items: {
                                header4_item1:header4_item1

                            }
                        }

                    }
                }
            }
        },

        paint: function ($element, layout) {
        var app = qlik.currApp(this);

		//Check if Qlik Sense Desktop or Server
		var isPersonalMode = true;

		var global = qlik.getGlobal();
		global.isPersonalMode( function ( reply ) {
		  isPersonalMode = reply.qReturn;
		});

        // Display Extension Visualization
        var html = html = '<a href="#" id="modal-open" class="btn btn-primary">'+layout.props.section4.item1+'</a>';
        $element.html( html );

			// Open modal
			$("#modal-open").click(function(event) {
				event.preventDefault();

				$(this).blur() ;

                    // Check if modal is displayed
                    if($("#modal-overlay")[0]) return false ;

                    // Add modal overlay
                    $(".qv-panel-sheet").append('<div id="modal-overlay"></div>');
                    $("#modal-overlay").fadeIn("slow");

                    // Add modal panel
                    $(".qv-panel-sheet").append('<div id="modal-content" style="display:none"><div id="modal-message"><h2>'+layout.props.section2.item1+'</h2></div><div id="modal-botton"><a href="#" id="execute-reload" class="btn btn-primary"> OK </a><a href="#" id="modal-close" class="btn btn-danger">Cancel</a></div></div>');
                    $("#modal-content").fadeIn("slow");

                    // Close modal
                    $("#modal-overlay, #modal-close").unbind().click(function(event) {
                        event.preventDefault();
                        $("#modal-content,#modal-overlay").fadeOut("slow", function() {
                            $("#modal-content").remove();
                            $("#modal-overlay").remove();
                        });
                    });

				// Execute reload
				$("#execute-reload").click(function(event) {

                    event.preventDefault();

					// Check if reload is partial
					var isPartial = layout.myproperties.border;

					// Remove modal
					$("#modal-content").remove();

					// Open loader circle
					$("#modal-overlay").append('<div id="loader" class="loader">Loading...</div>');


                    app.createCube({
                    "qInitialDataFetch": [
                        {
                            "qHeight": 20,
                            "qWidth": 1
                        }
                    ],
                    "qDimensions": [],
                    "qMeasures": [
                        {
                            "qDef": {
                                "qDef": layout.props.section1.item1
                            },
                            "qLabel": "GetApplication",
                            "qLibraryId": null,
                            "qSortBy": {
                                "qSortByState": 0,
                                "qSortByFrequency": 0,
                                "qSortByNumeric": 0,
                                "qSortByAscii": 1,
                                "qSortByLoadOrder": 0,
                                "qSortByExpression": 0,
                                "qExpression": {
                                    "qv": " "
                                }
                            }
                        }
                    ],
                    "qSuppressZero": false,
                    "qSuppressMissing": false,
                    "qMode": "S",
                    "qInterColumnSortOrder": [],
                    "qStateName": "$"
                    },GetApplication);


                    function GetApplication(reply, app){

                        var output = reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
                        app.destroySessionObject(reply.qInfo.qId);
                        // Condition OK, Load Data in Qlik Sense
                        if (output == 0) {
                            app.doReload( 0, isPartial, false).then(function(e) {
                                $("#loader").remove();
                                if(e) {
                                    app.doSave();
                                    $("#modal-overlay").append('<div id="modal-content" style="display:none"><div id="modal-message"><h2>'+layout.props.section2.item2+'</h2></div><br><div id="modal-checkbox"><a href="#" id="modal-close" class="btn btn-success">Close</a></div></div>');
                                } else {

                                    $("#modal-overlay").append('<div id="modal-content" style="display:none"><div id="modal-message"><h2>'+layout.props.section2.item3+'</h2></div><br><div id="modal-checkbox"><a href="#" id="modal-close" class="btn btn-danger">Close</a></div></div>');
                                }
                                $("#modal-content").fadeIn("slow");
                            })

                        // Condition KO, failed
                        } else {

                            $("#modal-overlay").append('<div id="modal-content" style="display:none"><div id="modal-message"><h2>Reload failed!</h2></div><br><div id="modal-checkbox"><a href="#" id="modal-close" class="btn btn-danger">Close</a></div></div>');
                            }
                            $("#modal-content").fadeIn("slow");
	                    };

				}); // End Execute reload

			});
		}
	};
});
