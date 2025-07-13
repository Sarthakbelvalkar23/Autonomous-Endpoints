package com.example.Autonomous.Endpoints.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PredictInput {
    private String storeId;
    private String productId;
    private int category;             // e.g., "Electronics"
    private int region;               // e.g., "North"
    private int inventoryLevel;
    private int unitsSold;
    private int unitsOrdered;
    private double price;
    private double discount;
    private int weatherCondition;     // e.g., "Snowy"
    private boolean promotion;
    private double competitorPricing;
    private int seasonality;          // e.g., "Winter"
    private boolean epidemic;
    private boolean festivalFlag;
    private String date;


}
