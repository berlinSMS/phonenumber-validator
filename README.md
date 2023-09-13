# jQuery PhonenumberValidator
[Homepage](https://www.berlinsms.de/)

# Usage

Include jquery

    
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

Download bsms-phonenumber-validator.js
```link
https://raw.githubusercontent.com/berlinSMS/phonenumber-validator/main/bsms-phonenumber-validator.js
```

Include bsms-phonenumber-validator
```html
<script src="bsms-phonenumber-validator.js"></script>
```

Find your jquery-container and assign phonenumber-validator
```js
$('.plugin-container').bsmsPhonenumberValidator();    
```

Make sure, the script is fully loaded, before you assign phonenumber-validator, e.g. use jquerys 'ready'
```js
$(document).ready(function () {
    $('.plugin-container').bsmsPhonenumberValidator();
});    
```

Add options, if needed:
```js
$(document).ready(function() {
	$('.phonenumber-validator-container').bsmsPhonenumberValidator({
		countries: { 
			"AT": { name:"Österreich",  code:"+43"} ,
			"DE": { name:"Deutschland", code:"+49"}, 
			"CH": { name:"Schweiz",     code:"+41"}, 
		}, 
		defaultCountry: "DE"
	});
});   
```

Add callbacks, if needed:
```js
$(document).ready(function() {
	$('.phonenumber-validator-container').bsmsPhonenumberValidator({
		onSolved:onSolvedCallback
	});
});   
function onSolvedCallback() {
	alert('Phonenumber validated');
}
```

# Options

| Option               | DESCRIPTION                                                                                                                                       | DEFAULT                               |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| className            | For costum-css, class of the dropdown-container                                                                                                   | bsms-country-code                     |         
| inputNamePhonenumber | Name attribute of a hidden input tag. The plugin adds it to the form and writes the phonenumber into the value                                    | bsms-phonenumber                      |
| inputNameToken       | Name attribute of a hidden input tag. The plugin adds it to the form and writes the challenge token into the value                                | bsms-challenge-token                  |
| countries            | Dictionary of available countries, each key must be an uniqued identifier of a country, values are dictionaries with name and code of the country | {"DE": { name:"Germany", code:"+49"}} |
| defaultCountry       | Identifier of a country that ist initially selected must be a key in the country dictionary                                                       | DE                                    |
| defaultLocalnumber   | Localpart of a phonenumber that is initially displayed                                                                                            |                                       |
| twofaSitekey         | twofaSitekey given by berlinsms (https://www.berlinsms.de/dokumentation/sitekey-secretkey-generieren/)                                            |                                       |
| onLoad               | Callback that fires when the validator has loaded                                                                                                 | null                                  |
| onSolved             | Callback that is triggered when the phonenumber is validated                                                                                      | null                                  |
| onExpired            | Callback triggered when the validation-time expires                                                                                               | null                                  |
| onError              | Callback, will be triggered, if something is wrong                                                                                                | null                                  |                                                                                                                                                                  
