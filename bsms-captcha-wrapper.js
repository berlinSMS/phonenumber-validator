(function ($) {
    $.fn.bsmsCaptchaWrapper = function (options) {

        var settings = $.extend({
            captchaType: 'reCaptcha',
            sitekey: '',
            onLoad:    null,
            onSolved:  null,
            onExpired: null,
            onError:   null,
        }, options);

        this.each(function () {
            const $container = $(this);

            if (settings.captchaType === 'hCaptcha') {
                // Laden Sie hCaptcha
                var captchaScriptUrl = 'https://hcaptcha.com/1/api.js';
                $.getScript(captchaScriptUrl, function () {
                    if (typeof settings.onLoad == 'function') settings.onLoad();
                    hcaptcha.render($container.get(0), {
                        sitekey: settings.sitekey,
                        callback: settings.onSolved,
                        'expired-callback': settings.onExpired,
                        'error-callback': settings.onError
                    });
                });
            } else if (settings.captchaType === 'reCaptcha') {
                var captchaScriptUrl = 'https://www.google.com/recaptcha/api.js';
                $.getScript(captchaScriptUrl, function () {
                    if (typeof settings.onLoad == 'function') settings.onLoad();
                    grecaptcha.ready(() => {
                        grecaptcha.render($container.get(0), {
                            'sitekey': settings.sitekey,
                            'callback': settings.onSolved,
                            'expired-callback': settings.onExpired,
                            'error-callback': settings.onError
                        });
                    });
                });
            }
        });

        this.onLoad = callback => { settings.onLoad = callback; return this; };
        this.onSolved = callback => { settings.onSolved = callback; return this; };
        this.onExpired = callback => { settings.onExpired = callback; return this; };
        this.onError = callback => { settings.onError = callback; return this; };

        return this;
    }
})(jQuery);