package com.example.Autonomous.Endpoints.service;

import com.example.Autonomous.Endpoints.model.DemandRecord;
import com.example.Autonomous.Endpoints.repository.DemandRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DemandRecordService {

    @Autowired
    private DemandRecordRepository demandRecordRepository;

    public DemandRecord save(DemandRecord record) {
        return demandRecordRepository.save(record);
    }

    public List<DemandRecord> getAll() {
        return demandRecordRepository.findAll();
    }

    public List<DemandRecord> getByProduct(String productId) {
        return demandRecordRepository.findByProductId(productId);
    }

    public List<DemandRecord> getByStore(String storeId) {
        return demandRecordRepository.findByStoreId(storeId);
    }

    public List<DemandRecord> getByDate(LocalDate date) {
        return demandRecordRepository.findByDate(date);
    }
    public void saveAll(List<DemandRecord> records) {
        demandRecordRepository.saveAll(records);
    }

}

