package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

public record AprFundDocRes(Long apprId, LocalDateTime regDate, LocalDateTime effectDate, String classTreeNameAllPath, String title,
                            String receiveName, String fileName) {
}
