package com.example.Autonomous.Endpoints;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class AutonomousEndpointsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutonomousEndpointsApplication.class, args);
	}
	@Configuration
	public static class WebClientConfig {

		@Bean
		public WebClient webClient() {
			return WebClient.builder().build(); // <-- provides WebClient directly
		}
	}

}
