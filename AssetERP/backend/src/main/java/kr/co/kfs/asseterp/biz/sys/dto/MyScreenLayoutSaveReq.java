package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 나의 화면 목록 저장 (재설계 03): 목록 전체를 보낸다. 배열 순서 = 번호(1~9, 0) */
public record MyScreenLayoutSaveReq(List<MyScreenPreset> presets) {
}
