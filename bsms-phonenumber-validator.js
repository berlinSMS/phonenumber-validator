﻿/** 
 * A jquery-plugin to verify a phonenumber direct in the formular
 *  - You need to import jquery
 *
 * @copyright Copyright (c) 2023, Energieweise Ingenieur GmbH, berlinsms
 * @link      https://www.berlinsms.de/
 * 
 * Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehoerigen
 * Dokumentationsdateien (die "Software") erwirbt, kostenlos die Erlaubnis erteilt, 
 * uneingeschraenkt mit der Software zu handeln, einschliesslich und ohne 
 * Einschraenkung der Rechte, Kopien der Software zu verwenden, zu kopieren, zu 
 * modifizieren, zusammenzufuehren, zu veroeffentlichen, zu vertreiben, zu 
 * unterlizenzieren und/oder zu verkaufen, und Personen, denen die Software zur 
 * Verfuegung gestellt wird, dies unter den folgenden Bedingungen zu gestatten:
 * 
 * Dieser Copyright-Hinweis und dieser Genehmigungshinweis muessen in allen Kopien 
 * oder wesentlichen Teilen der Software enthalten sein.
 * 
 * DIE SOFTWARE WIRD OHNE MAENGELGEWAEHR ZUR VERFUEGUNG GESTELLT, OHNE AUSDRUECKLICHE 
 * ODER STILLSCHWEIGENDE GEWAEHRLEISTUNG JEGLICHER ART, EINSCHLIESSLICH, ABER NICHT
 * BESCHRAENKT AUF DIE GEWAEHRLEISTUNG DER MARKTGAENGIGKEIT, DER EIGNUNG FUER EINEN 
 * BESTIMMTEN ZWECK UND DER NICHTVERLETZUNG VON RECHTEN. IN KEINEM FALL HAFTEN DIE 
 * AUTOREN ODER URHEBERRECHTSINHABER FUER JEGLICHE ANSPRUECHE, SCHAEDEN ODER SONSTIGE 
 * HAFTUNG, SEI ES DURCH VERTRAG, UNERLAUBTE HANDLUNGEN ODER ANDERWEITIG, DIE SICH 
 * AUS DER SOFTWARE ODER DER NUTZUNG DER SOFTWARE ODER DEM SONSTIGEN UMGANG MIT 
 * DER SOFTWARE ERGEBEN ODER DAMIT ZUSAMMENHAENGEN.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
 * Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * This copyright notice and this permission notice must be included in all copies 
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
 * IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIMS, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING OUT OF OR RELATED TO THE SOFTWARE 
 * OR THE USE OF OR OTHER DEALINGS WITH THE SOFTWARE.
 * 
 */
 
(function ($) {
    $.fn.bsmsPhonenumberValidator = function (options = {}) {

        const caller = this;
        const fadeInDuration = 1000;
        const twofaApi = 'https://api.berlinsms.de/twofa';
        const _getSecretUrl = "https://twofa.berlinsms.de";
        var g_address;
        var g_challengeToken;

        const twofaTypes = {
            optinSms: 'optin(sms)',
            optinMail: 'optin(mail)',
        };

        if (!options.className) options.className = 'bsms-phonenumber-validator';

        const defaultStyles = `
.${options.className} {
    position: relative;
	width: 373px;
}
.${options.className} .country-picker-container {
    position:relative;
    margin:0;
    padding:1px 3px;
    width:55px;
    height:25px;
    border:solid 2px darkblue;
    border-radius:6px 0 0 6px;
    overflow:visible;
    display:inline-block;
    vertical-align:top;
    z-index:1
}
.${options.className} .local-number {
    margin:0;
    padding:1px 3px;
    width:300px;
    height:25px;
    border:solid 2px darkblue;
    border-left:0;
    border-radius:0 6px 6px 0;
    display:inline-block;
    vertical-align:top;
    z-index:0
}
.${options.className} .verification-start {
	position: absolute;
	right: 3px;
    margin:0;
    padding:0;
    border:0;
    background:none;
    font-size:22px;    
    color: darkred;
	cursor: pointer;  
}
.${options.className} .verification-end {
	position: absolute;
	right: 6px;
    margin:0;
    padding:0;
    border:0;
    background:none;
    font-size:24px;    
    color: darkgreen;
    display: inline-block;
}
.${options.className} .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Hintergrundfarbe mit Transparenz */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:1;
}
.${options.className} .overlay-close {
    position:absolute;
    right:5px;
    top:5px;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    font-size:28px;
    line-height:20px;
    cursor: pointer
}
.${options.className} .overlay-content {
    position:relative;
    width:400px;
    height:250px;
    background-color: white;
    /*padding: 20px;*/
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family:arial;
    /*background:yellow;*/
}
.${options.className} .overlay-captcha {
}
.${options.className} .captcha-text {
    position:absolute;
    top:10px;
    left:0;
    width:380px;
    padding:10px;
}
.${options.className} .captcha-page {
}
.${options.className} .overlay-vcode {
}
.${options.className} .vcode-text {
    position:absolute;
    top:10px;
    left:0;
    width:380px;
    padding:10px;
}
.${options.className} .vcode-page {
}
.${options.className} .overlay-error {
}
.${options.className} .error-text {
    position:absolute;
    top:10px;
    left:0;
    width:380px;
    padding:10px;
    color:darkred;
}
.${options.className} .overlay-wait {
}
.${options.className} .wait-text {
    position:absolute;
    top:10px;
    left:0;
    width:380px;
    padding:10px;
    color:darkred;
}
.${options.className} .wait-page {
}`;

        const defaultSettings = {
            userStyles: defaultStyles,
            countries: { "DE": { name: "Germany", code: "+49" } },
            defaultCountry: "DE",
            defaultLocalnumber: "",
            inputNamePhonenumber: 'bsms-phonenumber',
            inputNameToken: 'bsms-challenge-token',
            className: 'bsms-phonenumber-validator',
            twofaSitekey: null,
            onSolved: null,
            onLoad: null,
            onExpired: null,
            onError: null,
        };

        const settings = $.extend({}, defaultSettings, options);

        $(`<style type="text/css">${settings.userStyles}</style>`)
            .prependTo('head');

        getAccountData(settings.twofaSitekey)
            .then(
                accountData => caller.each((nr, target) => buildDom(target, accountData)),
                error => { $overlay.showPage('error', error); }
            )     

        function buildDom(target, accountData) {
            const $validator = $(`<div class="${options.className}"></div>`);
            if ('div' == target.nodeName.toLowerCase()) {
                $(target).append($validator);
            } else {
                $(target)
                .hide()
                .after($validator);
            }
            const $hiddenInputPhonenumber = $(`<input type="hidden" name="${settings.inputNamePhonenumber}">`)
                .appendTo($validator);
            const $hiddenInputToken = $(`<input type="hidden" name="${settings.inputNameToken}">`)
                .appendTo($validator);
            const $countryCode = $(`<div class="country-picker-container"></div>`)
                .appendTo($validator)
                .bsmsCountryPicker({ countries: settings.countries, defaultCountry: settings.defaultCountry })
                .change(countryCodeChanged);
            const $localNumber = $(`<input class="local-number" type="text" placeholder="Phonenumber" name="local-number">`)
                .appendTo($validator)
                .change(localNumberChanged)
                .on("keyup", localNumberKeyup);
            const $verifyButton = $(`<button class="verification-start" title="Zur Bestätigung Ihrer Telefonnummer senden wir Ihnen einen Code per SMS zu. Klicken Sie hier, um den Bestätigunsprozess zu starten.">&#x1F4AC;</button>`)
                .appendTo($validator)
                .hide()
                .click(verificationStart);
            const $okCheckmark = $(`<div class="verification-end" title="Telefonnummer bestätigt">&#x2714;</div>`)
                .appendTo($validator)
                .hide();


            //Overlay-Captcha
            const $captchaPage = $(`<div id="cw1" class="captcha-page"></div>`)
                .bsmsCaptchaWrapper({
                    captchaType: accountData.captchaType,//'reCaptcha',
                    sitekey: accountData.captchaSitekey
                })
                .onSolved(captchaSolved)
                .onExpired(captchaExpired)
                .onError(captchaError);

            //Overlay-ValidationCode
            const $vcodePage = $(`<div class="vcode-page"></div>`)
                .bsmsCodePicker()
                .lastDigitEntered(vcodeEntered);

            //Overlay
            const $overlay = $.bsmsOverlay()
                .addPage('captcha', '', $captchaPage)
                .addPage('vcode', '', $vcodePage)
                .addPage('error')
                .addPage('wait','',`<div class="wait-page">&#x23f3;</div>`);

            //debug-defaults
            $localNumber
                .val(settings.defaultLocalnumber)
                .trigger('change');

            //Events
            function verificationStart(event) {
                event.preventDefault();
                g_address = $countryCode.val() + $localNumber.val();
                //console.log('---verificationStart-', g_address);
                $overlay.showPage('captcha',`Um einen Code an ${g_address} zu senden,<br>lösen sie bitte zuerst das Captcha.`);
            }

            function captchaSolved(captchaToken) {
                //console.log('captchaSolved, token=', captchaToken);
                $overlay.showPage('wait',`Sende Code an ${g_address}`);
                postTwofaSend(accountData.twofaType, settings.twofaSitekey, captchaToken, g_address)
                    .then(twofaSendOk, twofaSendError);
            }

            async function twofaSendOk(response) {
                $overlay.showPage('vcode',`Der Code wurde an ${g_address} gesendet.<br>Bitte geben Sie diesen Code hier ein.`);
                g_challengeToken = response.challengeToken;
            }

            async function twofaSendError(error) {
                const errorText = `Fehler beim Senden des Verifikations-Codes<br>${error})`;
                console.log(errorText);
                $overlay.showPage('error',error);
            }

            async function captchaExpired() {
                if (g_challengeToken) return;
                console.log('captchaExpired');
                $overlay.showPage('captcha','Captcha expired');
            }

            async function captchaError(error) {
                $overlay.showPage('captcha',`Captcha-Error: ${error}`);
            }

            //events
            function countryCodeChanged(event) {
                //alert('countryCodeChanged:' + event.target);
                //alert('countryCodeChanged:' + $(event.target).val());
            }
            function localNumberChanged(event) {
                const localNumber = $(event.target).val();
                if (localNumber.length <= 8) { $verifyButton.hide(); }
                else if (localNumber.length >= 12) { $verifyButton.hide(); }
                else { $verifyButton.fadeIn(fadeInDuration); }
            }

            function localNumberKeyup(event) {
                if (event.keyCode != 13) return localNumberChanged(event);
                event.preventDefault();
                if ($verifyButton.is(":hidden")) return;
                $verifyButton.click();
            }
            async function vcodeEntered(vcode) {
                try {
                    await putTwofaPreverifyCode(settings.twofaSitekey, g_challengeToken, vcode);
                    $hiddenInputPhonenumber.val(g_address);
                    $hiddenInputToken.val(g_challengeToken);
                    $verifyButton.hide();
                    $overlay.hide();
                    $okCheckmark.fadeIn(fadeInDuration);
                    $localNumber.prop('readonly', true);
                    $countryCode.prop('readonly', true);
                    if (typeof settings.onSolved === 'function') settings.onSolved(g_challengeToken);
                } catch (error) {
                    if (typeof settings.onError === 'function') settings.onError(error);
                    $overlay.showPage('vcode',`Der eingegebene Code war nicht korrekt.<br>Bitte geben Sie den Code erneut ein.<br>${error}`);
                }
            }

        };

        //Rest-Calls
        
        /// <summary>
        /// Gets the two-factor authentication account data for the given sitekey.
        /// </summary>
        /// <returns>
        /// The two-factor authentication account data.
        /// </returns>
        async function getAccountData(twofaSitekey) {

            if (!twofaSitekey) {
                throw 'twofaSitekey not defined';
            }

            const accountData = await restCall('GET', '/account', {
                twofaSitekey: twofaSitekey
            });

            if (!accountData.domains?.includes(window.location.hostname)) {
                throw `Domain ${window.location.hostname} doesnt match twofaAccount.domains: ${accountData.domains}`;
            }
            return accountData;
        }

        function restCall(method = 'PUT', path = '/', data = {}) {
            return new Promise((resolve, reject) => {
                const params = new URLSearchParams(data);
                const url = twofaApi + path + '?' + params.toString();
                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState != 4) {
                        return;
                    }
                    if (this.status < 200) {
                        reject(`twofa-Server nicht erreichbar (status=${this.status})`);
                        return;
                    }
                    if ([401, 404].includes(this.status)) {
                        reject('twofaSitekey incorrect');
                        return;
                    }
                    try {
                        const json = JSON.parse(this.responseText);
                        json.status = this.status;
                        resolve(json);
                    }
                    catch (e) {
                        console.log(`restCall JSON.parse(${this.responseText}) @ ${url}`);
                        reject(e);
                    }
                };
                xhttp.open(method, url, true);
                xhttp.send();
            });
        };

        async function postTwofaSend(twofaType, twofaSitekey, captchaToken, address) {
            if (twofaType == twofaTypes.optinSms) {
                return await postTwofaSendsms(twofaSitekey, captchaToken, address);
            }
            if (twofaType == twofaTypes.optinMail) {
                return await postTwofaSendmail(twofaSitekey, captchaToken, address);
            }
            throw `unknown twofaType ${twofaType}`;
        }

        async function postTwofaSendsms(twofaSitekey, captchaToken, phoneNumber) {
            return await restCall('POST', '/sendsms', {
                twofaSitekey: twofaSitekey,
                captchaToken: captchaToken,
                phonenumber: phoneNumber
            });
        }

        async function postTwofaSendmail(twofaSitekey, captchaToken, mailaddress) {
            return await restCall('POST', '/sendmail', {
                twofaSitekey: twofaSitekey,
                captchaToken: captchaToken,
                mailaddress: mailaddress
            });
        }

        async function putTwofaPreverifyCode(twofaSitekey, challengeToken, verificationCode) {
            const response = await restCall('PUT', '/preverifycode', {
                twofaSitekey: twofaSitekey,
                challengeToken: challengeToken,
                code: verificationCode
            });

            if (response.status == 403) {
                const limitAttempts = response.limitAttempts;
                if (limitAttempts > 1) {
                    throw `Noch ${limitAttempts} Versuche`;
                }
                else if (limitAttempts == 1) {
                    throw `Letzter Versuch`;
                }
                else {
                    throw `Keine weiteren Versuche`;
                }
            }

            return response;
        }

        this.onSolved  = callback => { settings.onSolved  = callback; return this; };
        this.onLoad    = callback => { settings.onLoad    = callback; return this; };
        this.onExpired = callback => { settings.onExpired = callback; return this; };
        this.onError = callback => { settings.onError = callback; return this; };

        return this;
    };
})(jQuery);