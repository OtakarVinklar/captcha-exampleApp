package com.example.captcha

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.client.WebClient

@SpringBootApplication
class ClientBackendApplication

fun main(args: Array<String>) {
	runApplication<ClientBackendApplication>(*args)
}
