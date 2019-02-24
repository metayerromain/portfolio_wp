/*
|--------------------------------------------------------------------------------
|                                   Placeholder
|--------------------------------------------------------------------------------
|
| Placeholder allows to simulate placeholder
|
*/

/*
|
| Class
|--------
|
*/
class Placeholder {
    /*
    |
    | Constructor
    |--------------
    */
    constructor($field, placeholder) {
        this.field       = $field;
        this.placeholder = placeholder;

        this.init();
    }

    /*
    |
    | init
    |-------
    */
    init() {
        this.simulatePlaceholder();
    }

    /*
    |
    | simulatePlaceholder
    |----------------------
    */
    simulatePlaceholder() {
        const _this       = this;
        const $field      = this.field;

        $field.on('focus blur', function(e){
            const event  = e.type;
            const $field = $(this);
            const val    = $field.val();

            event === 'focus' && _this.handleFocus($field, val);
            event === 'blur' && _this.handleBlur($field, val);
        });
    }

    /*
    |
    | handleFocus
    |--------------
    */
    handleFocus($field, val) {
        const placeholder = this.placeholder;

        val == placeholder && $field.addClass('placeholder_disabled').val('');
    }

    /*
    |
    | handleBlur
    |-------------
    */
    handleBlur($field, val) {
        const placeholder = this.placeholder;
        const isPlaceholder = val == '' || val == placeholder;

        isPlaceholder && $field.removeClass('placeholder_disabled').val(placeholder);
    }
}

export default Placeholder;