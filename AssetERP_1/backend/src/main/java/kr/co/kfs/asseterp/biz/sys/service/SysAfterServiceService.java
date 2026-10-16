package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceRes;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceSearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceUserSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceUserSearchParam;
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

    // ── A29 사용자 화면 (Sys90_Tab_AfterService) — 로그인한 회사의 것만 ──

    /**
     * AS-IS Sys90_Tab_AfterService.retrieve() L184-231 + 서버 selectBySearchText L96-131: 미확인 체크면 confirmYn='false' 아니면 '%',
     * 구분 null·'전체'는 '%', 완료여부 null이면 완료·취소(10·90) 제외 / '전체'는 '%', 검색어는 '%'+검색어+'%'.
     */
    public List<AfterServiceRes> search(UserPrincipal user, LocalDate happenStartDate, LocalDate happenEndDate, String typeYn, String stateCd,
                                        boolean unconfirmedOnly, String searchText) {
        AfterServiceUserSearchParam param = new AfterServiceUserSearchParam(user.getCompanyId(), happenStartDate, happenEndDate,
                likeOrAll(typeYn), stateCd == null || stateCd.isEmpty() ? null : stateCd, unconfirmedOnly ? "false" : "%",
                "%" + (searchText == null ? "" : searchText) + "%");
        return sysAfterServiceMapper.selectBySearchText(param);
    }

    /** AS-IS GridInsertRow.insertRow + Sys90_Tab_AfterService.insertRow() L233-251: ID만 받고 DB에는 쓰지 않는다. 요청자 = 관리자면 "관리자", 아니면 사용자 이름 */
    @Transactional  // f_create_seq()가 시퀀스 테이블을 갱신하므로 읽기 전용이면 NULL이 나온다
    public AfterServiceRes newRow(UserPrincipal user) {
        Long id = sysAfterServiceMapper.selectNewId();
        String regEmpNm = user.getRoles() != null && user.getRoles().contains("ROLE_ADMIN") ? "관리자" : user.getName();
        return new AfterServiceRes(id, user.getCompanyId(), null, LocalDate.now(), regEmpNm, null, null, null, null, null, null, null, null, null, null, "false");
    }

    /** AS-IS Sys90_Edit_Board.updateRow() L333-357 → userUpdate → updateEnd() L359-373(selectById) */
    @Transactional
    public AfterServiceRes userUpdate(UserPrincipal user, AfterServiceUserSaveReq req) {
        requireOwnCompany(user, req.afterServiceId());
        sysAfterServiceMapper.userUpdate(user.getCompanyId(), req);
        return sysAfterServiceMapper.selectById(req.afterServiceId());
    }

    /** AS-IS Sys90_Edit_Board.delete() L394-415 → sys.Sys90_AfterService.delete (UpdateDataModel.deleteModel) */
    @Transactional
    public void delete(UserPrincipal user, Long afterServiceId) {
        requireOwnCompany(user, afterServiceId);
        sysAfterServiceMapper.deleteById(afterServiceId);
    }

    /** 이미 있는 행이면 로그인한 회사의 것이어야 한다 (원본은 ID만으로 UPDATE·DELETE — 다른 고객사 행을 건드리지 못하게 막는다) */
    private void requireOwnCompany(UserPrincipal user, Long afterServiceId) {
        AfterServiceRes row = afterServiceId == null ? null : sysAfterServiceMapper.selectById(afterServiceId);
        if (row != null && !user.getCompanyId().equals(row.companyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
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
