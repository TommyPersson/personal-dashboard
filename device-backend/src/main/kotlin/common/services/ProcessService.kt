package common.services

interface ProcessService {
    suspend fun getActiveProcessName(): String?
}