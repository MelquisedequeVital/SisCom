# ==========================================
# ETAPA 1: Build (Compilação)
# ==========================================
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# 1. Copia os arquivos do Maven Wrapper e o pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# 2. Permissão de execução e cache das dependências
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline

# 3. Copia o código-fonte e gera o pacote .jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ==========================================
# ETAPA 2: Execução (Imagem Final Otimizada)
# ==========================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copia o .jar gerado na Etapa 1
COPY --from=build /app/target/*.jar app.jar

# Inicializa o Spring Boot ajustando a porta dinâmica do Render ($PORT) e controle de memória JVM
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]