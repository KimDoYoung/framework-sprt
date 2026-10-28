package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveManageRes;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveManageSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEtcLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 포상휴가관리 (AS-IS Emp22_Tab_EtcLeave) — 1단계: [결재요청]의 결재문서 생성(Apr01_Edit_ApprDoc)·상세보기는 다음 단계 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEtcLeaveService {

    /** AS-IS 그리드 [등록]이 넣는 휴가코드(포상휴가) */
    private static final String LEAVE_CODE = "05";
    /** 결재 임시저장 상태 */
    private static final String APPR_TEMP = "99";

    private final EmpEtcLeaveMapper mapper;

    /** AS-IS emp.Emp22_EtcLeave.selectByDate — 검색어는 사유+비고에 대한 `%검색어%` */
    public List<EtcLeaveManageRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByDate(user.getCompanyId(), startDate, closeDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS emp.Emp22_EtcLeave.update: 임시저장(99) 결재문서가 걸린 행은 문서를 폐기문서로 옮겨 지우고 상신 ID 를 비운 뒤 저장한다.
     * 새 행(ID 0 이하)은 채번해 INSERT(휴가코드 05), 나머지는 UPDATE → 저장한 행을 요청 순서대로 돌려준다.
     * AS-IS 는 클라이언트가 보낸 상태 코드를 믿지만 TOBE 는 저장된 행의 상태를 본다.
     */
    @Transactional
    public List<EtcLeaveManageRes> save(UserPrincipal user, List<EtcLeaveManageSaveReq> rows) {
        List<EtcLeaveManageRes> saved = new ArrayList<>();
        for (EtcLeaveManageSaveReq row : rows) {
            Long id = row.etcLeaveId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertEtcLeave(user.getCompanyId(), id, row.reason(), row.days(), row.startDate(), row.closeDate(), row.note());
            } else {
                EtcLeaveManageRes stored = mapper.selectById(user.getCompanyId(), id);
                if (stored == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                boolean clearAppr = stored.apprId() != null && APPR_TEMP.equals(stored.apprStatusCode());
                if (clearAppr) {
                    mapper.insertApprDel(stored.apprId(), user.getUserId());
                    mapper.deleteAppr(stored.apprId());
                }
                mapper.updateEtcLeave(user.getCompanyId(), id, row.reason(), row.days(), row.startDate(), row.closeDate(), row.note(), clearAppr);
            }
            saved.add(mapper.selectById(user.getCompanyId(), id));
        }
        return saved;
    }

    /**
     * AS-IS emp.Emp22_EtcLeave.deleteApprId + delete — 상신된 결재문서는 폐기문서로 옮기고 지운 뒤 포상휴가를 지운다.
     * AS-IS 는 첫 번째로 고른 행의 결재문서만 지우지만 TOBE 는 고른 행 모두의 문서를 지운다(남은 문서가 고아가 되지 않게).
     * (AS-IS 는 대상 직원 emp23 행을 따로 지우지 않는다)
     */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (Long id : ids) {
            EtcLeaveManageRes row = mapper.selectById(user.getCompanyId(), id);
            if (row != null && row.apprId() != null) {
                mapper.insertApprDel(row.apprId(), user.getUserId());
                mapper.deleteAppr(row.apprId());
            }
        }
        return mapper.deleteEtcLeaves(user.getCompanyId(), ids);
    }
}
