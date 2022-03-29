const isBlank = str => str.trim().length === 0
const COMMENTS_ENDPOINT = 'api/comments'

// todo refactoring + error handling
const ExampleApp = {
    data() {
        return {
            user_name: '',
            user_message: '',
            comments: [],
        }
    },
    methods: {
        addComment() {
            if (isBlank(this.user_name) || isBlank(this.user_message))
                return;
            axios.post(COMMENTS_ENDPOINT, {name: this.user_name, message: this.user_message, tokenId: this.get_captcha_token()}).then(response => {
                this.updateComments();
                Captcha.reset(this.get_captcha_element())
            })

            this.user_name = '';
            this.user_message = '';
        },
        updateComments() {
            axios.get(COMMENTS_ENDPOINT).then(response => {
                this.comments = response.data;
            })
        },
        get_captcha_token() {
            const elem = this.get_captcha_element();
            return elem.dataset['token'];
        },
        get_captcha_element() {
            return document.getElementById('captcha_element');
        }
    },
    mounted() {
        this.updateComments();
        Captcha.initCaptcha();
    }
}

Vue.createApp(ExampleApp).mount('#app')
