package kr.co.kfs.asseterp.biz.sys.dto;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

/**
 * 로그인 사용자 설정 (재설계 03).
 * presets: 나의 화면 목록(없으면 빈 목록), props: 그 밖의 사용자 설정 JSON(없으면 빈 객체)
 */
public record UserPropsRes(List<MyScreenPreset> presets, JsonNode props) {
}
