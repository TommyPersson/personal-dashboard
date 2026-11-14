FROM eclipse-temurin:25

ENV DATA_DIR=/data

EXPOSE 8080

RUN mkdir /app \
    && mkdir $DATA_DIR

COPY device-backend/target/device-backend-*-shaded.jar /app/app.jar

CMD ["java", "-jar", "/app/app.jar"]