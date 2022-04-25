package cz.opendatalab.captcha



data class VerificationDTO(val tokenId: String, val secretKey: String)
data class EvaluationDTO(val isHuman: Boolean)

data class CommentDTO(val tokenId: String, val name: String, val message: String) {
    fun toComment(): Comment {
        return Comment(name, message)
    }
}
