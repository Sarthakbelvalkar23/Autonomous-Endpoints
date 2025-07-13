package com.example.Autonomous.Endpoints.controller;

import com.example.Autonomous.Endpoints.dto.DemandPredictionResponse;
import com.example.Autonomous.Endpoints.dto.PredictInput;
import com.example.Autonomous.Endpoints.dto.RawDemandRequest;
import com.example.Autonomous.Endpoints.helper.CsvHelper;
import com.example.Autonomous.Endpoints.helper.EncodingHelper;
import com.example.Autonomous.Endpoints.helper.PredictionHelper;
import com.example.Autonomous.Endpoints.model.DemandRecord;
import com.example.Autonomous.Endpoints.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/demand")
public class DemandRecordController {

    @Autowired
    private DemandRecordService demandRecordService;
    @Autowired
    private PredictionHelper predictionHelper;
    @Autowired
    private MLService mlService;
    @Autowired
    private EncodingHelper encodingHelper;

    @PostMapping
    public ResponseEntity<DemandRecord> createDemand(@RequestBody DemandRecord record) {
        return ResponseEntity.ok(demandRecordService.save(record));
    }

    @GetMapping
    public ResponseEntity<List<DemandRecord>> getAllDemands() {
        return ResponseEntity.ok(demandRecordService.getAll());
    }

    @GetMapping("/byProduct/{productId}")
    public ResponseEntity<List<DemandRecord>> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(demandRecordService.getByProduct(productId));
    }

    @GetMapping("/byStore/{storeId}")
    public ResponseEntity<List<DemandRecord>> getByStore(@PathVariable String storeId) {
        return ResponseEntity.ok(demandRecordService.getByStore(storeId));
    }

    @GetMapping("/byDate")
    public ResponseEntity<List<DemandRecord>> getByDate(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return ResponseEntity.ok(demandRecordService.getByDate(date));
    }
    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".csv")) {
            return ResponseEntity.badRequest().body("Invalid file. Please upload a valid CSV.");
        }

        try {
            List<DemandRecord> records = CsvHelper.parseCSV(
                    file.getInputStream()
            );

            // Save all
            demandRecordService.saveAll(records);
            return ResponseEntity.ok("CSV uploaded and records saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping(value = "/predict", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DemandPredictionResponse> predictDemand(@RequestBody RawDemandRequest input) {
        RawDemandRequest request = predictionHelper.buildPredictionRequest(input);
        PredictInput encoder = encodingHelper. encode(request);
        System.out.println(encoder);

        DemandPredictionResponse prediction = mlService.predictDemand(encoder);
        return ResponseEntity.ok(prediction);
    }

}

