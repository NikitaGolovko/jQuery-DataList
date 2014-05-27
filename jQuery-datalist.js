/*
jQuery datalist plugin
*/
(function($) {
    //Global variables & Constants
    var CONST_ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var CONST_ALPHABET_OTHERS = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', ';', ':', '"', '<', '>', '.'];
    var CONST_ALPHABET_NUMERIC = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    var CONST_OTHERS = '...';
    var CONST_NUMBERS = '0-9';
    var CONST_OPTION_ALL = 'OptionAll';
    var CONST_OPTION_NUMBERS = 'OptionNumbers';
    var CONST_EVENT_TYPE_TOUCH = 'touchstart';
    var CONST_EVENT_TYPE_CLICK = 'click';
    var CONST_EVENT_TYPE_SEARCH = 'keyup';


    $.fn.datalist = function(options) {

        //set options
        var _options = $.extend({}, $.fn.datalist.defaults, options);

        //For now we'll deal with only one list at a time, so this will have to be called on each of the list
        var $list = $(this),
            id = this[0].id,
            $container,
            $navigation,
            $searchContol,
            $previousNavigationSelection,
            previousNavigationLetter = '',
            previousSearchCriteria = '';

        // set/create the parent/reference container
        if (!$('#' + id + '-datalist').length) {
            $('<div id="' + id + '-datalist" class="datalist"/>').insertBefore($list);
        }

        $container = $('#' + id + '-datalist');

        $container.append(CreateNavigationMarkup());

        //set the navigation
        $navigation = $('.btn-group.navigation', $container);

        //set the search control if needed
        if (_options.searchControlName !== '') {
            $searchContol = $('#' + _options.searchControlName);
        }

        initialize();

        //enable/disable the navigation elements based on content 
        //set appropriate bindings for the elements 

        function initialize() {

            //iterate through the list re-enabling the navigation options based on the value in the list
            $list.children().each(function() {
                if (this.innerText.length > 0) {
                    var firstLetter = this.innerText[0].toLowerCase();
                    //Enable the letter in navigation
                    if (CONST_ALPHABET.indexOf(firstLetter) > -1) {
                        $('button[type=button][value="' + firstLetter + '"]').removeAttr('disabled').removeClass('hidden');
                        $(this).addClass(firstLetter);
                    }

                    //Enable navigation element for 'otherOptions'
                    if (CONST_ALPHABET_OTHERS.indexOf(firstLetter) > -1) {
                        $('button[type=button][value="' + CONST_OTHERS + '"]').removeAttr('disabled').removeClass('hidden');
                        $(this).addClass(CONST_OTHERS);
                    }


                    //Enable navigation element for 'optionNums' if those actually exist
                    if (CONST_ALPHABET_NUMERIC.indexOf(firstLetter) > -1) {
                        $('button[type=button][value="' + CONST_OPTION_NUMBERS + '"]').removeAttr('disabled').removeClass('hidden');
                        $(this).addClass(CONST_OPTION_NUMBERS);
                    }
                }
            });

            if (!(_options.removeDisabled)) {
                $('button[type="button"][disabled="disabled"]', $navigation).removeClass('hidden')
            }


            //Bind elements
            $('button', $navigation).bind(CONST_EVENT_TYPE_CLICK, function(e) {
                e.preventDefault();
                var $this = $(this)

                //We'll only filter the list if the different value was selected
                if (!($previousNavigationSelection) || ($this[0] !== $previousNavigationSelection[0])) {
                    console.log('looking again');
                    if ($this.val() === CONST_OPTION_ALL) {
                        $list.children().show();
                    } else {
                        $list.children().hide().each(function() {
                            if ($(this).hasClass($this.val())) {
                                $(this).show()
                            }

                        });
                    }

                    //Reset active class
                    $(this).addClass('active');
                    if ($previousNavigationSelection) {
                        $previousNavigationSelection.removeClass('active');
                    }
                    $previousNavigationSelection = $this;
                    previousNavigationLetter = $this.val();
                }
            });

            if ($searchContol) {
                $($searchContol).bind(CONST_EVENT_TYPE_SEARCH, function(e) {
                    e.preventDefault();
                    var $this = $(this),
                        searchCriteria = $this.val(),
                        blnFound = false;

                    if (searchCriteria.length > 2) {
                        $previousNavigationSelection.removeClass('active');
                        $list.children().each(function() {
                            if (this.innerText.toLowerCase().indexOf(searchCriteria.toLowerCase()) > -1) {
                                $(this).show();
                                blnFound = true;
                            } else {
                                $(this).hide();
                            }
                        });
                    } else {
                        if (searchCriteria === '') {
                            $previousNavigationSelection = null;
                            selectNavigationElement(previousNavigationLetter)
                        }
                    }

                    previousSearchCriteria = searchCriteria;
                });
            };

            if (_options.optionAll) {
                $previousNavigationSelection = $('button[type=button][value="' + CONST_OPTION_ALL + '"]');
                $previousNavigationSelection.addClass('active');
                selectNavigationElement(CONST_OPTION_ALL);
            }
        }

        function selectNavigationElement(elemValue) {
            $('button[type=button][value="' + elemValue + '"]').trigger(CONST_EVENT_TYPE_CLICK);
        }



        //fill the navigation list

        function CreateNavigationMarkup() {
            //TODO we need to do something a little better here in the future to avoid performance bottlenecks
            //Concatenating html markup as strings is not really a good practice.
            //Perhaps we can look into the jQuery template

            var markup = '';

            //include option for All
            if (_options.optionAll) {
                markup += '<button type="button" class="btn ' + _options.navigationClass + '" value="' + CONST_OPTION_ALL + '">All</button>'

            }

            //Include numbers
            if (_options.optionNums) {
                markup += '<button type="button" class="btn ' + _options.navigationClass + ' hidden" value="' + CONST_OPTION_NUMBERS + '" disabled="disabled">' + CONST_NUMBERS + '</button>'
            }

            //Build the remaining list
            for (var i = 1; i < CONST_ALPHABET.length; i++) {
                markup += '<button type="button" class="btn ' + _options.navigationClass + ' hidden" value="' + CONST_ALPHABET[i] + '" disabled="disabled">' + CONST_ALPHABET[i] + '</button>'
            }

            if (_options.optionOther) {
                markup += '<button type="button" class="btn ' + _options.navigationClass + '" value="' + CONST_OTHERS + '" disabled="disabled">' + CONST_OTHERS + '</button>'
            }

            return '<div class="btn-group block navigation">' + markup + '</div>'
        }

        //set the individual item classes & remove items not needed

    }

    $.fn.datalist.defaults = {
        initLetter: '',
        optionAll: true,
        optionOther: false,
        optionNums: true,
        removeDisabled: true,
        notFoundText: 'No matching entries found',
        searchControlName: '',
        navigationClass: 'btn-default'
    };
})(jQuery);
