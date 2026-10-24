package kr.co.kfs.asseterp.biz.tdm.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeHistoryRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChangeHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 책무 변경/삭제 이력 (AS-IS server/tdm/Tdm95_ChangeHistory·Tdm96_ChangeDetail) — 이력 쓰기는 책무 화면들이 같이 쓴다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmChangeHistoryService {

    /** AS-IS 화면이 보내는 menuNo (책무 등록 #1412) */
    public static final String MENU_NO = "1412";

    private final TdmChangeHistoryMapper mapper;
    private final ObjectMapper objectMapper;

    /** AS-IS Tdm95_Lookup_ChangeHistory.retrieve: searchText는 비어 있으면 null, 아니면 %…% */
    public List<ChangeHistoryRes> search(UserPrincipal user, String targetTable, Long targetId, String changeType, String searchText) {
        String text = searchText == null || searchText.isEmpty() ? null : "%" + searchText + "%";
        String type = changeType == null || changeType.isEmpty() ? null : changeType;
        return mapper.selectByTargetId(user.getCompanyId(), targetTable, targetId, type, text);
    }

    /** AS-IS Tdm95_Lookup_ChangeHistory.detailRetrieve */
    public List<ChangeDetailRes> searchDetails(UserPrincipal user, Long changeHistoryId) {
        return mapper.selectByChangeHistoryId(user.getCompanyId(), changeHistoryId);
    }

    /** historyMap의 공통 부분 (AS-IS 화면 코드가 채우던 companyId·empName·menuNo·targetTable) */
    public Map<String, Object> newHistory(UserPrincipal user, String changeType, String targetTable, String reason) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("companyId", user.getCompanyId());
        map.put("empName", user.getName());
        map.put("changeType", changeType);
        map.put("menuNo", MENU_NO);
        map.put("targetTable", targetTable);
        map.put("reason", reason);
        return map;
    }

    /** 변경 컬럼 한 건 (AS-IS modiColumnList의 한 행) */
    public static Map<String, String> column(String windowItemName, String columnName, String afterData) {
        Map<String, String> col = new LinkedHashMap<>();
        col.put("windowItemName", windowItemName);
        col.put("columnName", columnName);
        col.put("afterData", afterData);
        return col;
    }

    /**
     * AS-IS Tdm96_ChangeDetail.insertModifyHistory: 변경 전 값을 읽어야 하므로 저장(UPDATE·DELETE) **전에** 부른다.
     * 결과가 'Y'가 아니면 DB 함수가 돌려준 문구로 실패.
     */
    @Transactional
    public void insertModifyHistory(Map<String, Object> historyMap) {
        String json;
        try {
            json = objectMapper.writeValueAsString(historyMap);
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경이력 생성시 오류발생");
        }
        String resultMsg = mapper.createChangeHistory(json);
        if (!"Y".equals(resultMsg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, resultMsg == null ? "변경이력 생성시 오류발생" : resultMsg);
        }
    }

    /** 삭제 이력: targetKeyId를 넣어 대상마다 한 번 */
    @Transactional
    public void insertDeleteHistory(UserPrincipal user, String targetTable, Long targetKeyId, String reason) {
        Map<String, Object> map = newHistory(user, "DELETE", targetTable, reason);
        map.put("targetKeyId", targetKeyId.toString());
        insertModifyHistory(map);
    }

    public static List<Map<String, String>> newColumns() {
        return new ArrayList<>();
    }
}
