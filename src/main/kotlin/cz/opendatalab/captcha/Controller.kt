package cz.opendatalab.captcha

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

const val CAPTCHA_SERVER_URL = "http://localhost:8080"
const val VERIFICATION_PATH = "api/verification/tokens/verification"

const val COMMENTS_ENDPOINT = "/api/comments"
const val SECRET_KEY = "secretKey3"

@RestController
@RequestMapping(COMMENTS_ENDPOINT)
class Controller(private val webClient: WebClient) {

    val comments = mutableListOf(Comment("John", "Hello fellas"),
        Comment("Aleksandr", "Hello friendz"))

    @GetMapping
    fun getCommentList(): List<Comment> {
        return comments
    }

    @PostMapping
    fun createComment(@RequestBody commentDTO: CommentDTO): ResponseEntity<Void> {
        // TODO some polishing
        // TODO error handling
        val uri = UriComponentsBuilder.fromHttpUrl(CAPTCHA_SERVER_URL)
            .path(VERIFICATION_PATH)
            .build()
            .toUri()
        val body = BodyInserters.fromValue(VerificationDTO(commentDTO.tokenId, SECRET_KEY))

        val response = webClient.post()
            .uri(uri)
            .body(body)
            .retrieve()
            .bodyToMono(EvaluationDTO::class.java)
            .block()

        val validToken = response?.isHuman ?: false

        if (!validToken) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token")
        }
        comments.add(commentDTO.toComment())
        val location = URI("$COMMENTS_ENDPOINT/${comments.size}")
        return ResponseEntity.created(location).build()
    }
}
