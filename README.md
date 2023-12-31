# jQuery PhonenumberValidator
[Homepage](https://www.berlinsms.de/)

# Description
A jquery-plugin to verify a phonenumber direct in the formular.

The user can enter his phone number in the form.

BerlinSMS will send a code to this number.

The user receives this code via SMS and has to enter it again on the website.

If the code is correct, the frontend receives a callback and a token.

The token can be used to check the validity in the backend.

# Usage

Download bsms-phonenumber-validator.js
```link
https://static.berlinsms.de/toolsforcoder/phonenumber-validator/dist/bsms-phonenumber-validator.min.js
```

Include jquery and bsms-phonenumber-validator.js
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="bsms-phonenumber-validator.min.js"></script>
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
$(document).ready(()=>{
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

| Option                | DESCRIPTION                                                                                                                                       | DEFAULT                               |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| inputNamePhonenumber  | Name attribute of a hidden input tag. The plugin adds it to the form and writes the phonenumber into the value                                    | bsms-phonenumber                      |
| inputNameToken        | Name attribute of a hidden input tag. The plugin adds it to the form and writes the challenge token into the value                                | bsms-challenge-token                  |
| countries             | Dictionary of available countries, each key must be an uniqued identifier of a country, values are dictionaries with name and code of the country | {"DE": { name:"Germany", code:"+49"}} |
| defaultState          | Initial state of the plugin, possible options are start and verified                                                                              | start                                 |
| defaultCountry        | Identifier of a country that ist initially selected on defaultState 'start' (must be a key in the country dictionary)                             | DE                                    |
| defaultLocalnumber    | Localpart of a phonenumber that is initially displayed on defaultState 'start'                                                                    |                                       |
| defaultVerifiedNumber | Phonenumber initially displayed on defaultState 'verified'                                                                                        |                                       |
| twofaSitekey          | twofaSitekey given by berlinsms (https://www.berlinsms.de/dokumentation/sitekey-secretkey-generieren/)                                            |                                       |
| onLoad                | Callback that fires when the validator has loaded                                                                                                 | null                                  |
| onSolved              | Callback that is triggered when the phonenumber is validated                                                                                      | null                                  |
| onExpired             | Callback triggered when the validation-time expires                                                                                               | null                                  |
| onError               | Callback, will be triggered, if something is wrong                                                                                                | null                                  | 
| onStateChange         | Callback triggered when state change between start and verified                                                                                   | null                                  | 
| showCredits           | shows credits                                                                                                                                     | true                                  |
