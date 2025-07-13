package com.example.Autonomous.Endpoints.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DemandPredictionRequest {
    private String storeId;
    private String productId;
    private String category;
    private String region;
    private int inventoryLevel;
    private int unitsSold;
    private int unitsOrdered;
    private double price;
    private double discount;
    private String weatherCondition;
    private boolean promotion;
    private double competitorPricing;
    private String seasonality;
    private boolean epidemic;
    private boolean festivalFlag;
    private String date;
}
