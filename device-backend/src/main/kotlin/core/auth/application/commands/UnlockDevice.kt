package core.auth.application.commands

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import core.CoreConfig
import core.auth.domain.AuthErrors
import core.auth.domain.DeviceSessionJWT
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject
import java.time.Instant
import java.time.temporal.ChronoUnit

data class UnlockDevice(val pin: String) : Command<DeviceSessionJWT>

class UnlockDeviceCommandHandler @Inject constructor(
    private val config: CoreConfig,
) : CommandHandler<UnlockDevice, DeviceSessionJWT> {
    override suspend fun handle(command: UnlockDevice): DeviceSessionJWT {
        if (command.pin != config.auth.pinCode) {
            throw AuthErrors.InvalidPinCode()
        }

        return DeviceSessionJWT(JWT.create()
            .withClaim("isDeviceUnlocked", true)
            .withExpiresAt(Instant.now().plus(config.auth.sessionTimeoutMinutes, ChronoUnit.MINUTES))
            .sign(Algorithm.HMAC512(config.auth.jwtSecret)))
    }
}

