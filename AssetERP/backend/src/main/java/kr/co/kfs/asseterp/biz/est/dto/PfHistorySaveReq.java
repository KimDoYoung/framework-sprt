package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 수행내역 저장 (AS-IS est.Est03_PfHistory.modelUpdate) + 같은 화면에서 함께 저장하는 증빙자료(est.Est04_PfFile.update·delete).
 * pfHistoryId는 [등록] 때 받은 새 번호 또는 기존 행. statusCode는 10(승인신청)·null(신청취소)·기존 값
 */
public record PfHistorySaveReq(Long pfHistoryId, Long pfContractId, Long no, LocalDate startDate, LocalDate closeDate, String content, String detail,
                               Long personId, String statusCode, Long confirmerId,
                               List<PfFileSaveReq> files, List<Long> deleteFileIds) {
}
