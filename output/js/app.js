(function($) {
    var app = $.sammy(function() {
        this.element_selector = "body";
        this.data_element = this.element_selector;
        this.use(Sammy.Template);
        
        ///////////////////////////////////////////////////////////////////////////////
        // Views
        
        this.get("#/", function(context) {
            $("nav button").removeClass("clicked");
            $("nav button.projects").addClass("clicked");
            
            // make sure that no selections are visible on project page (hacky!)
            $(".project-nav .highlight-box").hide();
            
            if($("#sub-nav").is(":empty")) {
                $("#sub-nav").hide();
            } else {
                $("#sub-nav").slideUp(1000);
            }
            
            // note: this is ok as a blocking request because our data is
            // static and thus served extremely quickly. we can do this 
            // asynchronously, but the code is 3x longer. also, i like turtles.
            
            context.projects = $(app.data_element).data("projects");
            if(context.projects == undefined) {
                context.projects = app.load_projects();
                $(app.data_element).data("projects", context.projects);
            }
            
            context.partial("/templates/projects.template", {}, function(rendered) { 
                $("#stage").html(rendered); 
                $("body").attr("class", "projects-page");
            });
        });
        
        // @todo replace this with a DRYer implementation--this works for now
        this.get("#/project/:slug", function(context) {
            slug = this.params["slug"];
            
            $("nav button").removeClass("clicked");
            $("nav button.projects").addClass("clicked");
            
            $(".project-nav .highlight-box").fadeOut(300);
            $("#project-"+slug+" .highlight-box").show();
                        
            context.projects = $(app.data_element).data("projects");
            if(context.projects == undefined) {
                context.projects = app.load_projects();
                $(app.data_element).data("projects", context.projects);
            }
            
            // get project from projects list
            not_found = true;
            for(var i in context.projects) {
                if(context.projects[i].slug == slug) {
                    context.project = context.projects[i];
                    not_found = false;
                    break;
                }
            }
            if(not_found) app.trigger("error-handler",404);
            context.partial("/templates/project.template", {}, function(rendered) { 
                $("#stage").html(rendered); 
                $("body").attr("class", "project-page");
            });
            
            // if necessary, populate projects subnav
            if($("#sub-nav").is(":empty")) {
                this.partial("/templates/project-nav.template", {}, function(rendered) { 
                    $("#sub-nav").html(rendered);
                    $("#sub-nav").slideDown();
                    
                    // draw our 'highlight box' on each canvas and hide it for
                    // future use. this makes it extremely easy to handle boxes
                    // of different sizes since dimensions are calculated based on
                    // the size of the canvas element itself.
                    $("#sub-nav .highlight-box").each(function(index) {
                        id = $(this).attr('id');
                        app.draw_highlight(id);
                        $("#"+id).hide();
                    });
                    
                    // notice we tried this at the beginning of this view, but
                    // the projects subnav wasn't available then.
                    $("#project-"+slug+" .highlight-box").show();
                    
                });
            } else {
                $("#sub-nav").slideDown();
            }
        });
        
        
        ///////////////////////////////////////////////////////////////////////////////
        // Events
        
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
        
        $(".project-nav .project").live("click", function() {
            // @todo do something with this click
        });
        
        
        ///////////////////////////////////////////////////////////////////////////////
        // Post
        
        this.post("#/", function(context) {
            context.redirect("#/");
            return false;
        });
        
        this.post("#/about", function(context) {
            context.redirect("#/");
            return false;
        });
        
        // this.post("#/contact", function(context) {
        //     context.redirect("#/");
        //     return false;
        // });
        

        ///////////////////////////////////////////////////////////////////////////////
        // Helpers
        
        this.load_projects = function() {
            url = "/data/projects.json";
            projects = null;
            
            $.ajax({
                url: url, 
                dataType: "json",
                async: false,
                success: function(data) {
                    // projects will be found in the context "above" this one
                    projects = data.projects;
                },
                error: function(data) {
                    // handle error
                },
                complete: function() {
                    // handle complete
                }
            });
            
            return projects;
        }
        
        this.draw_highlight = function(id) {
            var canvas = document.getElementById(id);
            
            if(canvas.getContext) {
                var ctx = canvas.getContext("2d");

                x = 10;
                y = 10;
                width = canvas.clientWidth - 20; //230;
                height = canvas.clientHeight - 30; //220;
                weight = 5;
                radius = 5;

                // draw main rect
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.shadowBlur    = 8;
                ctx.shadowColor   = "rgba(0, 0, 0, .4)";
                ctx.fillStyle = "#4696f7";
                app.paint_rounded_rect(ctx, x, y, width, height, radius);

                var grd = ctx.createLinearGradient(0,y,0,y+height);
                grd.addColorStop(0,"#78b5fa");
                grd.addColorStop(0.01,"#4696f7");
                grd.addColorStop(.98,"#1562d1");
                grd.addColorStop(1,"#1151ab"); 
                ctx.fillStyle = grd;
                ctx.fill();

                // embossing
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 2;
                ctx.shadowColor = "rgba(0, 0, 0, .6)";
                ctx.fillStyle = "#fff";
                ctx.fillRect(x+weight, y+weight, width-weight*2, 1);

                ctx.shadowBlur = 2;
                ctx.shadowColor = "rgba(255, 255, 255, .3)";
                ctx.fillStyle = "#4d8fe0";
                ctx.fillRect(x+weight, y+height-weight, width-weight*2, 1);            

                // knockout middle box
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                ctx.clearRect(x+weight, y+weight, width-weight*2, height-weight*2);

                // mask for inner shadow
                ctx.beginPath();
                ctx.moveTo(x+weight, y+weight);
                ctx.lineTo(x+width-radius, y+weight);
                ctx.lineTo(x+width-radius, y+height-weight);
                ctx.lineTo(x+weight, y+height-weight);
                ctx.lineTo(x+weight, y+weight);
                ctx.clip();

                // inner shadow
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x+width, y);
                ctx.lineTo(x+width, y+height);
                ctx.lineTo(x, y+height);
                ctx.lineTo(x, y);
                ctx.lineTo(x+weight, y+weight);
                ctx.lineTo(x+weight, y+height-weight);
                ctx.lineTo(x+width-weight, y+height-weight);
                ctx.lineTo(x+width-weight, y+weight);
                ctx.lineTo(x+weight, y+weight);    

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 3;
                ctx.shadowColor = "rgba(0, 0, 0, .5)";
                ctx.fill();
            }
        }
        
        this.paint_rounded_rect = function(ctx, x, y, width, height, radius) {
            correction = 0;

            ctx.beginPath();
            ctx.moveTo(x, y+radius);
            ctx.lineTo(x, y+height-radius);
            ctx.quadraticCurveTo(x, y+height, x+radius, y+height);
            ctx.lineTo(x+width-radius, y+height);
            ctx.quadraticCurveTo(x+width, y+height, x+width, y+height-radius);  
            ctx.lineTo(x+width, y+radius);
            ctx.quadraticCurveTo(x+width, y, x+width-radius, y);
            ctx.lineTo(x+radius, y);
            ctx.quadraticCurveTo(x, y, x, y+radius);
            ctx.fill();
        }

        
    });

    $(function() {
        app.run("#/");
    });

})(jQuery);