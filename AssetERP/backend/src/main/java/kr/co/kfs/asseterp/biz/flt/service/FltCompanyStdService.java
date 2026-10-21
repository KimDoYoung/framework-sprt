package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdLockupReq;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdRes;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltCompanyStdMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/flt/Flt01_CompanyStd.java (selectByCompanyId L30, updateOne L60, update L68, delete L73) — J09 기준관리. 로그인 회사의 행만 다룬다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltCompanyStdService {

    private final FltCompanyStdMapper mapper;

    /** AS-IS selectByCompanyId — 적용시작일 내림차순 */
    public List<CompanyStdRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<CompanyStdRes> update(UserPrincipal user, List<CompanyStdSaveReq> rows) {
        List<CompanyStdRes> saved = new ArrayList<>();
        for (CompanyStdSaveReq req : rows) {
            boolean isNew = req.companyStdId() == null || req.companyStdId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.companyStdId();
            if (isNew) {
                mapper.insertCompanyStd(id, user.getCompanyId(), req);
            } else if (mapper.updateCompanyStd(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteCompanyStds(user.getCompanyId(), ids);
    }

    /**
     * AS-IS updateOne — 의무보유기간 위반 체크 방식(조회창 Flt01_Lookup_LockUpCheckType). 저장한 행을 돌려준다.
     * 검사는 원본 조회창과 같다: 보유기간 체크면 의무보유기간 필수, 매수 주문건수 체크면 일간·월간 중 하나는 체크
     */
    @Transactional
    public CompanyStdRes updateLockup(UserPrincipal user, Long companyStdId, CompanyStdLockupReq req) {
        if ("1".equals(req.lockUpCode())) {
            if (req.lockUpDays() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "의무보유기간을 입력하세요");
            }
        } else if (!"true".equals(req.buyOprDayYn()) && !"true".equals(req.buyOprMonthYn())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "체크방식은 한 개 이상 반드시 체크되어야 합니다");
        }
        if (mapper.updateLockup(user.getCompanyId(), companyStdId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(companyStdId);
    }
}
