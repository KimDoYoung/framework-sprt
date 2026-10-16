package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceRes;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysAfterServiceMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sys/Sys90_AfterService.java (selectByAdmin·selectByIncomplete·selectById L33 / adminUpdate L248 / updateRemarks L218) — 관리자 화면(고객사 전체) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysAfterServiceService {

    private final SysAfterServiceMapper sysAfterServiceMapper;

    /**
     * AS-IS Sys90_Tab_AfterServiceAdmin.retrieve() L188-241: 회사명 '전체'·'%'면 '%', 확인여부 체크면 'false' 아니면 '%',
     * 미완료 체크면 selectByIncomplete. 검색어는 "%"+검색어+"%"(원본 서버 파라미터 처리와 같게 여기서 만든다).
     */
    public List<AfterServiceRes> searchAdmin(UserPrincipal user, LocalDate happenStartDate, LocalDate happenEndDate, String companyText,
                                             String typeYn, String stateCd, boolean unconfirmedOnly, boolean incompleteOnly, String searchText) {
        requireSysAdmin(user);
        AfterServiceSearchParam param = new AfterServiceSearchParam(happenStartDate, happenEndDate,
                likeOrAll(companyText), likeOrAll(typeYn), likeOrAll(stateCd), unconfirmedOnly ? "false" : "%",
                "%" + (searchText == null ? "" : searchText) + "%");
        return incompleteOnly ? sysAfterServiceMapper.selectByIncomplete(param) : sysAfterServiceMapper.selectByAdmin(param);
    }

    /** AS-IS selectById — 저장 뒤 그리드 행 갱신 */
    public AfterServiceRes getById(UserPrincipal user, Long afterServiceId) {
        requireSysAdmin(user);
        AfterServiceRes res = sysAfterServiceMapper.selectById(afterServiceId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /** AS-IS Sys90_Edit_BoardAdmin.updateRow() L374-394 → adminUpdate → updateEnd() L396-410(selectById) */
    @Transactional
    public AfterServiceRes adminUpdate(UserPrincipal user, AfterServiceAdminSaveReq req) {
        requireSysAdmin(user);
        sysAfterServiceMapper.adminUpdate(req);
        return getById(user, req.afterServiceId());
    }

    /** AS-IS Sys90_Lookup_Remarks.update() L74-88 → updateRemarks */
    @Transactional
    public AfterServiceRes updateRemarks(UserPrincipal user, Long afterServiceId, String remarks) {
        requireSysAdmin(user);
        sysAfterServiceMapper.updateRemarks(afterServiceId, remarks);
        return getById(user, afterServiceId);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static String likeOrAll(String value) {
        return value == null || value.isEmpty() ? "%" : value;
    }
}
