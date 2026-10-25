package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRecordSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmHrRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 인사정보 창 (AS-IS server/tdm/Tdm02_HrRecord) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmHrRecordService {

    private final TdmHrRecordMapper mapper;

    /** AS-IS tdm.Tdm02_HrRecord.selectByCompanyId (searchText는 '%…%'로 감싼다) */
    public List<HrRecordRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String applyCode, String searchText, Integer limit) {
        return mapper.selectByCompanyId(user.getCompanyId(), startDate, closeDate, applyCode, "%" + (searchText == null ? "" : searchText) + "%", limit);
    }

    /** AS-IS tdm.Tdm02_HrRecord.selectChangeList (Tdm00_Tab_ChangeList.retrieve: companyId, stdDate) */
    public List<ChangeListRes> changeList(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectChangeList(user.getCompanyId(), stdDate);
    }

    /** AS-IS tdm.Tdm02_HrRecord.updateApplyCode: 바뀐 행마다 적용여부 코드와 비고 */
    @Transactional
    public int save(UserPrincipal user, List<HrRecordSaveReq> rows) {
        for (HrRecordSaveReq row : rows) {
            Long companyId = mapper.selectCompanyId(row.hrRecordId());
            if (companyId == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (!companyId.equals(user.getCompanyId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
        }
        for (HrRecordSaveReq row : rows) {
            mapper.updateApplyCode(row.hrRecordId(), row.applyCode(), row.note(), user.getName());
        }
        return rows.size();
    }
}
