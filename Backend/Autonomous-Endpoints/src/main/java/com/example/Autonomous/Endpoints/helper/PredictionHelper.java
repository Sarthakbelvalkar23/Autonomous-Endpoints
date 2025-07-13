package com.example.Autonomous.Endpoints.helper;

import com.example.Autonomous.Endpoints.dto.DemandPredictionRequest;
import com.example.Autonomous.Endpoints.dto.PredictInput;
import com.example.Autonomous.Endpoints.dto.RawDemandRequest;
import com.example.Autonomous.Endpoints.model.DemandRecord;
import com.example.Autonomous.Endpoints.repository.DemandRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class PredictionHelper {

    @Autowired
    private DemandRecordRepository demandRecordRepository;

    public RawDemandRequest buildPredictionRequest(RawDemandRequest input) {
        LocalDate targetDate = LocalDate.parse(input.getDate());
        LocalDate fromDate = targetDate.minusMonths(6);
        LocalDate toDate = targetDate.minusDays(1);

        List<DemandRecord> history = demandRecordRepository
                .findByStoreIdAndProductIdAndDateBetween(input.getStoreId(), input.getProductId(), fromDate, toDate);

        double avgSold = history.stream().mapToInt(DemandRecord::getUnitsSold).average().orElse(0);
        double avgOrdered = history.stream().mapToInt(DemandRecord::getUnitsOrdered).average().orElse(0);

        return new RawDemandRequest(
                input.getStoreId(),
                input.getProductId(),
                input.getCategory(),
                input.getRegion(),
                0, // inventoryLevel can be 0 or predicted later
                (int) avgSold,
                (int) avgOrdered,
                input.getPrice(),
                input.getDiscount(),
                input.getWeatherCondition(),
                input.isPromotion(),
                input.getCompetitorPricing(),
                input.getSeasonality(),
                input.isEpidemic(),
                input.isFestivalFlag(),
                input.getDate()
        );
    }
}
