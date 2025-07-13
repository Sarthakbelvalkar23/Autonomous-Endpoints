package com.example.Autonomous.Endpoints.helper;

import com.example.Autonomous.Endpoints.model.DemandRecord;
import org.apache.catalina.Store;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class CsvHelper {

    public static List<DemandRecord> parseCSV(InputStream is) {
        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())
        ) {
            List<DemandRecord> records = new ArrayList<>();

            for (CSVRecord csv : csvParser) {

                LocalDate date = LocalDate.parse(csv.get("Date"), DateTimeFormatter.ofPattern("dd-MM-yyyy"));

                DemandRecord record = new DemandRecord();
                record.setDate(date);
                record.setStoreId(csv.get("Store ID"));
                record.setProductId(csv.get("Product ID"));
                record.setInventoryLevel(Integer.parseInt(csv.get("Inventory")));
                record.setUnitsSold(Integer.parseInt(csv.get("Units Sold")));
                record.setUnitsOrdered(Integer.parseInt(csv.get("Units Ordered")));
                record.setPrice(Double.parseDouble(csv.get("Price")));
                record.setDiscount(Double.parseDouble(csv.get("Discount")));
                record.setWeatherCondition(csv.get("Weather Condition"));
                record.setPromotion(csv.get("Promotion").equals("1"));
                record.setCompetitorPricing(Double.parseDouble(csv.get("Competitor Pricing")));
                record.setSeasonality(csv.get("Seasonality"));
                record.setEpidemic(csv.get("Epidemic").equals("1"));
                record.setDemand(Integer.parseInt(csv.get("Demand")));
                record.setFestivalFlag(Boolean.parseBoolean(csv.get("Festival Flag")));

                records.add(record);
            }
            return records;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV: " + e.getMessage());
        }
    }
}
