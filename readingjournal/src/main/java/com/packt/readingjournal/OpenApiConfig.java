package com.packt.readingjournal;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {
	
	@Bean
	public OpenAPI readingJournalDatabaseOpenAPI() {
		return new OpenAPI().info(new Info().title("Reading Journal REST API").description("My books stock").version("1.0"));
	}

}
