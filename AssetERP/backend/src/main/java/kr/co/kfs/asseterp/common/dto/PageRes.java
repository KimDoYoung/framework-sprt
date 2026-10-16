package kr.co.kfs.asseterp.common.dto;

import java.util.List;

/**
 * 서버 페이징 응답 (AS-IS GridPagingLoader: 목록 + 전체 건수)
 *
 * @param total 조건에 맞는 전체 건수
 * @param rows  요청한 페이지의 행
 */
public record PageRes<T>(long total, List<T> rows) {
}
