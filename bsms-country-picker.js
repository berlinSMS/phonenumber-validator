/** 
 * A jquery-plugin to pick a country-code in a formular
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
 
 (function($) {
    $.fn.bsmsCountryPicker = function(options) {
        
        if (!options.className) options.className = 'bsms-country-code';
        
        const defaultStyles = `
.${options.className} {
  position:relative;
  display: inline-block;
  top:0px;
  left:0px;
  width:55px;
}
.${options.className}:hover {
  background-color: RGBA(240,240,240,0.9);
  width:280px;
  max-height:300px;
  top:2px;
  overflow-x:visible;
  overflow-y: scroll; 
}
.${options.className}       input[type="radio"] + label{
   font-family:arial
}
.${options.className}       input[type="radio"] + label div{
   font-weight: bold; 
   color: darkblue;
   width:50px;
   display:inline-block
}
.${options.className}       input[type="radio"] + label span {
   font-style: italic; 
   color: #e83e8c;
   min-width:200px;
   display:inline-block;
}
.${options.className}       input[type="radio"] {
  display: none;
}
.${options.className}       input[type="radio"] + label {
  display: none;
}
.${options.className}       input[type="radio"]:checked + label {
  color: #28AADC;
  display: inline-block;
}
.${options.className}       input[type="radio"]:checked + label span {
  display: none;
}
.${options.className}       input[type="radio"]:checked + label div:after {
  content:"\\25BE";
}
.${options.className}:hover input[type="radio"] + label {
  display: inline-block;
}
.${options.className}:hover input[type="radio"] + label:hover {
  background-color: lightblue;
}
.${options.className}:hover input[type="radio"]:checked + label {
  background-color: lightgrey;
}
.${options.className}:hover input[type="radio"]:checked + label span {
  display:inline-block
}
.${options.className}:hover input[type="radio"]:checked + label div:after {
  content:''
}`;    
                
        const defaultSettings = {
            userStyles: defaultStyles,
            countries: {"DE": { name:"Germany", code:"+49"}},
            defaultCountry: "DE",
            inputName: 'bsms-country-code',
            className: 'bsms-country-code'
        };

        const settings = $.extend({}, defaultSettings, options);

        $(`<style type="text/css">${settings.userStyles}</style>`)
            .prependTo('head');    

        return this.each(function() {
            const $container = $(this);
            const $dropdown = $(`<div class="${settings.className}"></div>`).appendTo($container);

            $.each(settings.countries, function(short, country) {
                $dropdown.append(`
<div>
<input id="${short}" type="radio" name="${settings.inputName}" value="${country.code}"/>
<label for="${short}">
    <div>${country.code}</div>
    <span>${country.name}</span>
</label>
</div>`);
            });
            $dropdown.find(`input`).first()
                .prop('checked', true);
            $dropdown.find(`input#${settings.defaultCountry}`)
                .prop('checked', true);
            $container.append($dropdown);

            $dropdown.hover(()=>{
                const $checkedInput = $dropdown.find(`input:checked`).closest('div');
                $dropdown.scrollTop( $dropdown.scrollTop() + $checkedInput.position().top );            
            });

            $dropdown.click(event => {
                $dropdown
                    .fadeOut(1)
                    .delay(1)
                    .fadeIn(1);
            });

            $dropdown.change(event => {
                $container.val($(event.target).val());
            });

            //select and trigger default            
            var defaultInput = $dropdown.find(`input#${settings.defaultCountry}`);
            if (!defaultInput.length) {
                defaultInput = $dropdown.find(`input`).first();
            }
            defaultInput
                .prop('checked', true)
                .trigger('change');
            
        });
    };
})(jQuery);
