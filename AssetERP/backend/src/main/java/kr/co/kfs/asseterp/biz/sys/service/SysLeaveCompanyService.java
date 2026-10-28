package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveCompanyRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveCompanySaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLeaveCompanyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys31_LeaveCompany.java (selectByCompanyId / update) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLeaveCompanyService {

    private final SysLeaveCompanyMapper mapper;

    /** AS-IS selectByCompanyId(companyId) */
    public List<LeaveCompanyRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS update: selectById 로 저장된 행인지 보고, 없으면 dbConfig.getSeq 로 채번해 INSERT, 있으면 UPDATE.
     * 조회 SQL 은 저장된 행이 없는 기준에 임시 번호(ROW_NUMBER)를 ID 로 주므로 로그인 회사의 행인지로 판정한다 → 저장한 건수.
     */
    @Transactional
    public int save(UserPrincipal user, List<LeaveCompanySaveReq> rows) {
        int count = 0;
        for (LeaveCompanySaveReq row : rows) {
            String unUseYn = Boolean.TRUE.equals(row.unUseYn()) ? "true" : "false";
            if (mapper.countById(user.getCompanyId(), row.leaveCompanyId()) == 0) {
                if (row.leaveCode() == null || row.leaveCode().isBlank()) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "휴가구분이 없습니다");
                }
                count += mapper.insertLeaveCompany(user.getCompanyId(), mapper.selectNextId(), row.leaveCode(),
                        row.spcLeaveCode(), row.days(), row.calcCode(), unUseYn, row.note());
            } else {
                count += mapper.updateLeaveCompany(user.getCompanyId(), row.leaveCompanyId(), row.days(), row.calcCode(), unUseYn);
            }
        }
        return count;
    }
}
