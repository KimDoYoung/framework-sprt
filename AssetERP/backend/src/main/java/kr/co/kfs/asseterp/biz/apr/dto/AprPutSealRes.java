package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 인감확인 저장 결과 (AS-IS Apr01_Appr.updatePutSealEmpId 가 돌려주는 모델 중 인감확인자·확인일시) */
public record AprPutSealRes(Long apprId, String putSealEmpName, LocalDateTime putSealDate) {
}
