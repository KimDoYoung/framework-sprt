package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportAttachRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleReportMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무구조도 제출(AS-IS Tdm36_Tab_RoleReport, N14) → server/tdm/Tdm36_RoleReport */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmRoleReportService {

    private final TdmRoleReportMapper mapper;

    /** AS-IS tdm.Tdm36_RoleReport.selectByDate — 로그인 회사만. 전체보기가 아닐 때 기간, 전체보기일 때만 미처리건만 조회(결재상태 10·20·99) */
    public List<RoleReportRes> search(UserPrincipal user, String startDate, String closeDate, boolean notPeriodYn, boolean notEndYn) {
        return mapper.selectByDate(new RoleReportParam(user.getCompanyId(), startDate, closeDate, notPeriodYn, notEndYn));
    }

    /** AS-IS tdm.Tdm36_RoleReport.getAttachList — 제출 행이 로그인 회사 것이어야 한다 */
    public List<RoleReportAttachRes> attaches(UserPrincipal user, Long roleReportId) {
        requireOwn(user, roleReportId);
        return mapper.getAttachList(roleReportId);
    }

    /** AS-IS Tdm36_RoleReport.update(UpdateDataModel): roleReportId가 없거나 ≤ 0이면 INSERT, 아니면 UPDATE */
    @Transactional
    public void save(UserPrincipal user, List<RoleReportSaveReq> rows) {
        for (RoleReportSaveReq r : rows) {
            if (r.roleReportId() == null || r.roleReportId() <= 0) {
                mapper.insertRoleReport(mapper.selectNextId(), user.getCompanyId(), r.boardOpenDate(), r.allcStdDate(), r.reportDate(),
                        r.boardOpenLoc(), r.membTotCnt(), r.membAttendCnt(), r.boardOpenAgenda(), r.membYesName(), user.getName());
            } else {
                requireOwn(user, r.roleReportId());
                mapper.updateRoleReport(r.roleReportId(), user.getCompanyId(), r.boardOpenDate(), r.allcStdDate(), r.reportDate(),
                        r.boardOpenLoc(), r.membTotCnt(), r.membAttendCnt(), r.boardOpenAgenda(), r.membYesName(), user.getName());
            }
        }
    }

    /** AS-IS Tdm36_RoleReport.delete (UpdateDataModel.deleteModel) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> roleReportIds) {
        if (roleReportIds == null || roleReportIds.isEmpty()) {
            return 0;
        }
        for (Long id : roleReportIds) {
            requireOwn(user, id);
        }
        return mapper.deleteRoleReports(user.getCompanyId(), roleReportIds);
    }

    /** 제출 행이 로그인 회사 것이어야 한다 */
    private void requireOwn(UserPrincipal user, Long roleReportId) {
        Long companyId = mapper.selectCompanyId(roleReportId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
