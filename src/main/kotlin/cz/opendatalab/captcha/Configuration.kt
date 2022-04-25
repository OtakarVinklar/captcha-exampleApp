package cz.opendatalab.captcha

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class Configuration {
    @Bean
    fun createWebClient(): WebClient = WebClient.builder()
        .baseUrl(CAPTCHA_SERVER_URL)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build()
//        .clientConnector(ReactorClientHttpConnector(HttpClient.from(TcpClient
//            .create()
//            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
//            .doOnConnected { connection: Connection ->
//                connection.addHandlerLast(ReadTimeoutHandler(10000, TimeUnit.MILLISECONDS))
//                connection.addHandlerLast(WriteTimeoutHandler(10000, TimeUnit.MILLISECONDS))
//            })))
//        .build()
}
