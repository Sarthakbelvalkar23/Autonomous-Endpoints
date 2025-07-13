package com.example.Autonomous.Endpoints.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DemandPredictionResponse {
    private String storeId;
    private String productId;
    private String date;
    private int predictedDemand;
}
