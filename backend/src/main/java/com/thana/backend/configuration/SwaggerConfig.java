package com.thana.backend.configuration;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .servers(List.of(new Server().url("http://localhost:8082")))
        .components(new Components()
            .addSecuritySchemes("basicAuth", new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("basic")
            )
        )
        .addSecurityItem(new SecurityRequirement().addList("basicAuth"))
        .info(new Info()
            .title("My Awesome Spring Boot API")
            .version("1.0")
            .description("API documentation for the Spring Boot application.")
        );
  }
}
