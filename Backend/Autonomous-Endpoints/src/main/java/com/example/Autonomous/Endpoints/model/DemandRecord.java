package com.example.Autonomous.Endpoints.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandRecord {
    @Id
    @GeneratedValue()
    private Long id;

    private LocalDate date;

    private String storeId;
    private String region;

    private String productId;
    private String category;

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
    private int demand;
    private boolean festivalFlag;
}
