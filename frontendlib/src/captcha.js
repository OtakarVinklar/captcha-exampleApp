

const Captcha = (function (exports) {
    const BASE_URL = 'http://localhost:8080/api/verification/'
    const TASKS_URL = BASE_URL + 'tasks'
    const TOKENS_URL = BASE_URL + 'tokens'
    const CAPTCHA_ELEMENT_CLASS = 'captcha-verification'
    const TOKEN_DATA_ATTRIBUTE = 'token'
    const SITEKEY_DATA_ATTRIBUTE = 'sitekey'
    const TASKID_DATA_ATTRIBUTE = 'taskid'


    function initCaptcha() {
        document.addEventListener("DOMContentLoaded", function() {
            const captchaElements = document.getElementsByClassName(CAPTCHA_ELEMENT_CLASS)

            for (let elem of captchaElements) {
                Captcha.reset(elem);
            }
        });
    }

    function create_captcha_element(elem) {
        delete elem.dataset[TOKEN_DATA_ATTRIBUTE]
        elem.innerHTML = ''
        load_captcha_task(elem)
    }

    function captcha_on_submit() {

    }
    function load_captcha_task(elem) {
        const site_key = elem.dataset[SITEKEY_DATA_ATTRIBUTE]

        get_task(site_key, response => {
            elem.dataset[TASKID_DATA_ATTRIBUTE] = response.data.id

            const descriptionElem = document.createElement('p')
            const text = document.createTextNode(response.data.description)
            descriptionElem.appendChild(text)
            elem.appendChild(descriptionElem)

            const answer_data_lambda = create_answersheet(elem, response.data.answerSheet)

            create_submit_button(elem, answer_data_lambda)
        })
    }

    function create_answersheet(elem, answer_sheet) {
        displayTask(answer_sheet.displayData, elem)

        switch (answer_sheet.answerType) {
            case 'TextListAnswer':
                return create_MultipleText_anwersheet(elem, answer_sheet);
            case 'TextAnswer':
                return create_TextField_Answersheet(elem, answer_sheet);
            default:
                throw Error(`Unknown answerType: ${answer_sheet.type}`)
        }
    }

    function displayTask(data, elem) {
        const displayElement = createDisplayElement(data)
        elem.appendChild(displayElement)
    }

    function createDisplayElement(data) {
        switch (data.type) {
            case 'ImageDisplayData':
                const image_element = document.createElement('img');
                // image_element.setAttribute('title', choice.imageId);
                image_element.setAttribute('src', data.base64ImageString);
                image_element.setAttribute('width', '200px');
                return image_element

            case 'ListDisplayData':
                const container_element = document.createElement('div');
                for (displayData of data.listData) {
                    container_element.append(createDisplayElement(displayData))
                }
                return container_element
        }
    }

    function create_MultipleText_anwersheet(elem, answer_sheet_data) {
        const text_input = document.createElement('input');
        text_input.setAttribute('type', "text");
        elem.appendChild(text_input)

        return () => {
            return {type: 'TextListAnswer', texts: text_input.value.split(',')}
        }
    }

    function create_TextField_Answersheet(elem, answer_sheet_data) {
        const text_input = document.createElement('input')

        text_input.setAttribute('type', "text");

        elem.appendChild(text_input);

        return () => {
            return {type: 'TextAnswer', text: text_input.value}
        }
    }

    function create_submit_button(elem, answer_data_lambda) {
        const buttonElement = document.createElement('button')
        buttonElement.innerHTML = 'Submit captcha'
        buttonElement.setAttribute('type', 'button')

        buttonElement.addEventListener('click', () => {
            get_token(elem.dataset[TASKID_DATA_ATTRIBUTE], answer_data_lambda(), response => {
                elem.dataset[TOKEN_DATA_ATTRIBUTE] = response.data.id
                elem.innerHTML = `Success, token: ${response.data.id}`
            },
                (error) => {reset(elem)})
        })

        elem.appendChild(buttonElement)
    }

    function get_task(siteKey, callback) {
        axios.post(`${TASKS_URL}?siteKey=${siteKey}`, {}).then(response => {
            console.log(response)
            callback(response)
        }).catch(error => {
            if (error.response) {
                // Request made and server responded
                console.log(1);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(2);
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log(3);
                console.log('Error', error.message);
            }
        });
    }

    function get_token(taskId, data, callback, error_callback) {
        axios.post(TOKENS_URL, {taskId, data}).then(response => {
            callback(response)
        }).catch(error => {
            if (error.response) {
                // Request made and server responded
                console.log(1);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(2);
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log(3);
                console.log('Error', error.message);
            }
            error_callback(error)
        });
    }

    function reset(element) {
        create_captcha_element(element);
    }

    exports.reset = reset;
    exports.initCaptcha = initCaptcha;

    return exports
}({}));
