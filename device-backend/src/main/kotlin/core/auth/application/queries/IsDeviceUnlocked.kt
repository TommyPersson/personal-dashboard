package core.auth.application.queries

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import core.CoreConfig
import core.auth.application.contracts.IsDeviceUnlockedResponseDTO
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject


data class IsDeviceUnlocked(val jwt: String?) : Query<IsDeviceUnlockedResponseDTO>

class IsDeviceUnlockedQueryHandler @Inject constructor(
    private val config: CoreConfig,
) : QueryHandler<IsDeviceUnlocked, IsDeviceUnlockedResponseDTO> {
    override suspend fun handle(query: IsDeviceUnlocked): IsDeviceUnlockedResponseDTO {
        val isDeviceUnlocked = try {
            val parsedJwt = JWT.decode(query.jwt)
            val verifiedJwt = JWT.require(Algorithm.HMAC512(config.auth.jwtSecret)).build().verify(parsedJwt)
            verifiedJwt.getClaim("isDeviceUnlocked").asBoolean()
        } catch (e: Exception) {
            false
        }

        return IsDeviceUnlockedResponseDTO(
            isDeviceUnlocked = isDeviceUnlocked
        )
    }
}