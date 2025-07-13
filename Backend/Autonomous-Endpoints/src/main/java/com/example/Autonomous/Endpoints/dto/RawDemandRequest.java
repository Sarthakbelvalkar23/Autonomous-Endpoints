package com.example.Autonomous.Endpoints.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawDemandRequest {
    private String storeId;
    private String productId;
    private String category;             // e.g., "Electronics"
    private String region;               // e.g., "North"
    private int inventoryLevel;
    private int unitsSold;
    private int unitsOrdered;
    private double price;
    private double discount;
    private String weatherCondition;     // e.g., "Snowy"
    private boolean promotion;
    private double competitorPricing;
    private String seasonality;          // e.g., "Winter"
    private boolean epidemic;
    private boolean festivalFlag;
    private String date;

    // Getters & setters (or use Lombok @Data)
}
