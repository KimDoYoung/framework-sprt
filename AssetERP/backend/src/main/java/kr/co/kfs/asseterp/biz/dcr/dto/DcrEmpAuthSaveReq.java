package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** AS-IS Dcr04_EmpAuth.updateList 요청 (등록한 행 + 비고를 고친 행) */
public record DcrEmpAuthSaveReq(List<Row> rows) {
    public record Row(Long classTreeId, Long personId, String note) {
    }
}
