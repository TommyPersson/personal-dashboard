package core.notifications.infrastructure

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.text.SimpleDateFormat

fun configureJackson(om: ObjectMapper) {
    om.configure(SerializationFeature.INDENT_OUTPUT, true)
    om.findAndRegisterModules()
    om.dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
}

object JSON {
    val objectMapper = jacksonObjectMapper().also(::configureJackson)
}
