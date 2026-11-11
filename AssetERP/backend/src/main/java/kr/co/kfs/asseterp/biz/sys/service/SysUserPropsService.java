package kr.co.kfs.asseterp.biz.sys.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MyScreenLayoutSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MyScreenPreset;
import kr.co.kfs.asseterp.biz.sys.dto.UserPropsRes;
import kr.co.kfs.asseterp.biz.sys.dto.UserPropsRow;
import kr.co.kfs.asseterp.biz.sys.mapper.SysUserPropsMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 사용자 설정 (TOBE 재설계 03 "나의 화면 저장", docs/4-재설계/03-나의-화면-저장.md). AS-IS 없음.
 * 대상은 항상 토큰의 사용자(userId) — 다른 사람 설정은 다루지 않는다.
 * sys90_my_screen_layout JSON: {"version":1,"presets":[{name, model, savedAt}, …]}
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysUserPropsService {

    /** 단축키 1~9, 0 */
    static final int MAX_PRESETS = 10;
    static final int MAX_NAME_LEN = 30;
    /** 목록 전체 JSON 상한 (배치 10개 기준 넉넉) */
    static final int MAX_JSON_CHARS = 1_000_000;
    static final int LAYOUT_VERSION = 1;

    private final SysUserPropsMapper mapper;
    private final ObjectMapper objectMapper;

    public UserPropsRes getMine(UserPrincipal user) {
        UserPropsRow row = mapper.selectByUserId(user.getUserId());
        List<MyScreenPreset> presets = row == null ? List.of() : readPresets(row.myScreenLayout());
        JsonNode props = row == null ? null : readJson(row.props());
        return new UserPropsRes(presets, props != null && props.isObject() ? props : objectMapper.createObjectNode());
    }

    /** 나의 화면 목록 전체 저장 → 저장한 목록 */
    @Transactional
    public List<MyScreenPreset> saveMyScreenLayout(UserPrincipal user, MyScreenLayoutSaveReq req) {
        List<MyScreenPreset> in = req == null || req.presets() == null ? List.of() : req.presets();
        if (in.size() > MAX_PRESETS) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, MAX_PRESETS + "개까지 저장할 수 있습니다. 하나를 지운 뒤 저장하세요.");
        }
        List<MyScreenPreset> out = new ArrayList<>(in.size());
        Set<String> names = new HashSet<>();
        for (MyScreenPreset p : in) {
            String name = p == null || p.name() == null ? "" : p.name().strip();
            if (name.isEmpty() || name.length() > MAX_NAME_LEN) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "화면 이름은 1~" + MAX_NAME_LEN + "자로 입력하세요.");
            }
            if (!names.add(name)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "같은 이름이 있습니다: " + name);
            }
            if (p.model() == null || !p.model().isObject()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "화면 배치 정보가 없습니다: " + name);
            }
            out.add(new MyScreenPreset(name, p.model(), p.savedAt()));
        }
        String json;
        try {
            json = objectMapper.writeValueAsString(Map.of("version", LAYOUT_VERSION, "presets", out));
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e);
        }
        if (json.length() > MAX_JSON_CHARS) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "저장할 화면 배치가 너무 큽니다.");
        }
        mapper.upsertMyScreenLayout(user.getUserId(), user.getCompanyId(), json);
        return out;
    }

    private List<MyScreenPreset> readPresets(String json) {
        JsonNode root = readJson(json);
        if (root == null || !root.path("presets").isArray()) return List.of();
        try {
            return objectMapper.convertValue(root.get("presets"), new TypeReference<List<MyScreenPreset>>() { });
        } catch (IllegalArgumentException e) {
            log.warn("sys90_my_screen_layout 읽기 실패 — 빈 목록으로 본다: {}", e.getMessage());
            return List.of();
        }
    }

    private JsonNode readJson(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readTree(json);
        } catch (JsonProcessingException e) {
            log.warn("sys90_user_props JSON 읽기 실패 — 무시: {}", e.getOriginalMessage());
            return null;
        }
    }
}
