package kr.co.kfs.asseterp.biz.sys.dto;

import com.fasterxml.jackson.databind.JsonNode;

/** 나의 화면 하나 (재설계 03): 이름 + flexlayout Model.toJson() + 저장 시각 */
public record MyScreenPreset(String name, JsonNode model, String savedAt) {
}
