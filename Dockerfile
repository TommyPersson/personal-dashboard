FROM eclipse-temurin:21

ENV DATA_DIR=/data

EXPOSE 8080

RUN mkdir /app \
    && mkdir $DATA_DIR

COPY device-backend/target/device-backend-*-shaded.jar /app/

CMD ["java", "-jar", "/app/device-backend-1.0-SNAPSHOT-shaded.jar"]