package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

/** 계좌폐쇄 등록 (AS-IS flt.Flt06_AccountClose.insert: 폐쇄일 + 고른 계좌들) */
public record AccountCloseReq(String closeDate, List<Long> accountIds) {
}
