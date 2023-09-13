/** 
 * A jquery-plugin to popup an overlay. 
 * The overlay can carry each dom you want.
 * The dom-elements are arranged in pages.
 * You can easy flipp between pages and hide and show them together with the oyerlay
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
var beinwell = 0;
(function ($) {

    var $overlay = null;
    var pages = {};

    $.bsmsOverlay = function (options = {}) {

        const caller = this;
        if (!options.className) options.className = 'bsms-overlay';

        const defaultStyles = `
.${options.className} {
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
.${options.className} .overlay-page {
    position:relative;
    width:400px;
    height:250px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family:arial;
}
.${options.className} .overlay-title {
    position:absolute;
    top:10px;
    left:0;
    width:380px;
    padding:10px;
}`;

        const defaultSettings = {
            userStyles: defaultStyles,
            className: 'bsms-overlay',
            onClose: null,
            closeRequested: null,
            pages: {},
            fadeInDuration: 500,
        };

        const settings = $.extend({}, defaultSettings, options);

        if ($overlay) return $overlay;

        $(`<style type="text/css">${settings.userStyles}</style>`)
            .prependTo('head');

        //dom
        $overlay = $(`<div class="${settings.className}"></div>`)
            .appendTo('body')
            .hide();
        const $overlayClose = $(`<button class="overlay-close">&#x2716;</button>`)
            .appendTo($overlay)
            .click(closeOverlayClick);

        //Exports
        $overlay.onClose = callback => { settings.onClose = callback; return $overlay; };
        $overlay.closeRequested = callback => { settings.closeRequested = callback; return $overlay; };
        $overlay.addPage = (pagename, title = null, $dom = []) => {
            return $overlay.getPage(pagename)
                .empty()
                .append($dom)
                .setTitle(title);
        };
        $overlay.getPage = pagename => {
            const sanitizedPagename = sanitizePagename(pagename);
            if (!pages.hasOwnProperty(sanitizedPagename)) {
                const $overlayTitle     = $(`<div class="overlay-title     overlay-title-${sanitizedPagename}    "></div>`);
                const $overlayContainer = $(`<div class="overlay-container overlay-container-${sanitizedPagename}"></div>`);
                const $overlayPage      = $(`<div class="overlay-page      overlay-page-${sanitizedPagename}     "></div>`)
                    .appendTo($overlay)
                    .append($overlayTitle)
                    .append($overlayContainer)
                    .hide();
                $overlayContainer.addPage = (pagename, title = null, $dom = []) => {
                    return $overlay.addPage(pagename, title, $dom);
                };
                $overlayContainer.getPage = pagename => {
                    return $overlay.getPage(pagename);
                };
                $overlayContainer.showPage = (pagename, title = null, afterFadeIn = null) => {
                    return $overlay.showPage(pagename, title, afterFadeIn);
                };
                $overlayContainer.hide = () => {
                    return $overlay.hide();
                };
                $overlayContainer.show = () => {
                    return $overlay.showPage(pagename);
                };
                $overlayContainer.hidePage = () => {
                    $overlayPage.hide();
                    return $overlayContainer;
                };
                $overlayContainer.setTitle = title => {
                    if (title !== null) $overlayTitle.html(title);
                    return $overlayContainer;
                };
                $overlayContainer.fadeIn = (afterFadeIn = null) => {
                    $overlayPage.fadeIn(settings.fadeInDuration, afterFadeIn);
                    return $overlayContainer;
                };

                pages[sanitizedPagename] = $overlayContainer
            }
            return pages[sanitizedPagename];
        }
        $overlay.showPage = (pagename, title = null, afterFadeIn = null) => {
            $overlay
                .hideAllPages(pagename)
                .show();
            return $overlay.getPage(pagename)
                .setTitle(title)
                .fadeIn(afterFadeIn);
        };
        $overlay.hideAllPages = (exceptPagename=null) => {
            const sanitizedPagename = sanitizePagename(exceptPagename);
            $.each(pages, (pagename, $overlayContainer) => {
                if (sanitizedPagename != pagename) {
                    $overlayContainer.hidePage();
                }
            });
            return $overlay;
        }
        return $overlay;

        //Events
        function closeOverlayClick(event) {
            if (event) event.preventDefault();
            if (settings.closeRequested && !settings.closeRequested()) return;
            $overlay.hide();
            if (settings.onClose) settings.onClose();
        }

        //Tools
        function sanitizePagename(pagename = '') {
            if (typeof pagename != 'string') return randomPagename();
            pagename = pagename
                .replace(/[^a-zA-Z0-9_\-]/g, '')
                .replace(/^[0-9_\-]+/, '')
                .replace(/-+$/, '');
            if (!pagename) return randomPagename();
            return pagename;
        }
        function randomPagename(length = 20) {
            var pagename = '';
            for (var i = 0; i < length; i++) {
                pagename += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            }
            return pagename;
        }
    };
})(jQuery);

