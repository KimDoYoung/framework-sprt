package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 책무 세부내용 저장: 변경한 행들과 변경사유(기존 행을 고쳤을 때만 필요) */
public record TaskDetailSaveReq(
        List<TaskDetailRow> rows,
        String reason
) {
}
