(function ($, window, document, undefined) {
    var pluginName = "", defaults = {

    };

    function demo(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    
    function test() {
        
    }
    
    demo.prototype = {
        init: function () {
            this.container = $();
            this.elements = {
                
            };
            return this.element;
        }, test: function () {
            
        }
    };
    
    $.fn[pluginName] = function () {
        var args = arguments;
        if (options === undefined || typeof options === "object") {
            return this.each(function () {
                if (!$(this).is("div")) {
                    $(this).find("div").each(function (index, item) {
                        $(item).demo(options);
                    })
                } else {
                    if (!$.data(this, "plugin_" + pluginName)) {
                        $.data(this, "plugin_" + pluginName, new Demo(this, options));
                    }
                }
            })
        } else {
            if (typeof options === "string" && options[0] !== "_" && options !== "init") {
                var returns;
                this.each(function () {
                    var instance = $.data(this, "plugin_" + pluginName);
                    if (instance instanceof  Demo && typeof instance[options] === "function") {
                        returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1))
                    }
                });
                return returns !== undefined ? returns : this;
            }
        }
    }
})(jQuery, window, document);
(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(root , require("jquery"))
    } else {
        if (typeof define === "function" && define.amd) {
            define(["jquery"], function (jQuery) {
                return factory(root, jQuery)
            })
        } else {
            factory(root, root.jQuery)
        }
    }
}(this, function(window, $, undefined) {
    $.fn.demo = function (options) {
        var Demo = this.demo(options);
        return Demo;
    }
}));