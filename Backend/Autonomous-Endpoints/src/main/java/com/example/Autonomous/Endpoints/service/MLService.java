package com.example.Autonomous.Endpoints.service;

import com.example.Autonomous.Endpoints.dto.DemandPredictionRequest;
import com.example.Autonomous.Endpoints.dto.DemandPredictionResponse;
import com.example.Autonomous.Endpoints.dto.PredictInput;
import com.example.Autonomous.Endpoints.dto.RawDemandRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MLService {


    private final WebClient webClient;

    public MLService(WebClient webClient) {
        this.webClient = webClient;
    }

    public DemandPredictionResponse predictDemand(PredictInput input) {

        return webClient.post()
                .uri("http://localhost:5000/predict-demand")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(input)
                .retrieve()
                .bodyToMono(DemandPredictionResponse.class)
                .block();  // or use reactive chain
    }

}
