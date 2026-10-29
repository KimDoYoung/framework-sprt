package kr.co.kfs.asseterp.biz.car.dto;

/** 운행일지 일괄생성 — stdMonth 'YYYY.MM'. 그 달의 작업일마다 같은 내용으로 만든다(AS-IS Car04_Lookup_Batch → Car04_Journal.batch) */
public record CarJournalBatchReq(Long infoId, String stdMonth, Long mileage, Long unBizMileage, Long commuteMileage, Long bizMileage,
                                 String destination, String reason) {
}
