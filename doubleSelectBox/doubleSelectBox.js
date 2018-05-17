(function ($, window, document, undefined) {
    var pluginName = "doubleSelectBox", defaults = {
        // selectedListLabel: false,
        // unselectedListLabel: false,
        selectSize: 8,
        width: 500
    };

    function DoubleSelectBox (element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    function refreshSelect (dualSelectBox) {
        dualSelectBox.selectedElements = 0;
        dualSelectBox.elements.select1.empty();
        dualSelectBox.elements.select2.empty();
        dualSelectBox.element.find("option").each(function () {
            if ($(this).prop("selected")) {
                dualSelectBox.selectedElements ++;
                dualSelectBox.elements.select2.append($(this).clone(true).prop("selected", false));
            } else {
                dualSelectBox.elements.select1.append($(this).clone(true).prop("selected", false));
            }
        });
    }

    function bindEvents () {

    }

    DoubleSelectBox.prototype = {
        init: function () {
            this.container = $("" +
                '<div class="row p-container">' +
                    '<div class="col-xs-5 p-box1">' +
                        '<select name="from" class="form-control" multiple="multiple"></select>' +
                    '</div>' +
                    '<div class="col-xs-2 btn-group-vertical">' +
                        '<button type="button" class="btn btn-primary p-moveAll"><i class="glyphicon glyphicon-forward"></i></button>' +
                        '<button type="button" class="btn btn-primary p-move"><i class="glyphicon glyphicon-chevron-right"></i></button>' +
                        '<button type="button" class="btn btn-primary p-remove"><i class="glyphicon glyphicon-chevron-left"></i></button>' +
                        '<button type="button" class="btn btn-primary p-removeAll"><i class="glyphicon glyphicon-backward"></i></button>' +
                    '</div>' +
                    '<div class="col-xs-5 p-box2">' +
                        '<select name="from" class="form-control" multiple="multiple"></select>' +
                    '</div>' +
                '</div>'
            ).insertBefore(this.element);
            this.elements = {
                select1: $(".p-box1 select", this.container),
                select2: $(".p-box2 select", this.container),
                moveButton: $(".p-move", this.container),
                moveAllButton: $(".p-moveAll", this.container),
                removeButton: $(".p-remove", this.container),
                removeAllButton: $(".p-removeAll", this.container)
            };
            this.elements.select1.attr("size", this.settings.selectSize);
            this.elements.select2.attr("size", this.settings.selectSize);
            this.container.css("width", this.settings.width);
            this.element.hide();
            return this.element;
        }, refresh: function () {
            refreshSelect(this);
        }
    };

    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === "object") {
            return this.each(function () {
                if (!$(this).is("select")) {
                    $(this).find("select").each(function (index, item) {
                        $(item).doubleSelectBox(options);
                    })
                } else {
                    if (!$.data(this, "plugin_" + pluginName)) {
                        $.data(this, "plugin_" + pluginName, new DoubleSelectBox(this, options));
                    }
                }
            })
        } else {
            if (typeof options === "string" && options[0] !== "_" && options !== "init") {
                var returns;
                this.each(function () {
                    var instance = $.data(this, "plugin_" + pluginName);
                    if (instance instanceof  DoubleSelectBox && typeof instance[options] === "function") {
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
    $.fn.doubleSelect = function (options) {
        var box = this.doubleSelectBox(options);
        var items = "";
        box.selectElement = function () {
            if (options.unselectedList != null) {
                for (var i in options.unselectedList) {
                    if (options.unselectedList.hasOwnProperty(i)) {
                       items += '<option value ="' + options.unselectedList[i][options.optionValue] + '">' + options.unselectedList[i][options.optionText] + '</option>';
                    }
                }
            }
            if (options.selectedList != null) {
                for (var i in options.selectedList) {
                    if (options.selectedList.hasOwnProperty(i)) {
                        items += '<option value ="' + options.selectedList[i][options.optionValue] + '" selected>' + options.selectedList[i][options.optionText] + '</option>';
                    }
                }
            }
            box.append(items);
            box.doubleSelectBox("refresh")
        };
        box.selectElement();
        return box;
    }
}));