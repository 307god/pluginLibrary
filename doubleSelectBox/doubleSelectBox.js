(function ($, window, document, undefined) {
    var pluginName = "doubleSelectBox", defaults = {
        // selectedListLabel: false,
        // unselectedListLabel: false,
        showFilterInputs: true,
        selectSize: 8,
        width: 500,
        css: {
            filterInputBottom: "5px"
        }
    };

    function DoubleSelectBox (element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    /**
     * 初始化selection状态
     * @param dualSelectBox
     */
    function updateSelectionStates (dualSelectBox) {
        dualSelectBox.element.find("option").each(function (index, item) {
            var $item = $(item);
            if (typeof ($item.data("original-index")) === "undefined") {
                $item.data("original-index", dualSelectBox.elementCount++)
            }
            if (typeof ($item.data("_selected")) === "undefined") {
                $item.data("_selected", false);
            }
        })
    }

    /**
     * 保存一个selection状态
     * @param dualSelectBox
     * @param original_index
     * @param selected
     */
    function changeSelectionState (dualSelectBox, original_index, selected) {
        dualSelectBox.element.find("option").each(function (index, item) {
            var $item = $(item);
            if ($item.data("original-index") === original_index) {
                $item.prop("selected", selected);
            }
        })
    }

    /**
     * 保存一边selection状态
     * @param dualSelectBox
     * @param selectIndex
     */
    function saveSelections (dualSelectBox, selectIndex) {
        dualSelectBox.elements["select" + selectIndex]. find("option").each(function (index, item) {
            var $item = $(item);
            dualSelectBox.element.find("option").eq($item.data("original-index")).data("_selected", $item.prop("selected"))
        })
    }

    /**
     * 刷新selection
     * @param dualSelectBox
     */
    function refreshSelects (dualSelectBox) {
        dualSelectBox.selectedElements = 0;
        dualSelectBox.elements.select1.empty();
        dualSelectBox.elements.select2.empty();
        dualSelectBox.element.find("option").each(function (index, item) {
            var $item = $(item);
            if ($item.prop("selected")) {
                dualSelectBox.selectedElements ++;
                dualSelectBox.elements.select2.append($item.clone(true).prop("selected", $item.data("_selected")));
            } else {
                dualSelectBox.elements.select1.append($item.clone(true).prop("selected", $item.data("_selected")));
            }
        });
        if (dualSelectBox.settings.showFilterInputs) {
            filter(dualSelectBox, 1);
            filter(dualSelectBox, 2);
        }
    }

    /**
     * 一边selection过滤
     * @param dualSelectBox
     * @param selectIndex
     */
    function filter (dualSelectBox, selectIndex) {
        if (!dualSelectBox.settings.showFilterInputs) {
            return;
        }
        saveSelections(dualSelectBox, selectIndex);
        dualSelectBox.elements["select" + selectIndex].empty().scrollTop(0);
        var regex = new RegExp($.trim(dualSelectBox.elements["filterInput" + selectIndex].val()), "gi"),
           options = dualSelectBox.element;
        if (selectIndex === 1) {
            options = options.find("option").not(":selected");
        } else {
            options = options.find("option:selected");
        }
        options.each(function (index, item) {
            var $item = $(item), isFiltered = true;
            if (item.text.match(regex)) {
                isFiltered = false;
                dualSelectBox.elements["select" + selectIndex].append($item.clone(true).prop("selected", $item.data("_selected")));
            }
            dualSelectBox.element.find("option").eq($item.data("original-index")).data("filtered" + selectIndex, isFiltered);
        });
    }

    /**
     * 从左到右移动一个selection
     * @param dualSelectBox
     */
    function move (dualSelectBox) {
        dualSelectBox.elements.select1.find("option:selected").each(function (index, item) {
            var $item = $(item);
            if (!$item.data("filtered1")) {
                changeSelectionState(dualSelectBox, $item.data("original-index"), true);
            }
        });
        refreshSelects(dualSelectBox);
    }

    /**
     * 从右到左移动一个selection
     * @param dualSelectBox
     */
    function remove (dualSelectBox) {
        dualSelectBox.elements.select2.find("option:selected").each(function (index, item) {
            var $item = $(item);
            if (!$item.data("filtered2")) {
                changeSelectionState(dualSelectBox, $item.data("original-index"), false);
            }
        });
        refreshSelects(dualSelectBox);
    }

    /**
     * 从左到右移动一边selection
     * @param dualSelectBox
     */
    function moveAll (dualSelectBox) {
        dualSelectBox.element.find("option").each(function (index, item) {
            var $item = $(item);
            if (!$item.data("filtered1")) {
                $item.prop("selected", true);
            }
        });
        refreshSelects(dualSelectBox);
    }

    /**
     * 从右到左移动一边selection
     * @param dualSelectBox
     */
    function removeAll (dualSelectBox) {
        dualSelectBox.element.find("option").each(function (index, item) {
            var $item = $(item);
            if (!$item.data("filtered2")) {
                $item.prop("selected", false);
            }
        });
        refreshSelects(dualSelectBox);
    }

    /**
     * 绑定事件
     * @param dualSelectBox
     */
    function bindEvents (dualSelectBox) {
        dualSelectBox.elements.moveButton.on("click", function () {
            move(dualSelectBox);
        });
        dualSelectBox.elements.removeButton.on("click", function () {
            remove(dualSelectBox);
        });
        dualSelectBox.elements.moveAllButton.on("click", function () {
            moveAll(dualSelectBox);
        });
        dualSelectBox.elements.removeAllButton.on("click", function () {
            removeAll(dualSelectBox);
        });
        dualSelectBox.elements.filterInput1.on("change keyup", function () {
            filter(dualSelectBox, 1);
        });
        dualSelectBox.elements.filterInput2.on("change keyup", function () {
            filter(dualSelectBox, 2);
        })
    }

    DoubleSelectBox.prototype = {
        /**
         * 初始化
         * @returns {*|HTMLElement}
         */
        init: function () {
            this.container = $("" +
                '<div class="row p-container">' +
                    '<div class="col-xs-5 p-box1">' +
                        '<input class="form-control filter" type="text" placeholder="Filter">' +
                        '<select name="from" class="form-control" multiple="multiple"></select>' +
                    '</div>' +
                    '<div class="col-xs-2 btn-group-vertical">' +
                        '<button type="button" class="btn btn-primary p-moveAll"><i class="glyphicon glyphicon-forward"></i></button>' +
                        '<button type="button" class="btn btn-primary p-move"><i class="glyphicon glyphicon-chevron-right"></i></button>' +
                        '<button type="button" class="btn btn-primary p-remove"><i class="glyphicon glyphicon-chevron-left"></i></button>' +
                        '<button type="button" class="btn btn-primary p-removeAll"><i class="glyphicon glyphicon-backward"></i></button>' +
                    '</div>' +
                    '<div class="col-xs-5 p-box2">' +
                        '<input class="form-control filter" type="text" placeholder="Filter">' +
                        '<select name="from" class="form-control" multiple="multiple"></select>' +
                    '</div>' +
                '</div>'
            ).insertBefore(this.element);
            this.elements = {
                filterInput: $(".filter", this.container),
                filterInput1: $(".p-box1 .filter", this.container),
                filterInput2: $(".p-box2 .filter", this.container),
                select1: $(".p-box1 select", this.container),
                select2: $(".p-box2 select", this.container),
                moveButton: $(".p-move", this.container),
                moveAllButton: $(".p-moveAll", this.container),
                removeButton: $(".p-remove", this.container),
                removeAllButton: $(".p-removeAll", this.container)
            };
            this.elementCount = 0;
            this.elements.select1.attr("size", this.settings.selectSize);
            this.elements.select2.attr("size", this.settings.selectSize);
            this.container.css("width", this.settings.width);
            this.elements.filterInput.css("margin-bottom", this.settings.css.filterInputBottom);
            this.setShowFilterInputs(this.settings.showFilterInputs);
            this.element.hide();
            bindEvents(this);
            return this.element;
        },
        /**
         * 设置过滤框
         * @param value
         * @param refresh
         * @returns {*|HTMLElement}
         */
        setShowFilterInputs: function (value, refresh) {
            if (!value) {
                this.elements.filterInput.hide();
            } else {
                this.elements.filterInput.show();
            }
            this.settings.showFilterInputs = value;
            if (refresh) {
                refreshSelects(this);
            }
            return this.element;
        },
        /**
         * 刷新
         */
        refresh: function () {
            updateSelectionStates(this);
            refreshSelects(this);
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
            if (options.selectedList != null) {
                for (var i in options.selectedList) {
                    if (options.selectedList.hasOwnProperty(i)) {
                        items += '<option value ="' + options.selectedList[i][options.optionValue] + '" selected>' + options.selectedList[i][options.optionText] + '</option>';
                    }
                }
            }
            if (options.unselectedList != null) {
                for (var i in options.unselectedList) {
                    if (options.unselectedList.hasOwnProperty(i)) {
                        items += '<option value ="' + options.unselectedList[i][options.optionValue] + '">' + options.unselectedList[i][options.optionText] + '</option>';
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