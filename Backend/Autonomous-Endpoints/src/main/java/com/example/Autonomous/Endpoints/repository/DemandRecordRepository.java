package com.example.Autonomous.Endpoints.repository;

import com.example.Autonomous.Endpoints.model.DemandRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DemandRecordRepository extends JpaRepository<DemandRecord,Long> {
        List<DemandRecord> findByProductId(String productId);
        List<DemandRecord> findByStoreId(String storeId);
        List<DemandRecord> findByDate(LocalDate date);
        List<DemandRecord> findByStoreIdAndProductIdAndDateBetween(
                String storeId, String productId, LocalDate startDate, LocalDate endDate);


}
