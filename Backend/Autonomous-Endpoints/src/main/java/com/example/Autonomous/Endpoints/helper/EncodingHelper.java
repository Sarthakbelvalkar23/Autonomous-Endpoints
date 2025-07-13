package com.example.Autonomous.Endpoints.helper;

import com.example.Autonomous.Endpoints.dto.*;
import org.springframework.stereotype.Component;

@Component
public class EncodingHelper {
    public PredictInput encode(RawDemandRequest raw) {
        return new PredictInput(
                raw.getStoreId(),
                raw.getProductId(),
                Category.encode(raw.getCategory()),
                Region.encode(raw.getRegion()),
                raw.getInventoryLevel(),
                raw.getUnitsSold(),
                raw.getUnitsOrdered(),
                raw.getPrice(),
                raw.getDiscount(),
                WeatherCondition.encode(raw.getWeatherCondition()),
                raw.isPromotion(),
                raw.getCompetitorPricing(),
                Seasonality.encode(raw.getSeasonality()),
                raw.isEpidemic(),
                raw.isFestivalFlag(),
                raw.getDate()
        );
    }
}
