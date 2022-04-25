# Open-source CAPTCHA

This project has been created as a part of open source CAPTCHA: https://github.com/opendatalabcz/czech-captcha

Purpose of this project is to demonstrate the functionality of the open-source CAPTCHA. It is also an example how to use the CAPTCHA verification service. Further this project contains simple javascript library which enables simple injection of CAPTCHA into any element.

## Running the project
To run the project it is necessary to have installed JDK 11.
Then just run the command:

```
./grandlew bootRun 
```
Example website is then served on localhost:8081

## Using the javascript library
Simplistic javascript library is stored in the folder frontendlib. Bash script buildscript copies the library files into the backed project to use the latest version.

To use the library it is necessary to: 
- first include the library files into your project.
- Next mark element, where the CAPTCHA should be injected with **class captcha-verification**.
- Specify the site key with **sitekey data attribute** on the injected element.
- Call **Captcha.initCaptcha** method to load the CAPTCHA task
- Retrieve the created token after successful CAPTCHA completion from the **data attribute token** on the injected element.
- Reset of CAPTCHA challenge is done through function **Captcha.reset**, which takes the injected element as argument.

Our javascript library then takes care of acquiring a new task, displaying the task to the tested user and finally collecting the token, if the user is successful. The library won't and cannot take care of verifying the token.

