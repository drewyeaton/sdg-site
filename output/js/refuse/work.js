(function($) {
    var app = $.sammy(function() {
        this.element_selector = "#content";
        this.data_element = this.element_selector;
        this.use(Sammy.Template);
        
        
        
        ///////////////////////////////////////////////////////////////////////////////
        // Views
        
        this.get("#/", function(context) {
            $("nav.main li").removeClass("selected");
            $("nav.main li.start-sale").addClass("selected");
            
            $("body").attr("class", "products-page");
            $("#stage").empty();
            
            setup_products = {
                template: "/media/templates/pos/products.template",
                target: "#stage",
                url: "/pos/products/"
            }
            context.products = $(app.data_element).data(setup_products.url);
            
            if(context.products == undefined) { 
                $("nav.main li.start-sale").addClass("loading");
                $.ajax({
                    url: setup_products.url, 
                    dataType: "json",
                    success: function(data) {
                        context.products = data;
                        $(app.data_element).data(setup_products.url, context.products);
                        context.partial(setup_products.template, {}, function(rendered) { $(setup_products.target).html(rendered); });
                    },
                    error: function(data) { app.trigger("error-handler", data.status); },
                    complete: function() { $("nav.main li").removeClass("loading"); }
                });
            } else { context.partial(setup_products.template, {}, function(rendered) { $(setup_products.target).html(rendered); }); }            
            
            app.trigger("render-cart", null);
        });
        
        
        this.get("#/product/:slug", function(context) {
            slug = this.params["slug"];
            
            $("nav.main li").removeClass("selected");
            $("nav.main li.start-sale").addClass("selected");
            
            $("body").attr("class", "product-page");
            $("#stage").empty();
            
            setup_product = {
                template: "/media/templates/pos/product.template",
                target: "#stage",
                url: "/pos/product/" + slug
            }
            context.product = $(app.data_element).data(setup_product.url);
            
            if(context.product == undefined) {
                $("nav.main li.start-sale").addClass("loading");                
                $.ajax({
                    url: setup_product.url, 
                    dataType: "json",
                    success: function(data) {
                        context.product = data;
                        $(app.data_element).data(setup_product.url, context.product);
                        context.partial(setup_product.template, {}, function(rendered) { $(setup_product.target).html(rendered); });
                    },
                    error: function(data) { app.trigger("error-handler", data.status); },
                    complete: function() { $("nav.main li").removeClass("loading"); }
                });
            } else { context.partial(setup_product.template, {}, function(rendered) { $(setup_product.target).html(rendered); }); }
            
            app.trigger("render-cart", null);
        });
        
        
        this.get("#/success", function(context) {
            $("body").attr("class", "success-page");
            
            setup_success = {
                template: "/media/templates/pos/success.template",
                target: "#stage"
            }            
            context.partial(setup_success.template, {}, function(rendered) { $(setup_success.target).html(rendered); });
        });
        
        
        this.get("#/invoices", function(context) {
            $("nav.main li").removeClass("selected");
            $("nav.main li.invoices").addClass("selected");
            
            $("body").attr("class", "invoices-page");
            $("#stage").empty();
            
            // this view handles data a little differently than the others
            // because our api result breaks the pattern
            
            setup_invoices = {
                template: "/media/templates/pos/invoices.template",
                target: "#stage",
                url: "/pos/invoices/"
            }
            data = $(app.data_element).data(setup_invoices.url);
            
            if(data == undefined) {
                $("nav.main li.invoices").addClass("loading");
                $.ajax({
                    url: setup_invoices.url, 
                    dataType: "json",
                    success: function(data) {
                        $.extend(context, data);                        
                        $(app.data_element).data(setup_invoices.url, data);
                        context.partial(setup_invoices.template, {}, function(rendered) { $(setup_invoices.target).html(rendered); });
                    },
                    error: function(data) { app.trigger("error-handler", data.status); },
                    complete: function() { $("nav.main li").removeClass("loading"); }
                });
            } else { 
                $.extend(context, data);                
                context.partial(setup_invoices.template, {}, function(rendered) { 
                    $(setup_invoices.target).html(rendered);
                    // $("table").hide();
                    // alert("aoeu");
                    $("table").tablesorter(); 
                }); 
            }
        });
        
        
        this.get("#/invoice/:uid", function(context) {
            uid = this.params["uid"];
            
            $("nav.main li").removeClass("selected");
            $("nav.main li.invoices").addClass("selected");
            
            $("body").attr("class", "invoice-page");
            $("#stage").empty();
            
            setup_invoice = {
                template: "/media/templates/pos/invoice.template",
                target: "#stage",
                url: "/pos/invoice/" + uid
            }
            context.invoice = $(app.data_element).data(setup_invoice.url);
            
            if(context.product == undefined) {
                $("nav.main li.invoices").addClass("loading");
                $.ajax({
                    url: setup_invoice.url, 
                    dataType: "json",
                    success: function(data) {
                        context.invoice = data;
                        $(app.data_element).data(setup_invoice.url, context.invoice);
                        context.partial(setup_invoice.template, {}, function(rendered) { $(setup_invoice.target).html(rendered); });
                    },
                    error: function(data) { app.trigger("error-handler", data.status); },
                    complete: function() { $("nav.main li").removeClass("loading"); }
                });
            } else { context.partial(setup_invoice.template, {}, function(rendered) { $(setup_invoice.target).html(rendered); }); }            
        });
        
        
        this.get("#/shipments", function(context) {
            $("nav.main li").removeClass("selected");
            $("nav.main li.shipments").addClass("selected");
            
            $("body").attr("class", "shipments-page");
            $("#stage").empty();
            
            setup_shipments = {
                template: "/media/templates/pos/shipments.template",
                target: "#stage",
                url: "/pos/shipments/"
            }
            context.shipments = $(app.data_element).data(setup_shipments.url);
            
            if(context.shipments == undefined) {
                $("nav.main li.shipments").addClass("loading");                
                $.ajax({
                    url: setup_shipments.url, 
                    dataType: "json",
                    success: function(data) {
                        context.shipments = data;
                        $(app.data_element).data(setup_shipments.url, context.shipments);
                        context.partial(setup_shipments.template, {}, function(rendered) { $(setup_shipments.target).html(rendered); });
                    },
                    error: function(data) { app.trigger("error-handler", data.status); },
                    complete: function() { $("nav.main li").removeClass("loading"); }
                });
            } else { context.partial(setup_shipments.template, {}, function(rendered) { $(setup_shipments.target).html(rendered); }); }
        });
        $(".invoice_shipment").live('change', function() {
            $(this).submit();
        });
        
        
        ///////////////////////////////////////////////////////////////////////////////
        // Post
        
        this.post("#/start_sale", function(context) {
            context.redirect("#/");
        });
        
        
        this.post("#/add_to_cart", function(context) {
            var key = this.params["key"];
            var options = this.params["options"];
                        
            add_to_cart_data = {
                "key": key, 
                "options": options
            }
            
            $.ajax({
                url: "/pos/add_to_cart/?123", 
                type: "POST",
                data: add_to_cart_data,
                dataType: "json",
                cache: false,
                success: function(data) {
                    app.trigger("render-cart", data);
                    app.trigger("update-context");
                    app.trigger("notification", {"message": "Added to Invoice!"});
                },
                error: function(data) { app.trigger("error-handler", data.status); }
            });
        });
        
        
        this.post("#/remove_item", function(context) {
            var uid = this.params["uid"];
                        
            item_data = {"uid": uid}
            $.post("/pos/remove_item/", item_data, function(data) {                 
                app.trigger("render-cart", data);
                app.trigger("update-context");
                app.trigger("notification", {"message": "Item removed!"});
            }, "json");
        });
        
        
        this.post("#/clear_cart", function(context) {
            $.post("/pos/clear_cart/", function(data) { 
                app.trigger("render-cart", data);
                app.trigger("update-context");
                app.trigger("notification", {"message": "Invoice Cleared!"});
            }, "json");
        });
        
        
        this.post("#/confirm", function(context) {
            var agree_to_terms = this.params["agree_to_terms"];
            var payment_type = this.params["payment_type"];
            
            if(agree_to_terms) {            
                confirm_data = {
                    "agree_to_terms": agree_to_terms, 
                    "payment_type": payment_type
                }
                
                $.ajax({
                    url: "/pos/confirm/",
                    type: "POST",
                    data: confirm_data,
                    dataType: "json",
                    success: function(data) { 
                        context.redirect("#/success");
                        
                        // removed cart data so that it will update when it is rendered
                        $(app.data_element).removeData("/pos/cart/");
                        $(app.data_element).removeData("/pos/invoices/");
                    
                        app.trigger("update-context");
                        app.trigger("notification", {"message": "Sale Confirmed!"});
                    },
                    error: function(data) {
                        if(data.status == 403) {
                            alert("You must login to proceed.");
                        } else {
                            alert("There was an error. Please try again.");
                        }                            
                    }
                });
            } else {
                alert("You must agree to the terms to confirm!")
            }
        });
        
        
        this.post("#/create_shipment", function(context) {
            app.trigger("notification", {"message": "Creating Shipment..."});
            // $(".tray").attr("disabled","disabled");
            
            $.ajax({
                url: "/pos/create_shipment/",
                type: "POST",
                dataType: "json",
                success: function(data) { 
                    // invalidate shipment and invoice data
                    $(app.data_element).removeData("/pos/shipments/");
                    $(app.data_element).removeData("/pos/invoices/");
                    
                    context.redirect("#/shipments");
                    app.trigger("update-context");
                    app.trigger("notification", {"message": "Shipment Created!"});
                },
                error: function(data) { app.trigger("error-handler", data.status); }
            });
        });
        
        
        this.post("#/change_invoice_shipment", function(context) {
            var invoice_uid = this.params["invoice_uid"];
            var shipment_uid = this.params["shipment_uid"];
            
            change_invoice_shipment_data = {
                "invoice_uid": invoice_uid, 
                "shipment_uid": shipment_uid,
            }
            
            // @todo handle 304 (no change)
            $.ajax({
                url: "/pos/change_invoice_shipment/",
                type: "POST",
                data: change_invoice_shipment_data,
                dataType: "json",
                success: function(data) {
                    // invalidate invoices data
                    $(app.data_element).removeData("/pos/invoices/");
                    // $(app.data_element).removeData("/pos/invoice/" + change_invoice_shipment_data.invoice_uid);
                    
                    app.trigger("update-context");
                    app.trigger("notification", {"message": "Invoice added to shipment."});
                },
                error: function(data) { app.trigger("error-handler", data.status); }
            });
        });
        
        
        this.post("#/change_shipment_status", function(context) {
            var uid = this.params["uid"];
            var status = this.params["status"];
            
            change_shipment_status_data = {
                "uid": uid, 
                "status": status,
            }
            
            // @todo handle 304 (no change)
            $.ajax({
                url: "/pos/change_shipment_status/",
                type: "POST",
                data: change_shipment_status_data,
                dataType: "json",
                success: function(data) {                    
                    // invalidate shipment data
                    $(app.data_element).removeData("/pos/shipments/");
                    $(app.data_element).removeData("/pos/invoices/");
                    
                    // @todo change this to "live" checkbox so no refresh is needed
                    
                    context.redirect("#/shipments");
                    app.trigger("update-context");
                    app.trigger("notification", {"message": "Shipment status changed!"});
                },
                error: function(data) { app.trigger("error-handler", data.status); }
            });
        });
        
        
        
        ///////////////////////////////////////////////////////////////////////////////
        // Events
        
        this.bind("render-cart", function(e, data) {                   
            setup_cart = {
                template: "/media/templates/pos/cart.template",
                target: "#cart",
                url: "/pos/cart/"
            }
            
            if(data != null) {
                $(app.data_element).data(setup_cart.url, data);
                cart = data;
            } else {
                cart = $(app.data_element).data(setup_cart.url);
            }
            
            context = this;
            
            if($(setup_cart.target).is(":empty") || cart == undefined || data) {
                if(cart == undefined) {                
                    $.ajax({
                        url: setup_cart.url, 
                        dataType: "json",
                        cache: false,
                        success: function(data) {                                                 
                            $(app.data_element).data(setup_cart.url, data);
                            context.partial(setup_cart.template, data, function(rendered) { $(setup_cart.target).html(rendered); });
                        },
                        error: function(data) {
                            app.trigger("error-handler", data.status);  
                        }
                    });
                } else {
                    this.partial(setup_cart.template, cart, function(rendered) { $(setup_cart.target).html(rendered); });
                } 
            }           
        });
        
        
        this.bind("notification", function(e, data) {
            this.partial("/media/templates/pos/notification.template", data, function(rendered) {
                seconds = 2;
                $(rendered).appendTo($("#notifications")).hide().slideDown("fast").delay(seconds * 1000).fadeOut("slow");     
            });
        });
        
        
        this.bind("error-handler", function(e, data) {
            if(data == 304) {
                alert("No change.");
            } else if(data == 403) {
                alert("You must be logged in.");
                window.location.replace("/pos/login/");
            } else {
                alert("There was an application error.");
            }
        });
        
        
        this.bind("update-context", function() {
            $.ajax({
                url: "/pos/context/",
                type: "GET",
                dataType: "json",
                success: function(data) {
                    item_count = $("li.start-sale span.count");
                    invoice_count = $("li.invoices span.count");
                    shipment_count = $("li.shipments span.count");

                    if(data.cart_item_count > 0)
                        item_count.show().text(data.cart_item_count);
                    else
                        item_count.hide();
                    
                    if(data.unshipped_invoices > 0)
                        invoice_count.show().text(data.unshipped_invoices);
                    else
                        invoice_count.hide();
                    
                    if(data.unshipped_shipments > 0)
                        shipment_count.show().text(data.unshipped_shipments);
                    else
                        shipment_count.hide();
                },
                error: function(data) { app.trigger("error-handler", data.status); }
            }); 
        });
        
        
        this.bind("run", function() {
            app.trigger("update-context");
        });
    });
    
    $(function() {
        app.run("#/");
    });
    
})(jQuery);