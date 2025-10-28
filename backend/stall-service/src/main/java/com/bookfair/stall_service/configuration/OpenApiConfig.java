package com.bookfair.stall_service.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class OpenApiConfig {

//  @Bean
//  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//    http
//        .authorizeHttpRequests(auth -> auth
//            .requestMatchers(
//                "/v3/api-docs/**",
//                "/swagger-ui/**",
//                "/swagger-ui.html",
//                "/swagger-ui/index.html",
//                "/webjars/**"
//            ).permitAll()
//            .anyRequest().authenticated()
//        );
//    http.formLogin(Customizer.withDefaults());
//    http.httpBasic(Customizer.withDefaults());
//
//    return http.build();
//  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll() // Allow access to all endpoints
        )
        .csrf(csrf -> csrf.disable()) // Disable CSRF using the new DSL
        .formLogin(formLogin -> formLogin.disable()) // Disable the login form using the new DSL
        .httpBasic(
            httpBasic -> httpBasic.disable()); // Disable basic authentication using the new DSL

    return http.build();
  }

//
//  @Bean
//  public UserDetailsService users() {
//    PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
//    UserDetails user = User.withUsername("admin")
//        .password(encoder.encode("password"))
//        .roles("USER")
//        .build();
//    return new InMemoryUserDetailsManager(user);
//  }
//
//  @Bean
//  public OpenAPI customOpenAPI() {
//    return new OpenAPI()
//        .info(new Info()
//            .title("Stall Service API")
//            .version("v1.0")
//            .description("API documentation for Stall Service")
//
//        );
//  }

//  @Bean
//  public GroupedOpenApi stallApi() {
//    return GroupedOpenApi.builder()
//        .group("stall-service")
//        .packagesToScan("com.bookfair.stall_service.controller")
//        .build();
//  }

  @Bean
  public OpenAPI customOpenAPI() {
    final String securitySchemeName = "bearerAuth";
    return new OpenAPI()
        .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
        .components(new Components()
            .addSecuritySchemes(securitySchemeName,
                new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")))
        .info(new Info()
            .title("Stall Management API")
            .version("1.0.0")
            .description("API documentation for the Stall management system"));
  }

}
