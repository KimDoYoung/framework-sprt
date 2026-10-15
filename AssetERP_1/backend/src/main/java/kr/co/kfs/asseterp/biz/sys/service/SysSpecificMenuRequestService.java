package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuRequestMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys53_SpecificMenuRequest.java (selectByText L23 / update L43 / delete L48) — 로그인 회사의 요청만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysSpecificMenuRequestService {

    private final SysSpecificMenuRequestMapper sysSpecificMenuRequestMapper;

    /** AS-IS selectByText: 상태·특정업무 콤보 '%'(전체) 또는 코드 → LIKE */
    public List<SpecificMenuRequestRes> search(UserPrincipal user, String stateCd, String specificWorkCd) {
        return sysSpecificMenuRequestMapper.selectByText(user.getCompanyId(), likeOrAll(stateCd), likeOrAll(specificWorkCd));
    }

    /** AS-IS insertRow() L266-274: 신청자 = 로그인 사용자, 신청일 = 오늘 */
    public SpecificMenuRequestRes newRow(UserPrincipal user) {
        return sysSpecificMenuRequestMapper.selectNewRow(user.getUserId());
    }

    /**
     * AS-IS update(UpdateDataModel) L43 + 화면 update() L276-295 필수 검사(특정업무).
     * 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     */
    @Transactional
    public List<SpecificMenuRequestRes> update(UserPrincipal user, List<SpecificMenuRequestSaveReq> rows) {
        List<SpecificMenuRequestRes> saved = new ArrayList<>();
        for (SpecificMenuRequestSaveReq req : rows) {
            if (req.specificWorkCd() == null || req.specificWorkCd().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "특정업무 구분은 필수선택 항목입니다");
            }
            boolean isNew = req.specificMenuRequestId() == null || req.specificMenuRequestId() <= 0;
            Long id = isNew ? sysSpecificMenuRequestMapper.selectNextId() : req.specificMenuRequestId();
            if (isNew) {
                sysSpecificMenuRequestMapper.insertSpecificMenuRequest(id, user.getCompanyId(), user.getUserId(), req);
            } else if (sysSpecificMenuRequestMapper.updateSpecificMenuRequest(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysSpecificMenuRequestMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L48: ID로 지우기 → 지운 건수 (완료·진행중 문서 검사는 AS-IS도 화면에서 한다) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return sysSpecificMenuRequestMapper.deleteSpecificMenuRequests(user.getCompanyId(), ids);
    }

    private static String likeOrAll(String value) {
        return value == null || value.isEmpty() ? "%" : value;
    }
}
